import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Card, Input } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    passengerCount: number;
    onOpenPassengersPicker: () => void;
};

export const PassengerCard: React.FC<Props> = ({ passengerCount, onOpenPassengersPicker }) => (
    <Card
        variant="default"
        padding="lg"
        style={styles.passengerCard}
    >
        <Text style={styles.sectionTitle}>Pasajeros</Text>
        <TouchableOpacity
            onPress={onOpenPassengersPicker}
            activeOpacity={0.7}
        >
            <Input
                value={`${passengerCount} ${passengerCount === 1 ? 'pasajero' : 'pasajeros'}`}
                editable={false}
                pointerEvents="none"
                placeholder="Selecciona pasajeros"
            />
        </TouchableOpacity>
        <Text style={styles.helperText}>Máximo 4 pasajeros.</Text>
    </Card>
);
