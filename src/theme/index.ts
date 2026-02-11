/**
 * Tema unificado VTC Premium
 * Sistema de diseño completo
 */

import { colors } from './colors';
import {
    fontSize,
    fontWeight,
    fontFamily,
    lineHeight,
    letterSpacing,
    textStyles,
} from './typography';
import {
    spacing,
    borderRadius,
    shadows,
    iconSizes,
    heights,
    opacity,
    animation,
    zIndex,
    screen,
} from './spacing';

export const theme = {
    colors,
    fontSize,
    fontWeight,
    fontFamily,
    lineHeight,
    letterSpacing,
    textStyles,
    spacing,
    borderRadius,
    shadows,
    iconSizes,
    heights,
    opacity,
    animation,
    zIndex,
    screen,
} as const;

export type Theme = typeof theme;

// Exportar todo
export * from './colors';
export * from './typography';
export * from './spacing';

export default theme;
