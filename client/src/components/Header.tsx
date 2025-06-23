import { useState } from 'react';

interface HeaderProps {
    onNewChat?: () => void;
    messagesCount?: number;
}

const Header = ({ onNewChat, messagesCount = 0 }: HeaderProps) => {
    const [activeTab, setActiveTab] = useState('CHAT');

    const handleNewChat = () => {
        if (onNewChat) {
            onNewChat();
        }
    };

    return (
        <header className="relative flex items-center justify-between px-8 py-5 bg-gradient-to-r from-[#4A3F71] to-[#5E507F] z-10">
            <div className="absolute inset-0 bg-[url('/api/placeholder/100/100')] opacity-5 mix-blend-overlay"></div>
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
                    onClick={() => setActiveTab('HOME')}
                    className={`text-xs px-4 py-2 font-medium rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'HOME' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                >
                    HOME
                </button>
                <button
                    onClick={() => setActiveTab('CHAT')}
                    className={`text-xs px-4 py-2 font-medium rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'CHAT' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                >
                    CHAT
                </button>
                <button
                    onClick={() => setActiveTab('CONTACTS')}
                    className={`text-xs px-4 py-2 font-medium rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'CONTACTS' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                >
                    CONTACTS
                </button>
                <button
                    onClick={() => setActiveTab('SETTINGS')}
                    className={`text-xs px-4 py-2 font-medium rounded-lg transition-all duration-200 cursor-pointer ${activeTab === 'SETTINGS' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
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