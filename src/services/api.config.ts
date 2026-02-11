/**
 * Configuración de la API
 * Puntos de integración con backend WordPress
 */

// IMPORTANTE: Configuración del servidor WordPress VTC Premium Navarra
export const API_CONFIG = {
    // ✅ WordPress en producción
    BASE_URL: 'https://vtcpremiumnavarra.com/wp-json/vtc/v1',

    // Base de datos (NO usar desde la app, solo referencia):
    // DB: dbs14070314
    // Prefijo tablas: vtc_
    // IVA: 10%

    TIMEOUT: 30000, // 30 segundos (Mapbox puede tardar)
    HEADERS: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

/**
 * Endpoints disponibles
 */
export const API_ENDPOINTS = {
    // Autenticación
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
    },

    // Usuarios
    USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/update',
        LOCATIONS: '/user/locations', // Ubicaciones guardadas (casa, trabajo)
    },

    // Viajes
    TRIPS: {
        CREATE: '/trips/create',
        GET: '/trips/:id',
        LIST: '/trips/my-trips',
        CANCEL: '/trips/:id/cancel',
        // RATE eliminado - campos rating/rating_comment no existen en BD
        ESTIMATE: '/trips/estimate', // Estimación de precio (datos de ejemplo por ahora)
    },

    // Conductores
    DRIVERS: {
        AVAILABLE: '/drivers/available',
        LOCATION: '/drivers/:id/location',
        INFO: '/drivers/:id',
    },

    // Geocoding
    GEOCODING: {
        SEARCH: '/geocoding/search',
        REVERSE: '/geocoding/reverse',
        AUTOCOMPLETE: '/geocoding/autocomplete',
    },

    // Pagos
    PAYMENTS: {
        METHODS: '/payments/methods',
        ADD_METHOD: '/payments/add',
        CHARGE: '/payments/charge',
    },
} as const;

/**
 * Helper para construir URLs completas
 */
export const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // Reemplazar parámetros en la URL (:id, etc.)
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, value);
        });
    }

    return url;
};

/**
 * Helper para manejar errores de API
 */
export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}
