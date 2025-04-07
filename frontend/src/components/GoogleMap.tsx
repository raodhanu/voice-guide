import React, { useState, useMemo, useEffect, useRef } from "react";
import { GoogleMap as ReactGoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { getGoogleMapsApiKey, mapLibraries, DUBAI_CENTER } from "utils/maps";

export interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  description?: string;
  category?: string;
  image?: string;
}

interface Props {
  center?: { lat: number; lng: number };
  zoom?: number;
  places?: Place[];
  selectedPlaceId?: string;
  directions?: google.maps.DirectionsResult | null;
  onPlaceSelect?: (place: Place) => void;
  className?: string;
}

// This component handles displaying a loading state when the map isn't ready
function MapLoadingState({ className }: { className?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center rounded-xl bg-gray-100 ${className}`}>
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
}

// This component handles displaying an error state
function MapErrorState({ className, errorMessage = "Error loading maps" }: { className?: string; errorMessage?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center rounded-xl bg-gray-100 ${className}`}>
      <p className="text-red-500">{errorMessage}</p>
    </div>
  );
}

// This component renders the actual map when loaded
function LoadedGoogleMap({
  apiKey,
  center = DUBAI_CENTER,
  zoom = 11,
  places = [],
  selectedPlaceId,
  directions = null,
  onPlaceSelect,
  className = "",
}: Props & { apiKey: string }) {
  // All state hooks at the top
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Set the selected place when the selectedPlaceId changes
  useEffect(() => {
    if (selectedPlaceId) {
      const place = places.find((p) => p.id === selectedPlaceId);
      if (place) {
        setSelectedPlace(place);
      }
    }
  }, [selectedPlaceId, places]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: mapLibraries,
  });

  // Calculate appropriate map zoom based on directions
  const mapZoom = useMemo(() => {
    if (directions) {
      return 12; // Slightly zoomed out when showing directions
    }
    return zoom;
  }, [directions, zoom]);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    styles: [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#dedede" }, { lightness: 21 }],
      },
    ],
  }), []);

  if (loadError) {
    return <MapErrorState className={className} />;
  }

  if (!isLoaded) {
    return <MapLoadingState className={className} />;
  }

  return (
    <ReactGoogleMap
      mapContainerClassName={`w-full h-full rounded-xl ${className}`}
      center={center}
      zoom={mapZoom}
      options={mapOptions}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {/* Render all place markers */}
      {places.map((place) => (
        <Marker
          key={place.id}
          position={place.location}
          onClick={() => {
            setSelectedPlace(place);
            if (onPlaceSelect) onPlaceSelect(place);
          }}
          icon={{
            url:
              place.category === "historical"
                ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : place.category === "beach"
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : place.category === "shopping"
                ? "https://maps.google.com/mapfiles/ms/icons/dollar.png"
                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(32, 32),
          }}
        />
      ))}

      {/* Render InfoWindow for selected place */}
      {selectedPlace && (
        <InfoWindow
          position={selectedPlace.location}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="max-w-xs">
            <h3 className="font-medium text-base mb-1">{selectedPlace.name}</h3>
            {selectedPlace.image && (
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-full h-24 object-cover mb-2 rounded"
              />
            )}
            <p className="text-sm text-gray-600">{selectedPlace.description}</p>
          </div>
        </InfoWindow>
      )}

      {/* Render directions if available */}
      {directions && <DirectionsRenderer directions={directions} />}
    </ReactGoogleMap>
  );
}

// Main component that handles API key loading and renders the map when ready
export function GoogleMap(props: Props) {
  // Always define all hooks at the top level
  const [apiKey, setApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  // Fetch API key once on component mount
  useEffect(() => {
    let isMounted = true;
    
    getGoogleMapsApiKey()
      .then(key => {
        if (!isMounted) return;
        setApiKey(key);
      })
      .catch(error => {
        if (!isMounted) return;
        setApiKeyError(error.message);
        console.error("Error fetching Google Maps API key:", error);
      });
      
    return () => { isMounted = false; };
  }, []);
  
  // Handle error state
  if (apiKeyError) {
    return <MapErrorState className={props.className} errorMessage={apiKeyError} />;
  }
  
  // Handle loading state
  if (!apiKey) {
    return <MapLoadingState className={props.className} />;
  }
  
  // When API key is loaded, render the actual map
  return <LoadedGoogleMap apiKey={apiKey} {...props} />;
}
