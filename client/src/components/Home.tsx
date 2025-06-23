const Home = () => {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            ),
            title: "Intelligent Search",
            description: "Advanced web search powered by AI to find the most relevant information"
        },
        {
            icon: (
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
            ),
            title: "AI-Powered Answers",
            description: "Get comprehensive, well-formatted responses using cutting-edge language models"
        },
        {
            icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
            ),
            title: "Real-time Streaming",
            description: "Watch your answers appear in real-time with live search progress tracking"
        }
    ]; return (
        <div className="flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-y-auto">
            <div className="min-h-full flex flex-col justify-center items-center px-8 py-12">
                {/* Main Logo/Title */}
                <div className="text-center mb-16">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl shadow-xl mb-6">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-6">
                        Search Agent
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Your intelligent companion for web search and information discovery.
                        Ask questions, get comprehensive answers powered by advanced AI.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4">
                                    {feature.icon}
                                </div>                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Getting Started */}
                <div className="text-center mb-12">                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready to get started?</h3>
                    <p className="text-gray-600 mb-6">
                        Click on the <span className="font-medium text-teal-600">CHAT</span> tab above to begin your search journey
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Web Search Active
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            AI Model Ready
                        </div>                        </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
