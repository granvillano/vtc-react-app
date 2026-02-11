import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomSheet from '@gorhom/bottom-sheet';

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

    // Región inicial del mapa (Madrid como ejemplo)
    const initialRegion = {
        latitude: 40.4168,
        longitude: -3.7038,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const handleSearchPress = () => {
        navigation.navigate('SearchDestination');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Mapa no disponible en Expo Go */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.placeholderText}>Mapa no disponible en Expo Go</Text>
            </View>

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

    mapPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    placeholderText: {
        ...theme.textStyles.h4,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },

    placeholderSubtext: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
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
