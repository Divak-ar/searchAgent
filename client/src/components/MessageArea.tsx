import React, { useState, useEffect, useRef } from 'react';

// Enhanced markdown-like formatter for better text display
const formatContent = (content: string) => {
    if (!content) return content;

    // Handle code blocks first
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        // Add text before code block
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: content.slice(lastIndex, match.index)
            });
        }

        // Add code block
        parts.push({
            type: 'code',
            language: match[1] || 'text',
            content: match[2]
        });

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
        parts.push({
            type: 'text',
            content: content.slice(lastIndex)
        });
    }

    // If no code blocks found, treat entire content as text
    if (parts.length === 0) {
        parts.push({
            type: 'text',
            content: content
        });
    }

    return (
        <div className="prose prose-sm max-w-none">
            {parts.map((part, partIndex) => {
                if (part.type === 'code') {
                    return (
                        <div key={partIndex} className="my-4">
                            <div className="bg-gray-900 rounded-lg overflow-hidden">
                                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-300 border-b border-gray-700">
                                    {part.language}
                                </div>
                                <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                                    <code>{part.content}</code>
                                </pre>
                            </div>
                        </div>
                    );
                }

                // Format regular text
                const lines = part.content.split('\n');
                const formattedLines = lines.map((line, index) => {
                    // Handle headers
                    if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-800">{line.substring(4)}</h3>;
                    }
                    if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2 text-gray-800">{line.substring(3)}</h2>;
                    }
                    if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold mt-4 mb-2 text-gray-800">{line.substring(2)}</h1>;
                    }

                    // Handle bullet points
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                        return (
                            <div key={index} className="flex items-start mb-1 pl-4">
                                <span className="text-teal-500 mr-2 mt-1">•</span>
                                <span>{line.substring(2)}</span>
                            </div>
                        );
                    }

                    // Handle numbered lists
                    const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
                    if (numberedMatch) {
                        return (
                            <div key={index} className="flex items-start mb-1 pl-4">
                                <span className="text-teal-500 mr-2 mt-1 font-medium">{numberedMatch[1]}.</span>
                                <span>{numberedMatch[2]}</span>
                            </div>
                        );
                    }

                    // Handle inline code
                    if (line.includes('`')) {
                        const inlineCodeRegex = /`([^`]+)`/g;
                        const segments = [];
                        let lastIdx = 0;
                        let inlineMatch;

                        while ((inlineMatch = inlineCodeRegex.exec(line)) !== null) {
                            if (inlineMatch.index > lastIdx) {
                                segments.push(line.slice(lastIdx, inlineMatch.index));
                            }
                            segments.push(
                                <code key={inlineMatch.index} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                                    {inlineMatch[1]}
                                </code>
                            );
                            lastIdx = inlineMatch.index + inlineMatch[0].length;
                        }

                        if (lastIdx < line.length) {
                            segments.push(line.slice(lastIdx));
                        }

                        return (
                            <p key={index} className="mb-2 leading-relaxed">
                                {segments}
                            </p>
                        );
                    }

                    // Handle bold text
                    if (line.includes('**')) {
                        const boldParts = line.split(/(\*\*[^*]+\*\*)/);
                        return (
                            <p key={index} className="mb-2 leading-relaxed">
                                {boldParts.map((part, boldIndex) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={boldIndex} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
                                    }
                                    return part;
                                })}
                            </p>
                        );
                    }

                    // Handle empty lines
                    if (line.trim() === '') {
                        return <br key={index} />;
                    }

                    // Regular paragraphs
                    return <p key={index} className="mb-2 leading-relaxed text-gray-700">{line}</p>;
                });

                return <div key={partIndex}>{formattedLines}</div>;
            })}
        </div>
    );
};

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

interface MessageAreaProps {
    messages: Message[];
}

const CopyButton = ({ text, className = "" }: { text: string; className?: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            className={`p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 ${className}`}
            title={copied ? "Copied!" : "Copy to clipboard"}
        >
            {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
            )}
        </button>
    );
};

const PremiumTypingAnimation = () => {
    return (
        <div className="flex items-center">
            <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400/70 rounded-full animate-pulse"
                    style={{ animationDuration: "1s", animationDelay: "0ms" }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400/70 rounded-full animate-pulse"
                    style={{ animationDuration: "1s", animationDelay: "300ms" }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400/70 rounded-full animate-pulse"
                    style={{ animationDuration: "1s", animationDelay: "600ms" }}></div>
            </div>
        </div>
    );
};

const SearchStages = ({ searchInfo }: { searchInfo: SearchInfo }) => {
    if (!searchInfo || !searchInfo.stages || searchInfo.stages.length === 0) return null;

    return (
        <div className="mb-3 mt-1 relative pl-4">
            {/* Search Process UI */}
            <div className="flex flex-col space-y-4 text-sm text-gray-700">
                {/* Searching Stage */}
                {searchInfo.stages.includes('searching') && (
                    <div className="relative">
                        {/* Green dot */}
                        <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-teal-400 rounded-full z-10 shadow-sm"></div>

                        {/* Connecting line to next item if reading exists */}
                        {searchInfo.stages.includes('reading') && (
                            <div className="absolute -left-[7px] top-3 w-0.5 h-[calc(100%+1rem)] bg-gradient-to-b from-teal-300 to-teal-200"></div>
                        )}

                        <div className="flex flex-col">
                            <span className="font-medium mb-2 ml-2">Searching the web</span>

                            {/* Search Query in box styling */}
                            <div className="flex flex-wrap gap-2 pl-2 mt-1">
                                <div className="bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 inline-flex items-center">
                                    <svg className="w-3 h-3 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    {searchInfo.query}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reading Stage */}
                {searchInfo.stages.includes('reading') && (
                    <div className="relative">
                        {/* Green dot */}
                        <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-teal-400 rounded-full z-10 shadow-sm"></div>

                        <div className="flex flex-col">
                            <span className="font-medium mb-2 ml-2">Reading</span>

                            {/* Search Results */}
                            {searchInfo.urls && searchInfo.urls.length > 0 && (
                                <div className="pl-2 space-y-1">
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(searchInfo.urls) ? (
                                            searchInfo.urls.map((url: string, index: number) => (
                                                <div key={index} className="bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 truncate max-w-[200px] transition-all duration-200 hover:bg-gray-50 group cursor-pointer"
                                                    onClick={() => window.open(url, '_blank')}
                                                    title={url}>
                                                    <div className="flex items-center justify-between">
                                                        <span className="truncate">{url.length > 25 ? url.substring(0, 25) + '...' : url}</span>
                                                        <svg className="w-3 h-3 ml-1 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 truncate max-w-[200px] transition-all duration-200 hover:bg-gray-50">
                                                No results found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Writing Stage */}
                {searchInfo.stages.includes('writing') && (
                    <div className="relative">
                        {/* Green dot with subtle glow effect */}
                        <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-teal-400 rounded-full z-10 shadow-sm"></div>
                        <span className="font-medium pl-2">Writing answer</span>
                    </div>
                )}

                {/* Error Message */}
                {searchInfo.stages.includes('error') && (
                    <div className="relative">
                        {/* Red dot over the vertical line */}
                        <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-red-400 rounded-full z-10 shadow-sm"></div>
                        <span className="font-medium">Search error</span>
                        <div className="pl-4 text-xs text-red-500 mt-1">
                            {searchInfo.error || "An error occurred during search."}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MessageArea = ({ messages }: MessageAreaProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-grow overflow-y-auto bg-[#FCFCF8] border-b border-gray-100" style={{ minHeight: 0 }}>
            <div className="max-w-4xl mx-auto p-6">
                {messages.map((message: Message) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-5`}>
                        <div className="flex flex-col max-w-md">
                            {/* Search Status Display - Now ABOVE the message */}
                            {!message.isUser && message.searchInfo && (
                                <SearchStages searchInfo={message.searchInfo} />
                            )}

                            {/* Message Content */}
                            <div
                                className={`rounded-lg py-3 px-5 relative group ${message.isUser
                                    ? 'bg-gradient-to-br from-[#5E507F] to-[#4A3F71] text-white rounded-br-none shadow-md'
                                    : 'bg-[#F3F3EE] text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                    }`}
                            >
                                {/* Copy button for AI messages */}
                                {!message.isUser && message.content && !message.isLoading && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <CopyButton text={message.content} />
                                    </div>
                                )}

                                {message.isLoading ? (
                                    <PremiumTypingAnimation />
                                ) : (
                                    <div className="pr-8">
                                        {message.content ? (
                                            formatContent(message.content)
                                        ) : (
                                            // Fallback if content is empty but not in loading state
                                            <span className="text-gray-400 text-xs italic">Waiting for response...</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageArea;