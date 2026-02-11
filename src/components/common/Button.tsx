import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { theme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * Componente Button premium
 * Responsive, accesible y con estados visuales claros
 */
export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    fullWidth = false,
    style,
    ...props
}) => {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ].filter(Boolean);

    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        styles[`text_${size}`],
        (disabled || loading) && styles.textDisabled,
    ].filter(Boolean);

    return (
        <TouchableOpacity
            style={buttonStyles}
            disabled={disabled || loading}
            activeOpacity={theme.opacity.pressed}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === 'primary' ? theme.colors.text.onGold : theme.colors.primary.gold
                    }
                />
            ) : (
                <>
                    {icon && icon}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
        ...theme.shadows.md,
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary.gold,
    },
    secondary: {
        backgroundColor: theme.colors.background.card,
        borderWidth: 1,
        borderColor: theme.colors.border.gold,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary.gold,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    size_sm: {
        height: theme.heights.button.sm,
        paddingHorizontal: theme.spacing.md,
    },
    size_md: {
        height: theme.heights.button.md,
        paddingHorizontal: theme.spacing.lg,
    },
    size_lg: {
        height: theme.heights.button.lg,
        paddingHorizontal: theme.spacing.xl,
    },

    // Text styles
    text: {
        ...theme.textStyles.button,
        textTransform: 'uppercase',
    },
    text_primary: {
        color: theme.colors.text.onGold,
    },
    text_secondary: {
        color: theme.colors.primary.gold,
    },
    text_outline: {
        color: theme.colors.primary.gold,
    },
    text_ghost: {
        color: theme.colors.text.primary,
    },

    text_sm: {
        fontSize: theme.fontSize.sm,
    },
    text_md: {
        fontSize: theme.fontSize.base,
    },
    text_lg: {
        fontSize: theme.fontSize.lg,
    },

    // States
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: theme.opacity.disabled,
    },
    textDisabled: {
        opacity: theme.opacity.disabled,
    },
});
