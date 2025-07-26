import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import WelcomePage from './components/WelcomePage';
import ChatInterface from './components/ChatInterface';

const App = () => {
  // View state
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' or 'chat'
  
  const [chat, setChat] = useState([
    {
      system: { 
        content: "🌐 Welcome to your ICP-Native Universal AI Assistant! I'm powered by the Internet Computer with Internet Identity authentication, cycles-based payments, and on-chain storage. Your original chatting experience is preserved while adding Web3 capabilities. What would you like to explore today?",
        provider: "system"
      }
    }
  ]);
  
  // Original state variables
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [assistantType, setAssistantType] = useState('casual');
  const [availableProviders, setAvailableProviders] = useState(['gemini']);
  
  // New ICP-native state variables
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [storeOnChain, setStoreOnChain] = useState(false);
  const [userDashboard, setUserDashboard] = useState(null);
  const [icpMode, setIcpMode] = useState(false);

  useEffect(() => {
    loadInitialData();
    // Simulate Internet Identity connection
    const mockPrincipal = `rdmx6-jaaaa-aaaah-qcaiq-cai`;
    setUserPrincipal(mockPrincipal);
    loadUserDashboard();
  }, []);

  const loadInitialData = async () => {
    try {
      const providers = await backend.get_available_providers();
      setAvailableProviders(providers.length > 0 ? providers : ['gemini']);
    } catch (error) {
      console.log('Could not load providers:', error);
    }
  };

  const loadUserDashboard = async () => {
    if (!userPrincipal) return;
    
    try {
      const dashboardResult = await backend.get_user_dashboard(userPrincipal);
      if (dashboardResult.Ok) {
        setUserDashboard(dashboardResult.Ok);
      }
    } catch (error) {
      console.log('Could not load user dashboard:', error);
    }
  };

  // Handler functions for the new UI
  const handleConnect = () => {
    // Simulate Internet Identity connection
    const mockPrincipal = `rdmx6-jaaaa-aaaah-qcaiq-cai`;
    setUserPrincipal(mockPrincipal);
    loadUserDashboard();
  };

  const handleDisconnect = () => {
    setUserPrincipal(null);
    setUserDashboard(null);
  };

  const handleGetStarted = () => {
    setCurrentView('chat');
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
  };

  // Render the appropriate view
  if (currentView === 'welcome') {
    return (
      <WelcomePage 
        userPrincipal={userPrincipal}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onGetStarted={handleGetStarted}
      />
    );
  }

  return (
    <ChatInterface 
      userPrincipal={userPrincipal}
      onBackToWelcome={handleBackToWelcome}
      initialChat={chat}
      selectedProvider={selectedProvider}
      assistantType={assistantType}
      storeOnChain={storeOnChain}
      icpMode={icpMode}
    />
  );
};

export default App;
