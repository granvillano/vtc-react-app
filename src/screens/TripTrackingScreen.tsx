// ...existing code...
import React from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { Card, Button } from '../components/common';
import { RootStackParamList } from '../types/navigation';

type TripTrackingRouteProp = RouteProp<RootStackParamList, 'TripTracking'>;
type TripTrackingNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Pantalla de seguimiento del viaje en tiempo real
 * Muestra la ubicación del conductor y el progreso del viaje
 */
export const TripTrackingScreen: React.FC = () => {
    const navigation = useNavigation<TripTrackingNavigationProp>();
    const route = useRoute<TripTrackingRouteProp>();
    const { tripId } = route.params;

    // Mock de datos del viaje (en producción vendrían del backend en tiempo real)
    const tripData = {
        status: 'in_progress' as const,
        driverName: 'Carlos García',
        vehicleModel: 'Mercedes-Benz Clase E',
        licensePlate: '1234 ABC',
        eta: 5, // minutos
        driverLocation: {
            latitude: 40.42,
            longitude: -3.7066,
        },
        rating: 4.9,
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Placeholder de mapa para Expo Go */}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#222',
                }}
            >
                <Text style={{ color: '#fff' }}>Mapa no disponible en Expo Go</Text>
            </View>
            {/* Aquí puedes añadir el resto de la UI (info del conductor, botones, etc.) si lo deseas */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    driverCard: {
        margin: theme.spacing.lg,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.background.secondary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        marginBottom: theme.spacing.md,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.status.success,
        marginRight: theme.spacing.sm,
    },
    statusText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.secondary,
        fontWeight: theme.fontWeight.semibold,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.background.secondary,
        marginRight: theme.spacing.md,
        borderWidth: 2,
        borderColor: theme.colors.primary.gold,
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
        marginBottom: theme.spacing.xs,
    },
    vehicleInfo: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rating: {
        ...theme.textStyles.caption,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.semibold,
    },

    etaContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary.gold,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },

    etaValue: {
        ...theme.textStyles.h3,
        color: theme.colors.text.onGold,
        fontWeight: theme.fontWeight.bold,
    },

    etaLabel: {
        ...theme.textStyles.caption,
        color: theme.colors.text.onGold,
    },

    actions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },

    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.secondary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        gap: theme.spacing.sm,
    },

    actionIcon: {
        width: theme.iconSizes.sm,
        height: theme.iconSizes.sm,
        borderRadius: theme.iconSizes.sm / 2,
        backgroundColor: theme.colors.primary.gold,
    },

    actionText: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.medium,
    },

    cancelButton: {
        marginTop: theme.spacing.sm,
    },
});

const mapDarkStyle = [
    {
        elementType: 'geometry',
        stylers: [{ color: '#1a1a1a' }],
    },
    {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#8a8a8a' }],
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#1a1a1a' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#2a2a2a' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212121' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0f0f0f' }],
    },
];
