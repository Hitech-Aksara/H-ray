/**
 * Format a number as currency
 */
export function formatCurrency(amount: number | null, currency = 'USD', locale = 'en-US'): string {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Format a date string to readable format
 */
export function formatDate(
    dateString: string | null,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    },
    locale = 'en-US'
): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString(locale, options);
}

/**
 * Format a date string to short format (e.g., Jan 15, 2024)
 */
export function formatDateShort(dateString: string | null, locale = 'en-US'): string {
    return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' }, locale);
}
