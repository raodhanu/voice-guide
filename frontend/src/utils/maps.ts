// Singleton for Google Maps API loading

import brain from "brain";

// Define libraries array outside component to avoid performance warnings
export const mapLibraries = ["places", "directions"];

// Dubai center coordinates
export const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 };

// A singleton promise that fetches the API key once
let apiKeyPromise: Promise<string> | null = null;

export function getGoogleMapsApiKey(): Promise<string> {
  if (!apiKeyPromise) {
    apiKeyPromise = new Promise((resolve, reject) => {
      brain.get_google_maps_api_key()
        .then(response => response.json())
        .then(data => {
          if (data.api_key) {
            resolve(data.api_key);
          } else {
            reject(new Error(data.error || "Failed to load Google Maps API key"));
          }
        })
        .catch(error => {
          reject(new Error("Error fetching Google Maps API key"));
        });
    });
  }
  
  return apiKeyPromise;
}
