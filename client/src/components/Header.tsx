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
        <header className="relative flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-[#4A3F71] to-[#5E507F] z-10">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Logo and Title */}
            <div className="flex items-center relative">
                <div className="absolute -left-2 sm:-left-3 top-1/2 transform -translate-y-1/2 w-1.5 h-4 sm:h-6 bg-teal-400 rounded-full opacity-80"></div>
                <div className="flex flex-col">
                    <span className="font-bold text-white text-lg sm:text-xl tracking-tight">Search Agent</span>
                    {messagesCount > 1 && (
                        <span className="text-white/60 text-xs hidden sm:block">{messagesCount - 1} messages</span>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('HOME');
                    }}
                    className={`text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 font-medium rounded-lg transition-all duration-200 cursor-pointer border hover:scale-105 ${activeTab === 'HOME'
                        ? 'text-white bg-white/20 border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                        }`}
                    type="button"
                >
                    <span className="hidden sm:inline">HOME</span>
                    <span className="sm:hidden">🏠</span>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('CHAT');
                    }}
                    className={`text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 font-medium rounded-lg transition-all duration-200 cursor-pointer border hover:scale-105 ${activeTab === 'CHAT'
                        ? 'text-white bg-white/20 border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                        }`}
                    type="button"
                >
                    <span className="hidden sm:inline">CHAT</span>
                    <span className="sm:hidden">💬</span>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleTabClick('SETTINGS');
                    }}
                    className={`text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 font-medium rounded-lg transition-all duration-200 cursor-pointer border hover:scale-105 ${activeTab === 'SETTINGS'
                        ? 'text-white bg-white/20 border-white/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border-transparent'
                        }`}
                    type="button"
                >
                    <span className="hidden sm:inline">SETTINGS</span>
                    <span className="sm:hidden">⚙️</span>
                </button>

                {/* GitHub Profile Link - Only show in CHAT tab and on larger screens */}
                {activeTab === 'CHAT' && (
                    <a
                        href="https://github.com/Divak-ar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 sm:ml-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        title="Visit GitHub Profile"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                        </svg>
                    </a>
                )}
            </div>
        </header>
    )
}

export default Header