"use client"

import Header from '@/components/Header';
import InputBar from '@/components/InputBar';
import MessageArea from '@/components/MessageArea';
import HomePage from '@/components/Home';
import Settings from '@/components/Settings';
import SessionContext from '@/components/SessionContext';
import React, { useState } from 'react';

interface SearchInfo {
  stages: string[];
  query: string;
  urls: string[];
  error?: string;
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  type: string;
  isLoading?: boolean;
  searchInfo?: SearchInfo;
}

interface SSEData {
  type: string;
  content?: string;
  checkpoint_id?: string;
  query?: string;
  urls?: string | string[];
  error?: string;
}

const Home = () => {
  const [activeTab, setActiveTab] = useState('CHAT');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hi there! I\'m your Search Agent. I can help you find information on the web and provide detailed answers. What would you like to know?',
      isUser: false,
      type: 'message'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [checkpointId, setCheckpointId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [sessionContext, setSessionContext] = useState("");
  const [isContextVisible, setIsContextVisible] = useState(false);
  const [showContextHint, setShowContextHint] = useState(true);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        content: 'Hi there! I\'m your Search Agent. I can help you find information on the web and provide detailed answers. What would you like to know?',
        isUser: false,
        type: 'message'
      }
    ]);
    setCheckpointId(null);
    setCurrentMessage("");
    setConnectionError(null);
    setActiveTab('CHAT'); // Switch to chat when starting new chat
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && !isLoading) {
      setIsLoading(true);
      setConnectionError(null);

      // First add the user message to the chat
      const newMessageId = messages.length > 0 ? Math.max(...messages.map(msg => msg.id)) + 1 : 1;

      setMessages(prev => [
        ...prev,
        {
          id: newMessageId,
          content: currentMessage,
          isUser: true,
          type: 'message'
        }
      ]);

      const userInput = currentMessage;
      setCurrentMessage(""); // Clear input field immediately

      try {
        // Create AI response placeholder
        const aiResponseId = newMessageId + 1;
        setMessages(prev => [
          ...prev,
          {
            id: aiResponseId,
            content: "",
            isUser: false,
            type: 'message',
            isLoading: true,
            searchInfo: {
              stages: [],
              query: "",
              urls: []
            }
          }
        ]);

        // Create URL with checkpoint ID and session context if they exist
        let url = `http://127.0.0.1:8000/chat_stream/${encodeURIComponent(userInput)}`;
        const params = new URLSearchParams();

        if (checkpointId) {
          params.append('checkpoint_id', checkpointId);
        }

        if (sessionContext && sessionContext.trim()) {
          params.append('session_context', sessionContext);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        // Connect to SSE endpoint using EventSource
        const eventSource = new EventSource(url);
        let streamedContent = "";
        let searchData: SearchInfo | null = null;
        let hasReceivedContent = false;

        // Process incoming messages
        eventSource.onmessage = (event) => {
          try {
            const data: SSEData = JSON.parse(event.data);

            if (data.type === 'checkpoint') {
              // Store the checkpoint ID for future requests
              if (data.checkpoint_id) {
                setCheckpointId(data.checkpoint_id);
              }
            }
            else if (data.type === 'content') {
              streamedContent += data.content;
              hasReceivedContent = true;

              // Update message with accumulated content
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'search_start') {
              // Create search info with 'searching' stage
              const newSearchInfo: SearchInfo = {
                stages: ['searching'],
                query: data.query || "",
                urls: []
              };
              searchData = newSearchInfo;

              // Update the AI message with search info
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'search_results') {
              try {
                // Parse URLs from search results
                const urls = typeof data.urls === 'string' ? JSON.parse(data.urls) : data.urls;

                // Update search info to add 'reading' stage (don't replace 'searching')
                const newSearchInfo: SearchInfo = {
                  stages: searchData ? [...searchData.stages, 'reading'] : ['reading'],
                  query: searchData?.query || "",
                  urls: urls
                };
                searchData = newSearchInfo;

                // Update the AI message with search info
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiResponseId
                      ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                      : msg
                  )
                );
              } catch (err) {
                console.error("Error parsing search results:", err);
              }
            }
            else if (data.type === 'search_error') {
              // Handle search error
              const newSearchInfo: SearchInfo = {
                stages: searchData ? [...searchData.stages, 'error'] : ['error'],
                query: searchData?.query || "",
                error: data.error,
                urls: []
              };
              searchData = newSearchInfo;

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'end') {
              // When stream ends, add 'writing' stage if we had search info
              if (searchData) {
                const finalSearchInfo: SearchInfo = {
                  ...searchData,
                  stages: [...searchData.stages, 'writing']
                };

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiResponseId
                      ? { ...msg, searchInfo: finalSearchInfo, isLoading: false }
                      : msg
                  )
                );
              }

              eventSource.close();
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error parsing event data:", error, event.data);
          }
        };

        // Handle errors
        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          eventSource.close();
          setIsLoading(false);

          const errorMessage = "Sorry, there was a connection error. Please check if the backend server is running and try again.";
          setConnectionError(errorMessage);

          // Only update with error if we don't have content yet
          if (!streamedContent) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiResponseId
                  ? { ...msg, content: errorMessage, isLoading: false }
                  : msg
              )
            );
          }
        };

        // Listen for end event
        eventSource.addEventListener('end', () => {
          eventSource.close();
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error setting up EventSource:", error);
        setIsLoading(false);
        setConnectionError("Failed to connect to the server. Please ensure the backend is running.");
        setMessages(prev => [
          ...prev,
          {
            id: newMessageId + 1,
            content: "Sorry, there was an error connecting to the server. Please ensure the backend is running on http://127.0.0.1:8000",
            isUser: false,
            type: 'message',
            isLoading: false
          }
        ]);
      }
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-8 px-4">
      {/* Main container with refined shadow and border */}
      <div className="w-[70%] bg-white flex flex-col rounded-xl shadow-lg border border-gray-100 overflow-hidden h-[90vh]">
        <Header
          onNewChat={handleNewChat}
          messagesCount={messages.length}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Connection Error Banner */}
        {connectionError && activeTab === 'CHAT' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{connectionError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setConnectionError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'HOME' && <HomePage />}
        {activeTab === 'CHAT' && (
          <>
            {/* Context Hint - Show only once */}
            {showContextHint && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Pro tip:</strong> Click the context button (bottom right) to set custom instructions for the AI.
                      This helps guide responses for your specific needs!
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setShowContextHint(false)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <MessageArea messages={messages} />
            <InputBar
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder={sessionContext ? "Ask with custom context..." : "Ask me anything..."}
            />
          </>
        )}
        {activeTab === 'SETTINGS' && <Settings />}

        {/* Session Context Component - Only show in CHAT tab */}
        {activeTab === 'CHAT' && (
          <SessionContext
            sessionContext={sessionContext}
            setSessionContext={setSessionContext}
            isVisible={isContextVisible}
            setIsVisible={setIsContextVisible}
          />
        )}
      </div>
    </div>
  );
};

export default Home;