import React, { useState, useRef, useEffect } from 'react';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';

const ChatInterface = ({ 
  userPrincipal, 
  onBackToWelcome,
  initialChat = [],
  selectedProvider = 'gemini',
  assistantType = 'casual',
  storeOnChain = false,
  icpMode = false
}) => {
  const [chat, setChat] = useState(initialChat.length > 0 ? initialChat : [
    {
      system: { 
        content: "🌐 Welcome to your ICP-Native Universal AI Assistant! I'm powered by the Internet Computer with Internet Identity authentication, cycles-based payments, and on-chain storage. Your original chatting experience is preserved while adding Web3 capabilities. What would you like to explore today?",
        provider: "system"
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    setChat(prev => [...prev, { user: { content: userMessage } }]);

    try {
      let response;
      if (icpMode) {
        // Use ICP-native prompt function with provider selection
        response = await backend.icp_ai_prompt(
          userMessage,
          selectedProvider ? [selectedProvider] : [],
          assistantType ? [assistantType] : [],
          storeOnChain ? [storeOnChain] : []
        );
      } else {
        // Use original prompt function
        response = await backend.prompt(userMessage);
      }

      if (response.Ok) {
        setChat(prev => [...prev, { 
          assistant: { 
            content: response.Ok,
            provider: selectedProvider || "gemini"
          }
        }]);
      } else {
        setChat(prev => [...prev, { 
          assistant: { 
            content: `Error: ${response.Err}`,
            provider: "error"
          }
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChat(prev => [...prev, { 
        assistant: { 
          content: `Error: Failed to send message. ${error.message}`,
          provider: "error"
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBackToWelcome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Welcome</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-500">
              {icpMode ? `ICP Mode • ${selectedProvider}` : 'Classic Mode'}
            </p>
          </div>

          {userPrincipal && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div 
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chat.map((message, index) => (
            <div key={index} className="animate-fadeIn">
              {message.user && (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs lg:max-w-md">
                    <p className="text-sm">{message.user.content}</p>
                  </div>
                  <img src={userImg} alt="User" className="w-8 h-8 rounded-full" />
                </div>
              )}
              
              {message.assistant && (
                <div className="flex items-start space-x-3">
                  <img src={botImg} alt="Assistant" className="w-8 h-8 rounded-full" />
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs lg:max-w-md shadow-sm border">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.assistant.content}</p>
                    {message.assistant.provider && (
                      <p className="text-xs text-gray-500 mt-1">via {message.assistant.provider}</p>
                    )}
                  </div>
                </div>
              )}
              
              {message.system && (
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl px-4 py-2 max-w-2xl">
                    <p className="text-sm text-gray-700 text-center">{message.system.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <img src={botImg} alt="Assistant" className="w-8 h-8 rounded-full" />
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm border">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
