import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { Button, Card } from '../components/common';
import { RootStackParamList } from '../types/navigation';

type TripPreviewRouteProp = RouteProp<RootStackParamList, 'TripPreview'>;
type TripPreviewNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type VehicleType = 'economy' | 'premium' | 'luxury';

interface VehicleOption {
    type: VehicleType;
    name: string;
    description: string;
    price: number;
    eta: number; // minutos
    capacity: number;
}

/**
 * Pantalla de resumen del viaje
 * Muestra distancia, tiempo, precio y opciones de vehículo
 */
export const TripPreviewScreen: React.FC = () => {
    const navigation = useNavigation<TripPreviewNavigationProp>();
    const route = useRoute<TripPreviewRouteProp>();
    const { origin, destination } = route.params;

    const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('premium');

    // Mock de opciones de vehículos (en producción vendrían del backend)
    const vehicleOptions: VehicleOption[] = [
        {
            type: 'economy',
            name: 'Economy',
            description: 'Opción económica',
            price: 25.5,
            eta: 5,
            capacity: 4,
        },
        {
            type: 'premium',
            name: 'Premium',
            description: 'Confort superior',
            price: 35.0,
            eta: 3,
            capacity: 4,
        },
        {
            type: 'luxury',
            name: 'Luxury',
            description: 'Máximo lujo',
            price: 55.0,
            eta: 2,
            capacity: 3,
        },
    ];

    // Mock de información del viaje
    const tripInfo = {
        distance: '12.5 km',
        duration: '18 min',
    };

    const handleConfirmTrip = () => {
        // TODO: Integrar con backend para crear el viaje
        console.log('Confirming trip with vehicle:', selectedVehicle);

        // Navegar a seguimiento del viaje
        navigation.navigate('TripTracking', { tripId: 'mock-trip-id' });
    };

    const renderVehicleOption = (option: VehicleOption) => {
        const isSelected = selectedVehicle === option.type;

        return (
            <TouchableOpacity
                key={option.type}
                onPress={() => setSelectedVehicle(option.type)}
                activeOpacity={0.7}
            >
                <Card
                    variant={isSelected ? 'outlined' : 'default'}
                    padding="md"
                    style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
                >
                    <View style={styles.vehicleInfo}>
                        <View style={styles.vehicleIcon} />
                        <View style={styles.vehicleDetails}>
                            <Text style={styles.vehicleName}>{option.name}</Text>
                            <Text style={styles.vehicleDescription}>{option.description}</Text>
                            <Text style={styles.vehicleEta}>Llega en {option.eta} min</Text>
                        </View>
                        <View style={styles.vehiclePrice}>
                            <Text style={styles.priceAmount}>{option.price.toFixed(2)}€</Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resumen del viaje</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Información del trayecto */}
                <Card
                    variant="elevated"
                    padding="lg"
                    style={styles.routeCard}
                >
                    <View style={styles.routeInfo}>
                        <View style={styles.routePoint}>
                            <View style={styles.originDot} />
                            <Text
                                style={styles.routeAddress}
                                numberOfLines={1}
                            >
                                {origin.address || 'Tu ubicación'}
                            </Text>
                        </View>

                        <View style={styles.routeLine} />

                        <View style={styles.routePoint}>
                            <View style={styles.destinationDot} />
                            <Text
                                style={styles.routeAddress}
                                numberOfLines={1}
                            >
                                {destination.address || 'Destino'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tripDetails}>
                        <View style={styles.tripDetailItem}>
                            <Text style={styles.tripDetailLabel}>Distancia</Text>
                            <Text style={styles.tripDetailValue}>{tripInfo.distance}</Text>
                        </View>
                        <View style={styles.tripDetailDivider} />
                        <View style={styles.tripDetailItem}>
                            <Text style={styles.tripDetailLabel}>Duración</Text>
                            <Text style={styles.tripDetailValue}>{tripInfo.duration}</Text>
                        </View>
                    </View>
                </Card>

                {/* Opciones de vehículo */}
                <View style={styles.vehiclesSection}>
                    <Text style={styles.sectionTitle}>Elige tu vehículo</Text>
                    <View style={styles.vehiclesList}>
                        {vehicleOptions.map(renderVehicleOption)}
                    </View>
                </View>

                {/* Información adicional */}
                <Card
                    variant="default"
                    padding="md"
                    style={styles.infoCard}
                >
                    <Text style={styles.infoText}>
                        El precio puede variar según el tráfico y las condiciones del servicio
                    </Text>
                </Card>
            </ScrollView>

            {/* Botón de confirmación */}
            <View style={styles.footer}>
                <Button
                    title="Confirmar viaje"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleConfirmTrip}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },

    backButtonText: {
        fontSize: theme.fontSize['2xl'],
        color: theme.colors.primary.gold,
    },

    headerTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
    },

    content: {
        flex: 1,
    },

    contentContainer: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing['2xl'],
    },

    routeCard: {
        marginBottom: theme.spacing.lg,
    },

    routeInfo: {
        marginBottom: theme.spacing.lg,
    },

    routePoint: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    originDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.map.userLocation,
        marginRight: theme.spacing.md,
    },

    destinationDot: {
        width: 12,
        height: 12,
        backgroundColor: theme.colors.primary.gold,
        marginRight: theme.spacing.md,
    },

    routeLine: {
        width: 2,
        height: theme.spacing.lg,
        backgroundColor: theme.colors.border.light,
        marginLeft: 5,
        marginVertical: theme.spacing.sm,
    },

    routeAddress: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        flex: 1,
    },

    tripDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
    },

    tripDetailItem: {
        alignItems: 'center',
        flex: 1,
    },

    tripDetailLabel: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginBottom: theme.spacing.xs,
    },

    tripDetailValue: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
    },

    tripDetailDivider: {
        width: 1,
        height: theme.spacing['2xl'],
        backgroundColor: theme.colors.border.light,
    },

    vehiclesSection: {
        marginBottom: theme.spacing.lg,
    },

    sectionTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },

    vehiclesList: {
        gap: theme.spacing.md,
    },

    vehicleCard: {
        marginBottom: theme.spacing.sm,
    },

    vehicleCardSelected: {
        borderColor: theme.colors.primary.gold,
        borderWidth: 2,
        ...theme.shadows.gold,
    },

    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    vehicleIcon: {
        width: theme.iconSizes.xl,
        height: theme.iconSizes.xl,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary,
        marginRight: theme.spacing.md,
    },

    vehicleDetails: {
        flex: 1,
    },

    vehicleName: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    vehicleDescription: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    },

    vehicleEta: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginTop: theme.spacing.xs,
    },

    vehiclePrice: {
        alignItems: 'flex-end',
    },

    priceAmount: {
        ...theme.textStyles.h3,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    infoCard: {
        backgroundColor: theme.colors.background.secondary,
    },

    infoText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        textAlign: 'center',
        lineHeight: theme.textStyles.caption.lineHeight * 1.5,
    },

    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        backgroundColor: theme.colors.background.card,
        ...theme.shadows.lg,
    },
});
