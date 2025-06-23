import { useState } from 'react';

interface SettingsProps {
    settings: {
        searchResults: number;
        streamingEnabled: boolean;
        autoScroll: boolean;
        copyOnSelect: boolean;
    };
    onSettingsChange: (settings: any) => void;
}

const Settings = ({ settings, onSettingsChange }: SettingsProps) => {
    const handleSettingChange = (key: string, value: any) => {
        const newSettings = {
            ...settings,
            [key]: value
        };
        onSettingsChange(newSettings);
    };

    return (
        <div className="flex-grow bg-gray-50 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
                    <p className="text-gray-600">Customize your Search Agent experience</p>
                </div>                <div className="space-y-8">
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
                                    <label className="text-sm font-medium text-gray-800">Max Search Results</label>
                                    <p className="text-xs text-gray-600">Number of search results to analyze</p>
                                </div>
                                <select
                                    value={settings.searchResults}
                                    onChange={(e) => handleSettingChange('searchResults', parseInt(e.target.value))}
                                    className="px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50 text-green-800"
                                >
                                    <option value={1} className="bg-green-50 text-green-800">1 Result</option>
                                    <option value={2} className="bg-green-50 text-green-800">2 Results</option>
                                    <option value={3} className="bg-green-50 text-green-800">3 Results</option>
                                    <option value={4} className="bg-green-50 text-green-800">4 Results</option>
                                    <option value={5} className="bg-green-50 text-green-800">5 Results</option>
                                </select>
                            </div>
                        </div>
                    </div>                    {/* Interface Section */}
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
                                    <label className="text-sm font-medium text-gray-800">Real-time Streaming</label>
                                    <p className="text-xs text-gray-600">Enable live response streaming</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('streamingEnabled', !settings.streamingEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.streamingEnabled ? 'bg-green-500' : 'bg-gray-300'
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
                                    <label className="text-sm font-medium text-gray-800">Auto Scroll</label>
                                    <p className="text-xs text-gray-600">Automatically scroll to new messages</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('autoScroll', !settings.autoScroll)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoScroll ? 'bg-green-500' : 'bg-gray-300'
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
                                    <label className="text-sm font-medium text-gray-800">Copy on Select</label>
                                    <p className="text-xs text-gray-600">Automatically copy selected text</p>
                                </div>
                                <button
                                    onClick={() => handleSettingChange('copyOnSelect', !settings.copyOnSelect)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.copyOnSelect ? 'bg-green-500' : 'bg-gray-300'
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
                        </h3>                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-black font-medium">Version</span>
                                <span className="font-medium text-black">2.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-black font-medium">AI Model</span>
                                <span className="font-medium text-black">Gemini 2.0 Flash</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-black font-medium">Search Provider</span>
                                <span className="font-medium text-black">Tavily API</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-600">Backend Status</span>
                                <span className="flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="font-medium text-green-600">Online</span>
                                </span>
                            </div>                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
