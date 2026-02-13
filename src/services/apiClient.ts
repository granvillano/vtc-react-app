import { API_CONFIG, buildUrl, API_ENDPOINTS, APIError } from './api.config';

/**
 * Cliente HTTP base para hacer peticiones a la API
 */

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number>;
    timeout?: number;
}

/**
 * Función base para hacer peticiones HTTP
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options;

    const url = buildUrl(endpoint, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                ...API_CONFIG.HEADERS,
                ...fetchOptions.headers,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.message || 'Error en la petición',
                response.status,
                errorData
            );
        }

        return await response.json();
    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error instanceof APIError) {
            throw error;
        }

        if (error?.name === 'AbortError') {
            throw new APIError('Tiempo de espera agotado');
        }

        throw new APIError('Error de red: ' + (error?.message || 'Desconocido'));
    }
}

/**
 * Cliente HTTP con métodos específicos
 */
export const apiClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        }),

    put: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    patch: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
