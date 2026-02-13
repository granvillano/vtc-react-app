import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { ServiceType } from '../../services/tripService';
import { Card, Button } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    total?: number;
    baseTariff?: string;
    horario?: string;
    distanceAppliedKm?: number;
    tripInfo: { distance: string; duration: string };
    passengerCount: number;
    serviceType: ServiceType;
    hoursNeeded: number;
    formatCurrency: (amount: string | number | undefined | null) => string;
    pickupDate?: string;
    pickupTime?: string;
    destinationLabel?: string;
};

const serviceTypeLabel: Record<ServiceType, string> = {
    one_way: 'Solo ida',
    round_trip: 'Ida y vuelta',
    hourly: 'Por horas',
    daily: 'Por días',
};

export const EstimateModal: React.FC<Props> = ({
    visible,
    onClose,
    total,
    baseTariff,
    horario,
    distanceAppliedKm,
    tripInfo,
    passengerCount,
    serviceType,
    hoursNeeded,
    formatCurrency,
    onConfirm,
    pickupDate,
    pickupTime,
    destinationLabel,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.estimateModalOverlay}>
            <Card
                variant="default"
                padding="lg"
                style={styles.estimateModalCard}
            >
                <View style={styles.estimateModalHeader}>
                    <Text style={styles.estimateModalTitle}>Confirmación viaje</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.estimateModalClose}
                        accessibilityLabel="Cerrar"
                    >
                        <Text style={styles.estimateModalCloseText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.estimateStats}>
                    <View style={styles.estimateStatRow}>
                        <Text style={styles.estimateStatLabel}>Total estimado</Text>
                        <Text style={styles.estimateStatValueGold}>{formatCurrency(total)}</Text>
                    </View>
                    <View style={styles.estimateStatRow}>
                        <Text style={styles.estimateStatLabel}>Distancia</Text>
                        <Text style={styles.estimateStatValue}>{tripInfo.distance}</Text>
                    </View>
                    <View style={styles.estimateStatRow}>
                        <Text style={styles.estimateStatLabel}>Duración</Text>
                        <Text style={styles.estimateStatValue}>{tripInfo.duration}</Text>
                    </View>
                    {pickupDate ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Fecha</Text>
                            <Text style={styles.estimateStatValue}>{pickupDate}</Text>
                        </View>
                    ) : null}
                    {pickupTime ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Hora de salida</Text>
                            <Text style={styles.estimateStatValue}>{`${pickupTime} H`}</Text>
                        </View>
                    ) : null}
                    {destinationLabel ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Destino</Text>
                            <Text style={styles.estimateStatValueLong}>{destinationLabel}</Text>
                        </View>
                    ) : null}
                    <View style={styles.estimateStatRow}>
                        <Text style={styles.estimateStatLabel}>Pasajeros</Text>
                        <Text style={styles.estimateStatValue}>{passengerCount}</Text>
                    </View>
                    <View style={styles.estimateStatRow}>
                        <Text style={styles.estimateStatLabel}>Servicio</Text>
                        <Text style={styles.estimateStatValue}>
                            {serviceTypeLabel[serviceType]}
                        </Text>
                    </View>
                    {serviceType === 'hourly' ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Horas</Text>
                            <Text style={styles.estimateStatValue}>{hoursNeeded}</Text>
                        </View>
                    ) : null}
                    {baseTariff ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Tarifa</Text>
                            <Text style={styles.estimateStatValueLong}>{baseTariff}</Text>
                        </View>
                    ) : null}
                    {horario ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Horario</Text>
                            <Text style={styles.estimateStatValueLong}>{horario}</Text>
                        </View>
                    ) : null}
                    {distanceAppliedKm ? (
                        <View style={styles.estimateStatRow}>
                            <Text style={styles.estimateStatLabel}>Km aplicados</Text>
                            <Text style={styles.estimateStatValue}>
                                {distanceAppliedKm.toFixed(2)} km
                            </Text>
                        </View>
                    ) : null}
                </View>

                <Button
                    title="Reservar"
                    variant="primary"
                    onPress={onConfirm}
                    style={styles.estimateModalButton}
                />
                <Button
                    title="Cerrar"
                    variant="secondary"
                    onPress={onClose}
                />
            </Card>
        </View>
    </Modal>
);
