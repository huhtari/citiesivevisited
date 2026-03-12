import { useState, useCallback } from 'react';
import {
  getTrips,
  addTrip as serviceAdd,
  updateTrip as serviceUpdate,
  deleteTrip as serviceDelete,
} from '../services/trips';
import type { Trip, TripInput } from '../models/types';

interface UseTripsResult {
  trips: Trip[];
  addTrip: (input: TripInput) => Trip;
  updateTrip: (id: string, input: TripInput) => Trip;
  deleteTrip: (id: string) => void;
  reload: () => void;
}

export function useTrips(): UseTripsResult {
  const [trips, setTrips] = useState<Trip[]>(() => getTrips());

  const reload = useCallback(() => {
    setTrips(getTrips());
  }, []);

  const addTrip = useCallback((input: TripInput): Trip => {
    const trip = serviceAdd(input);
    setTrips(getTrips());
    return trip;
  }, []);

  const updateTrip = useCallback((id: string, input: TripInput): Trip => {
    const trip = serviceUpdate(id, input);
    setTrips(getTrips());
    return trip;
  }, []);

  const deleteTrip = useCallback((id: string): void => {
    serviceDelete(id);
    setTrips(getTrips());
  }, []);

  return { trips, addTrip, updateTrip, deleteTrip, reload };
}
