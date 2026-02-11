import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './api.config';

/**
 * Servicio para gestionar viajes - Integrado con WordPress VTC
 */

export type ServiceType = 'one_way' | 'round_trip' | 'hourly' | 'daily';
export type TripStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface TripInfo {
    id: string;
    token_id: string; // Nuevo campo único del backend
    origin: string;
    destination: string;
    pickupDate: string;
    pickupTime: string;
    numberOfPassengers: number;
    serviceType: ServiceType;
    status: TripStatus;
    paymentStatus?: string;
    totalAmount?: number;
    depositAmount?: number;
    distanceKm?: number;
    supplements?: string[];
    comments?: string;
    createdAt?: string;
}

interface CreateTripRequest {
    origin: string;
    destination: string;
    pickupDate: string;
    pickupTime: string;
    numberOfPassengers: number;
    serviceType: ServiceType;
    supplements?: string[];
    comments?: string;
}

interface CreateTripResponse {
    success: boolean;
    data: {
        trip: TripInfo;
    };
    message: string;
}

interface TripEstimateRequest {
    origin: string;
    destination: string;
    pickupDate: string;
    pickupTime: string;
    numberOfPassengers: number;
    serviceType: ServiceType;
    supplements?: string[];
}

interface TripEstimateResponse {
    success: boolean;
    data: {
        distances: {
            distanceBaseToPickup: number;
            distancePickupToDestination: number;
            distanceDestinationToBase: number;
            totalDistance: number;
            estimatedDuration: number;
        };
        pricing: {
            tariffUsed: {
                id: number;
                name: string;
            };
            baseFare: number;
            distanceCharges: number;
            supplements: Array<{ name: string; amount: number }>;
            subtotal: number;
            iva: number;
            total: number;
            deposit: number;
            priceBreakdown: Array<{ concept: string; amount: string | number }>;
        };
    };
}

export const tripService = {
    /**
     * Estimar precio y distancia de un viaje
     * Usa el sistema real de WordPress + Mapbox
     */
    async estimateTrip(data: TripEstimateRequest): Promise<TripEstimateResponse> {
        try {
            console.log('📊 Estimando viaje:', data);

            const response = await apiClient.post<TripEstimateResponse>('/trips/estimate', {
                origin: data.origin,
                destination: data.destination,
                pickup_date: data.pickupDate,
                pickup_time: data.pickupTime,
                number_of_passengers: data.numberOfPassengers,
                service_type: data.serviceType,
                supplements: data.supplements || [],
            });

            if (response.success) {
                return response;
            }

            throw new Error('Error al estimar el viaje');
        } catch (error) {
            console.error('❌ Error estimando viaje:', error);
            throw error;
        }
    },

    /**
     * Crear un nuevo viaje/reserva
     * Guarda en la tabla vtc_travels
     */
    async createTrip(data: CreateTripRequest): Promise<{ trip: TripInfo; message: string }> {
        try {
            console.log('✅ Creando reserva:', data);

            const response = await apiClient.post<CreateTripResponse>('/trips/create', {
                origin: data.origin,
                destination: data.destination,
                travel_date: data.pickupDate,
                travel_time: data.pickupTime,
                number_of_passengers: data.numberOfPassengers,
                service_type: data.serviceType,
                supplements: data.supplements || [],
                comments: data.comments || '',
            });

            if (response.success) {
                return {
                    trip: response.data.trip,
                    message: response.message || 'Viaje creado exitosamente',
                };
            }

            throw new Error('Error al crear el viaje');
        } catch (error) {
            console.error('❌ Error creando viaje:', error);
            throw error;
        }
    },

    /**
     * Obtener información de un viaje
     */
    async getTrip(tripId: string): Promise<TripInfo> {
        try {
            console.log('📖 Obteniendo viaje:', tripId);

            const response = await apiClient.get<{ success: boolean; data: { trip: TripInfo } }>(
                `/trips/${tripId}`
            );

            if (response.success) {
                return response.data.trip;
            }

            throw new Error('Viaje no encontrado');
        } catch (error) {
            console.error('❌ Error obteniendo viaje:', error);
            throw error;
        }
    },

    /**
     * Obtener lista de viajes del usuario
     */
    async listTrips(page: number = 1, limit: number = 20): Promise<TripInfo[]> {
        try {
            console.log('📋 Listando viajes:', { page, limit });

            const response = await apiClient.get<{ success: boolean; data: { trips: TripInfo[] } }>(
                `/trips/my-trips?page=${page}&limit=${limit}`
            );

            if (response.success) {
                return response.data.trips;
            }

            return [];
        } catch (error) {
            console.error('❌ Error listando viajes:', error);
            return [];
        }
    },

    /**
     * Cancelar un viaje
     */
    async cancelTrip(tripId: string, reason?: string): Promise<{ message: string }> {
        try {
            console.log('🚫 Cancelando viaje:', tripId, reason);

            const response = await apiClient.post<{ success: boolean; message: string }>(
                `/trips/${tripId}/cancel`,
                { reason }
            );

            if (response.success) {
                return { message: response.message || 'Viaje cancelado exitosamente' };
            }

            throw new Error('Error al cancelar el viaje');
        } catch (error) {
            console.error('❌ Error cancelando viaje:', error);
            throw error;
        }
    },

    // ❌ rateTrip ELIMINADO - Los campos rating/rating_comment no existen en la base de datos
};
