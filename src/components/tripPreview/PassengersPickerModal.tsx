import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Button, Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    visible: boolean;
    options: number[];
    selected: number;
    onSelect: (value: number) => void;
    onClose: () => void;
};

export const PassengersPickerModal: React.FC<Props> = ({
    visible,
    options,
    selected,
    onSelect,
    onClose,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.timePickerOverlay}>
            <Card
                variant="default"
                padding="lg"
                style={styles.timePickerModal}
            >
                <Text style={styles.sectionTitle}>Selecciona pasajeros</Text>
                <ScrollView
                    style={styles.timeList}
                    contentContainerStyle={styles.timeListContent}
                >
                    {options.map((value) => (
                        <TouchableOpacity
                            key={value}
                            style={[
                                styles.timeOption,
                                value === selected && styles.timeOptionSelected,
                            ]}
                            onPress={() => onSelect(value)}
                        >
                            <Text style={styles.timeOptionText}>
                                {value} {value === 1 ? 'pasajero' : 'pasajeros'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Button
                    title="Cerrar"
                    variant="secondary"
                    onPress={onClose}
                    style={styles.timePickerClose}
                />
            </Card>
        </View>
    </Modal>
);
