// src/components/layout/Sidebar/Sidebar.tsx
import React, { useState } from 'react';
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
  PieChart,
  User,
  DollarSign,
  ArrowUpDown,
  X,
  //Menu,
  //ChevronLeft,
  ChevronDown,
  Bell,
  Activity,
  //Coins,
 // TrendingDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Datos del usuario
  const userName = user?.name || user?.email?.split('@')[0] || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = user?.email || 'No autenticado';
  const totalBalance = user?.dashboard?.totalBalance || 0;
const availableCash = user?.dashboard?.availableCash || 0;
const investedAmount = user?.dashboard?.totalInvested || 0;
const profitLoss = user?.dashboard?.totalProfit || 0;  // Asegúrate de que el campo se llama totalProfit
const profitPercent = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/wallet', icon: Wallet, label: 'Mi Cartera' },
    { path: '/transactions', icon: BarChart3, label: 'Transacciones' },
    { path: '/markets', icon: TrendingUp, label: 'Mercados' },
    { path: '/settings', icon: SettingsIcon, label: 'Configuración' },
  ];

  const quickActions = [
    { 
      icon: CreditCard, 
      label: 'Depositar', 
      color: 'emerald',
      onClick: () => {
        navigate('/wallet?action=deposit');
        onClose?.();
      }
    },
    { 
      icon: Shield, 
      label: 'Seguridad', 
      color: 'blue',
      onClick: () => {
        navigate('/settings?tab=security');
        onClose?.();
      }
    },
    { 
      icon: Trophy, 
      label: 'Logros', 
      color: 'violet',
      onClick: () => {
        navigate('/achievements');
        onClose?.();
      }
    },
    { 
      icon: Zap, 
      label: 'Rápido', 
      color: 'amber',
      onClick: () => {
        navigate('/quick-trade');
        onClose?.();
      }
    },
  ];

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    onClose?.();
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getBalanceDisplay = () => {
    if (showBalance) {
      return formatCurrency(totalBalance);
    }
    return '••••••••';
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 
        border-r border-gray-200/80 dark:border-gray-700/80 min-h-screen shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Botón de cerrar en móvil */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          <div 
            className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100 dark:border-primary-800/30 cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
            onClick={handleProfileClick}
          >
            <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
              {user ? (
                <span className="font-bold text-lg">{userInitial}</span>
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full">
                  NIVEL 2
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Balance Mini */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 mb-8 shadow-lg">
            {/* Elementos decorativos */}
            <div className="absolute -top-10 -right-10 h-20 w-20 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 h-20 w-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-300">Balance Total</p>
                <button
                  onClick={toggleBalanceVisibility}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                {getBalanceDisplay()}
              </p>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-400">Disponible</span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {showBalance ? formatCurrency(availableCash) : '••••••'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Invertido</span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {showBalance ? formatCurrency(investedAmount) : '••••••'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className={`h-4 w-4 ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="text-sm text-gray-400">Ganancia/Pérdida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {showBalance ? `${profitLoss >= 0 ? '+' : ''}${formatCurrency(profitLoss)}` : '••••••'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${profitPercent >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-gray-400">En tiempo real</span>
                </div>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Menú Principal */}
          <nav className="space-y-1 mb-8">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
              Navegación
            </h3>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/10 to-blue-500/10 dark:from-primary-900/20 dark:to-blue-900/20 text-primary-600 dark:text-primary-400 font-semibold border-r-4 border-primary-600 dark:border-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 hover:border-r-4 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-gradient-to-br from-primary-500 to-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* Acciones Rápidas */}
          <div className="mb-8">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex items-center justify-between w-full px-4 mb-3 group"
            >
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones Rápidas
              </h3>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
            </button>
            
            {showQuickActions && (
              <div className="grid grid-cols-2 gap-2 px-4">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={`flex flex-col items-center p-3 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 dark:from-${action.color}-900/20 dark:to-${action.color}-900/10 rounded-xl border border-${action.color}-100 dark:border-${action.color}-800/30 hover:border-${action.color}-200 dark:hover:border-${action.color}-700 transition-all group`}
                  >
                    <action.icon className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400 mb-2`} />
                    <span className={`text-xs font-medium text-${action.color}-800 dark:text-${action.color}-300`}>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Estadísticas Rápidas */}
          {user?.wallet.cryptoHoldings && user.wallet.cryptoHoldings.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
                Tus Top Activos
              </h3>
              <div className="space-y-2 px-4">
                {user.wallet.cryptoHoldings.slice(0, 3).map((holding) => (
                  <div 
                    key={holding.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => {
                      navigate(`/markets?asset=${holding.symbol}`);
                      onClose?.();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {holding.symbol.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {holding.symbol.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {holding.amount.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${holding.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ayuda y Soporte */}
          <div className="mb-6">
            <Link
              to="/help"
              onClick={() => onClose?.()}
              className="flex items-center gap-3 px-4 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
            >
              <div className="p-2 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg group-hover:from-cyan-100 group-hover:to-blue-100 dark:group-hover:from-cyan-900/30 dark:group-hover:to-blue-900/30">
                <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="font-medium">Centro de Ayuda</span>
            </Link>
          </div>

          {/* Notificaciones */}
          <div className="mb-6">
            <Link
              to="/notifications"
              onClick={() => onClose?.()}
              className="flex items-center justify-between px-4 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg group-hover:from-purple-100 group-hover:to-pink-100 dark:group-hover:from-purple-900/30 dark:group-hover:to-pink-900/30">
                  <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">Notificaciones</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            </Link>
          </div>

          {/* Logout */}
          <div className="mt-auto pt-6 border-t border-gray-200/80 dark:border-gray-700/80">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
            >
              <div className="p-2 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg group-hover:from-red-100 group-hover:to-rose-100 dark:group-hover:from-red-900/30 dark:group-hover:to-rose-900/30">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>

          {/* Información de Sesión */}
          <div className="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-700/80">
            <div className="space-y-2">
              {user && (
                <>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Sesión activa</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Último acceso: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>MetaHalving v2.0.0</span>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span>Beta</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                © 2024 MetaHalving. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Componentes auxiliares para los iconos de visibilidad
const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default Sidebar;