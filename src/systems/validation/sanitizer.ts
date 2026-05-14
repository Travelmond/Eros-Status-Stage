/**
 * Input Sanitization & Validation
 * Security utilities for Eros Status Stage
 */

/**
 * Dangerous property patterns that could enable prototype pollution
 */
const DANGEROUS_PATTERNS = [
    '__proto__',
    'constructor',
    'prototype',
];

/**
 * Sanitizes user input to prevent prototype pollution attacks
 * @param input - The input value to sanitize
 * @param maxLength - Maximum allowed string length
 * @returns Sanitized string or empty string
 */
export function sanitizeInput(input: unknown, maxLength: number = 500): string {
    if (typeof input === 'undefined' || input === null) {
        return '';
    }

    // Convert to string
    let str = String(input);

    // Check for dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
        if (str.toLowerCase().includes(pattern.toLowerCase())) {
            console.warn(`[Sanitizer] Blocked dangerous input: ${pattern}`);
            return '';
        }
    }

    // Trim and truncate
    str = str.trim().slice(0, maxLength);

    // Remove potentially dangerous characters
    // Allow basic punctuation but block script injection attempts
    str = str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/data:/gi, '');

    return str;
}

/**
 * Validates a progress value is within 0-100 range
 * @param value - The value to validate
 * @returns Clamped value between 0 and 100
 */
export function validateProgressValue(value: unknown): number {
    if (typeof value !== 'number' || isNaN(value)) {
        return 0;
    }
    return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Validates and sanitizes an object for state updates
 * @param data - The data object to sanitize
 * @returns Sanitized object safe for state merge
 */
export function sanitizeObject<T extends Record<string, unknown>>(
    data: unknown,
    allowedKeys: string[]
): Partial<T> {
    if (!data || typeof data !== 'object') {
        return {};
    }

    const result: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const key of Object.keys(obj)) {
        // Check for dangerous keys
        if (DANGEROUS_PATTERNS.some(p => key.toLowerCase() === p.toLowerCase())) {
            console.warn(`[Sanitizer] Blocked dangerous key: ${key}`);
            continue;
        }

        // Only allow whitelisted keys
        if (!allowedKeys.includes(key)) {
            continue;
        }

        const value = obj[key];

        // Recursively sanitize nested objects
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result[key] = sanitizeObject(value, allowedKeys);
        } else if (typeof value === 'string') {
            result[key] = sanitizeInput(value);
        } else if (typeof value === 'number') {
            result[key] = validateProgressValue(value);
        } else if (typeof value === 'boolean') {
            result[key] = value;
        }
    }

    return result as Partial<T>;
}

/**
 * Validates state integrity - ensures state has required structure
 * @param state - The state object to validate
 * @returns true if valid, false otherwise
 */
export function validateStateIntegrity(state: unknown): boolean {
    if (!state || typeof state !== 'object') {
        return false;
    }

    const s = state as Record<string, unknown>;

    // Check required top-level properties
    const required = [
        'progression',
        'system',
        'location',
        'clothing',
        'body',
        'sexModule',
        'ntrModule',
        'character',
    ];

    for (const key of required) {
        if (!(key in s)) {
            console.warn(`[Sanitizer] Missing required key: ${key}`);
            return false;
        }
    }

    // Validate progression
    if (typeof s.progression !== 'object' || s.progression === null) {
        return false;
    }

    const prog = s.progression as Record<string, unknown>;
    const validStats = [
        'affection',
        'obedience',
        'libido',
        'arousal',
        'trust',
        'corruption',
        'submission',
        'jealousy',
        'embarrassment',
    ];

    for (const stat of validStats) {
        if (typeof prog[stat] !== 'number') {
            console.warn(`[Sanitizer] Invalid progression stat: ${stat}`);
            return false;
        }
    }

    // Validate system
    if (typeof s.system !== 'object' || s.system === null) {
        return false;
    }

    const sys = s.system as Record<string, unknown>;
    if (typeof sys.day !== 'number' || typeof sys.time !== 'string') {
        console.warn('[Sanitizer] Invalid system data');
        return false;
    }

    // Validate sexModule
    if (typeof s.sexModule !== 'object' || s.sexModule === null) {
        return false;
    }

    const sex = s.sexModule as Record<string, unknown>;
    if (typeof sex.active !== 'boolean') {
        console.warn('[Sanitizer] Invalid sexModule data');
        return false;
    }

    return true;
}

/**
 * Validates a time string format (HH:MM)
 * @param time - Time string to validate
 * @returns Valid time string or default
 */
export function validateTimeString(time: unknown): string {
    if (typeof time !== 'string') {
        return '00:00';
    }

    // Basic HH:MM format validation
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
        return '00:00';
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return '00:00';
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Validates a room/location identifier
 * @param roomId - Room identifier to validate
 * @returns Sanitized room ID or default
 */
export function validateRoomId(roomId: unknown): string {
    const sanitized = sanitizeInput(roomId, 50);
    // Only allow alphanumeric, underscore, and hyphen
    return sanitized.replace(/[^a-zA-Z0-9_-]/g, '') || 'unknown';
}

/**
 * Validates scene type is one of the allowed values
 * @param sceneType - Scene type string
 * @returns Valid scene type or 'quiet'
 */
export function validateSceneType(sceneType: unknown): string {
    const validTypes = [
        'quiet',
        'conversation',
        'flirt',
        'foreplay',
        'sex',
        'aftercare',
    ];

    if (typeof sceneType !== 'string') {
        return 'quiet';
    }

    const normalized = sceneType.toLowerCase().trim();
    return validTypes.includes(normalized) ? normalized : 'quiet';
}

/**
 * Deep clone an object safely (no prototype pollution risk)
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export function safeDeepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => safeDeepClone(item)) as unknown as T;
    }

    const cloned: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
        // Skip dangerous keys
        if (DANGEROUS_PATTERNS.includes(key)) {
            continue;
        }
        cloned[key] = safeDeepClone((obj as Record<string, unknown>)[key]);
    }

    return cloned as T;
}

/**
 * Sanitizes AI response content to remove injected commands
 * @param content - Raw AI response
 * @returns Cleaned content
 */
export function sanitizeAIResponse(content: unknown): string {
    if (typeof content !== 'string') {
        return '';
    }

    // Remove Eros Status command tags (they're processed separately)
    let cleaned = content.replace(/<GET\s+\w+>/gi, '');
    cleaned = cleaned.replace(/<UPDATE\s+\w+\s+[+-]?\d+>/gi, '');
    cleaned = cleaned.replace(/<SET\s+\w+\s+\d+>/gi, '');

    // Basic XSS prevention
    cleaned = cleaned.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return cleaned;
}