import React from 'react';
import { Session } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  session: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gradient-to-r from-black to-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/src/assets/images/noblefit-logo.jpg"
              alt="Noble Fit Logo"
              className="h-10 w-10 object-contain rounded"
            />
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-white">Noble Fit</h1>
              <p className="text-gray-300 text-sm">Order Manager</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white text-sm">{new Date().toLocaleDateString()}</p>
              {session && (
                <p className="text-gray-300 text-xs">{session.user.email}</p>
              )}
            </div>
            {session && (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;