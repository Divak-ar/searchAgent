import { useState, KeyboardEvent, useRef } from "react"

interface InputBarProps {
    currentMessage: string;
    setCurrentMessage: (message: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
    placeholder?: string;
}

const InputBar = ({ currentMessage, setCurrentMessage, onSubmit, isLoading = false, placeholder = "Ask me anything..." }: InputBarProps) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestions = [
        "What are the latest AI developments?",
        "How does climate change affect the economy?",
        "Explain quantum computing in simple terms",
        "What are the benefits of renewable energy?",
        "Compare different programming languages"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessage(e.target.value);
        setShowSuggestions(e.target.value.length === 0);
    }

    const handleSuggestionClick = (suggestion: string) => {
        setCurrentMessage(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (currentMessage.trim() && !isLoading) {
                onSubmit(e as any);
                setShowSuggestions(false);
            }
        }
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }

    const handleFocus = () => {
        if (currentMessage.length === 0) {
            setShowSuggestions(true);
        }
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow clicking
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <form onSubmit={onSubmit} className="p-3 sm:p-4 bg-white">
            <div className="flex items-center bg-[#F9F9F5] rounded-full p-2 sm:p-3 shadow-md border border-gray-200">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={isLoading ? "Waiting for response..." : placeholder}
                    value={currentMessage}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(currentMessage.length === 0)}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className="flex-grow px-3 sm:px-4 py-2 bg-transparent focus:outline-none text-gray-700 disabled:text-gray-400 text-sm sm:text-base"
                />
                <button
                    type="submit"
                    disabled={!currentMessage.trim() || isLoading}
                    className={`rounded-full p-2 sm:p-3 ml-2 shadow-md transition-all duration-200 group ${!currentMessage.trim() || isLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500'
                        }`}
                    title="Send message"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-45 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    )}
                </button>
            </div>
        </form>
    )
}

export default InputBar