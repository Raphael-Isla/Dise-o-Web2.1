/* ========================================
ARCHIVO 6: src/services/api/authAPI.ts
======================================== */

import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials,
  User 
} from '../../auth/types/auth.types';

class AuthAPI {
  private static readonly USER_DB_KEY = 'metahalving_users_db';
  private static readonly PASSWORD_PREFIX = 'metahalving_pwd_'; // ✅ Agrega esta constante

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = this.getAllUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const storedPassword = this.getUserPassword(user.id);
    if (storedPassword !== credentials.password) {
      throw new Error('Contraseña incorrecta');
    }

    user.lastLogin = new Date();
    this.updateUser(user);

    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    if (credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (!credentials.agreeToTerms) {
      throw new Error('Debes aceptar los términos y condiciones');
    }

    const users = this.getAllUsers();
    const existingUser = users.find(u => u.email === credentials.email);

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    users.push(newUser);
    localStorage.setItem(AuthAPI.USER_DB_KEY, JSON.stringify(users)); // ✅ Usa la constante
    this.setUserPassword(newUser.id, credentials.password);

    const token = this.generateToken(newUser.id);

    return {
      user: newUser,
      token,
    };
  }

  async verifyToken(token: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('Token inválido');
    }

    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  private getAllUsers(): User[] {
    const data = localStorage.getItem(AuthAPI.USER_DB_KEY); // ✅ Usa la constante
    if (!data) {
      return this.createDemoUsers();
    }
    return JSON.parse(data);
  }

  private createDemoUsers(): User[] {
    const demoUsers: User[] = [
      {
        id: 'user_demo_1',
        email: 'demo@metahalving.com',
        name: 'Usuario Demo',
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
    ];

    localStorage.setItem(AuthAPI.USER_DB_KEY, JSON.stringify(demoUsers)); // ✅ Usa la constante
    this.setUserPassword('user_demo_1', 'password123');

    return demoUsers;
  }

  private updateUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(AuthAPI.USER_DB_KEY, JSON.stringify(users)); // ✅ Usa la constante
    }
  }

  private getUserPassword(userId: string): string | null {
    return localStorage.getItem(`${AuthAPI.PASSWORD_PREFIX}${userId}`) || null; // ✅ Usa la constante
  }

  private setUserPassword(userId: string, password: string): void {
    localStorage.setItem(`${AuthAPI.PASSWORD_PREFIX}${userId}`, password); // ✅ Usa la constante
  }

  private generateToken(userId: string): string {
    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
    return btoa(JSON.stringify(payload));
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      return payload.userId;
    } catch {
      return null;
    }
  }
}

export const authAPI = new AuthAPI();