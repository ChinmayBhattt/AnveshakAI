import React from 'react';
import Header from './Header';
import WelcomeHero from './WelcomeHero';
import CapabilitiesSection from './CapabilitiesSection';
import TechSpecs from './TechSpecs';
import Footer from './Footer';

const WelcomePage = ({ 
  userPrincipal, 
  onConnect, 
  onDisconnect, 
  onGetStarted 
}) => {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        userPrincipal={userPrincipal}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
      
      <main>
        <WelcomeHero onGetStarted={onGetStarted} />
        <CapabilitiesSection />
        <TechSpecs />
      </main>
      
      <Footer />
    </div>
  );
};

export default WelcomePage;
