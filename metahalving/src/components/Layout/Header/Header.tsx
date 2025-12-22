// src/components/layout/Header/Header.tsx - VERSIÓN MEJORADA
import React from 'react';
import { Search, Bell, User, Menu, ChevronDown, Settings, LogOut, HelpCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConnectionStatus from '../../../components/common/ConnectionStatus/ConnectionStatus';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200/80 backdrop-blur-sm">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Search */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <span className="text-white font-bold text-lg">MH</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  MetaHalving
                </h1>
                <p className="text-xs text-gray-500 font-medium">Crypto Portfolio</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar criptomonedas, transacciones..."
                  className="pl-11 pr-4 py-2.5 w-72 lg:w-96 border border-gray-300/80 bg-white/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all shadow-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md">⌘ K</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions and User */}
          <div className="flex items-center gap-2">
            {/* Search Button (Mobile) */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></span>
              </button>
            </div>

            {/* Connection Status Badge (Desktop) */}
            <div className="hidden md:block">
                 <ConnectionStatus />
                  </div>
            {/* User Profile with Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="h-9 w-9 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center shadow-inner">
                  <User className="h-4.5 w-4.5 text-primary-600" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-900">Usuario Demo</p>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">Nivel 2 • Pro</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">Usuario Demo</p>
                  <p className="text-sm text-gray-500">usuario@demo.com</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-medium rounded-full">Pro</span>
                    <span className="text-xs text-gray-500">Nivel 2</span>
                  </div>
                </div>
                
                <div className="py-2">
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Mi Perfil</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span>Métodos de Pago</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Configuración</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                    <HelpCircle className="h-4 w-4 text-gray-500" />
                    <span>Ayuda y Soporte</span>
                  </a>
                </div>
                
                <div className="border-t border-gray-100 pt-2">
                  <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status (Mobile) and Extra Info */}
        <div className="mt-3 flex items-center justify-between">
          <div className="md:hidden">
            <ConnectionStatus />
          </div>
          
          {/* Network Info */}
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
             
             
            </div>
            
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Portfolio: </span>
              <span className="font-semibold text-gray-900">$24,580.32</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">24h: </span>
              <span className="font-semibold text-green-600">+2.34%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;