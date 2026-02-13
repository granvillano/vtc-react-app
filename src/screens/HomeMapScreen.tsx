import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';

import { theme } from '../theme';
import { Card } from '../components/common';
import { RootStackParamList } from '../types/navigation';

type HomeMapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Pantalla principal con mapa a pantalla completa
 * Bottom sheet con búsqueda de destino
 */
export const HomeMapScreen: React.FC = () => {
    const navigation = useNavigation<HomeMapScreenNavigationProp>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView>(null);
    const initialRegion = {
        latitude: 40.4168,
        longitude: -3.7038,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const [userRegion, setUserRegion] = useState(initialRegion);
    const [hasLocation, setHasLocation] = useState(false);
    const [locationLabel, setLocationLabel] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso de ubicación',
                        'Activa el permiso para centrarte en el mapa.'
                    );
                    return;
                }

                const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                setUserRegion(region);
                setHasLocation(true);

                try {
                    const [address] = await Location.reverseGeocodeAsync({
                        latitude: region.latitude,
                        longitude: region.longitude,
                    });

                    const labelParts = [
                        address?.street || address?.name,
                        address?.city || address?.district || address?.subregion,
                        address?.country,
                    ].filter(Boolean);

                    setLocationLabel(labelParts.join(', ') || 'Ubicación detectada');
                } catch (geoError) {
                    setLocationLabel('Ubicación detectada');
                }

                mapRef.current?.animateToRegion(region, 600);
            } catch (error) {
                console.error('Error obteniendo ubicación', error);
            }
        })();
    }, []);

    const handleSearchPress = () => {
        navigation.navigate('SearchDestination');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                region={hasLocation ? userRegion : undefined}
                showsUserLocation
                showsMyLocationButton={false}
                toolbarEnabled={false}
                onPress={() => {
                    if (hasLocation) {
                        mapRef.current?.animateToRegion(userRegion, 500);
                    }
                }}
            >
                {hasLocation && (
                    <Marker
                        coordinate={userRegion}
                        title="Tu ubicación"
                        description={
                            locationLabel ||
                            `${userRegion.latitude.toFixed(4)}, ${userRegion.longitude.toFixed(4)}`
                        }
                        pinColor={theme.colors.primary.gold}
                    />
                )}
                {!hasLocation && (
                    <Marker
                        coordinate={{
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude,
                        }}
                        title="Madrid"
                    />
                )}
            </MapView>

            <TouchableOpacity
                style={styles.locationButton}
                onPress={() => {
                    if (hasLocation) {
                        mapRef.current?.animateToRegion(userRegion, 500);
                    }
                }}
                activeOpacity={0.8}
            >
                <Text style={styles.locationButtonText}>Mi ubicación</Text>
            </TouchableOpacity>

            {hasLocation && (
                <View style={styles.locationBadge}>
                    <Text style={styles.locationBadgeText}>
                        {locationLabel || 'Ubicación detectada'}
                    </Text>
                    <Text style={styles.locationBadgeSubtext}>
                        {userRegion.latitude.toFixed(4)}, {userRegion.longitude.toFixed(4)}
                    </Text>
                </View>
            )}

            {/* Header con logo/marca */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.logo}>VTC Premium</Text>
                </View>
            </SafeAreaView>

            {/* Bottom Sheet colapsado con búsqueda */}
            <View style={styles.bottomSheetContainer}>
                <Card
                    variant="elevated"
                    padding="lg"
                    style={styles.searchCard}
                >
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearchPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.searchIconContainer}>
                            <View style={styles.searchIcon} />
                        </View>
                        <Text style={styles.searchText}>¿A dónde vamos?</Text>
                    </TouchableOpacity>

                    {/* Accesos rápidos */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={styles.quickActionIcon} />
                            <Text style={styles.quickActionText}>Casa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={styles.quickActionIcon} />
                            <Text style={styles.quickActionText}>Trabajo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={styles.quickActionIcon} />
                            <Text style={styles.quickActionText}>Aeropuerto</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
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

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.content,
    },

    headerContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },

    logo: {
        ...theme.textStyles.h3,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
        textShadowColor: theme.colors.shadow.heavy,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    bottomSheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },

    searchCard: {
        width: '100%',
    },

    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border.gold,
    },

    searchIconContainer: {
        width: theme.iconSizes.md,
        height: theme.iconSizes.md,
        marginRight: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchIcon: {
        width: theme.iconSizes.sm,
        height: theme.iconSizes.sm,
        borderRadius: theme.iconSizes.sm / 2,
        backgroundColor: theme.colors.primary.gold,
    },

    searchText: {
        ...theme.textStyles.body,
        color: theme.colors.text.tertiary,
    },

    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: theme.spacing.lg,
        gap: theme.spacing.sm,
    },

    quickAction: {
        flex: 1,
        alignItems: 'center',
        padding: theme.spacing.sm,
    },

    quickActionIcon: {
        width: theme.iconSizes.lg,
        height: theme.iconSizes.lg,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary,
        marginBottom: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    quickActionText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.secondary,
    },

    locationButton: {
        position: 'absolute',
        bottom: theme.spacing['2xl'],
        right: theme.spacing.lg,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    locationButtonText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    locationBadge: {
        position: 'absolute',
        top: theme.spacing.xl,
        right: theme.spacing.lg,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    locationBadgeText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.primary,
    },

    locationBadgeSubtext: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
    },
});

// Estilo oscuro personalizado para el mapa
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
