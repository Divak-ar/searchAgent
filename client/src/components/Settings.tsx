import { useState } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        theme: 'light',
        searchResults: 4,
        streamingEnabled: true,
        autoScroll: true,
        copyOnSelect: false
    });

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="flex-grow bg-[#FCFCF8] overflow-y-auto">
            <div className="max-w-3xl mx-auto p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
                    <p className="text-gray-600">Customize your Search Agent experience</p>
                </div>

                <div className="space-y-8">
                    {/* Appearance Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                            </svg>
                            Appearance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Theme</label>
                                    <p className="text-xs text-gray-500">Choose your preferred theme</p>
                                </div>
                                <select
                                    value={settings.theme}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            Search Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Max Search Results</label>
                                    <p className="text-xs text-gray-500">Number of search results to analyze</p>
                                </div>
                                <select
                                    value={settings.searchResults}
                                    onChange={(e) => handleSettingChange('searchResults', parseInt(e.target.value))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value={2}>2 Results</option>
                                    <option value={4}>4 Results</option>
                                    <option value={6}>6 Results</option>
                                    <option value={8}>8 Results</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Interface Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                            </svg>
                            Interface
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Real-time Streaming</label>
                                    <p className="text-xs text-gray-500">Enable live response streaming</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('streamingEnabled', !settings.streamingEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.streamingEnabled ? 'bg-teal-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.streamingEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Auto Scroll</label>
                                    <p className="text-xs text-gray-500">Automatically scroll to new messages</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('autoScroll', !settings.autoScroll)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoScroll ? 'bg-teal-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoScroll ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Copy on Select</label>
                                    <p className="text-xs text-gray-500">Automatically copy selected text</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('copyOnSelect', !settings.copyOnSelect)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.copyOnSelect ? 'bg-teal-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.copyOnSelect ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            System Information
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Version</span>
                                <span className="font-medium">2.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">AI Model</span>
                                <span className="font-medium">Gemini 2.0 Flash</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Search Provider</span>
                                <span className="font-medium">Tavily API</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Backend Status</span>
                                <span className="flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="font-medium text-green-600">Online</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
