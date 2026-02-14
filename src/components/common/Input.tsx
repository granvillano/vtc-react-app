import React, { forwardRef } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { theme } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

/**
 * Componente Input premium
 * Campo de texto con estados, iconos y validación visual
 */
export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            error,
            helperText,
            icon,
            rightIcon,
            containerStyle,
            style,
            editable = true,
            ...props
        },
        ref
    ) => {
        const hasError = !!error;

        const inputContainerStyles = [
            styles.inputContainer,
            hasError && styles.inputContainerError,
            !editable && styles.inputContainerDisabled,
        ];

        const inputStyles = [
            styles.input,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
            hasError && styles.inputError,
            style,
        ];

        return (
            <View style={[styles.container, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}

                <View style={inputContainerStyles}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}

                    <TextInput
                        ref={ref}
                        style={inputStyles as any}
                        editable={editable}
                        focusable={editable}
                        showSoftInputOnFocus={editable}
                        selectTextOnFocus={editable}
                        {...props}
                    />

                    {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}
                {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
            </View>
        );
    }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    label: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
        fontWeight: theme.fontWeight.medium,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        height: theme.heights.input.md,
        paddingHorizontal: theme.spacing.md,
        ...theme.shadows.sm,
    },

    inputContainerError: {
        borderColor: theme.colors.status.error,
    },

    inputContainerDisabled: {
        backgroundColor: theme.colors.background.secondary,
        opacity: theme.opacity.disabled,
    },

    input: {
        flex: 1,
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        paddingVertical: 0, // Reset padding for consistent height
    },

    inputWithIcon: {
        paddingLeft: theme.spacing.xs,
    },

    inputWithRightIcon: {
        paddingRight: theme.spacing.xs,
    },

    inputError: {
        color: theme.colors.status.error,
    },

    iconContainer: {
        marginRight: theme.spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },

    rightIconContainer: {
        marginLeft: theme.spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorText: {
        ...theme.textStyles.caption,
        color: theme.colors.status.error,
        marginTop: theme.spacing.xs,
    },

    helperText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginTop: theme.spacing.xs,
    },
});
