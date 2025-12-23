/* eslint-disable react-hooks/exhaustive-deps */
// src/components/layout/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => {
    if (isMobile) {
       
      setSidebarOpen(false);
    }
  }, [window.location.pathname]); // Esto se activará cuando cambie la ruta

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fijo - ya tiene su propia lógica */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          top-16 lg:top-0
          h-[calc(100vh-4rem)] lg:h-screen
        `}>
          <Sidebar 
            isMobileOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
          w-full lg:w-[calc(100%-18rem)]
          p-4 md:p-6 lg:p-8
        `}>
          <Outlet />
        </main>
      </div>

      {/* Botón flotante para abrir sidebar en móvil */}
      {!sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Botón para cerrar sidebar en móvil (dentro del sidebar) */}
      {sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed top-20 right-6 z-50 p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Layout;