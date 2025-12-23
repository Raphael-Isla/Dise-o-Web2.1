// ═════════════════════════════════════════════════════════════════════
// ARCHIVO: src/auth/pages/Register.tsx
// ═════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const { register, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem('metahalving_remember_email');
    return savedEmail || '';
  });
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const savedEmail = localStorage.getItem('metahalving_remember_email');
    return !!savedEmail;
  });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setSuccess('');

    // Validaciones
    if (!email || !password || !confirmPassword) {
      setLocalError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({ 
        email, 
        password, 
        confirmPassword, 
        name,
        rememberMe 
      });
      
      setSuccess('¡Registro exitoso! Redirigiendo a tu dashboard...');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-green-500 to-primary-600 mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">MH</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-gray-400">Comienza tu viaje en MetaHalving</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 mb-6">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {displayError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{displayError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nombre (Opcional)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300 cursor-pointer">
                Recuerda mi email
              </label>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Beneficios de registrarte
              </h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• $10,000 USD iniciales para invertir</li>
                <li>• Dashboard personalizado</li>
                <li>• Wallet de criptomonedas</li>
                <li>• Seguimiento de transacciones</li>
                <li>• Acceso a mercados en tiempo real</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-primary-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;