import React from 'react';
import { View, Text } from 'react-native';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

export const EstimatePriceBox = ({
    total,
    formatCurrency,
}: {
    total?: number;
    formatCurrency: (amount: string | number | undefined | null) => string;
}) => (
    <View style={[styles.estimateStats, { paddingVertical: 16 }]}>
        <Text
            style={[
                styles.estimateStatLabel,
                {
                    color: '#888',
                    fontSize: 18,
                    textAlign: 'center',
                    marginBottom: 2,
                },
            ]}
        >
            Precio total
        </Text>
        <View
            style={{
                backgroundColor: 'rgba(30,30,30,0.95)',
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
            }}
        >
            <Text style={styles.estimateStatValueGold}>{formatCurrency(total)}</Text>
        </View>
    </View>
);
