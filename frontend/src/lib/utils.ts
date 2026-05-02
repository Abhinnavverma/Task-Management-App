import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Type guard to check if an unknown error object matches the standard
 * RTK Query FetchBaseQueryError containing your backend's custom { error: string } payload
 */
export function isApiError(
    error: unknown
): error is FetchBaseQueryError & { data: { error: string } } {
    return (
        typeof error === 'object' &&
        error != null &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data != null &&
        'error' in error.data
    );
}
