/**
 * Servicio de cálculo de precios y tarifas
 * Replica la lógica del sistema WordPress VTC Premium Navarra
 */

import { apiClient } from './apiClient';
import { TripDistances } from './mapboxService';

export type ServiceType = 'one_way' | 'round_trip' | 'hourly' | 'daily';

export interface Tariff {
    id: number;
    nombre: string;
    precio_base: number;
    precio_iva: number;
    categoria: string | null;
    tipo_servicio: ServiceType;
    distancia_minima: number | null;
    distancia_maxima: number | null;
    hora_minima: string | null; // HH:MM:SS
    hora_maxima: string | null; // HH:MM:SS
    num_pasajeros_min: number | null;
    num_pasajeros_max: number | null;
    es_festivo: boolean;
    es_descuento: boolean;
    activo: boolean;
}

export interface Supplement {
    id: number;
    name: string;
    slug: string;
    price: number;
    active: boolean;
}

export interface PriceBreakdownLine {
    concept: string;
    amount: string | number;
}

export interface PriceCalculation {
    subtotal: number;
    iva: number;
    total: number;
    deposit: number; // 50% del total
    priceBreakdown: PriceBreakdownLine[];
    tariffUsed: Tariff | null;
}

export interface TripEstimateRequest {
    pickupLocation: string;
    destinationLocation: string;
    pickupDate: string; // YYYY-MM-DD
    pickupTime: string; // HH:MM
    numberOfPassengers: number;
    serviceType: ServiceType;
    supplements?: string[]; // slugs de suplementos
}

/**
 * Obtiene todas las tarifas activas desde WordPress
 */
export async function getAllTariffs(): Promise<Tariff[]> {
    try {
        const response = await apiClient.get<Tariff[]>('/wp-json/vtc/v1/tariffs');
        return response || [];
    } catch (error) {
        console.error('❌ Error obteniendo tarifas:', error);
        return [];
    }
}

/**
 * Obtiene todos los suplementos disponibles
 */
export async function getAllSupplements(): Promise<Supplement[]> {
    try {
        const response = await apiClient.get<Supplement[]>('/wp-json/vtc/v1/supplements');
        return response || [];
    } catch (error) {
        console.error('❌ Error obteniendo suplementos:', error);
        return [];
    }
}

/**
 * Verifica si una fecha es festivo
 */
export async function isHoliday(date: string): Promise<boolean> {
    try {
        // Verificar si es domingo
        const dateObj = new Date(date + 'T00:00:00');
        if (dateObj.getDay() === 0) return true;

        // Verificar en base de datos de festivos
        const response = await apiClient.get<{ is_holiday: boolean; reason?: string }>(
            '/wp-json/vtc/v1/holidays/check',
            { params: { date } }
        );

        return response?.is_holiday || false;
    } catch (error) {
        console.error('❌ Error verificando festivo:', error);
        // Si es domingo, marcar como festivo
        const dateObj = new Date(date + 'T00:00:00');
        return dateObj.getDay() === 0;
    }
}

/**
 * Encuentra la tarifa que mejor se ajusta a los criterios
 * Replica la lógica de findMatchingRate() del WordPress
 */
export async function findMatchingTariff(
    serviceType: ServiceType,
    passengers: number,
    hour: number, // 0-23
    distance: number, // km
    selectedDate: string,
    tariffs: Tariff[]
): Promise<Tariff | null> {
    try {
        // 1️⃣ Verificar si es festivo
        const festivo = await isHoliday(selectedDate);
        console.log('📅 Fecha:', selectedDate, '- ¿Festivo?:', festivo);

        // 2️⃣ Filtrar tarifas candidatas
        const candidatas = tariffs.filter((t) => {
            // Debe estar activa
            if (!t.activo) return false;

            // No debe ser descuento
            if (t.es_descuento) return false;

            // Tipo de servicio debe coincidir
            if (t.tipo_servicio !== serviceType) return false;

            // Festivo debe coincidir
            if (t.es_festivo !== festivo) return false;

            // Verificar rango de pasajeros
            if (t.num_pasajeros_min !== null && passengers < t.num_pasajeros_min) return false;
            if (t.num_pasajeros_max !== null && passengers > t.num_pasajeros_max) return false;

            // Verificar rango de distancia
            if (t.distancia_minima !== null && distance < t.distancia_minima) return false;
            if (t.distancia_maxima !== null && distance > t.distancia_maxima) return false;

            // Verificar rango de hora
            if (t.hora_minima && t.hora_maxima) {
                const minHour = parseInt(t.hora_minima.split(':')[0]);
                const maxHour = parseInt(t.hora_maxima.split(':')[0]);

                // Rango normal (ej: 08:00 - 22:00)
                if (minHour <= maxHour) {
                    if (hour < minHour || hour > maxHour) return false;
                }
                // Rango nocturno (ej: 22:00 - 08:00)
                else {
                    if (hour < minHour && hour > maxHour) return false;
                }
            }

            return true;
        });

        if (candidatas.length === 0) {
            console.warn('⚠️ No se encontró tarifa que coincida con los criterios');
            return null;
        }

        // 3️⃣ Retornar la primera tarifa que coincida
        // (podrías ordenar por precio_base si hay múltiples)
        const tarifa = candidatas[0];
        console.log('✅ Tarifa seleccionada:', tarifa.nombre);

        return tarifa;
    } catch (error) {
        console.error('❌ Error buscando tarifa:', error);
        return null;
    }
}

