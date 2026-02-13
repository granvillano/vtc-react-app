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

export const HoursPickerModal: React.FC<Props> = ({
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
                <Text style={styles.sectionTitle}>Selecciona horas</Text>
                <ScrollView
                    style={styles.timeList}
                    contentContainerStyle={styles.timeListContent}
                >
                    {options.map((hours) => (
                        <TouchableOpacity
                            key={hours}
                            style={[
                                styles.timeOption,
                                hours === selected && styles.timeOptionSelected,
                            ]}
                            onPress={() => onSelect(hours)}
                        >
                            <Text style={styles.timeOptionText}>
                                {hours} {hours === 1 ? 'hora' : 'horas'}
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
