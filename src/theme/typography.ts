import { Platform } from 'react-native';

/**
 * Sistema tipográfico VTC Premium
 * Responsive, escalable y profesional
 */

// Escala base (usamos % del viewport para responsividad)
const baseScale = {
    xs: 0.75, // 75% del base
    sm: 0.875, // 87.5% del base
    base: 1, // 100%
    lg: 1.125, // 112.5% del base
    xl: 1.25, // 125% del base
    '2xl': 1.5, // 150% del base
    '3xl': 1.875, // 187.5% del base
    '4xl': 2.25, // 225% del base
};

// Tamaño base responsive
const getBaseFontSize = () => {
    // En dispositivos más pequeños, reducimos ligeramente
    return Platform.select({
        ios: 16,
        android: 16,
        default: 16,
    });
};

const baseFontSize = getBaseFontSize();

/**
 * Función helper para calcular tamaños responsive
 */
export const scaleFontSize = (scale: number): number => {
    return baseFontSize * scale;
};

/**
 * Tamaños de fuente escalables
 */
export const fontSize = {
    xs: scaleFontSize(baseScale.xs), // ~12px
    sm: scaleFontSize(baseScale.sm), // ~14px
    base: scaleFontSize(baseScale.base), // 16px
    lg: scaleFontSize(baseScale.lg), // ~18px
    xl: scaleFontSize(baseScale.xl), // ~20px
    '2xl': scaleFontSize(baseScale['2xl']), // ~24px
    '3xl': scaleFontSize(baseScale['3xl']), // ~30px
    '4xl': scaleFontSize(baseScale['4xl']), // ~36px
} as const;

/**
 * Pesos de fuente
 */
export const fontWeight = {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

/**
 * Familias de fuente
 */
export const fontFamily = Platform.select({
    ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },
    android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
    },
    default: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },
});

/**
 * Line heights (altura de línea)
 */
export const lineHeight = {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
} as const;

/**
 * Letter spacing
 */
export const letterSpacing = {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
} as const;

/**
 * Estilos de texto predefinidos para uso común
 */
export const textStyles = {
    h1: {
        fontSize: fontSize['4xl'],
        fontWeight: fontWeight.bold,
        lineHeight: fontSize['4xl'] * lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    h2: {
        fontSize: fontSize['3xl'],
        fontWeight: fontWeight.bold,
        lineHeight: fontSize['3xl'] * lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    h3: {
        fontSize: fontSize['2xl'],
        fontWeight: fontWeight.semibold,
        lineHeight: fontSize['2xl'] * lineHeight.snug,
        letterSpacing: letterSpacing.normal,
    },
    h4: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.semibold,
        lineHeight: fontSize.xl * lineHeight.snug,
        letterSpacing: letterSpacing.normal,
    },
    body: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.base * lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    },
    bodyLarge: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.lg * lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    },
    bodySmall: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.sm * lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    },
    caption: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.regular,
        lineHeight: fontSize.xs * lineHeight.normal,
        letterSpacing: letterSpacing.wide,
    },
    button: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
        lineHeight: fontSize.base * lineHeight.tight,
        letterSpacing: letterSpacing.wider,
    },
    buttonLarge: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        lineHeight: fontSize.lg * lineHeight.tight,
        letterSpacing: letterSpacing.wider,
    },
} as const;

export type Typography = typeof textStyles;
