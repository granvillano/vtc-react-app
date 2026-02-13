import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { Input, Card } from '../components/common';
import { RootStackParamList, LocationCoordinates } from '../types/navigation';
import { MapboxFeature, searchPlaces } from '../services';
const BASE_ORIGIN_LABEL = 'Base central VTC Premium Navarra';

type SearchDestinationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LocationSuggestion {
    id: string;
    address: string;
    description: string;
    coordinates: LocationCoordinates;
}

/**
 * Pantalla de búsqueda de origen y destino
 * Con autocompletado y sugerencias
 */
export const SearchDestinationScreen: React.FC = () => {
    const navigation = useNavigation<SearchDestinationNavigationProp>();
    const [origin, setOrigin] = useState(BASE_ORIGIN_LABEL);
    const [destination, setDestination] = useState('');
    const [focusedField, setFocusedField] = useState<'origin' | 'destination'>('destination');
    const [originCoords] = useState<LocationCoordinates | null>({ latitude: 0, longitude: 0 });
    const [destinationCoords, setDestinationCoords] = useState<LocationCoordinates | null>(null);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const mapFeatureToSuggestion = (feature: MapboxFeature, idx: number): LocationSuggestion => ({
        id: feature.id || `${feature.place_name}-${idx}`,
        address: feature.text || feature.place_name,
        description: feature.place_name,
        coordinates: {
            latitude: feature.center[1],
            longitude: feature.center[0],
        },
    });

    const currentQuery = focusedField === 'origin' ? origin : destination;

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!currentQuery || currentQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const results = await searchPlaces(currentQuery);
                const mapped = results.map(mapFeatureToSuggestion);
                setSuggestions(mapped);
            } catch (error) {
                console.error('❌ Error cargando sugerencias', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [currentQuery, focusedField]);

    const handleSuggestionPress = (suggestion: LocationSuggestion) => {
        if (focusedField === 'destination') {
            setDestination(suggestion.address);
            setDestinationCoords(suggestion.coordinates);
        }

        const nextOrigin = origin;
        const nextOriginCoords = originCoords;
        const nextDestination = focusedField === 'destination' ? suggestion.address : destination;
        const nextDestinationCoords =
            focusedField === 'destination' ? suggestion.coordinates : destinationCoords;

        if (nextOrigin && nextDestination && nextOriginCoords && nextDestinationCoords) {
            navigation.navigate('TripPreview', {
                origin: { ...nextOriginCoords, address: nextOrigin },
                destination: { ...nextDestinationCoords, address: nextDestination },
            });
        }
    };

    const renderSuggestion = ({ item }: { item: LocationSuggestion }) => (
        <TouchableOpacity
            onPress={() => handleSuggestionPress(item)}
            activeOpacity={0.7}
        >
            <Card
                variant="default"
                padding="md"
                style={styles.suggestionCard}
            >
                <View style={styles.suggestionIcon} />
                <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionAddress}>{item.address}</Text>
                    <Text style={styles.suggestionDescription}>{item.description}</Text>
                </View>
            </Card>
        </TouchableOpacity>
    );

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
                <Text style={styles.headerTitle}>Planificar viaje</Text>
            </View>

            {/* Inputs de origen y destino */}
            <View style={styles.inputsContainer}>
                <View style={styles.inputWithIndicator}>
                    <View style={styles.originIndicator} />
                    <Input
                        placeholder="Origen"
                        value={origin}
                        editable={false}
                        containerStyle={styles.input}
                    />
                </View>

                <View style={styles.inputSeparator} />

                <View style={styles.inputWithIndicator}>
                    <View style={styles.destinationIndicator} />
                    <Input
                        placeholder="Destino"
                        value={destination}
                        onChangeText={(text) => {
                            setDestination(text);
                            setDestinationCoords(null);
                        }}
                        onFocus={() => setFocusedField('destination')}
                        containerStyle={styles.input}
                        autoFocus
                    />
                </View>
            </View>

            {/* Lista de sugerencias */}
            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Sugerencias</Text>
                <FlatList
                    data={suggestions}
                    renderItem={renderSuggestion}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.suggestionsList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        loading ? (
                            <Text style={styles.emptyText}>Buscando...</Text>
                        ) : currentQuery.length >= 3 ? (
                            <Text style={styles.emptyText}>Sin resultados</Text>
                        ) : (
                            <Text style={styles.emptyText}>Escribe al menos 3 caracteres</Text>
                        )
                    }
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

    inputsContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
    },

    inputWithIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        flex: 1,
    },

    originIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.map.userLocation,
        marginRight: theme.spacing.md,
    },

    destinationIndicator: {
        width: 12,
        height: 12,
        backgroundColor: theme.colors.primary.gold,
        marginRight: theme.spacing.md,
    },

    inputSeparator: {
        width: 2,
        height: theme.spacing.md,
        backgroundColor: theme.colors.border.light,
        marginLeft: 5,
        marginVertical: theme.spacing.xs,
    },

    myLocationButton: {
        alignSelf: 'flex-start',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    myLocationText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    suggestionsContainer: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
    },

    suggestionsTitle: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.tertiary,
        fontWeight: theme.fontWeight.semibold,
        marginBottom: theme.spacing.md,
        textTransform: 'uppercase',
        letterSpacing: theme.letterSpacing.wide,
    },

    suggestionsList: {
        gap: theme.spacing.sm,
    },

    suggestionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },

    suggestionIcon: {
        width: theme.iconSizes.md,
        height: theme.iconSizes.md,
        borderRadius: theme.iconSizes.md / 2,
        backgroundColor: theme.colors.background.secondary,
        marginRight: theme.spacing.md,
    },

    suggestionContent: {
        flex: 1,
    },

    suggestionAddress: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },

    suggestionDescription: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
    },

    emptyText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        textAlign: 'center',
        paddingVertical: theme.spacing.md,
    },
});
