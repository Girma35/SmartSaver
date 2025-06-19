import React, { useState } from 'react';
import Navigation from './components/Navigation';
import AuthForm from './components/AuthForm';
import Landing from './pages/Landing';
import AddExpense from './pages/AddExpense';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import { useAuth } from './hooks/useAuth';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

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

  if (!user) {
    return <AuthForm />;
  }

  const handleGetStarted = () => {
    setCurrentPage('add');
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
      default:
        return <Landing onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'home' && (
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      {renderCurrentPage()}
    </div>
  );
}

export default App;