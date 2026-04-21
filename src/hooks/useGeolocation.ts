"use client";
import { useState, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation is not supported" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: error.message || "Failed to get location",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, requestLocation };
}
