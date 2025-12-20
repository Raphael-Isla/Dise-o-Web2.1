// src/components/layout/Header/Header.tsx - VERSIÓN CORREGIDA
import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ConnectionStatus from '../../../components/common/ConnectionStatus/ConnectionStatus';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Search */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MH</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                MetaHalving
              </h1>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar criptomonedas, transacciones..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Actions and User */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <Menu className="h-6 w-6" />
            </button>

            {/* Search Button (Mobile) */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Usuario Demo</p>
                <p className="text-xs text-gray-500">Nivel 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status - Añadido aquí */}
        <div className="mt-4">
          <ConnectionStatus />
        </div>
      </div>
    </header>
  );
};

export default Header;