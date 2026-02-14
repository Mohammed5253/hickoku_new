/**
 * Session ID utility for guest cart management
 * Generates and manages session IDs for anonymous users
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a new session ID
 */
export function generateSessionId(): string {
    return `session-${uuidv4()}`;
}

/**
 * Get session ID from cookies (client-side)
 */
export function getSessionIdFromCookie(): string | null {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie =>
        cookie.trim().startsWith('sessionId=')
    );

    if (sessionCookie) {
        return sessionCookie.split('=')[1];
    }

    return null;
}

/**
 * Set session ID in cookies (client-side)
 */
export function setSessionIdCookie(sessionId: string, days: number = 30): void {
    if (typeof window === 'undefined') return;

    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    document.cookie = `sessionId=${sessionId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get or create session ID
 * Returns existing session ID from cookie or creates a new one
 */
export function getOrCreateSessionId(): string {
    let sessionId = getSessionIdFromCookie();

    if (!sessionId) {
        sessionId = generateSessionId();
        setSessionIdCookie(sessionId);
    }

    return sessionId;
}

/**
 * Clear session ID from cookies
 */
export function clearSessionId(): void {
    if (typeof window === 'undefined') return;

    document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
