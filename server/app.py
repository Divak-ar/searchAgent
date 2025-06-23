from typing import TypedDict, Annotated, Optional
from langgraph.graph import add_messages, StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessageChunk, ToolMessage
from dotenv import load_dotenv
from langchain_community.tools.tavily_search import TavilySearchResults
from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json
from uuid import uuid4
from langgraph.checkpoint.memory import MemorySaver

load_dotenv()

# Initialize memory saver for checkpointing
memory = MemorySaver()

class State(TypedDict):
    messages: Annotated[list, add_messages]

search_tool = TavilySearchResults(
    max_results=4,
)

tools = [search_tool]

# llm = ChatOpenAI(model="gpt-4o")
# llm = ChatGroq(model='llama-3.1-8b-instant')
llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash')

llm_with_tools = llm.bind_tools(tools=tools)

async def model(state: State):
    # Add instructions to try answering first before searching
    messages = state["messages"]
    last_message = messages[-1] if messages else None
    
    # If this is a user message, modify it to instruct the AI to try answering first
    if last_message and hasattr(last_message, 'content') and not hasattr(last_message, 'tool_calls'):
        # Check if the message looks like it might need real-time information
        content = last_message.content.lower()
        needs_search_keywords = [
            'latest', 'recent', 'current', 'today', 'now', 'this year', 'this month', 
            'news', 'breaking', 'update', 'status', 'price', 'stock', 'weather',
            'when is', 'what happened', 'who won', 'result', 'score'
        ]
        
        likely_needs_search = any(keyword in content for keyword in needs_search_keywords)
        
        if not likely_needs_search:
            # Add instruction to try answering from knowledge first
            system_instruction = """Try to answer the question using your existing knowledge first. Only use the search tool if:
1. The question requires very recent information (news, current events, latest updates)
2. The question is about specific real-time data (stock prices, weather, sports scores)
3. You genuinely don't know the answer from your training data

If you can provide a helpful answer from your knowledge, do so without searching."""
            
            # Create a modified message with the instruction
            modified_messages = [
                HumanMessage(content=f"{system_instruction}\n\nUser question: {last_message.content}")
            ] + messages[:-1]
            
            result = await llm_with_tools.ainvoke(modified_messages)
        else:
            result = await llm_with_tools.ainvoke(state["messages"])
    else:
        result = await llm_with_tools.ainvoke(state["messages"])
        
    return {
        "messages": [result], 
    }

async def tools_router(state: State):
    last_message = state["messages"][-1]

    if(hasattr(last_message, "tool_calls") and len(last_message.tool_calls) > 0):
        return "tool_node"
    else: 
        return END
    
# Global variable to store max search results
current_max_search_results = 3

async def tool_node(state):
    """Custom tool node that handles tool calls from the LLM."""
    global current_max_search_results
    
    # Get the tool calls from the last message
    tool_calls = state["messages"][-1].tool_calls
    
    # Initialize list to store tool messages
    tool_messages = []
    
    # Process each tool call
    for tool_call in tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        tool_id = tool_call["id"]
        
        # Handle the search tool
        if tool_name == "tavily_search_results_json":
            # Create a dynamic search tool with the current max_results setting
            dynamic_search_tool = TavilySearchResults(max_results=current_max_search_results)
            
            # Execute the search tool with the provided arguments
            search_results = await dynamic_search_tool.ainvoke(tool_args)
            
            # Create a ToolMessage for this result
            tool_message = ToolMessage(
                content=str(search_results),
                tool_call_id=tool_id,
                name=tool_name
            )
            
            tool_messages.append(tool_message)
    
    # Add the tool messages to the state
    return {"messages": tool_messages}

graph_builder = StateGraph(State)

graph_builder.add_node("model", model)
graph_builder.add_node("tool_node", tool_node)
graph_builder.set_entry_point("model")

graph_builder.add_conditional_edges("model", tools_router)
graph_builder.add_edge("tool_node", "model")

graph = graph_builder.compile(checkpointer=memory)

# creating the FastAPI app
app = FastAPI(
    title="Search Agent API",
    description="AI-powered search agent with real-time streaming responses",
    version="2.0.0"
)

# Add CORS middleware with settings that match frontend requirements
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
    expose_headers=["Content-Type"], 
)

def serialise_ai_message_chunk(chunk): 
    if(isinstance(chunk, AIMessageChunk)):
        # Clean and format the content
        content = chunk.content
        if content:
            # Ensure proper spacing after periods
            content = content.replace('. ', '. ')
            # Clean up multiple spaces
            content = ' '.join(content.split())
        return content
    else:
        raise TypeError(
            f"Object of type {type(chunk).__name__} is not correctly formatted for serialisation"
        )


