import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { Input, Card } from '../components/common';
import { RootStackParamList, LocationCoordinates } from '../types/navigation';

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
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [focusedField, setFocusedField] = useState<'origin' | 'destination'>('destination');

    // Mock de sugerencias (en producción vendrían de Google Places API o similar)
    const suggestions: LocationSuggestion[] = [
        {
            id: '1',
            address: 'Aeropuerto Adolfo Suárez Madrid-Barajas',
            description: 'Terminal T4, Madrid',
            coordinates: { latitude: 40.4719, longitude: -3.5626 },
        },
        {
            id: '2',
            address: 'Estación de Atocha',
            description: 'Glorieta del Emperador Carlos V, Madrid',
            coordinates: { latitude: 40.4069, longitude: -3.692 },
        },
        {
            id: '3',
            address: 'Gran Vía',
            description: 'Centro, Madrid',
            coordinates: { latitude: 40.42, longitude: -3.7066 },
        },
    ];

    const handleSuggestionPress = (suggestion: LocationSuggestion) => {
        if (focusedField === 'origin') {
            setOrigin(suggestion.address);
        } else {
            setDestination(suggestion.address);
        }

        // Si ambos campos están llenos, navegar a TripPreview
        if (origin && destination) {
            navigation.navigate('TripPreview', {
                origin: { latitude: 40.4168, longitude: -3.7038, address: origin },
                destination: suggestion.coordinates,
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
                        onChangeText={setOrigin}
                        onFocus={() => setFocusedField('origin')}
                        containerStyle={styles.input}
                    />
                </View>

                <View style={styles.inputSeparator} />

                <View style={styles.inputWithIndicator}>
                    <View style={styles.destinationIndicator} />
                    <Input
                        placeholder="Destino"
                        value={destination}
                        onChangeText={setDestination}
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
});
