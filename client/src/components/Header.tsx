import { useState } from 'react';

interface HeaderProps {
    onNewChat?: () => void;
    messagesCount?: number;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const Header = ({ onNewChat, messagesCount = 0, activeTab = 'CHAT', onTabChange }: HeaderProps) => {
    const handleNewChat = () => {
        if (onNewChat) {
            onNewChat();
        }
    };

    const handleTabClick = (tab: string) => {
        if (onTabChange) {
            onTabChange(tab);
        }
    };

    return (
        <header className="relative flex items-center justify-between px-8 py-5 bg-gradient-to-r from-[#4A3F71] to-[#5E507F] z-10">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="flex items-center relative">
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-teal-400 rounded-full opacity-80"></div>
                <div className="flex flex-col">
                    <span className="font-bold text-white text-xl tracking-tight">Search Agent</span>
                    {messagesCount > 1 && (
                        <span className="text-white/60 text-xs">{messagesCount - 1} messages</span>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-1">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('HOME');
                    }}
                    className={`text-sm px-6 py-2.5 font-medium rounded-lg transition-all duration-200 cursor-pointer border hover:scale-105 ${activeTab === 'HOME'
                        ? 'text-white bg-white/20 border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                        }`}
                    type="button"
                >
                    HOME
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('CHAT');
                    }}
                    className={`text-sm px-6 py-2.5 font-medium rounded-lg transition-all duration-200 cursor-pointer border hover:scale-105 ${activeTab === 'CHAT'
                        ? 'text-white bg-white/20 border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                        }`}
                    type="button"
                >
                    CHAT
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('SETTINGS');
                    }}
                    className={`text-sm px-6 py-2.5 font-medium rounded-lg transition-all duration-200 cursor-pointer border hover:scale-105 ${activeTab === 'SETTINGS'
                        ? 'text-white bg-white/20 border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                        }`}
                    type="button"
                >
                    SETTINGS
                </button>

                {/* New Chat Button */}
                <button
                    onClick={handleNewChat}
                    className="ml-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Start new chat"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
            </div>
        </header>
    )
}

export default Header