import React from 'react';
import { Modal, Text, TouchableOpacity, View, ScrollView } from 'react-native';

import { ServiceType } from '../../services/tripService';
import { Card, Button } from '../common';
import { EstimatePriceBox } from './EstimatePriceBox';
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
    destinationLabel?: string;
    passengerCount?: number;
    serviceType?: ServiceType;
    hoursNeeded?: string | number;
    pickupDate?: string;
    pickupTime?: string;
    formatCurrency?: (amount: string | number | undefined | null) => string;
};

export const EstimateModal: React.FC<Props> = ({
    visible,
    onClose,
    onConfirm,
    total,
    baseTariff,
    horario,
    distanceAppliedKm,
    tripInfo,
    destinationLabel,
    passengerCount = 1,
    serviceType = '' as ServiceType,
    hoursNeeded = '',
    pickupDate = '',
    pickupTime = '',
    formatCurrency = (n) => (n ? n.toString() : ''),
}) => {
    const serviceTypeLabel: Record<string, string> = {};

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.estimateModalOverlay}>
                <View style={styles.estimateModalCard}>
                    <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 8 }}>
                        <TouchableOpacity
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text
                                style={{
                                    fontSize: 28,
                                    color: '#888',
                                    fontWeight: 'bold',
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                ✕
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.estimateStats, { marginBottom: 24 }]}>
                            {destinationLabel ? (
                                <>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#888',
                                            fontWeight: '400',
                                            textAlign: 'center',
                                            marginBottom: 4,
                                        }}
                                    >
                                        Descripción
                                    </Text>
                                    <View style={styles.estimateStatRow}>
                                        <Text
                                            style={[
                                                styles.estimateStatLabel,
                                                { color: '#888', fontWeight: '400', minWidth: 80 },
                                            ]}
                                        >
                                            Destino
                                        </Text>
                                        <Text
                                            style={[
                                                styles.estimateDestinationValue,
                                                {
                                                    color: '#888',
                                                    flex: 1,
                                                    textAlign: 'left',
                                                    flexWrap: 'wrap',
                                                    fontWeight: '400',
                                                },
                                            ]}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {destinationLabel}
                                        </Text>
                                    </View>
                                </>
                            ) : null}
                            {pickupDate ? (
                                <View style={styles.estimateStatRow}>
                                    <Text
                                        style={[
                                            styles.estimateStatLabel,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        Fecha
                                    </Text>
                                    <Text
                                        style={[
                                            styles.estimateStatValue,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        {pickupDate}
                                    </Text>
                                </View>
                            ) : null}
                            {pickupTime ? (
                                <View style={styles.estimateStatRow}>
                                    <Text
                                        style={[
                                            styles.estimateStatLabel,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        Hora de salida
                                    </Text>
                                    <Text
                                        style={[
                                            styles.estimateStatValue,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        {pickupTime} H
                                    </Text>
                                </View>
                            ) : null}
                            <View style={styles.estimateStatRow}>
                                <Text
                                    style={[
                                        styles.estimateStatLabel,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    Distancia
                                </Text>
                                <Text
                                    style={[
                                        styles.estimateStatValue,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    {tripInfo.distance}
                                </Text>
                            </View>
                            <View style={styles.estimateStatRow}>
                                <Text
                                    style={[
                                        styles.estimateStatLabel,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    Duración
                                </Text>
                                <Text
                                    style={[
                                        styles.estimateStatValue,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    {tripInfo.duration}
                                </Text>
                            </View>
                            <View style={styles.estimateStatRow}>
                                <Text
                                    style={[
                                        styles.estimateStatLabel,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    Pasajeros
                                </Text>
                                <Text
                                    style={[
                                        styles.estimateStatValue,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    {passengerCount}
                                </Text>
                            </View>
                            <View style={styles.estimateStatRow}>
                                <Text
                                    style={[
                                        styles.estimateStatLabel,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    Servicio
                                </Text>
                                <Text
                                    style={[
                                        styles.estimateStatValue,
                                        { color: '#888', fontWeight: '400' },
                                    ]}
                                >
                                    {serviceTypeLabel[serviceType] || serviceType}
                                </Text>
                            </View>
                            {baseTariff ? (
                                <View style={styles.estimateStatRow}>
                                    <Text
                                        style={[
                                            styles.estimateStatLabel,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        Tarifa
                                    </Text>
                                    <Text
                                        style={[
                                            styles.estimateStatValueLong,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        {baseTariff}
                                    </Text>
                                </View>
                            ) : null}
                            {horario ? (
                                <View style={styles.estimateStatRow}>
                                    <Text
                                        style={[
                                            styles.estimateStatLabel,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        Horario
                                    </Text>
                                    <Text
                                        style={[
                                            styles.estimateStatValueLong,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        {horario}
                                    </Text>
                                </View>
                            ) : null}
                            {distanceAppliedKm ? (
                                <View style={styles.estimateStatRow}>
                                    <Text
                                        style={[
                                            styles.estimateStatLabel,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        Km aplicados
                                    </Text>
                                    <Text
                                        style={[
                                            styles.estimateStatValue,
                                            { color: '#888', fontWeight: '400' },
                                        ]}
                                    >
                                        {distanceAppliedKm.toFixed(2)} km
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                        <EstimatePriceBox
                            total={total}
                            formatCurrency={formatCurrency}
                        />
                        <Button
                            title="Reservar"
                            variant="primary"
                            onPress={onConfirm}
                            style={styles.estimateModalButton}
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
