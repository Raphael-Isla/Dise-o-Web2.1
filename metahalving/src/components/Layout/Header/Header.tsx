/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/Header/Header.tsx
import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { 
  Search, Bell, User, ChevronDown, Settings, LogOut, 
  HelpCircle, Wallet, Shield, Moon, Sun, Download, 
  Upload, Key, ChevronRight, ExternalLink
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useUI } from '../../../contexts/useUI';
import ConnectionStatus from '../../common/ConnectionStatus/ConnectionStatus';
import { debounce}from 'lodash';
// Componente memoizado para notificaciones


const NotificationItem = memo(({ notification }: { notification: any }) => (
  <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
    notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
  }`}>
    <div className="flex items-start gap-3">
      <div className={`h-2 w-2 mt-2 rounded-full ${
        notification.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
      }`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {notification.time}
        </p>
      </div>
    </div>
  </div>
));

NotificationItem.displayName = 'NotificationItem';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateSettings } = useAuth();
  const { profilePhoto, userName } = useUI();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Datos del usuario
  const userEmail = user?.email || 'No autenticado';
  const userInitial = userName?.charAt(0).toUpperCase() || 'U';
  const portfolioValue = user?.dashboard?.totalBalance || 0;
  const availableCash = user?.dashboard?.availableCash || 0;
  const investedAmount = user?.dashboard?.totalInvested || 0;
  const profitLoss = user?.dashboard?.totalProfit || 0;
  const profitPercent = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar dropdowns al cambiar de ruta
  useEffect(() => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Memoizar funciones de navegación
  const navigateToProfile = useCallback(() => {
    navigate('/profile');
    setDropdownOpen(false);
  }, [navigate]);

  const navigateToSettings = useCallback(() => {
    navigate('/settings');
    setDropdownOpen(false);
  }, [navigate]);

  const navigateToWallet = useCallback(() => {
    navigate('/wallet');
    setDropdownOpen(false);
  }, [navigate]);

  const handleDepositClick = useCallback(() => {
    navigate('/wallet?action=deposit');
    setDropdownOpen(false);
  }, [navigate]);

  const handleWithdrawClick = useCallback(() => {
    navigate('/wallet?action=withdraw');
    setDropdownOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  // Función debounced para búsqueda
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
      if (query.trim()) {
        navigate(`/markets?search=${encodeURIComponent(query)}`);
        setSearchOpen(false);
        setSearchQuery('');
         console.log('Buscando:', query);
      }
    }, 300),
   [navigate]
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleDarkModeToggle = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Actualizar localStorage y clase del documento
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Actualizar configuración del usuario si existe
    updateSettings?.({ theme: newDarkMode ? 'dark' : 'light' });
  }, [darkMode, updateSettings]);

  // Notificaciones memoizadas
  const notifications = [
    { id: 1, title: 'Bitcoin subió 5%', time: 'Hace 5 min', unread: true, type: 'price' },
    { id: 2, title: 'Transacción completada', time: 'Hace 1 hora', unread: true, type: 'transaction' },
    { id: 3, title: 'Nuevo activo disponible', time: 'Hace 2 horas', unread: false, type: 'info' },
    { id: 4, title: 'Actualización de seguridad', time: 'Ayer', unread: false, type: 'security' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Formatear números
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 supports-backdrop-filter:bg-white/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y navegación izquierda */}
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-lg">MH</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  MetaHalving
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {user ? `Portfolio: ${formatCurrency(portfolioValue)}` : 'Crypto Portfolio'}
                </p>
              </div>
            </Link>

            {/* Barra de búsqueda (Desktop) */}
            <div className="hidden lg:block ml-8 flex-1 max-w-xl" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar criptomonedas, transacciones..."
                  className="w-full pl-10 pr-20 py-2.5 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  aria-label="Buscar en la plataforma"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-md">
                    ⌘K
                  </kbd>
                  <button
                    type="submit"
                    className="p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    aria-label="Buscar"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sección derecha con acciones */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Botón de búsqueda móvil */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Estado de conexión */}
            <div className="hidden md:block">
              <ConnectionStatus />
            </div>

            {/* Modo oscuro/claro */}
            <button
              onClick={handleDarkModeToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notificaciones */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={notificationsOpen ? "Cerrar notificaciones" : "Ver notificaciones"}
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs rounded-full">
                          {unreadCount} nuevas
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => {
                        navigate('/notifications');
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil del usuario */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={dropdownOpen ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
                aria-expanded={dropdownOpen}
              >
                <div className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-inner">
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt={`Foto de ${userName}`} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="h-full w-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                            <span class="text-white font-bold text-sm">${userInitial}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {userInitial}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                      {userName}
                    </p>
                    <ChevronDown className={`h-4 w-4 ml-1 text-gray-400 transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {userEmail}
                  </p>
                </div>
              </button>

              {/* Dropdown del perfil */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2">
                  {/* Información del usuario */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800">
                        {profilePhoto ? (
                          <img 
                            src={profilePhoto} 
                            alt={`Foto de ${userName}`} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-base">
                              {userInitial}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {userName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                    
                    {user && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio</p>
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {formatCurrency(portfolioValue)}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Disponible</p>
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {formatCurrency(availableCash)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones principales */}
                  <div className="py-2">
                    <button
                      onClick={navigateToProfile}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Mi Perfil</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>

                    <button
                      onClick={navigateToWallet}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="h-4 w-4 text-gray-500" />
                        <span>Mi Wallet</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>

                    <div className="grid grid-cols-2 gap-2 px-4 py-2">
                      <button
                        onClick={handleDepositClick}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 rounded-lg hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200 group"
                      >
                        <Download className="h-4 w-4 group-hover:translate-y-[-1px] transition-transform" />
                        <span className="text-sm font-medium">Depositar</span>
                      </button>
                      <button
                        onClick={handleWithdrawClick}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/20 dark:to-primary-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:from-blue-100 hover:to-primary-100 dark:hover:from-blue-900/30 dark:hover:to-primary-900/30 transition-all duration-200 group"
                      >
                        <Upload className="h-4 w-4 group-hover:translate-y-[-1px] transition-transform" />
                        <span className="text-sm font-medium">Retirar</span>
                      </button>
                    </div>
                  </div>

                  {/* Configuración y seguridad */}
                  <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={navigateToSettings}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span>Configuración</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>

                    <button className="flex items-center justify-between w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span>Seguridad</span>
                      </div>
                      <Key className="h-4 w-4 text-gray-400" />
                    </button>

                    <button className="flex items-center justify-between w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-gray-500" />
                        <span>Soporte</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Cerrar sesión */}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                    >
                      <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        {searchOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar criptomonedas, transacciones..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
                aria-label="Buscar en la plataforma"
              />
            </form>
          </div>
        )}

        {/* Estado de conexión móvil y estadísticas */}
        <div className="md:hidden py-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <ConnectionStatus />
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(portfolioValue)}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  profitLoss >= 0 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {profitLoss >= 0 ? '+' : ''}{formatNumber(profitPercent)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);