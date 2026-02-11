/**
 * Servicio de Mapbox para geolocalización y cálculo de distancias
 *
 * IMPORTANTE: Por seguridad, las llamadas se hacen a través del backend WordPress
 * que actúa como proxy, evitando exponer la API key en el cliente.
 */

import { apiClient } from './apiClient';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface MapboxFeature {
    place_name: string;
    center: [number, number]; // [longitude, latitude]
    place_type: string[];
    text: string;
}

export interface DistanceResult {
    distance: number; // en kilómetros
    duration: number; // en minutos
}

/**
 * Convierte una dirección de texto a coordenadas geográficas
 * Usa Mapbox Geocoding API a través del backend WordPress
 */
export async function geocodeAddress(
    address: string,
    types: string = 'address,place,poi'
): Promise<Coordinates | null> {
    try {
        console.log('🔍 Geocoding:', address, '- types:', types);

        // Llamar al endpoint WordPress que hace de proxy
        const response = await apiClient.get<{ features: MapboxFeature[] }>('/mapbox/geocode', {
            params: {
                address,
                types,
            },
        });

        if (response.features?.length > 0) {
            const [longitude, latitude] = response.features[0].center;
            console.log('✅ Coordenadas:', { latitude, longitude });
            return { latitude, longitude };
        }

        console.warn('⚠️ No se encontraron coordenadas para:', address);
        return null;
    } catch (error) {
        console.error('❌ Error en geocoding:', error);
        return null;
    }
}

/**
 * Busca sugerencias de direcciones mientras el usuario escribe
 * Para autocompletado de direcciones
 */
export async function searchPlaces(
    query: string,
    types: string = 'address,place,poi'
): Promise<MapboxFeature[]> {
    try {
        if (query.length < 3) return [];

        console.log('🔍 Buscando lugares:', query);

        const response = await apiClient.get<{ features: MapboxFeature[] }>('/mapbox/search', {
            params: {
                query,
                types,
                limit: '5',
            },
        });

        return response.features || [];
    } catch (error) {
        console.error('❌ Error buscando lugares:', error);
        return [];
    }
}

/**
 * Calcula la distancia REAL por carretera entre dos puntos
 * Usa Mapbox Directions API a través del backend WordPress
 */
export async function getDistanceBetweenCoordinates(
    from: Coordinates,
    to: Coordinates
): Promise<DistanceResult | null> {
    try {
        console.log('🚗 Calculando distancia entre coordenadas...');

        const response = await apiClient.get<{
            routes: Array<{ distance: number; duration: number }>;
        }>('/mapbox/directions', {
            params: {
                from_lat: from.latitude.toString(),
                from_lon: from.longitude.toString(),
                to_lat: to.latitude.toString(),
                to_lon: to.longitude.toString(),
            },
        });

        if (response.routes?.length > 0) {
            const route = response.routes[0];
            const distanceKm = route.distance / 1000; // metros a km
            const durationMin = Math.ceil(route.duration / 60); // segundos a minutos

            console.log(`✅ Distancia: ${distanceKm.toFixed(2)} km, Duración: ${durationMin} min`);

            return {
                distance: parseFloat(distanceKm.toFixed(2)),
                duration: durationMin,
            };
        }

        console.warn('⚠️ No se pudo calcular la ruta');
        return null;
    } catch (error) {
        console.error('❌ Error calculando distancia:', error);
        return null;
    }
}

/**
 * Calcula la distancia entre dos direcciones de texto
 * Combina geocoding + directions
 */
export async function getDistanceFromAddresses(
    pickupAddress: string,
    destinationAddress: string
): Promise<DistanceResult | null> {
    try {
        console.log('📍 Calculando distancia de direcciones...');
        console.log('   Origen:', pickupAddress);
        console.log('   Destino:', destinationAddress);

        // Detectar si busca aeropuerto para ajustar tipos
        const wantsAirport = (text: string) => /aeropuerto/i.test(text);
        const pickupTypes = wantsAirport(pickupAddress) ? 'poi' : 'address,place,poi';
        const destinationTypes = wantsAirport(destinationAddress) ? 'poi' : 'address,place,poi';

        // 1️⃣ Geocodificar ambas direcciones
        const [pickupCoords, destinationCoords] = await Promise.all([
            geocodeAddress(pickupAddress, pickupTypes),
            geocodeAddress(destinationAddress, destinationTypes),
        ]);

        if (!pickupCoords || !destinationCoords) {
            console.warn('⚠️ No se pudieron geocodificar las direcciones');
            return null;
        }

        // 2️⃣ Calcular distancia real por carretera
        const result = await getDistanceBetweenCoordinates(pickupCoords, destinationCoords);

        return result;
    } catch (error) {
        console.error('❌ Error en getDistanceFromAddresses:', error);
        return null;
    }
}

/**
 * Obtiene las coordenadas de la base del vehículo
 * Esto se usa para calcular la distancia base → pickup
 */
export async function getVehicleBaseCoordinates(): Promise<Coordinates | null> {
    try {
        const response = await apiClient.get<{ latitude: number; longitude: number }>(
            '/vehicle/base-coordinates'
        );

        if (response.latitude && response.longitude) {
            return {
                latitude: response.latitude,
                longitude: response.longitude,
            };
        }

        return null;
    } catch (error) {
        console.error('❌ Error obteniendo coordenadas base:', error);
        return null;
    }
}

/**
 * Calcula todas las distancias necesarias para un viaje
 * - Distancia base → pickup
 * - Distancia pickup → destination
 */
export interface TripDistances {
    distanceBaseToPickup: number; // km
    distancePickupToDestination: number; // km
    totalDistance: number; // km
    estimatedDuration: number; // minutos
}

export async function calculateTripDistances(
    pickupLocation: string,
    destinationLocation: string
): Promise<TripDistances | null> {
    try {
        console.log('🧮 Calculando distancias del viaje...');

        // 1️⃣ Obtener coordenadas de la base
        const baseCoords = await getVehicleBaseCoordinates();
        if (!baseCoords) {
            console.warn('⚠️ No se pudieron obtener coordenadas de la base');
        }

        // 2️⃣ Geocodificar pickup
        const pickupCoords = await geocodeAddress(pickupLocation);
        if (!pickupCoords) {
            console.warn('⚠️ No se pudo geocodificar origen');
            return null;
        }

        // 3️⃣ Calcular distancia base → pickup (si tenemos base)
        let distanceBaseToPickup = 0;
        if (baseCoords) {
            const baseToPickup = await getDistanceBetweenCoordinates(baseCoords, pickupCoords);
            distanceBaseToPickup = baseToPickup?.distance || 0;
        }

        // 4️⃣ Calcular distancia pickup → destination
        const pickupToDestination = await getDistanceFromAddresses(
            pickupLocation,
            destinationLocation
        );

        if (!pickupToDestination) {
            console.warn('⚠️ No se pudo calcular distancia principal');
            return null;
        }

        const result: TripDistances = {
            distanceBaseToPickup,
            distancePickupToDestination: pickupToDestination.distance,
            totalDistance: distanceBaseToPickup + pickupToDestination.distance,
            estimatedDuration: pickupToDestination.duration,
        };

        console.log('✅ Distancias calculadas:', result);
        return result;
    } catch (error) {
        console.error('❌ Error calculando distancias del viaje:', error);
        return null;
    }
}
