import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

/**
 * Pantalla de perfil del usuario
 * Placeholder para futuro desarrollo
 */
export const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Cerrar sesión',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Perfil</Text>
                {user && (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                            {user.firstName} {user.lastName}
                        </Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.userPhone}>{user.phone}</Text>
                        <Text style={styles.userStatus}>
                            Estado: {user.status === 'approved' ? '✅ Aprobado' : '⏳ Pendiente'}
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        ...theme.textStyles.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
    },
    userName: {
        ...theme.textStyles.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    userEmail: {
        ...theme.textStyles.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    userPhone: {
        ...theme.textStyles.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
    },
    userStatus: {
        ...theme.textStyles.caption,
        color: theme.colors.primary.gold,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: theme.colors.status.error,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.md,
    },
    logoutButtonText: {
        ...theme.textStyles.button,
        color: theme.colors.text.primary,
    },
});
