import React, { useState } from 'react';

interface SessionContextProps {
  sessionContext: string;
  setSessionContext: (context: string) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const SessionContext = ({ sessionContext, setSessionContext, isVisible, setIsVisible }: SessionContextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const predefinedContexts = [
    {
      name: "General Assistant",
      prompt: "You are a helpful AI assistant. Provide accurate and comprehensive answers."
    },
    {
      name: "Technical Expert",
      prompt: "You are a technical expert. Focus on providing detailed technical explanations with code examples when relevant."
    },
    {
      name: "Research Assistant",
      prompt: "You are a research assistant. Provide well-sourced, academic-style responses with citations when possible."
    },
    {
      name: "Simple Explainer",
      prompt: "You are an expert at explaining complex topics in simple terms. Use analogies and examples that anyone can understand."
    }
  ];

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 bg-[#4A3F71] text-white p-3 rounded-full shadow-lg hover:bg-[#5E507F] transition-all duration-200 z-50"
        title="Set Session Context"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Session Context</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Set a context to guide the AI's responses for this session. This helps the AI understand how to respond to your queries.
        </p>

        <div className="space-y-2 mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span>Quick presets</span>
            <svg
              className={`w-3 h-3 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {isExpanded && (
            <div className="space-y-1 bg-gray-50 p-2 rounded text-xs">
              {predefinedContexts.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSessionContext(preset.prompt);
                    setIsExpanded(false);
                  }}
                  className="w-full text-left p-2 hover:bg-white rounded text-gray-700 hover:text-gray-900"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-gray-500 truncate">{preset.prompt.substring(0, 60)}...</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          value={sessionContext}
          onChange={(e) => setSessionContext(e.target.value)}
          placeholder="e.g., 'You are a helpful coding assistant. Always provide code examples and explain step by step.'"
          className="w-full p-2 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400">
            {sessionContext.length}/500 chars
          </span>
          <button
            onClick={() => setSessionContext("")}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionContext;
