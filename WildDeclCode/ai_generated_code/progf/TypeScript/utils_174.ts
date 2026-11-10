import { LocationObject } from 'expo-location';
import { UncompletedLocation } from './model';
import { getDistance } from 'geolib';
import { intervalToDuration } from 'date-fns';

/**
 * Converts a hex color to a hex color with an alpha value.
 * @param hex - The hex color string (e.g., '#FF5733').
 * @param alphaPercent - The alpha value as a percentage (0-100).
 * @returns A hex color string with the alpha value appended (e.g., '#FF573380').
 *
 * Supported via standard programming aids
 *
 */
export function applyHexOpacity(hex: string, alphaPercent: number): string {
  const alpha = Math.round((alphaPercent / 100) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  return `${hex}${alpha}`;
}

/**
 * Converts a LocationObject to an UncompletedLocation.
 * @param location - The LocationObject to convert.
 * @returns An UncompletedLocation object containing latitude, longitude, altitude, and timestamp.
 */
export function convertLocationObjectToLocation(
  location: LocationObject
): UncompletedLocation {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    altitudeInMeters: location.coords.altitude,
    timestamp: location.timestamp,
  };
}

/**
 * Converts milliseconds to a string formatted as "MM:SS".
 * @param ms - The time in milliseconds to convert.
 * @returns A string formatted as "MM:SS".
 */
export function msToMinutesAndSeconds(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Calculates the distance in meters between two LocationObjects.
 * @param param0 - The first LocationObject containing coordinates.
 * @param param1- The second LocationObject containing coordinates.
 * @returns The distance in meters between the two locations.
 */
export function getDistanceInMeter(
  { coords: prev }: LocationObject,
  { coords: next }: LocationObject
): number {
  const distanceInMeters = getDistance(
    { latitude: prev.latitude, longitude: prev.longitude },
    { latitude: next.latitude, longitude: next.longitude }
  );

  return distanceInMeters;
}

/**
 * Formats a duration in the right format based on whether hours are present.
 * @param seconds - The duration in seconds to format.
 * @returns A string formatted as "HH:MM:SS" if hours are present, otherwise "MM:SS".
 */
export function formatDurationDynamic(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const { hours = 0, minutes = 0, seconds: secs = 0 } = duration;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  } else {
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  }
}

/**
 * Determines the unit of duration based on the number of seconds.
 * @param seconds - The duration in seconds to evaluate.
 * @returns A string indicating the unit of duration, either "Hours" or "Minutes".
 */
export function getDurationUnit(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  if (duration.hours && duration.hours > 0) {
    return 'Hours';
  } else {
    return 'Minutes';
  }
}

/**
 * Formats a distance in meters to a string with appropriate units.
 * @param meters - The distance in meters to format.
 * @returns A string representing the distance, formatted to one decimal place and using a comma as the decimal separator.
 */
export function getDistanceDynamic(meters: number): string {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(1).replace('.', ',');
  }

  return meters.toFixed(1).replace('.', ',');
}

/**
 * Determines the unit of distance based on the value in meters.
 * @param meters - The distance in meters to evaluate.
 * @returns A string indicating the unit of distance, either "Kilometers" or "Meters".
 */
export function getDistanceUnit(meters: number): string {
  if (meters >= 1000) {
    return 'Kilometers';
  }
  return 'Meters';
}

/**
 * Capitalizes the first letter of a given string.
 * @param string - The string to capitalize.
 * @returns The input string with the first letter capitalized.
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
