import { useCallback, useEffect, useMemo, useState } from 'react';
import { APIError } from '../services/api.config';
import { Coordinates, geocodeAddress, getVehicleBaseCoordinates } from '../services/mapboxService';
import { ServiceType, tripService } from '../services/tripService';
import { LocationCoordinates } from '../types/navigation';
import { useDurationFormatter } from './useDurationFormatter';

const BASE_ORIGIN_LABEL = 'Base central VTC Premium Navarra';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

type EstimateData = Awaited<ReturnType<typeof tripService.estimateTrip>>['data'] | null;

type TripInfoDisplay = {
    distance: string;
    duration: string;
};

type PricingInfoDisplay = {
    breakdown: Array<{ concept: string; amount: string | number }>;
    total?: number;
    baseTariff?: string;
    horario?: string;
    distanceAppliedKm?: number;
};

type ServiceTypeOption = { value: ServiceType; label: string };

type UseTripPreviewParams = {
    origin: LocationCoordinates;
    destination: LocationCoordinates;
};

export const useTripPreview = ({ origin, destination }: UseTripPreviewParams) => {
    const { formatDuration } = useDurationFormatter();
    const [estimateData, setEstimateData] = useState<EstimateData>(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);
    const [estimateError, setEstimateError] = useState<string | null>(null);
    const [baseOrigin, setBaseOrigin] = useState<Coordinates | null>(null);
    const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [pickupTime, setPickupTime] = useState(() => new Date().toTimeString().slice(0, 5));
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateDraft, setDateDraft] = useState<Date | null>(null);
    const [serviceType, setServiceType] = useState<ServiceType>('one_way');
    const [showHoursPicker, setShowHoursPicker] = useState(false);
    const [hoursNeeded, setHoursNeeded] = useState(1);
    const [passengerCount, setPassengerCount] = useState(1);
    const [showPassengersPicker, setShowPassengersPicker] = useState(false);
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
                console.error('Error obteniendo origen base', error);
            }
        };

        loadBaseOrigin();

        return () => {
            isMounted = false;
        };
    }, []);

    const originDisplayLabel = useMemo(
        () => (baseOrigin ? BASE_ORIGIN_LABEL : origin.address || 'Tu ubicación'),
        [baseOrigin, origin.address]
    );

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
    const passengerOptions = useMemo(() => [1, 2, 3, 4], []);

    const tripInfo: TripInfoDisplay = useMemo(() => {
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
        const durationMin = rawDuration ? Math.ceil(Number(rawDuration)) : null;
        const durationText = formatDuration(durationMin);

        return {
            distance: distanceKm,
            duration: durationText,
        };
    }, [estimateData, formatDuration]);

    const pricingInfo: PricingInfoDisplay = useMemo(
        () => ({
            breakdown: estimateData?.pricing?.priceBreakdown || [],
            total: estimateData?.pricing?.total,
            baseTariff: estimateData?.pricing?.baseTariff,
            horario: estimateData?.pricing?.horario,
            distanceAppliedKm: estimateData?.pricing?.distanceAppliedKm,
        }),
        [estimateData]
    );

    const serviceTypeOptions: ServiceTypeOption[] = useMemo(
        () => [
            { value: 'one_way', label: 'Solo ida' },
            { value: 'round_trip', label: 'Ida y vuelta' },
            { value: 'hourly', label: 'Servicio por horas' },
            { value: 'daily', label: 'Servicio por días' },
        ],
        []
    );

    const formatCurrency = useCallback((amount: string | number | undefined | null) => {
        if (amount === undefined || amount === null) return '—';
        const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (Number.isNaN(numeric)) return '—';
        return `${numeric.toFixed(2)} €`;
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadEstimate = async () => {
            try {
                setLoadingEstimate(true);
                setEstimateError(null);
                console.log('🧭 Estimación: inicio', {
                    canEstimate,
                    pickupDate,
                    pickupTime,
                    serviceType,
                    hoursNeeded,
                    passengerCount,
                });

                if (!canEstimate) {
                    setEstimateData(null);
                    setEstimateError(null);
                    console.log('🧭 Estimación: abortada, canEstimate=false');
                    return;
                }

                if (!DATE_RE.test(pickupDate) || !TIME_RE.test(pickupTime)) {
                    setEstimateError('Introduce fecha (YYYY-MM-DD) y hora (HH:MM) válidas');
                    setEstimateData(null);
                    console.log('🧭 Estimación: fecha/hora inválidas');
                    return;
                }

                const baseHasCoords = Boolean(baseOrigin?.latitude && baseOrigin?.longitude);
                let originCoords = baseHasCoords ? baseOrigin : origin;
                const destinationCoords = destination;

                if (!originCoords?.latitude || !originCoords?.longitude) {
                    if (origin.address) {
                        console.log('🧭 Estimación: geocodificando origen por dirección', {
                            originAddress: origin.address,
                        });
                        const geocoded = await geocodeAddress(origin.address);
                        if (geocoded?.latitude && geocoded?.longitude) {
                            originCoords = geocoded;
                        }
                    }

                    if (!originCoords?.latitude || !originCoords?.longitude) {
                        setEstimateError('No se pudieron obtener las coordenadas de origen.');
                        setEstimateData(null);
                        console.log('🧭 Estimación: coordenadas de origen faltan', {
                            originCoords,
                        });
                        return;
                    }
                }

                if (!destinationCoords?.latitude || !destinationCoords?.longitude) {
                    setEstimateError('No se pudieron obtener las coordenadas de destino.');
                    setEstimateData(null);
                    console.log('🧭 Estimación: coordenadas de destino faltan', {
                        destinationCoords,
                    });
                    return;
                }

                const originLabel =
                    origin.address && !baseHasCoords
                        ? origin.address
                        : `${originCoords.latitude},${originCoords.longitude}`;

                const destinationLabel = destination.address
                    ? destination.address
                    : `${destinationCoords.latitude},${destinationCoords.longitude}`;

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
                    numberOfPassengers: passengerCount,
                    serviceType,
                    numberOfHours: serviceType === 'hourly' ? hoursNeeded : undefined,
                    supplements: [],
                };

                console.log('🧭 Estimación: enviando payload', requestPayload);
                const estimate = await tripService.estimateTrip(requestPayload);

                if (!isMounted) return;

                setEstimateData(estimate.data);
                console.log('🧭 Estimación: respuesta OK', estimate.data);
            } catch (error) {
                console.error('Error calculando estimación de viaje', error);
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
        passengerCount,
        canEstimate,
    ]);

    const openDatePicker = () => {
        setDateDraft(pickerBaseDate);
        setShowDatePicker(true);
    };

    const updateDateDraft = (selectedDate?: Date) => {
        if (selectedDate) {
            setDateDraft(selectedDate);
        }
    };

    const confirmDateSelection = () => {
        const finalDate = dateDraft || pickerBaseDate;
        setPickupDate(finalDate.toISOString().slice(0, 10));
        setCanEstimate(true);
        setShowDatePicker(false);
    };

    const openTimePicker = () => setShowTimePicker(true);
    const closeTimePicker = () => setShowTimePicker(false);
    const selectPickupTime = (time: string) => {
        setPickupTime(time);
        setShowTimePicker(false);
    };

    const destinationDisplayLabel = useMemo(
        () => destination.address || `${destination.latitude},${destination.longitude}`,
        [destination]
    );

    const openHoursPicker = () => setShowHoursPicker(true);
    const closeHoursPicker = () => setShowHoursPicker(false);
    const selectHours = (hours: number) => {
        setHoursNeeded(hours);
        setShowHoursPicker(false);
    };

    const openPassengersPicker = () => setShowPassengersPicker(true);
    const closePassengersPicker = () => setShowPassengersPicker(false);
    const selectPassengerCount = (value: number) => {
        setPassengerCount(value);
        setShowPassengersPicker(false);
    };

    return {
        pickupDate,
        pickupTime,
        canEstimate,
        loadingEstimate,
        estimateError,
        tripInfo,
        pricingInfo,
        serviceType,
        setServiceType,
        serviceTypeOptions,
        timeOptions,
        hourOptions,
        passengerOptions,
        hoursNeeded,
        passengerCount,
        showTimePicker,
        showDatePicker,
        dateDraft,
        showHoursPicker,
        showPassengersPicker,
        openDatePicker,
        closeDatePicker: () => setShowDatePicker(false),
        updateDateDraft,
        confirmDateSelection,
        openTimePicker,
        closeTimePicker,
        selectPickupTime,
        openHoursPicker,
        closeHoursPicker,
        selectHours,
        openPassengersPicker,
        closePassengersPicker,
        selectPassengerCount,
        originDisplayLabel,
        destinationDisplayLabel,
        pickerBaseDate,
        formatCurrency,
    };
};
