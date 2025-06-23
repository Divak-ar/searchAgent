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
    return (<button
      onClick={() => setIsVisible(true)}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 sm:p-5 rounded-full shadow-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 z-50 border-2 border-white/20 hover:scale-110"
      title="Set Session Context - Guide the AI's responses"
    >
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
    </button>
    );
  }
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white border border-blue-200 rounded-lg shadow-xl z-50 w-80 sm:w-96 max-w-[90vw]">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Session Context</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4">
          Set a context to guide the AI's responses for this session. This helps the AI understand how to respond to your queries.
        </p>

        <div className="space-y-2 mb-4">          <button onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left text-xs text-blue-600 hover:text-blue-800 flex items-center justify-between transition-colors"
        >
          <span>Quick Presets</span>
          <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>          {isExpanded && (
          <div className="space-y-1 bg-gradient-to-r from-blue-50 to-green-50 p-2 rounded text-xs">
            {predefinedContexts.map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setSessionContext(preset.prompt);
                  setIsExpanded(false);
                }}
                className="w-full text-left p-2 hover:bg-white rounded text-black hover:text-gray-900 transition-colors"
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-gray-600 truncate">{preset.prompt.substring(0, 60)}...</div>
              </button>
            ))}
          </div>
        )}
        </div>        <textarea
          value={sessionContext}
          onChange={(e) => setSessionContext(e.target.value)}
          placeholder="e.g., 'You are a helpful coding assistant. Always provide code examples and explain step by step.'"
          className="w-full p-3 border border-blue-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
          rows={4}
          maxLength={500}
        />        <div className="flex justify-between items-center mt-3">          <span className="text-xs text-blue-600">
          {sessionContext.length}/500 chars
        </span>
          <div className="space-x-2">
            <button
              onClick={() => setSessionContext("")}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionContext;