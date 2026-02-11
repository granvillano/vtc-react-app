/**
 * Servicio de Autenticación
 * Gestiona login, registro, logout y refresh de tokens JWT
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS } from './api.config';

const TOKEN_KEY = '@vtc_auth_token';
const USER_KEY = '@vtc_user_data';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
    role: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data?: {
        token: string;
        user: User;
    };
    message?: string;
    error?: string;
}

class AuthService {
    /**
     * Registrar nuevo usuario
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(data),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Error al registrar usuario',
                };
            }

            return result;
        } catch (error: any) {
            console.error('Error en register:', error);
            return {
                success: false,
                error: error.message || 'Error de conexión',
            };
        }
    }

    /**
     * Login de usuario
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(credentials),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Error al iniciar sesión',
                };
            }

            // Guardar token y usuario en AsyncStorage
            if (result.success && result.data) {
                await this.saveAuthData(result.data.token, result.data.user);
            }

            return result;
        } catch (error: any) {
            console.error('Error en login:', error);
            return {
                success: false,
                error: error.message || 'Error de conexión',
            };
        }
    }

    /**
     * Logout
     */
    async logout(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        } catch (error) {
            console.error('Error en logout:', error);
        }
    }

    /**
     * Obtener token almacenado
     */
    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error obteniendo token:', error);
            return null;
        }
    }

    /**
     * Obtener datos del usuario almacenados
     */
    async getUser(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            return null;
        }
    }

    /**
     * Verificar si el usuario está autenticado
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        const user = await this.getUser();
        return !!(token && user);
    }

    /**
     * Verificar si el usuario está aprobado
     */
    async isApproved(): Promise<boolean> {
        const user = await this.getUser();
        return user?.status === 'approved';
    }

    /**
     * Guardar datos de autenticación
     */
    private async saveAuthData(token: string, user: User): Promise<void> {
        try {
            await AsyncStorage.multiSet([
                [TOKEN_KEY, token],
                [USER_KEY, JSON.stringify(user)],
            ]);
        } catch (error) {
            console.error('Error guardando datos de auth:', error);
            throw error;
        }
    }

    /**
     * Obtener headers con autenticación
     */
    async getAuthHeaders(): Promise<HeadersInit> {
        const token = await this.getToken();
        return {
            ...API_CONFIG.HEADERS,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

    /**
     * Refrescar token (si el backend lo soporta)
     */
    async refreshToken(): Promise<boolean> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const currentToken = await AsyncStorage.getItem(TOKEN_KEY);
            if (!currentToken) return false;

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
                {
                    method: 'POST',
                    headers: {
                        ...API_CONFIG.HEADERS,
                        Authorization: `Bearer ${currentToken}`,
                    },
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) return false;

            const result = await response.json();
            if (result.success && result.data?.token) {
                await AsyncStorage.setItem(TOKEN_KEY, result.data.token);
                return true;
            }

            return false;
        } catch (error: any) {
            console.error('Error en refreshToken:', error);
            return false;
        }
    }
}

export default new AuthService();