/**
 * Calcula el precio total de un viaje
 * Replica calculateTotalPrice() del WordPress
 */
export async function calculateTripPrice(
    request: TripEstimateRequest,
    distances: TripDistances,
    tariffs: Tariff[],
    supplements: Supplement[]
): Promise<PriceCalculation> {
    try {
        console.log('💰 Calculando precio del viaje...');

        const hour = parseInt(request.pickupTime.split(':')[0]);

        // 1️⃣ Buscar tarifa aplicable
        const tariff = await findMatchingTariff(
            request.serviceType,
            request.numberOfPassengers,
            hour,
            distances.distancePickupToDestination,
            request.pickupDate,
            tariffs
        );

        if (!tariff) {
            throw new Error('No se encontró una tarifa aplicable');
        }

        // 2️⃣ Calcular precio base
        let subtotal = tariff.precio_base;

        const breakdown: PriceBreakdownLine[] = [
            { concept: 'Tarifa base', amount: `${tariff.precio_base.toFixed(2)} €` },
            { concept: 'Nombre tarifa', amount: tariff.nombre },
        ];

        // 3️⃣ Sumar suplementos seleccionados
        if (request.supplements && request.supplements.length > 0) {
            const selectedSupplements = supplements.filter((s) =>
                request.supplements!.includes(s.slug)
            );

            selectedSupplements.forEach((supp) => {
                subtotal += supp.price;
                breakdown.push({
                    concept: supp.name,
                    amount: `${supp.price.toFixed(2)} €`,
                });
            });
        }

        // 4️⃣ Suplemento por distancia base-origen (si aplica)
        // Esto se gestiona desde el backend en WordPress, aquí simplificamos
        if (distances.distanceBaseToPickup > 0) {
            breakdown.push({
                concept: 'Distancia base-origen',
                amount: `${distances.distanceBaseToPickup.toFixed(2)} km`,
            });
        }

        // 5️⃣ Calcular IVA (10% por defecto)
        const IVA_RATE = 0.1;
        const iva = subtotal * IVA_RATE;
        const total = subtotal + iva;
        const deposit = total * 0.5; // 50% de señal

        breakdown.push(
            { concept: 'Subtotal', amount: `${subtotal.toFixed(2)} €` },
            { concept: `IVA (${(IVA_RATE * 100).toFixed(0)}%)`, amount: `${iva.toFixed(2)} €` },
            { concept: 'Total', amount: `${total.toFixed(2)} €` },
            { concept: 'Señal (50%)', amount: `${deposit.toFixed(2)} €` }
        );

        console.log('✅ Precio calculado:', total.toFixed(2), '€');

        return {
            subtotal,
            iva,
            total,
            deposit,
            priceBreakdown: breakdown,
            tariffUsed: tariff,
        };
    } catch (error) {
        console.error('❌ Error calculando precio:', error);
        throw error;
    }
}

/**
 * Estima el precio completo de un viaje
 * Endpoint principal que combina todo
 */
export async function estimateTrip(request: TripEstimateRequest): Promise<{
    distances: TripDistances;
    pricing: PriceCalculation;
}> {
    try {
        console.log('🎯 Estimando viaje completo...');

        // Llamar directamente al endpoint de WordPress que hace todo
        interface EstimateResponse {
            success: boolean;
            data: {
                distances: TripDistances;
                pricing: PriceCalculation;
            };
        }

        const response = await apiClient.post<EstimateResponse>('/trips/estimate', {
            origin: request.pickupLocation,
            destination: request.destinationLocation,
            pickup_date: request.pickupDate,
            pickup_time: request.pickupTime,
            number_of_passengers: request.numberOfPassengers,
            service_type: request.serviceType,
            supplements: request.supplements || [],
        });

        if (response?.success) {
            return response.data;
        }

        throw new Error('No se pudo estimar el viaje');
    } catch (error) {
        console.error('❌ Error estimando viaje:', error);
        throw error;
    }
}
