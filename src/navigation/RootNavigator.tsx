import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MainTabNavigator } from './MainTabNavigator';
import { theme } from '../theme';
import { SearchDestinationScreen, TripPreviewScreen, TripTrackingScreen } from '../screens';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View, StyleSheet, Text, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Tema personalizado para Navigation
const navigationTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: theme.colors.primary.gold,
        background: theme.colors.background.primary,
        card: theme.colors.background.secondary,
        text: theme.colors.text.primary,
        border: theme.colors.border.light,
        notification: theme.colors.status.error,
    },
};

/**
 * Navegador raíz de la aplicación
 * Stack Navigation con Tabs anidados
 */
export const RootNavigator: React.FC = () => {
    const { isAuthenticated, isApproved, isLoading, user } = useAuth();

    // Ajustar la barra de navegación de Android al color de la app (excepto iOS)
    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const styleNavBar = async () => {
            try {
                // En edge-to-edge algunas llamadas no están soportadas; evitamos warnings
                await NavigationBar.setButtonStyleAsync('light');
                await NavigationBar.setVisibilityAsync('visible');
            } catch (error) {
                console.warn('No se pudo ocultar la barra de navegación', error);
            }
        };

        styleNavBar();
    }, []);

    // Mostrar loading mientras se verifica autenticación
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary.gold}
                />
            </View>
        );
    }

    // Mostrar mensaje si el usuario está pendiente de aprobación
    if (user && !isApproved) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary.gold}
                />
                <Text style={{ color: theme.colors.text.primary, marginTop: 20 }}>
                    Tu cuenta está pendiente de aprobación. Por favor, espera a que un administrador
                    la apruebe.
                </Text>
            </View>
        );
    }

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                id="RootStack"
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: theme.colors.background.primary,
                    },
                    animation: 'slide_from_right',
                }}
            >
                {!isAuthenticated ? (
                    // Pantallas de autenticación
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ animationTypeForReplace: 'pop' }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        />
                    </>
                ) : (
                    // Pantallas de la app (usuario autenticado y aprobado)
                    <>
                        {/* Pantalla principal con tabs */}
                        <Stack.Screen
                            name="Main"
                            component={MainTabNavigator}
                        />

                        {/* Pantallas modales/stack */}
                        <Stack.Screen
                            name="SearchDestination"
                            component={SearchDestinationScreen}
                            options={{
                                animation: 'slide_from_bottom',
                                presentation: 'modal',
                            }}
                        />

                        <Stack.Screen
                            name="TripPreview"
                            component={TripPreviewScreen}
                            options={{
                                animation: 'slide_from_bottom',
                                presentation: 'modal',
                            }}
                        />

                        <Stack.Screen
                            name="TripTracking"
                            component={TripTrackingScreen}
                            options={{
                                animation: 'fade',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background.primary,
    },
});
