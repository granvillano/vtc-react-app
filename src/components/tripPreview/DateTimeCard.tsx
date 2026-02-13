import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Card, Input } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    pickupDate: string;
    pickupTime: string;
    canEstimate: boolean;
    onOpenDatePicker: () => void;
    onOpenTimePicker: () => void;
};

export const DateTimeCard: React.FC<Props> = ({
    pickupDate,
    pickupTime,
    canEstimate,
    onOpenDatePicker,
    onOpenTimePicker,
}) => (
    <Card
        variant="default"
        padding="lg"
        style={styles.datetimeCard}
    >
        <Text style={styles.sectionTitle}>Fecha y hora del viaje</Text>
        <View style={styles.datetimeRow}>
            <View style={styles.datetimeField}>
                <Text style={styles.datetimeLabel}>Fecha</Text>
                <TouchableOpacity
                    onPress={onOpenDatePicker}
                    activeOpacity={0.7}
                >
                    <Input
                        value={pickupDate}
                        editable={false}
                        pointerEvents="none"
                        placeholder="YYYY-MM-DD"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.datetimeSpacer} />
            <View style={styles.datetimeField}>
                <Text style={styles.datetimeLabel}>Hora</Text>
                <TouchableOpacity
                    onPress={onOpenTimePicker}
                    activeOpacity={0.7}
                >
                    <Input
                        value={pickupTime}
                        editable={false}
                        pointerEvents="none"
                        placeholder="HH:MM"
                    />
                </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.helperText}>Se recalcula precio y ruta al cambiar fecha u hora.</Text>
        {!canEstimate && <Text style={styles.helperText}>Selecciona la fecha para calcular.</Text>}
    </Card>
);
