// Type definitions for the location data from the API

export interface LocationType {
  id: string;
  name: string;
  category: string;
  location: { lat: number; lng: number };
  description: string;
  image_url?: string;
}

export interface DirectionsInfoType {
  origin: LocationType;
  destination: LocationType;
  distance_text: string;
  duration_text: string;
  steps: string[];
}

export interface LocationQueryResponseType {
  locations: LocationType[];
  primary_location?: string;
  directions?: DirectionsInfoType;
  map_center: { lat: number; lng: number };
  zoom_level: number;
}
