import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  exportJSON,
  importJSON,
} from './trips';
import type { TripInput } from '../models/types';

const SAMPLE_INPUT: TripInput = {
  countryCode: 'JP',
  countryName: 'Japan',
  cities: ['Tokyo', 'Kyoto'],
  visitDate: '2023-04',
  note: 'Cherry blossom season.',
};

beforeEach(() => {
  localStorage.clear();
});

describe('getTrips', () => {
  it('returns empty array when localStorage has no data', () => {
    expect(getTrips()).toEqual([]);
  });

  it('returns sorted trips by visitDate descending', () => {
    addTrip({ ...SAMPLE_INPUT, visitDate: '2020-01' });
    addTrip({ ...SAMPLE_INPUT, countryCode: 'FR', countryName: 'France', visitDate: '2023-06' });
    addTrip({ ...SAMPLE_INPUT, countryCode: 'DE', countryName: 'Germany', visitDate: '2021-09' });
    const trips = getTrips();
    expect(trips[0].visitDate).toBe('2023-06');
    expect(trips[1].visitDate).toBe('2021-09');
    expect(trips[2].visitDate).toBe('2020-01');
  });

  it('returns [] and does not throw when localStorage contains invalid JSON', () => {
    localStorage.setItem('cv_trips', 'not-json');
    expect(getTrips()).toEqual([]);
  });
});

describe('addTrip', () => {
  it('persists a new trip and returns it with id and timestamps', () => {
    const trip = addTrip(SAMPLE_INPUT);
    expect(trip.id).toBeTruthy();
    expect(trip.countryCode).toBe('JP');
    expect(trip.cities).toEqual(['Tokyo', 'Kyoto']);
    expect(trip.createdAt).toBeTruthy();
    expect(trip.updatedAt).toBeTruthy();
  });

  it('can store multiple trips', () => {
    addTrip(SAMPLE_INPUT);
    addTrip({ ...SAMPLE_INPUT, countryCode: 'FR', countryName: 'France' });
    expect(getTrips()).toHaveLength(2);
  });
});

describe('updateTrip', () => {
  it('updates an existing trip and refreshes updatedAt', () => {
    const original = addTrip(SAMPLE_INPUT);
    const updated = updateTrip(original.id, { ...SAMPLE_INPUT, note: 'Updated note' });
    expect(updated.note).toBe('Updated note');
    expect(updated.id).toBe(original.id);
    expect(updated.createdAt).toBe(original.createdAt);
  });

  it('throws when trip id is not found', () => {
    expect(() => updateTrip('nonexistent-id', SAMPLE_INPUT)).toThrow();
  });
});

describe('deleteTrip', () => {
  it('removes a trip by id', () => {
    const trip = addTrip(SAMPLE_INPUT);
    deleteTrip(trip.id);
    expect(getTrips()).toHaveLength(0);
  });

  it('is a no-op when id is not found', () => {
    addTrip(SAMPLE_INPUT);
    expect(() => deleteTrip('nonexistent-id')).not.toThrow();
    expect(getTrips()).toHaveLength(1);
  });
});

describe('exportJSON', () => {
  it('returns a valid JSON string of all trips', () => {
    addTrip(SAMPLE_INPUT);
    const json = exportJSON();
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].countryCode).toBe('JP');
  });

  it('returns "[]" when no trips', () => {
    expect(exportJSON()).toBe('[]');
  });
});

describe('importJSON', () => {
  it('overwrites existing trips with imported data', () => {
    addTrip(SAMPLE_INPUT);
    const newData = [{ ...addTrip({ ...SAMPLE_INPUT, countryCode: 'FR', countryName: 'France' }) }];
    localStorage.clear();
    importJSON(JSON.stringify(newData));
    const trips = getTrips();
    expect(trips).toHaveLength(1);
    expect(trips[0].countryCode).toBe('FR');
  });

  it('throws a user-readable error for invalid JSON', () => {
    expect(() => importJSON('not-json')).toThrow(/invalid/i);
  });

  it('throws when the JSON is not an array', () => {
    expect(() => importJSON('{"key":"value"}')).toThrow(/invalid/i);
  });
});
