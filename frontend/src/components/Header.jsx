import React from 'react';

const Header = ({ userPrincipal, onConnect, onDisconnect }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AnveshakAI</h1>
              <p className="text-blue-100 text-sm">Powered by Internet Computer</p>
            </div>
          </div>

          {/* Identity Section */}
          <div className="flex items-center space-x-4">
            {userPrincipal ? (
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">Connected</p>
                  <p className="text-xs text-blue-100 font-mono">
                    {userPrincipal.slice(0, 8)}...{userPrincipal.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={onDisconnect}
                  className="text-white/70 hover:text-white transition-colors"
                  title="Disconnect"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
              >
                Connect Identity
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
