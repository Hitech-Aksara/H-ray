import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';

interface UseFilterOptions {
    baseUrl: string;
    initialFilters?: Record<string, string | null>;
    excludeFromReset?: string[];
}

interface UseFilterReturn<T extends Record<string, string>> {
    filters: T;
    setFilter: (key: keyof T, value: string) => void;
    handleFilterChange: (key: keyof T, value: string, allValue?: string) => void;
}

export function useFilter<T extends Record<string, string>>({
    baseUrl,
    initialFilters = {},
    excludeFromReset = ['page'],
}: UseFilterOptions): UseFilterReturn<T> {
    const [filters, setFilters] = useState<T>(() => {
        const params = new URLSearchParams(window.location.search);
        const initial: Record<string, string> = {};

        Object.keys(initialFilters).forEach((key) => {
            initial[key] = params.get(key) || initialFilters[key] || 'all';
        });

        return initial as T;
    });

    const setFilter = useCallback((key: keyof T, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleFilterChange = useCallback(
        (key: keyof T, value: string, allValue = 'all') => {
            // Update local state
            setFilters((prev) => ({ ...prev, [key]: value }));

            // Build payload preserving other params
            const currentParams = new URLSearchParams(window.location.search);
            const dataPayload: Record<string, string> = {};

            currentParams.forEach((val, paramKey) => {
                if (!Object.keys(filters).includes(paramKey) && !excludeFromReset.includes(paramKey)) {
                    dataPayload[paramKey] = val;
                }
            });

            // Add current filters
            Object.entries(filters).forEach(([filterKey, filterValue]) => {
                if (filterKey === key) {
                    if (value !== allValue) dataPayload[filterKey] = value;
                } else {
                    if (filterValue !== allValue) dataPayload[filterKey] = filterValue;
                }
            });

            router.get(baseUrl, dataPayload, { preserveState: true, preserveScroll: true });
        },
        [baseUrl, filters, excludeFromReset]
    );

    return { filters, setFilter, handleFilterChange };
}