async def generate_chat_responses(message: str, checkpoint_id: Optional[str] = None, session_context: Optional[str] = None, max_search_results: Optional[int] = 3):
    global current_max_search_results
    # Set the max search results for this request
    current_max_search_results = max_search_results or 3
    
    try:
        is_new_conversation = checkpoint_id is None
        
        # Prepare the user message with session context if provided
        user_message = message
        if session_context and session_context.strip():
            user_message = f"Session Context: {session_context}\n\nUser Query: {message}"
        
        # if it's a new chat (there is checkout_id)
        if is_new_conversation:
            # Generate new checkpoint ID for first message in conversation
            new_checkpoint_id = str(uuid4())

            config = {
                "configurable": {
                    "thread_id": new_checkpoint_id
                }
            }
            
            # Initialize with first message
            events = graph.astream_events(
                {"messages": [HumanMessage(content=user_message)]},
                version="v2",
                config=config
            )
            
            # First send the checkpoint ID
            yield f"data: {{\"type\": \"checkpoint\", \"checkpoint_id\": \"{new_checkpoint_id}\"}}\n\n"
        else:
            # if there is an checkpoint_id
            config = {
                "configurable": {
                    "thread_id": checkpoint_id
                }
            }
            # Continue existing conversation
            events = graph.astream_events(
                {"messages": [HumanMessage(content=user_message)]},
                version="v2",
                config=config
            )

        async for event in events:
            try:
                event_type = event["event"]
                
                if event_type == "on_chat_model_stream":
                    # getting the chunks from the response 
                    chunk_content = serialise_ai_message_chunk(event["data"]["chunk"])
                    # Properly escape content for JSON
                    safe_content = json.dumps(chunk_content)[1:-1]  # Remove the outer quotes
                    
                    yield f"data: {{\"type\": \"content\", \"content\": \"{safe_content}\"}}\n\n"
                    
                elif event_type == "on_chat_model_end":
                    # Check if there are tool calls for search
                    tool_calls = event["data"]["output"].tool_calls if hasattr(event["data"]["output"], "tool_calls") else []
                    search_calls = [call for call in tool_calls if call["name"] == "tavily_search_results_json"]
                    
                    if search_calls:
                        # Signal that a search is starting
                        search_query = search_calls[0]["args"].get("query", "")
                        # Properly escape query for JSON
                        safe_query = json.dumps(search_query)[1:-1]  # Remove the outer quotes
                        yield f"data: {{\"type\": \"search_start\", \"query\": \"{safe_query}\"}}\n\n"
                        
                elif event_type == "on_tool_end" and event["name"] == "tavily_search_results_json":
                    # Search completed - send results or error
                    output = event["data"]["output"]
                    
                    # Check if output is a list 
                    if isinstance(output, list):
                        # Extract URLs from list of search results
                        urls = []
                        for item in output:
                            if isinstance(item, dict) and "url" in item:
                                urls.append(item["url"])
                        
                        # Convert URLs to JSON and yield them
                        urls_json = json.dumps(urls)
                        yield f"data: {{\"type\": \"search_results\", \"urls\": {urls_json}}}\n\n"
                        
            except Exception as e:
                print(f"Error processing event: {e}")
                error_msg = json.dumps(str(e))[1:-1]
                yield f"data: {{\"type\": \"error\", \"error\": \"{error_msg}\"}}\n\n"
                continue
        
        # Send an end event
        yield f"data: {{\"type\": \"end\"}}\n\n"
        
    except Exception as e:
        print(f"Error in generate_chat_responses: {e}")
        error_msg = json.dumps(str(e))[1:-1]
        yield f"data: {{\"type\": \"error\", \"error\": \"{error_msg}\"}}\n\n"


@app.get("/chat_stream/{message}")
# SSE - server-sent events 
async def chat_stream(message: str, checkpoint_id: Optional[str] = Query(None), session_context: Optional[str] = Query(None), max_search_results: Optional[int] = Query(3)):
    return StreamingResponse(
        generate_chat_responses(message, checkpoint_id, session_context, max_search_results), 
        media_type="text/event-stream"
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "timestamp": "2025-06-23T00:00:00Z",
        "services": {
            "llm": "Google Gemini 2.0 Flash",
            "search": "Tavily API",
            "streaming": "Server-Sent Events"
        }
    }

# Get system status
@app.get("/status")
async def get_status():
    try:
        # Test LLM connection
        test_result = await llm.ainvoke([HumanMessage(content="Hello")])
        llm_status = "online"
    except Exception as e:
        llm_status = "offline"
    
    try:
        # Test search tool
        search_result = await search_tool.ainvoke({"query": "test"})
        search_status = "online"
    except Exception as e:
        search_status = "offline"
    
    return {
        "llm_status": llm_status,
        "search_status": search_status,
        "memory_status": "online" if memory else "offline"
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Search Agent API",
        "endpoints": {
            "health": "/health",
            "chat": "/chat_stream/{message}?checkpoint_id={optional}"
        }
    }

