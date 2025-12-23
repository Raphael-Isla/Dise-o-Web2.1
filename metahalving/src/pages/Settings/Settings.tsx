/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useRef, useEffect } from 'react';
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
  EyeOff,
  Camera,
  Upload,
  Trash2,
  Image
} from 'lucide-react';

interface ProfilePhoto {
  url: string;
  timestamp: number;
  name: string;
}

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

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotos, setProfilePhotos] = useState<ProfilePhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar foto de perfil desde localStorage al iniciar
  useEffect(() => {
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    const savedPhotos = localStorage.getItem('userProfilePhotos');
    
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
    
    if (savedPhotos) {
      setProfilePhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Guardar foto de perfil en localStorage
  useEffect(() => {
    if (profilePhoto) {
      localStorage.setItem('userProfilePhoto', profilePhoto);
    } else {
      localStorage.removeItem('userProfilePhoto');
    }
  }, [profilePhoto]);

  // Guardar historial de fotos en localStorage
  useEffect(() => {
    localStorage.setItem('userProfilePhotos', JSON.stringify(profilePhotos));
  }, [profilePhotos]);

  const handleChange = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUserInfoChange = (key: keyof typeof userInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Disparar evento personalizado para notificar a Header y Sidebar
    const event = new CustomEvent('profilePhotoUpdated', { 
      detail: { photo: profilePhoto, name: userInfo.name } 
    });
    window.dispatchEvent(event);
    
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Crear versión comprimida
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          const newPhoto: ProfilePhoto = {
            url: compressedBase64,
            timestamp: Date.now(),
            name: file.name
          };
          
          setProfilePhoto(compressedBase64);
          setProfilePhotos(prev => [newPhoto, ...prev.slice(0, 4)]); // Mantener solo las últimas 5
          
          // Disparar evento personalizado para actualizar en tiempo real
          const event = new CustomEvent('profilePhotoUpdated', { 
            detail: { photo: compressedBase64, name: userInfo.name } 
          });
          window.dispatchEvent(event);
          
          alert('Foto de perfil actualizada exitosamente');
        };
        img.src = base64String;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
      setProfilePhoto(null);
      
      // Disparar evento personalizado
      const event = new CustomEvent('profilePhotoUpdated', { 
        detail: { photo: null, name: userInfo.name } 
      });
      window.dispatchEvent(event);
      
      alert('Foto de perfil eliminada');
    }
  };

  const handleSelectFromGallery = (photo: ProfilePhoto) => {
    setProfilePhoto(photo.url);
    
    // Disparar evento personalizado
    const event = new CustomEvent('profilePhotoUpdated', { 
      detail: { photo: photo.url, name: userInfo.name } 
    });
    window.dispatchEvent(event);
    
    alert('Foto de perfil cambiada');
  };

  const handleRemoveFromGallery = (timestamp: number) => {
    if (confirm('¿Eliminar esta foto de la galería?')) {
      const updatedPhotos = profilePhotos.filter(p => p.timestamp !== timestamp);
      setProfilePhotos(updatedPhotos);
      
      // Si la foto eliminada era la actual, limpiar la actual
      if (profilePhoto && updatedPhotos.findIndex(p => p.url === profilePhoto) === -1) {
        setProfilePhoto(null);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    return userInfo.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white/20 bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Foto de perfil" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {getInitials()}
                  </span>
                )}
              </div>
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-primary-500 to-blue-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                title="Cambiar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{userInfo.name}</h1>
              <p className="text-gray-300 text-lg">Administra tus preferencias, seguridad y cuenta</p>
            </div>
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

      {/* NUEVA SECCIÓN: Foto de Perfil */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Foto de Perfil</h2>
              <p className="text-gray-600">Personaliza tu foto en el header y sidebar</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Foto actual */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Foto actual" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
              {profilePhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
                  title="Eliminar foto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{userInfo.name}</p>
              <p className="text-sm text-gray-500">Foto actual en header y sidebar</p>
            </div>
          </div>

          {/* Input para subir foto */}
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={triggerFileInput}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 rounded-2xl transition-all duration-200 group"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-blue-200">
                  <Upload className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-700">
                    Subir nueva foto
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG o GIF (max 5MB)
                  </p>
                </div>
              </button>
              
              <button
                onClick={() => setProfilePhoto(null)}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-pink-200">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 group-hover:text-red-700">
                    Usar iniciales
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mostrar iniciales en lugar de foto
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Galería de fotos previas (si hay) */}
          {profilePhotos.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <Image className="h-5 w-5" />
                Fotos anteriores
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {profilePhotos.map((photo) => (
                  <div 
                    key={photo.timestamp} 
                    className="relative group cursor-pointer"
                    onClick={() => handleSelectFromGallery(photo)}
                  >
                    <div className={`aspect-square rounded-xl overflow-hidden border-2 ${
                      profilePhoto === photo.url 
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-primary-400'
                    }`}>
                      <img 
                        src={photo.url} 
                        alt="Foto anterior" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">
                        Seleccionar
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromGallery(photo.timestamp);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Las fotos se guardan localmente en tu navegador. Se guardan hasta 5 fotos anteriores.
              </p>
            </div>
          )}

          {/* Información de almacenamiento */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Almacenamiento local</p>
                <p className="text-sm text-gray-500">
                  Fotos guardadas en tu navegador: {profilePhotos.length}/5
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('¿Eliminar todas las fotos del historial?')) {
                    setProfilePhotos([]);
                    localStorage.removeItem('userProfilePhotos');
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Limpiar historial
              </button>
            </div>
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