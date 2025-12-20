// src/components/layout/Sidebar/Sidebar.tsx
import React from 'react';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  TrendingUp, 
  Settings as SettingsIcon, 
  HelpCircle,
  //CreditCard,
  //Shield,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/wallet', icon: Wallet, label: 'Mi Cartera' },
    { path: '/transactions', icon: BarChart3, label: 'Transacciones' },
    { path: '/markets', icon: TrendingUp, label: 'Mercados' },
    { path: '/settings', icon: SettingsIcon, label: 'Configuración' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <span className="font-semibold">UD</span>
          </div>
          <div>
            <p className="font-medium">Usuario Demo</p>
            <p className="text-sm text-gray-500">Nivel 2 Verificado</p>
          </div>
        </div>

        {/* Balance Mini */}
        <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-lg p-4 mb-8 text-white">
          <p className="text-sm font-medium">Balance Total</p>
          <p className="text-2xl font-bold">$32,100</p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-green-500/20 px-2 py-1 rounded">+2.5% hoy</span>
          </div>
        </div>

        {/* Menú Principal */}
        <nav className="space-y-1 mb-8">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-200'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Ayuda */}
        <div className="mb-8">
          <Link
            to="/help"
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Centro de Ayuda</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Versión */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">CryptoWallet v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;