import type { Trip, TripInput } from '../models/types';

const STORAGE_KEY = 'cv_trips';

function readRaw(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    return [];
  }
}

function writeRaw(trips: Trip[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

/** Returns all trips sorted by visitDate descending. */
export function getTrips(): Trip[] {
  return readRaw().sort((a, b) => (b.visitDate ?? '').localeCompare(a.visitDate ?? ''));
}

/** Creates a new trip, persists it, and returns it. */
export function addTrip(input: TripInput): Trip {
  const trips = readRaw();
  const now = new Date().toISOString();
  const trip: Trip = {
    id: crypto.randomUUID(),
    countryCode: input.countryCode,
    countryName: input.countryName,
    cities: input.cities,
    visitDate: input.visitDate,
    note: input.note,
    createdAt: now,
    updatedAt: now,
  };
  trips.push(trip);
  writeRaw(trips);
  return trip;
}

/** Updates an existing trip. Throws if id not found. */
export function updateTrip(id: string, input: TripInput): Trip {
  const trips = readRaw();
  const idx = trips.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`Trip not found: ${id}`);
  const updated: Trip = {
    ...trips[idx],
    countryCode: input.countryCode,
    countryName: input.countryName,
    cities: input.cities,
    visitDate: input.visitDate,
    note: input.note,
    updatedAt: new Date().toISOString(),
  };
  trips[idx] = updated;
  writeRaw(trips);
  return updated;
}

/** Removes a trip by id. No-op if not found. */
export function deleteTrip(id: string): void {
  const trips = readRaw();
  writeRaw(trips.filter((t) => t.id !== id));
}

/** Returns the full trip array as a pretty-printed JSON string. */
export function exportJSON(): string {
  const trips = readRaw();
  return JSON.stringify(trips, null, 2);
}

/** Overwrites all trips with imported JSON data. Throws on invalid input. */
export function importJSON(json: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid import: the file is not valid JSON.');
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid import: expected a JSON array of trips.');
  }
  writeRaw(parsed as Trip[]);
}
