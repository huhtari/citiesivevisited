import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrips } from './useTrips';
import { addTrip as serviceAddTrip } from '../services/trips';
import type { TripInput } from '../models/types';

const SAMPLE_INPUT: TripInput = {
  countryCode: 'JP',
  countryName: 'Japan',
  cities: ['Tokyo'],
  visitDate: '2023-04',
  note: '',
};

describe('useTrips', () => {
  it('returns an empty trips array when localStorage is empty', () => {
    const { result } = renderHook(() => useTrips());
    expect(result.current.trips).toEqual([]);
  });

  it('loads existing trips from localStorage on mount', () => {
    serviceAddTrip(SAMPLE_INPUT);
    const { result } = renderHook(() => useTrips());
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].countryCode).toBe('JP');
  });

  it('addTrip adds a trip and re-renders with updated list', () => {
    const { result } = renderHook(() => useTrips());
    act(() => {
      result.current.addTrip(SAMPLE_INPUT);
    });
    expect(result.current.trips).toHaveLength(1);
  });

  it('updateTrip updates a trip and re-renders', () => {
    const { result } = renderHook(() => useTrips());
    act(() => {
      result.current.addTrip(SAMPLE_INPUT);
    });
    const id = result.current.trips[0].id;
    act(() => {
      result.current.updateTrip(id, { ...SAMPLE_INPUT, note: 'Updated' });
    });
    expect(result.current.trips[0].note).toBe('Updated');
  });

  it('deleteTrip removes a trip and re-renders', () => {
    const { result } = renderHook(() => useTrips());
    act(() => {
      result.current.addTrip(SAMPLE_INPUT);
    });
    const id = result.current.trips[0].id;
    act(() => {
      result.current.deleteTrip(id);
    });
    expect(result.current.trips).toHaveLength(0);
  });
});
