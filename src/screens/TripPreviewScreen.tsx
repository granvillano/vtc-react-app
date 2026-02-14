import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DatePickerModal } from '../components/tripPreview/DatePickerModal';
import { DateTimeCard } from '../components/tripPreview/DateTimeCard';
import { HoursCard } from '../components/tripPreview/HoursCard';
import { HoursPickerModal } from '../components/tripPreview/HoursPickerModal';
import { InfoNoteCard } from '../components/tripPreview/InfoNoteCard';
import { PassengerCard } from '../components/tripPreview/PassengerCard';
import { PassengersPickerModal } from '../components/tripPreview/PassengersPickerModal';
import { ConfirmReservationModal } from '../components/tripPreview/ConfirmReservationModal';
import { EstimateModal } from '../components/tripPreview/EstimateModal';
import { PricingCard } from '../components/tripPreview/PricingCard';
import { RouteSummaryCard } from '../components/tripPreview/RouteSummaryCard';
import { ServiceTypeCard } from '../components/tripPreview/ServiceTypeCard';
import { TimePickerModal } from '../components/tripPreview/TimePickerModal';
import { CalculatingOverlay } from '../components/tripPreview';
import { RootStackParamList } from '../types/navigation';
import { useTripPreview } from 'src/hooks/useTripPreview';
import { tripPreviewStyles as styles } from './styles/tripPreviewStyles';

type TripPreviewRouteProp = RouteProp<RootStackParamList, 'TripPreview'>;
type TripPreviewNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TripPreviewScreen: React.FC = () => {
    const navigation = useNavigation<TripPreviewNavigationProp>();
    const route = useRoute<TripPreviewRouteProp>();
    const { origin, destination } = route.params;
    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {
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
        closeDatePicker,
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
    } = useTripPreview({ origin, destination });

    const [parentScrollEnabled, setParentScrollEnabled] = useState(true);

    useEffect(() => {
        if (pricingInfo.total !== undefined && !loadingEstimate && !estimateError) {
            setShowEstimateModal(true);
        }
    }, [pricingInfo.total, loadingEstimate, estimateError]);

    const handleConfirmTrip = () => {
        console.log('Confirming trip', {
            origin: originDisplayLabel,
            destination: destination.address || `${destination.latitude},${destination.longitude}`,
            pickupDate,
            pickupTime,
            serviceType,
            hours: hoursNeeded,
        });

        setShowConfirmModal(true);
    };

    const reopenEstimateModal = () => setShowEstimateModal(true);

    const finalizeReservation = () => {
        setShowConfirmModal(false);
        setShowEstimateModal(false);
        navigation.navigate('TripTracking', { tripId: 'mock-trip-id' });
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={['top', 'right', 'bottom', 'left']}
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    accessibilityLabel="Volver"
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resumen del viaje</Text>
            </View>

            {loadingEstimate && canEstimate && <CalculatingOverlay />}

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                nestedScrollEnabled
                scrollEnabled={parentScrollEnabled}
                showsVerticalScrollIndicator={false}
            >
                <RouteSummaryCard
                    originLabel={originDisplayLabel}
                    destinationLabel={destination.address || 'Destino'}
                    distance={tripInfo.distance}
                    duration={tripInfo.duration}
                    loading={loadingEstimate}
                    error={estimateError}
                />

                <ServiceTypeCard
                    serviceType={serviceType}
                    options={serviceTypeOptions}
                    onSelect={setServiceType}
                    onInteractionStart={() => setParentScrollEnabled(false)}
                    onInteractionEnd={() => setParentScrollEnabled(true)}
                />

                <PassengerCard
                    passengerCount={passengerCount || 1}
                    passengerOptions={passengerOptions}
                    onSelect={selectPassengerCount}
                />

                <DateTimeCard
                    pickupDate={pickupDate}
                    pickupTime={pickupTime}
                    canEstimate={canEstimate}
                    onOpenDatePicker={openDatePicker}
                    onOpenTimePicker={openTimePicker}
                />

                {serviceType === 'hourly' && (
                    <HoursCard
                        hoursNeeded={hoursNeeded}
                        onOpenHoursPicker={openHoursPicker}
                    />
                )}

                <PricingCard
                    canEstimate={canEstimate}
                    isLoading={loadingEstimate}
                    canReserve={
                        canEstimate &&
                        !loadingEstimate &&
                        !estimateError &&
                        Boolean(pricingInfo.total)
                    }
                    breakdown={pricingInfo.breakdown}
                    total={pricingInfo.total}
                    baseTariff={pricingInfo.baseTariff}
                    horario={pricingInfo.horario}
                    distanceAppliedKm={pricingInfo.distanceAppliedKm}
                    formatCurrency={formatCurrency}
                    onReserve={reopenEstimateModal}
                />

                <InfoNoteCard />
            </ScrollView>

            <TimePickerModal
                visible={showTimePicker}
                options={timeOptions}
                selected={pickupTime}
                onSelect={selectPickupTime}
                onClose={closeTimePicker}
            />

            <DatePickerModal
                visible={showDatePicker}
                value={pickerBaseDate}
                draft={dateDraft}
                onChangeDraft={updateDateDraft}
                onConfirm={confirmDateSelection}
                onClose={closeDatePicker}
            />

            <HoursPickerModal
                visible={showHoursPicker}
                options={hourOptions}
                selected={hoursNeeded}
                onSelect={selectHours}
                onClose={closeHoursPicker}
            />

            <EstimateModal
                visible={showEstimateModal}
                onClose={() => setShowEstimateModal(false)}
                onConfirm={handleConfirmTrip}
                total={pricingInfo.total}
                baseTariff={pricingInfo.baseTariff}
                horario={pricingInfo.horario}
                distanceAppliedKm={pricingInfo.distanceAppliedKm}
                tripInfo={tripInfo}
                passengerCount={passengerCount || 1}
                serviceType={serviceType}
                hoursNeeded={hoursNeeded}
                formatCurrency={formatCurrency}
                pickupDate={pickupDate}
                pickupTime={pickupTime}
                destinationLabel={destinationDisplayLabel}
            />

            <ConfirmReservationModal
                visible={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={finalizeReservation}
            />
        </SafeAreaView>
    );
};
