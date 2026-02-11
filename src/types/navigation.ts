/**
 * Tipos para la navegación
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Tipos para el Stack Principal
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: NavigatorScreenParams<MainTabParamList>;
    SearchDestination: undefined;
    TripPreview: {
        origin: LocationCoordinates;
        destination: LocationCoordinates;
    };
    TripTracking: {
        tripId: string;
    };
};

// Tipos para los Tabs
export type MainTabParamList = {
    Home: undefined;
    Activity: undefined;
    Profile: undefined;
};

// Tipo para coordenadas de ubicación
export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    address?: string;
}

// Tipo para información de viaje
export interface TripInfo {
    id: string;
    origin: LocationCoordinates;
    destination: LocationCoordinates;
    distance: number; // en metros
    duration: number; // en segundos
    price: number; // en euros
    vehicleType: 'economy' | 'premium' | 'luxury';
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
