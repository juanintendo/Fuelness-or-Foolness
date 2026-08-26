import { AgentValidationError, AgentValidationResult } from './types';

/**
 * Validates and clamps a numeric score within the specified range [min, max].
 * Records an error if the value is non-numeric.
 */
export function validateNumberRange(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
  fieldName: string,
  errors: AgentValidationError[]
): number {
  if (value === null || value === undefined || value === '') {
    errors.push({ field: fieldName, message: `Field is required, received ${value}`, receivedValue: value });
    return fallback;
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    errors.push({ field: fieldName, message: `Expected number, received ${typeof value}`, receivedValue: value });
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(num)));
}

/**
 * Validates a string value against an allowed set of enum values.
 * Records an error if the value is not recognized.
 */
export function validateEnumField<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fallback: T,
  fieldName: string,
  errors: AgentValidationError[]
): T {
  if (typeof value === 'string' && (allowedValues as readonly string[]).includes(value)) {
    return value as T;
  }
  errors.push({
    field: fieldName,
    message: `Expected one of [${allowedValues.join(', ')}], received "${String(value)}"`,
    receivedValue: value
  });
  return fallback;
}

/**
 * Validates and normalizes string array fields.
 */
export function validateStringArray(
  value: unknown,
  fallback: string[] = []
): string[] {
  if (Array.isArray(value)) {
    return value.map(item => (typeof item === 'string' ? item : String(item)));
  }
  return fallback;
}
