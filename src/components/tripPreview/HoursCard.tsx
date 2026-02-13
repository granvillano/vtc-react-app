import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Card, Input } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    hoursNeeded: number;
    onOpenHoursPicker: () => void;
};

export const HoursCard: React.FC<Props> = ({ hoursNeeded, onOpenHoursPicker }) => (
    <Card
        variant="default"
        padding="lg"
        style={styles.hoursCard}
    >
        <Text style={styles.sectionTitle}>Duración del servicio</Text>
        <TouchableOpacity
            onPress={onOpenHoursPicker}
            activeOpacity={0.7}
        >
            <Input
                value={`${hoursNeeded} ${hoursNeeded === 1 ? 'hora' : 'horas'}`}
                editable={false}
                pointerEvents="none"
                placeholder="Selecciona horas"
            />
        </TouchableOpacity>
        <Text style={styles.helperText}>
            Indica cuántas horas necesitas el vehículo para calcular la tarifa.
        </Text>
    </Card>
);
