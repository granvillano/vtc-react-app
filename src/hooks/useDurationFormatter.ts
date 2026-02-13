import { useCallback } from 'react';

export const useDurationFormatter = () => {
    const formatDuration = useCallback((minutes?: number | null) => {
        if (minutes === undefined || minutes === null) return '—';
        const safeMinutes = Math.max(0, Math.ceil(minutes));
        const hours = Math.floor(safeMinutes / 60);
        const remainingMinutes = safeMinutes % 60;

        if (hours <= 0) {
            return `${remainingMinutes} min`;
        }

        const paddedMinutes = remainingMinutes.toString().padStart(2, '0');
        return `${hours}:${paddedMinutes} H`;
    }, []);

    return { formatDuration };
};
