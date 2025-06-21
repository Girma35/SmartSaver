import React, { useState } from 'react';
import { Plus, BarChart3, MessageCircle, User, CreditCard, Menu, X, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'add', label: 'Add Expense', icon: Plus },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'ai', label: 'AI Assistant', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    onPageChange('home');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  SmartSaver
                </span>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l">
                {/* Pricing Button */}
                <button
                  onClick={() => handlePageChange('pricing')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src="/photo_2025-05-19_22-40-08.jpg" 
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all duration-200"
                    onClick={() => handlePageChange('profile')}
                  />
                  <span className="text-sm text-gray-600 hidden xl:inline">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => {
                    handleLogoClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    SmartSaver
                  </span>
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-xl">
                <img 
                  src="/photo_2025-05-19_22-40-08.jpg" 
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">Welcome back!</div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                </div>
              </div>

              {/* Pricing Button - Mobile */}
              <div className="mb-6">
                <button
                  onClick={() => handlePageChange('pricing')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Upgrade to Premium</span>
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="space-y-2 mb-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;