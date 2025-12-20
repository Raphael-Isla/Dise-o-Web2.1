import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, CreditCard, User } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    language: 'es',
    currency: 'USD',
    theme: 'light'
  });

  const handleChange = (key: keyof typeof settings, value: boolean | string) => {
  setSettings(prev => ({ ...prev, [key]: value }));
};

  const handleSave = () => {
    // Aquí iría la lógica para guardar en backend
    console.log('Guardando configuración:', settings);
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra tus preferencias y seguridad</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Save className="h-5 w-5" />
          Guardar Cambios
        </button>
      </div>

      {/* Configuración de Notificaciones */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold">Notificaciones</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notificaciones por Email</h3>
              <p className="text-sm text-gray-500">Recibe alertas importantes en tu correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notificaciones Push</h3>
              <p className="text-sm text-gray-500">Alertas en tiempo real en tu dispositivo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.pushNotifications}
                onChange={(e) => handleChange('pushNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold">Seguridad</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Autenticación de Dos Factores (2FA)</h3>
              <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-3">Cambiar Contraseña</h3>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Actualizar Contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Preferencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Idioma */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Idioma</h3>
          </div>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        {/* Moneda */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Moneda de Visualización</h3>
          </div>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={settings.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            <option value="USD">USD - Dólar Americano</option>
            <option value="EUR">EUR - Euro</option>
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="COP">COP - Peso Colombiano</option>
          </select>
        </div>
      </div>

      {/* Información de la Cuenta */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-semibold">Información de la Cuenta</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              defaultValue="Usuario Demo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2"
              defaultValue="usuario@demo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Zona Peligrosa */}
      <div className="card border border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-6 text-red-600">
            ⚠️
          </div>
          <h2 className="text-xl font-semibold text-red-700">Zona Peligrosa</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Estas acciones son permanentes y no se pueden deshacer.
          </p>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
              Desactivar Cuenta Temporalmente
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Eliminar Cuenta Permanentemente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;