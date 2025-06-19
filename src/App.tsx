import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import AuthForm from './components/AuthForm';
import Landing from './pages/Landing';
import AddExpense from './pages/AddExpense';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import { useAuth } from './hooks/useAuth';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  // Handle URL-based routing for success page and other special routes
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    if (path === '/success' || searchParams.has('session_id')) {
      setCurrentPage('success');
      return;
    }
    
    // Don't change page if user is already on a specific page
    // This prevents unwanted redirects when the component re-renders
    if (currentPage === 'home' && user) {
      // Only auto-navigate to dashboard if we're still on home and user just logged in
      const hasNavigated = sessionStorage.getItem('hasNavigated');
      if (!hasNavigated) {
        setCurrentPage('dashboard');
        sessionStorage.setItem('hasNavigated', 'true');
      }
    }
  }, [user, currentPage]);

  // Clear navigation flag when user logs out
  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem('hasNavigated');
      setCurrentPage('home');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading FinanceFlow...</p>
        </div>
      </div>
    );
  }

  // Handle success page routing - show success page even if not authenticated
  if (currentPage === 'success' || window.location.pathname === '/success') {
    return <Success />;
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleGetStarted = () => {
    setCurrentPage('add');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Update URL for better user experience (optional)
    if (page === 'pricing') {
      window.history.pushState({}, '', '/pricing');
    } else if (page === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Landing onGetStarted={handleGetStarted} />;
      case 'add':
        return <AddExpense />;
      case 'dashboard':
        return <Dashboard />;
      case 'ai':
        return <AIAssistant />;
      case 'profile':
        return <Profile />;
      case 'pricing':
        return <Pricing />;
      case 'success':
        return <Success />;
      default:
        return <Landing onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'home' && currentPage !== 'success' && (
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      {renderCurrentPage()}
    </div>
  );
}

export default App;