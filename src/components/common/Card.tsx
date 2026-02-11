import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { theme } from '../../theme';

export type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends ViewProps {
    variant?: CardVariant;
    children: React.ReactNode;
    padding?: keyof typeof theme.spacing;
}

/**
 * Componente Card premium
 * Tarjeta con sombras suaves, bordes redondeados y variantes
 */
export const Card: React.FC<CardProps> = ({
    variant = 'default',
    children,
    padding = 'md',
    style,
    ...props
}) => {
    const cardStyles = [
        styles.base,
        styles[variant],
        { padding: theme.spacing[padding] },
        style,
    ].filter(Boolean);

    return (
        <View
            style={cardStyles}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.xl,
    },

    default: {
        ...theme.shadows.sm,
    },

    elevated: {
        ...theme.shadows.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border.gold,
        ...theme.shadows.none,
    },
});
