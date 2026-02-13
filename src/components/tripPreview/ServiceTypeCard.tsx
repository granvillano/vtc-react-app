import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';
import { ServiceType } from '../../services/tripService';

type Option = { value: ServiceType; label: string };

type Props = {
    serviceType: ServiceType;
    options: Option[];
    onChange: (value: ServiceType) => void;
};

export const ServiceTypeCard: React.FC<Props> = ({ serviceType, options, onChange }) => (
    <Card
        variant="default"
        padding="lg"
        style={styles.serviceCard}
    >
        <Text style={styles.sectionTitle}>Tipo de servicio</Text>
        <View style={styles.serviceTypeChips}>
            {options.map((option) => {
                const selected = option.value === serviceType;
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[styles.serviceChip, selected && styles.serviceChipSelected]}
                        onPress={() => onChange(option.value)}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.serviceChipText,
                                selected && styles.serviceChipTextSelected,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </Card>
);
