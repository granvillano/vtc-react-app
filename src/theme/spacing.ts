import { Dimensions } from 'react-native';

/**
 * Sistema de espaciado responsive VTC Premium
 * Basado en una escala de 8px, sin valores fijos
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Escala base de 8px
const BASE_SPACING = 8;

/**
 * Escala de espaciado modular
 */
export const spacing = {
    none: 0,
    xs: BASE_SPACING * 0.5, // 4
    sm: BASE_SPACING, // 8
    md: BASE_SPACING * 2, // 16
    lg: BASE_SPACING * 3, // 24
    xl: BASE_SPACING * 4, // 32
    '2xl': BASE_SPACING * 6, // 48
    '3xl': BASE_SPACING * 8, // 64
    '4xl': BASE_SPACING * 12, // 96
} as const;

/**
 * Bordes redondeados
 */
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999, // Para círculos perfectos
} as const;

/**
 * Sombras elevadas (elevation)
 */
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    // Sombra dorada premium
    gold: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
} as const;

/**
 * Tamaños de iconos
 */
export const iconSizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
} as const;

/**
 * Alturas de componentes comunes
 */
export const heights = {
    button: {
        sm: 36,
        md: 48,
        lg: 56,
    },
    input: {
        sm: 40,
        md: 48,
        lg: 56,
    },
    header: 56,
    tabBar: 60,
    bottomSheet: {
        collapsed: SCREEN_HEIGHT * 0.2, // 20% de la pantalla
        expanded: SCREEN_HEIGHT * 0.8, // 80% de la pantalla
    },
} as const;

/**
 * Anchos máximos para contenido
 */
export const maxWidths = {
    container: SCREEN_WIDTH - spacing.lg * 2, // Full width con padding
    card: SCREEN_WIDTH - spacing.md * 2,
    input: SCREEN_WIDTH - spacing.xl * 2,
} as const;

/**
 * Opacidades
 */
export const opacity = {
    disabled: 0.4,
    overlay: 0.85,
    pressed: 0.7,
    hover: 0.9,
} as const;

/**
 * Duración de animaciones (ms)
 */
export const animation = {
    fast: 150,
    normal: 250,
    slow: 350,
    slowest: 500,
} as const;

/**
 * Z-index layers
 */
export const zIndex = {
    background: -1,
    base: 0,
    content: 1,
    dropdown: 10,
    overlay: 50,
    modal: 100,
    toast: 200,
} as const;

/**
 * Dimensiones de pantalla
 */
export const screen = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} as const;

export type Spacing = typeof spacing;
