import React from 'react';
import { Modal, Text, View } from 'react-native';

import { Button, Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    visible: boolean;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmReservationModal: React.FC<Props> = ({
    visible,
    message = 'Se reservará este viaje.',
    onConfirm,
    onCancel,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
    >
        <View style={styles.confirmModalOverlay}>
            <Card
                variant="default"
                padding="lg"
                style={styles.confirmModalCard}
            >
                <Text style={styles.confirmModalTitle}>Confirmar reserva</Text>
                <Text style={styles.confirmModalMessage}>{message}</Text>

                <View style={styles.confirmModalActions}>
                    <Button
                        title="Cancelar"
                        variant="secondary"
                        fullWidth
                        onPress={onCancel}
                    />
                    <Button
                        title="Reservar"
                        variant="primary"
                        fullWidth
                        onPress={onConfirm}
                    />
                </View>
            </Card>
        </View>
    </Modal>
);
