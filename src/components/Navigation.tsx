import React from 'react';
import { Home, Plus, BarChart3, MessageCircle, LogOut, User, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { signOut, user } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'add', label: 'Add Expense', icon: Plus },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ai', label: 'AI Assistant', icon: MessageCircle },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FinanceFlow
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l">
              <div className="flex items-center space-x-3">
                <img 
                  src="/photo_2025-05-19_22-40-08.jpg" 
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all duration-200"
                  onClick={() => onPageChange('profile')}
                />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t">
        <div className="grid grid-cols-6 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/photo_2025-05-19_22-40-08.jpg" 
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;