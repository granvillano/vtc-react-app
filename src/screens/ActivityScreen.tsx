import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

/**
 * Pantalla de actividad (historial de viajes)
 * Placeholder para futuro desarrollo
 */
export const ActivityScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Actividad</Text>
                <Text style={styles.subtitle}>Aquí verás tu historial de viajes</Text>
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
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        ...theme.textStyles.body,
        color: theme.colors.text.tertiary,
    },
});
