import React from 'react';
import { Modal, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Button, Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';
import { theme } from '../../theme';

type Props = {
    visible: boolean;
    value: Date;
    draft: Date | null;
    onChangeDraft: (date?: Date) => void;
    onConfirm: () => void;
    onClose: () => void;
};

export const DatePickerModal: React.FC<Props> = ({
    visible,
    value,
    draft,
    onChangeDraft,
    onConfirm,
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
                <Text style={styles.sectionTitle}>Selecciona la fecha</Text>
                <DateTimePicker
                    value={draft || value}
                    mode="date"
                    display="spinner"
                    onChange={(_event, selectedDate) => onChangeDraft(selectedDate)}
                    minimumDate={new Date()}
                    textColor={theme.colors.text.primary}
                />

                <Button
                    title="Seleccionar"
                    variant="secondary"
                    onPress={onConfirm}
                    style={styles.timePickerClose}
                />
            </Card>
        </View>
    </Modal>
);
