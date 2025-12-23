// src/components/layout/Sidebar/Sidebar.tsx
import React from 'react';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  TrendingUp, 
  Settings as SettingsIcon, 
  HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard,
  Shield,
  Trophy,
  Zap,
  PieChart
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
const Sidebar: React.FC = () => {
  const location = useLocation();
  //const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/wallet', icon: Wallet, label: 'Mi Cartera' },
    { path: '/transactions', icon: BarChart3, label: 'Transacciones' },
    { path: '/markets', icon: TrendingUp, label: 'Mercados' },
    { path: '/settings', icon: SettingsIcon, label: 'Configuración' },
  ];

  // En el componente
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  window.location.href = '/login';
};

  return (
    <aside className="hidden lg:block w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/80 min-h-screen shadow-sm">
      <div className="p-6 h-full flex flex-col">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100">
          <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="font-bold text-lg">UD</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">Usuario Demo</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full">
                NIVEL 2
              </div>
              <span className="text-xs text-gray-500 font-medium">Verificado</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        {/* Balance Mini */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 mb-8 shadow-lg">
          {/* Elementos decorativos */}
          <div className="absolute -top-10 -right-10 h-20 w-20 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 h-20 w-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-300">Balance Total</p>
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              $32,450.80
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <span className="text-xs font-bold text-green-400">+2.5% hoy</span>
                </div>
              </div>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
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
                className={`flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-blue-500/10 text-primary-600 font-semibold border-r-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:border-r-4 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-gradient-to-br from-primary-500 to-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`h-4 w-4 ${
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-2 px-4">
            <button className="flex flex-col items-center p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all group">
              <CreditCard className="h-5 w-5 text-emerald-600 mb-2" />
              <span className="text-xs font-medium text-emerald-800">Depositar</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all group">
              <Shield className="h-5 w-5 text-blue-600 mb-2" />
              <span className="text-xs font-medium text-blue-800">Seguridad</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 hover:border-violet-200 transition-all group">
              <Trophy className="h-5 w-5 text-violet-600 mb-2" />
              <span className="text-xs font-medium text-violet-800">Logros</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:border-amber-200 transition-all group">
              <Zap className="h-5 w-5 text-amber-600 mb-2" />
              <span className="text-xs font-medium text-amber-800">Rápido</span>
            </button>
          </div>
        </div>

        {/* Ayuda */}
        <div className="mb-6">
          <Link
            to="/help"
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors group"
          >
            <div className="p-2 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg group-hover:from-cyan-100 group-hover:to-blue-100">
              <HelpCircle className="h-4 w-4 text-cyan-600" />
            </div>
            <span className="font-medium">Centro de Ayuda</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-gray-200/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-red-600 hover:bg-red-50/80 rounded-xl transition-colors group"
          >
            <div className="p-2 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg group-hover:from-red-100 group-hover:to-rose-100">
              <LogOut className="h-4 w-4 text-red-600" />
            </div>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>

        {/* Versión */}
        <div className="mt-8 pt-6 border-t border-gray-200/80">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>CryptoWallet v1.0.0</span>
            <div className="flex items-center gap-1">
             
              
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            © 2024 MetaHalving. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;