/**
 * Context de Autenticación
 * Gestiona el estado global del usuario autenticado
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isApproved: boolean;
    isPending: boolean; // Nuevo estado para usuarios pendientes
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    register: (data: RegisterRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Usuario ficticio para saltar el login mientras se inspecciona la app
    const bypassUser: User = {
        id: 0,
        username: 'devbypass',
        email: 'test@example.com',
        firstName: 'Dev',
        lastName: 'Bypass',
        phone: '+34 000000000',
        status: 'approved',
        role: 'tester',
    };

    // Cargar usuario al iniciar la app
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            setIsLoading(true);
            const token = await authService.getToken();
            const userData = await authService.getUser();

            if (token && userData) {
                setUser(userData);
            } else {
                // Bypass: carga el usuario de prueba para entrar sin credenciales
                setUser(bypassUser);
            }
        } catch (error) {
            console.error('Error cargando usuario:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
        try {
            const response = await authService.login(credentials);

            if (response.success && response.data) {
                setUser(response.data.user);
            }

            return response;
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión',
            };
        }
    };

    const register = async (data: RegisterRequest): Promise<AuthResponse> => {
        try {
            const response = await authService.register(data);
            return response;
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Error al registrar usuario',
            };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    const refreshUser = async (): Promise<void> => {
        await loadUser();
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        isApproved: user?.status === 'approved',
        isPending: user?.status === 'pending', // Nuevo estado para usuarios pendientes
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
