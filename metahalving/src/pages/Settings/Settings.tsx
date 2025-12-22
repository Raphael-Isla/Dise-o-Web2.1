import React, { useState } from 'react';
import { 
  Save, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  User, 
  Lock, 
  Palette,
  Smartphone,
  Mail,
  Key,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    language: 'es',
    currency: 'USD',
    theme: 'light'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUserInfoChange = (key: keyof typeof userInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Guardando configuración:', settings);
    console.log('Información de usuario:', userInfo);
    alert('Configuración guardada exitosamente');
  };

  const handleUpdatePassword = () => {
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña actualizada exitosamente');
    setUserInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Configuración</h1>
            <p className="text-gray-300 text-lg">Administra tus preferencias, seguridad y cuenta</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group"
          >
            <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            Guardar Cambios
          </button>
        </div>
        
        {/* Stats rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Notificaciones activas</p>
            <p className="text-2xl font-bold">{settings.emailNotifications ? 2 : 1}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Protección</p>
            <p className="text-2xl font-bold text-green-400">{settings.twoFactorAuth ? 'ON' : 'OFF'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Idioma</p>
            <p className="text-2xl font-bold">{settings.language.toUpperCase()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-gray-300">Moneda</p>
            <p className="text-2xl font-bold">{settings.currency}</p>
          </div>
        </div>
      </div>

      {/* Configuración de Notificaciones - Estilo mejorado */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
              <p className="text-gray-600">Controla cómo recibes las alertas y actualizaciones</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Notificaciones por Email</h3>
                <p className="text-sm text-gray-600">Recibe alertas importantes en tu correo</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Notificaciones Push</h3>
                <p className="text-sm text-gray-600">Alertas en tiempo real en tu dispositivo</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.pushNotifications}
                onChange={(e) => handleChange('pushNotifications', e.target.checked)}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Seguridad - Diseño mejorado */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Seguridad</h2>
              <p className="text-gray-600">Protege tu cuenta y datos personales</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <Lock className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Autenticación de Dos Factores (2FA)</h3>
                <p className="text-sm text-gray-600">Añade una capa extra de seguridad a tu cuenta</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              Cambiar Contraseña
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={userInfo.currentPassword}
                    onChange={(e) => handleUserInfoChange('currentPassword', e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nueva contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userInfo.newPassword}
                  onChange={(e) => handleUserInfoChange('newPassword', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Confirmar nueva contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userInfo.confirmPassword}
                  onChange={(e) => handleUserInfoChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <button
                onClick={handleUpdatePassword}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md"
              >
                Actualizar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferencias - Tarjetas más atractivas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Idioma */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Idioma</h3>
              <p className="text-gray-600">Selecciona tu idioma preferido</p>
            </div>
          </div>
          <select
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="es" className="text-gray-900">🇪🇸 Español</option>
            <option value="en" className="text-gray-900">🇺🇸 English</option>
            <option value="pt" className="text-gray-900">🇵🇹 Português</option>
          </select>
        </div>

        {/* Moneda */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Moneda</h3>
              <p className="text-gray-600">Moneda de visualización predeterminada</p>
            </div>
          </div>
          <select
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={settings.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            <option value="USD" className="text-gray-900">💵 USD - Dólar Americano</option>
            <option value="EUR" className="text-gray-900">💶 EUR - Euro</option>
            <option value="MXN" className="text-gray-900">🇲🇽 MXN - Peso Mexicano</option>
            <option value="COP" className="text-gray-900">🇨🇴 COP - Peso Colombiano</option>
          </select>
        </div>

        {/* Tema */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Palette className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Tema</h3>
              <p className="text-gray-600">Apariencia visual de la aplicación</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleChange('theme', 'light')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                settings.theme === 'light' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="h-8 w-16 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg mx-auto mb-2"></div>
                <span className={`font-medium ${
                  settings.theme === 'light' ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  Claro
                </span>
              </div>
            </button>
            <button
              onClick={() => handleChange('theme', 'dark')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                settings.theme === 'dark' 
                  ? 'border-gray-800 bg-gray-900 text-white' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="h-8 w-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg mx-auto mb-2"></div>
                <span className={`font-medium ${
                  settings.theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Oscuro
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Información de la Cuenta */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Información de la Cuenta</h2>
              <p className="text-gray-600">Actualiza tus datos personales</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={userInfo.email}
                onChange={(e) => handleUserInfoChange('email', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={userInfo.phone}
                onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Zona Peligrosa - Más prominente */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Zona de Alto Riesgo</h2>
              <p className="text-red-100">Acciones que no se pueden deshacer</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 mb-6">
            <p className="text-red-800 font-medium mb-2">
              ⚠️ Advertencia: Estas acciones son permanentes
            </p>
            <p className="text-gray-700">
              Una vez que desactives o elimines tu cuenta, perderás acceso a todos tus datos,
              transacciones y configuraciones. Esta acción no se puede revertir.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 border-2 border-red-400 text-red-700 bg-white hover:bg-red-50 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-red-500 flex items-center justify-center gap-2">
              <span>⏸️</span>
              Desactivar Cuenta Temporalmente
            </button>
            <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <span>🗑️</span>
              Eliminar Cuenta Permanentemente
            </button>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
        <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        <p className="mt-1">© 2024 MetaHalving. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default Settings;