import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    StatusBar,
    Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../theme';
import { Button, Card, Input } from '../components/common';
import { RootStackParamList } from '../types/navigation';
import { tripService, ServiceType } from '../services/tripService';
import { APIError } from '../services/api.config';
import { getVehicleBaseCoordinates, Coordinates } from '../services/mapboxService';

const BASE_ORIGIN_LABEL = 'Base central VTC Premium Navarra';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

type TripPreviewRouteProp = RouteProp<RootStackParamList, 'TripPreview'>;
type TripPreviewNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TripPreviewScreen: React.FC = () => {
    const navigation = useNavigation<TripPreviewNavigationProp>();
    const route = useRoute<TripPreviewRouteProp>();
    const { origin, destination } = route.params;
    const [estimateData, setEstimateData] = useState<
        Awaited<ReturnType<typeof tripService.estimateTrip>>['data'] | null
    >(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);
    const [estimateError, setEstimateError] = useState<string | null>(null);
    const [baseOrigin, setBaseOrigin] = useState<Coordinates | null>(null);
    const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [pickupTime, setPickupTime] = useState(() => new Date().toTimeString().slice(0, 5)); // HH:MM
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateDraft, setDateDraft] = useState<Date | null>(null);
    const [serviceType, setServiceType] = useState<ServiceType>('one_way');
    const [showHoursPicker, setShowHoursPicker] = useState(false);
    const [hoursNeeded, setHoursNeeded] = useState(1);
    const [canEstimate, setCanEstimate] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadBaseOrigin = async () => {
            try {
                const base = await getVehicleBaseCoordinates();
                if (isMounted && base) {
                    setBaseOrigin(base);
                }
            } catch (error) {
                console.error('❌ Error obteniendo origen base', error);
            }
        };

        loadBaseOrigin();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadEstimate = async () => {
            try {
                setLoadingEstimate(true);
                setEstimateError(null);

                if (!canEstimate) {
                    setEstimateData(null);
                    setEstimateError(null);
                    return;
                }

                if (!DATE_RE.test(pickupDate) || !TIME_RE.test(pickupTime)) {
                    setEstimateError('Introduce fecha (YYYY-MM-DD) y hora (HH:MM) válidas');
                    setEstimateData(null);
                    return;
                }

                const originLabel = baseOrigin
                    ? `${baseOrigin.latitude},${baseOrigin.longitude}`
                    : origin.address || `${origin.latitude},${origin.longitude}`;

                const destinationLabel =
                    destination.address || `${destination.latitude},${destination.longitude}`;

                if (serviceType === 'hourly' && (!hoursNeeded || hoursNeeded <= 0)) {
                    setEstimateError('Selecciona cuántas horas necesitas.');
                    setEstimateData(null);
                    return;
                }

                const requestPayload = {
                    origin: originLabel,
                    destination: destinationLabel,
                    pickupDate,
                    pickupTime,
                    numberOfPassengers: 1,
                    serviceType,
                    numberOfHours: serviceType === 'hourly' ? hoursNeeded : undefined,
                    supplements: [],
                };

                console.log('🚀 Enviando estimateTrip', requestPayload);

                const estimate = await tripService.estimateTrip(requestPayload);

                if (!isMounted) return;

                setEstimateData(estimate.data);
            } catch (error) {
                console.error('❌ Error calculando estimación de viaje', error);
                if (isMounted) {
                    if (error instanceof APIError && error.data?.message) {
                        setEstimateError(error.data.message);
                    } else {
                        setEstimateError('No se pudo calcular la estimación del viaje');
                    }
                }
            } finally {
                if (isMounted) {
                    setLoadingEstimate(false);
                }
            }
        };

        loadEstimate();

        return () => {
            isMounted = false;
        };
    }, [
        baseOrigin,
        origin,
        destination,
        pickupDate,
        pickupTime,
        serviceType,
        hoursNeeded,
        canEstimate,
    ]);

    const tripInfo = useMemo(() => {
        const rawDistance =
            estimateData?.distances?.distanceTripKm ??
            estimateData?.distances?.distanceBaseToDestination ??
            estimateData?.distances?.distancePickupToDestination ??
            estimateData?.distances?.totalDistance;

        const distanceKm = rawDistance
            ? `${parseFloat(rawDistance.toString()).toFixed(2)} km`
            : '—';

        const rawDuration =
            estimateData?.distances?.estimatedDuration ??
            estimateData?.distances?.estimatedDurationMin;
        const durationMin = rawDuration ? Math.ceil(rawDuration) : null;
        const durationText = durationMin ? `${durationMin} min` : '—';

        return {
            distance: distanceKm,
            duration: durationText,
        };
    }, [estimateData]);

    const pricingInfo = useMemo(() => {
        const breakdown = estimateData?.pricing?.priceBreakdown || [];
        const total = estimateData?.pricing?.total;
        return {
            breakdown,
            total,
            baseTariff: estimateData?.pricing?.baseTariff,
            horario: estimateData?.pricing?.horario,
            distanceAppliedKm: estimateData?.pricing?.distanceAppliedKm,
        };
    }, [estimateData]);

    const formatCurrency = (amount: string | number | undefined | null) => {
        if (amount === undefined || amount === null) return '—';
        const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (Number.isNaN(numeric)) return '—';
        return `${numeric.toFixed(2)} €`;
    };

    const serviceTypeOptions: Array<{ value: ServiceType; label: string }> = [
        { value: 'one_way', label: 'Solo ida' },
        { value: 'round_trip', label: 'Ida y vuelta' },
        { value: 'hourly', label: 'Servicio por horas' },
        { value: 'daily', label: 'Servicio por días' },
    ];

    const originDisplayLabel = baseOrigin ? BASE_ORIGIN_LABEL : origin.address || 'Tu ubicación';

    const pickerBaseDate = useMemo(() => {
        const parsed = new Date(pickupDate);
        return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    }, [pickupDate]);

    const timeOptions = useMemo(() => {
        const slots: string[] = [];
        for (let hour = 0; hour < 24; hour += 1) {
            for (let minute = 0; minute < 60; minute += 15) {
                const h = hour.toString().padStart(2, '0');
                const m = minute.toString().padStart(2, '0');
                slots.push(`${h}:${m}`);
            }
        }
        return slots;
    }, []);

    const hourOptions = useMemo(() => Array.from({ length: 12 }, (_v, idx) => idx + 1), []);

    const handleConfirmTrip = () => {
        // TODO: Integrar con backend para crear el viaje
        console.log('Confirming trip', {
            origin: originDisplayLabel,
            destination: destination.address || `${destination.latitude},${destination.longitude}`,
            pickupDate,
            pickupTime,
            serviceType,
            hours: hoursNeeded,
        });

        navigation.navigate('TripTracking', { tripId: 'mock-trip-id' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resumen del viaje</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Card
                    variant="elevated"
                    padding="lg"
                    style={styles.routeCard}
                >
                    <View style={styles.routeInfo}>
                        <View style={styles.routePoint}>
                            <View style={styles.originDot} />
                            <Text
                                style={styles.routeAddress}
                                numberOfLines={1}
                            >
                                {originDisplayLabel}
                            </Text>
                        </View>

                        <View style={styles.routeLine} />

                        <View style={styles.routePoint}>
                            <View style={styles.destinationDot} />
                            <Text
                                style={styles.routeAddress}
                                numberOfLines={1}
                            >
                                {destination.address || 'Destino'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tripDetails}>
                        <View style={styles.tripDetailItem}>
                            <Text style={styles.tripDetailLabel}>Distancia</Text>
                            <Text style={styles.tripDetailValue}>{tripInfo.distance}</Text>
                        </View>
                        <View style={styles.tripDetailDivider} />
                        <View style={styles.tripDetailItem}>
                            <Text style={styles.tripDetailLabel}>Duración</Text>
                            <Text style={styles.tripDetailValue}>{tripInfo.duration}</Text>
                        </View>
                    </View>

                    {loadingEstimate && (
                        <Text style={styles.helperText}>Calculando ruta y precio...</Text>
                    )}
                    {estimateError && <Text style={styles.errorText}>{estimateError}</Text>}
                </Card>
                <Card
                    variant="default"
                    padding="lg"
                    style={styles.datetimeCard}
                >
                    <Text style={styles.sectionTitle}>Fecha y hora del viaje</Text>
                    <View style={styles.datetimeRow}>
                        <View style={styles.datetimeField}>
                            <Text style={styles.datetimeLabel}>Fecha</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setDateDraft(pickerBaseDate);
                                    setShowDatePicker(true);
                                }}
                                activeOpacity={0.7}
                            >
                                <Input
                                    value={pickupDate}
                                    editable={false}
                                    pointerEvents="none"
                                    placeholder="YYYY-MM-DD"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datetimeSpacer} />
                        <View style={styles.datetimeField}>
                            <Text style={styles.datetimeLabel}>Hora</Text>
                            <TouchableOpacity
                                onPress={() => setShowTimePicker(true)}
                                activeOpacity={0.7}
                            >
                                <Input
                                    value={pickupTime}
                                    editable={false}
                                    pointerEvents="none"
                                    placeholder="HH:MM"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.helperText}>
                        Se recalcula precio y ruta al cambiar fecha u hora.
                    </Text>
                    {!canEstimate && (
                        <Text style={styles.helperText}>Selecciona la fecha para calcular.</Text>
                    )}
                </Card>

                <Card
                    variant="default"
                    padding="lg"
                    style={styles.serviceCard}
                >
                    <Text style={styles.sectionTitle}>Tipo de servicio</Text>
                    <View style={styles.serviceTypeChips}>
                        {serviceTypeOptions.map((option) => {
                            const selected = option.value === serviceType;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.serviceChip,
                                        selected && styles.serviceChipSelected,
                                    ]}
                                    onPress={() => setServiceType(option.value)}
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

                {serviceType === 'hourly' && (
                    <Card
                        variant="default"
                        padding="lg"
                        style={styles.hoursCard}
                    >
                        <Text style={styles.sectionTitle}>Duración del servicio</Text>
                        <TouchableOpacity
                            onPress={() => setShowHoursPicker(true)}
                            activeOpacity={0.7}
                        >
                            <Input
                                value={`${hoursNeeded} ${hoursNeeded === 1 ? 'hora' : 'horas'}`}
                                editable={false}
                                pointerEvents="none"
                                placeholder="Selecciona horas"
                            />
                        </TouchableOpacity>
                        <Text style={styles.helperText}>
                            Indica cuántas horas necesitas el vehículo para calcular la tarifa.
                        </Text>
                    </Card>
                )}

                <Card
                    variant="default"
                    padding="lg"
                    style={styles.pricingCard}
                >
                    <Text style={styles.sectionTitle}>Estimación de precio</Text>
                    {!canEstimate ? (
                        <Text style={styles.helperText}>
                            Selecciona la fecha para ver el precio.
                        </Text>
                    ) : (
                        <>
                            <View style={styles.pricingMeta}>
                                {pricingInfo.baseTariff ? (
                                    <Text style={styles.metaText}>
                                        Tarifa: {pricingInfo.baseTariff}
                                    </Text>
                                ) : null}
                                {pricingInfo.horario ? (
                                    <Text style={styles.metaText}>
                                        Horario: {pricingInfo.horario}
                                    </Text>
                                ) : null}
                                {pricingInfo.distanceAppliedKm ? (
                                    <Text style={styles.metaText}>
                                        Km aplicados: {pricingInfo.distanceAppliedKm?.toFixed(2)} km
                                    </Text>
                                ) : null}
                            </View>

                            {pricingInfo.breakdown.length > 0 ? (
                                <View style={styles.breakdownList}>
                                    {pricingInfo.breakdown.map(
                                        (
                                            item: { concept: string; amount: string | number },
                                            index: number
                                        ) => (
                                            <View
                                                key={`${item.concept}-${index}`}
                                                style={styles.breakdownRow}
                                            >
                                                <Text style={styles.breakdownConcept}>
                                                    {item.concept}
                                                </Text>
                                                <Text style={styles.breakdownAmount}>
                                                    {formatCurrency(item.amount)}
                                                </Text>
                                            </View>
                                        )
                                    )}
                                </View>
                            ) : (
                                <Text style={styles.helperText}>Aún sin desglosar precio.</Text>
                            )}

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total estimado</Text>
                                <Text style={styles.totalAmount}>
                                    {formatCurrency(pricingInfo.total)}
                                </Text>
                            </View>
                        </>
                    )}
                </Card>

                <Card
                    variant="default"
                    padding="lg"
                    style={styles.datetimeCard}
                >
                    <Text style={styles.infoText}>
                        El precio puede variar según el tráfico y las condiciones del servicio.
                    </Text>
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Confirmar viaje"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleConfirmTrip}
                />
            </View>

            <Modal
                visible={showTimePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowTimePicker(false)}
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
                            {timeOptions.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeOption,
                                        time === pickupTime && styles.timeOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setPickupTime(time);
                                        setShowTimePicker(false);
                                    }}
                                >
                                    <Text style={styles.timeOptionText}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Button
                            title="Cerrar"
                            variant="secondary"
                            onPress={() => setShowTimePicker(false)}
                            style={styles.timePickerClose}
                        />
                    </Card>
                </View>
            </Modal>

            <Modal
                visible={showDatePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.timePickerOverlay}>
                    <Card
                        variant="default"
                        padding="lg"
                        style={styles.timePickerModal}
                    >
                        <Text style={styles.sectionTitle}>Selecciona la fecha</Text>
                        <DateTimePicker
                            value={dateDraft || pickerBaseDate}
                            mode="date"
                            display="spinner"
                            onChange={(_event: DateTimePickerEvent, selectedDate?: Date) => {
                                if (selectedDate) {
                                    setDateDraft(selectedDate);
                                }
                            }}
                            minimumDate={new Date()}
                            textColor={theme.colors.text.primary}
                        />

                        <Button
                            title="Seleccionar"
                            variant="secondary"
                            onPress={() => {
                                const finalDate = dateDraft || pickerBaseDate;
                                setPickupDate(finalDate.toISOString().slice(0, 10));
                                setCanEstimate(true);
                                setShowDatePicker(false);
                            }}
                            style={styles.timePickerClose}
                        />
                    </Card>
                </View>
            </Modal>

            <Modal
                visible={showHoursPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowHoursPicker(false)}
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
                            {hourOptions.map((hours) => (
                                <TouchableOpacity
                                    key={hours}
                                    style={[
                                        styles.timeOption,
                                        hours === hoursNeeded && styles.timeOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setHoursNeeded(hours);
                                        setShowHoursPicker(false);
                                    }}
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
                            onPress={() => setShowHoursPicker(false)}
                            style={styles.timePickerClose}
                        />
                    </Card>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    datetimeCard: {
        marginBottom: theme.spacing.lg,
    },

    pricingCard: {
        marginBottom: theme.spacing.lg,
    },

    datetimeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
    },

    datetimeField: {
        flex: 1,
    },

    datetimeLabel: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },

    datetimeSpacer: {
        width: theme.spacing.sm,
    },

    serviceCard: {
        marginBottom: theme.spacing.lg,
    },

    hoursCard: {
        marginBottom: theme.spacing.lg,
    },

    pricingMeta: {
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.md,
    },

    metaText: {
        ...theme.textStyles.bodySmall,
        color: theme.colors.text.secondary,
    },

    breakdownList: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },

    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    breakdownConcept: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        flex: 1,
    },

    breakdownAmount: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        paddingTop: theme.spacing.md,
    },

    totalLabel: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        fontWeight: theme.fontWeight.semibold,
    },

    totalAmount: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.bold,
    },

    serviceTypeChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },

    serviceChip: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        backgroundColor: theme.colors.background.secondary,
    },

    serviceChipSelected: {
        borderColor: theme.colors.primary.gold,
        backgroundColor: theme.colors.background.card,
        ...theme.shadows.gold,
    },

    serviceChipText: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
    },

    serviceChipTextSelected: {
        color: theme.colors.primary.gold,
        fontWeight: theme.fontWeight.semibold,
    },

    timePickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },

    timePickerModal: {
        width: '100%',
        maxHeight: '70%',
    },

    timeList: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },

    timeListContent: {
        gap: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
    },

    timeOption: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    timeOptionSelected: {
        borderColor: theme.colors.primary.gold,
        backgroundColor: theme.colors.background.secondary,
    },

    timeOptionText: {
        ...theme.textStyles.bodyLarge,
        color: theme.colors.text.primary,
        textAlign: 'center',
    },

    timePickerClose: {
        marginTop: theme.spacing.sm,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },

    backButtonText: {
        fontSize: theme.fontSize['2xl'],
        color: theme.colors.primary.gold,
    },

    headerTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
    },

    content: {
        flex: 1,
    },

    contentContainer: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing['2xl'],
    },

    routeCard: {
        marginBottom: theme.spacing.lg,
    },

    routeInfo: {
        marginBottom: theme.spacing.lg,
    },

    routePoint: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    helperText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginTop: theme.spacing.sm,
    },

    errorText: {
        ...theme.textStyles.caption,
        color: theme.colors.status.error,
        marginTop: theme.spacing.sm,
    },

    originDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.map.userLocation,
        marginRight: theme.spacing.md,
    },

    destinationDot: {
        width: 12,
        height: 12,
        backgroundColor: theme.colors.primary.gold,
        marginRight: theme.spacing.md,
    },

    routeLine: {
        width: 2,
        height: theme.spacing.lg,
        backgroundColor: theme.colors.border.light,
        marginLeft: 5,
        marginVertical: theme.spacing.sm,
    },

    routeAddress: {
        ...theme.textStyles.body,
        color: theme.colors.text.primary,
        flex: 1,
    },

    tripDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
    },

    tripDetailItem: {
        alignItems: 'center',
        flex: 1,
    },

    tripDetailLabel: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        marginBottom: theme.spacing.xs,
    },

    tripDetailValue: {
        ...theme.textStyles.h4,
        color: theme.colors.primary.gold,
    },

    tripDetailDivider: {
        width: 1,
        height: theme.spacing['2xl'],
        backgroundColor: theme.colors.border.light,
    },

    sectionTitle: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },

    infoCard: {
        backgroundColor: theme.colors.background.secondary,
    },

    infoText: {
        ...theme.textStyles.caption,
        color: theme.colors.text.tertiary,
        textAlign: 'center',
        lineHeight: theme.textStyles.caption.lineHeight * 1.5,
    },

    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        backgroundColor: theme.colors.background.card,
        ...theme.shadows.lg,
    },
});
