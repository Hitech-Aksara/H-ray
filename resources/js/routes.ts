/**
 * Route helper functions for type-safe URL generation
 */

export function home(): string {
    return '/';
}

export function dashboard(): string {
    return '/dashboard';
}

export function login(): string {
    return '/login';
}

export function register(): string {
    return '/register';
}

export function logout(): string {
    return '/logout';
}

export function forgotPassword(): string {
    return '/forgot-password';
}

export function resetPassword(): string {
    return '/reset-password';
}

export function verifyEmail(): string {
    return '/verify-email';
}
