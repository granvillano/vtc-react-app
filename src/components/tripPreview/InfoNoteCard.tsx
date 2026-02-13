import React from 'react';
import { Text } from 'react-native';

import { Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

export const InfoNoteCard: React.FC = () => (
    <Card
        variant="default"
        padding="lg"
        style={styles.datetimeCard}
    >
        <Text style={styles.infoText}>
            El precio puede variar según el tráfico y las condiciones del servicio.
        </Text>
    </Card>
);
