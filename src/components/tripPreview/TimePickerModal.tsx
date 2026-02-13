import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Button, Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    visible: boolean;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    onClose: () => void;
};

export const TimePickerModal: React.FC<Props> = ({
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
                <Text style={styles.sectionTitle}>Selecciona la hora</Text>
                <ScrollView
                    style={styles.timeList}
                    contentContainerStyle={styles.timeListContent}
                >
                    {options.map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeOption,
                                time === selected && styles.timeOptionSelected,
                            ]}
                            onPress={() => onSelect(time)}
                        >
                            <Text style={styles.timeOptionText}>{time}</Text>
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
