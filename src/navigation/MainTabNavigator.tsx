import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { theme } from '../theme';
import { HomeMapScreen, ActivityScreen, ProfileScreen } from '../screens';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Navegación por tabs
 * Home, Activity, Profile
 */
export const MainTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            id="MainTabs"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.background.card,
                    borderTopColor: theme.colors.border.light,
                    borderTopWidth: 1,
                    height: theme.heights.tabBar,
                    paddingBottom: 8,
                    paddingTop: 8,
                    ...theme.shadows.lg,
                },
                tabBarActiveTintColor: theme.colors.primary.gold,
                tabBarInactiveTintColor: theme.colors.text.tertiary,
                tabBarLabelStyle: {
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: theme.letterSpacing.wide,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeMapScreen}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        // Aquí puedes usar react-native-vector-icons o expo-vector-icons
                        // Por ahora usamos texto simple
                        <></>
                    ),
                }}
            />
            <Tab.Screen
                name="Activity"
                component={ActivityScreen}
                options={{
                    tabBarLabel: 'Actividad',
                    tabBarIcon: ({ color, size }) => <></>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => <></>,
                }}
            />
        </Tab.Navigator>
    );
};
