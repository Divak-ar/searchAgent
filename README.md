# Search Agent - AI-Powered Web Search Assistant

A modern AI-powered search application that combines web search capabilities with conversational AI to provide comprehensive answers to user queries.

## Features

- 🔍 **Intelligent Web Search**: Uses Tavily API for real-time web search
- 🤖 **AI-Powered Responses**: Powered by Google Gemini 2.0 Flash model
- 💬 **Real-time Streaming**: Server-sent events for live response streaming
- 🎯 **Search Progress Tracking**: Visual indicators for search stages
- 📋 **Copy Functionality**: Easy copy-to-clipboard for AI responses
- 🔄 **New Chat Sessions**: Start fresh conversations anytime
- 📱 **Responsive Design**: Beautiful and modern UI with Tailwind CSS

## Architecture

### Backend (Python/FastAPI)

- **FastAPI**: Modern web framework for building APIs
- **LangGraph**: State management for AI workflows
- **LangChain**: Integration with various AI models and tools
- **Tavily**: Web search API for real-time information retrieval
- **Google Gemini**: Advanced language model for responses

### Frontend (Next.js/React)

- **Next.js 15**: React framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **Server-Sent Events**: Real-time communication with backend
- **TypeScript**: Type-safe development

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 18+
- API Keys for:
  - Google Gemini API
  - Tavily Search API

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `.env`:

   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here

   # Optional: LangSmith for debugging
   LANGSMITH_TRACING=true
   LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
   LANGSMITH_API_KEY=your_langsmith_key
   LANGSMITH_PROJECT=your_project_name
   ```

5. Start the backend server:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: http://localhost:3000 (or next available port)
- Backend: http://localhost:8000
- Backend Health Check: http://localhost:8000/health

## API Endpoints

### GET /health

Health check endpoint to verify backend status.

### GET /

Welcome message with available endpoints.

### GET /chat_stream/{message}

Streaming chat endpoint with optional checkpoint_id parameter for conversation continuity.

Parameters:

- `message`: The user's query (URL encoded)
- `checkpoint_id`: Optional conversation ID for multi-turn conversations

## Usage

1. Open the frontend application in your browser
2. Type your question in the input field
3. Watch as the AI searches the web and compiles a response
4. Copy responses using the copy button
5. Start new conversations using the "+" button in the header

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `app.py` or extend the LangGraph workflow
2. **Frontend**: Add new components in `src/components/` or extend existing functionality

### Environment Variables

The application uses several environment variables:

- `GOOGLE_API_KEY`: Required for AI responses
- `TAVILY_API_KEY`: Required for web search
- `LANGSMITH_*`: Optional for debugging and monitoring

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check if all dependencies are installed and API keys are configured
2. **Frontend connection errors**: Ensure backend is running on port 8000
3. **Search not working**: Verify Tavily API key is valid
4. **AI responses failing**: Check Google Gemini API key and quota

### Error Messages

- "Failed to connect to server": Backend is not running or incorrect port
- "Search error": Tavily API issues or network problems
- "API quota exceeded": Check your API usage limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and development purposes.
