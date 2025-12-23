// src/contexts/UIContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface UIContextType {
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  // Agrega aquí otros estados de UI que necesites
}

// Crear el contexto con un valor por defecto
// eslint-disable-next-line react-refresh/only-export-components
export const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    // Cargar desde localStorage al iniciar
    return localStorage.getItem('userProfilePhoto');
  });
  
  const [userName, setUserName] = useState<string>('Usuario');

  // Escuchar eventos de actualización de foto de perfil
  useEffect(() => {
    const handleProfilePhotoUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.photo !== undefined) {
        setProfilePhoto(customEvent.detail.photo);
      }
      if (customEvent.detail?.name) {
        setUserName(customEvent.detail.name);
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, []);

  // Guardar en localStorage cuando cambie la foto
  useEffect(() => {
    if (profilePhoto) {
      localStorage.setItem('userProfilePhoto', profilePhoto);
    } else {
      localStorage.removeItem('userProfilePhoto');
    }
  }, [profilePhoto]);

  const value: UIContextType = {
    profilePhoto,
    setProfilePhoto,
    userName,
    setUserName,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

// NOTA: No exportes useUI desde aquí, usa el archivo separado