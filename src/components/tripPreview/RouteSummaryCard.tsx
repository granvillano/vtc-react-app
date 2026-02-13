import React from 'react';
import { View, Text } from 'react-native';

import { Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    originLabel: string;
    destinationLabel: string;
    distance: string;
    duration: string;
    loading: boolean;
    error: string | null;
};

export const RouteSummaryCard: React.FC<Props> = ({
    originLabel,
    destinationLabel,
    distance,
    duration,
    loading,
    error,
}) => (
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
                    {originLabel}
                </Text>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
                <View style={styles.destinationDot} />
                <Text
                    style={styles.routeAddress}
                    numberOfLines={1}
                >
                    {destinationLabel}
                </Text>
            </View>
        </View>

        <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Distancia</Text>
                <Text style={styles.tripDetailValue}>{distance}</Text>
            </View>
            <View style={styles.tripDetailDivider} />
            <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Duración</Text>
                <Text style={styles.tripDetailValue}>{duration}</Text>
            </View>
        </View>

        {loading && <Text style={styles.helperText}>Calculando ruta y precio...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
    </Card>
);
