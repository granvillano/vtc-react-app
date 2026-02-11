/**
 * Paleta de colores VTC Premium
 * Inspirada en elegancia, lujo y profesionalismo
 * Esquema: Negro/Dorado con acentos premium
 */

export const colors = {
    // Colores primarios
    primary: {
        black: '#0A0A0A', // Negro profundo principal
        darkGray: '#1A1A1A', // Gris oscuro para fondos secundarios
        charcoal: '#2A2A2A', // Carbón para tarjetas
        gold: '#D4AF37', // Dorado corporativo
        lightGold: '#E8C56A', // Dorado claro para hover/active
        darkGold: '#B8941F', // Dorado oscuro para sombras
    },

    // Colores de acento
    accent: {
        platinum: '#E5E5E5', // Platino para textos importantes
        silver: '#C0C0C0', // Plata para textos secundarios
        bronze: '#CD7F32', // Bronce para estados alternativos
    },

    // Textos
    text: {
        primary: '#FFFFFF', // Blanco puro para títulos
        secondary: '#E5E5E5', // Platino para textos normales
        tertiary: '#A0A0A0', // Gris claro para textos secundarios
        disabled: '#666666', // Gris para deshabilitados
        onGold: '#0A0A0A', // Negro sobre dorado
    },

    // Fondos
    background: {
        primary: '#0A0A0A', // Negro principal
        secondary: '#1A1A1A', // Gris oscuro
        card: '#2A2A2A', // Carbón para tarjetas
        overlay: 'rgba(10, 10, 10, 0.95)', // Overlay oscuro
        modalOverlay: 'rgba(0, 0, 0, 0.85)', // Overlay para modales
    },

    // Bordes
    border: {
        light: '#3A3A3A', // Borde sutil
        medium: '#4A4A4A', // Borde medio
        dark: '#2A2A2A', // Borde oscuro
        gold: '#D4AF37', // Borde dorado para énfasis
    },

    // Estados
    status: {
        success: '#2ECC71', // Verde éxito
        error: '#E74C3C', // Rojo error
        warning: '#F39C12', // Naranja advertencia
        info: '#3498DB', // Azul información
    },

    // Mapas
    map: {
        marker: '#D4AF37', // Dorado para marcadores
        route: '#E8C56A', // Dorado claro para rutas
        userLocation: '#3498DB', // Azul para ubicación usuario
    },

    // Sombras y profundidad
    shadow: {
        light: 'rgba(212, 175, 55, 0.1)', // Sombra dorada sutil
        medium: 'rgba(212, 175, 55, 0.2)', // Sombra dorada media
        heavy: 'rgba(0, 0, 0, 0.5)', // Sombra negra fuerte
    },
} as const;

export type ColorTheme = typeof colors;
