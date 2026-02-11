// Global error logging to console (avoid Alert to keep stack trace visible in Metro)
if (typeof ErrorUtils !== 'undefined' && ErrorUtils.setGlobalHandler) {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
        const message = error?.message || String(error);
        const stack = error?.stack;
        const name = error?.name;
        console.error('GLOBAL JS ERROR MESSAGE:', message);
        console.error('GLOBAL JS ERROR NAME:', name);
        console.error('GLOBAL JS ERROR STACK:', stack);
        console.error('GLOBAL JS ERROR FULL:', { message, name, stack, isFatal, error });
    });
}

// Global unhandled promise logging to console
if (typeof global !== 'undefined') {
    const origHandler = global.onunhandledrejection;
    global.onunhandledrejection = (event) => {
        const reason = event?.reason || event;
        const message = reason?.message || String(reason);
        const stack = reason?.stack;
        console.error('UNHANDLED PROMISE REJECTION:', { message, stack, reason });
        if (origHandler) origHandler(event);
    };
}
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

/**
 * VTC Premium - Aplicación móvil de transporte VTC
 * Arquitectura profesional con React Native + Expo
 */
export default function App() {
    return (
        <AuthProvider>
            <GestureHandlerRootView style={styles.container}>
                <StatusBar style="light" />
                <RootNavigator />
            </GestureHandlerRootView>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
