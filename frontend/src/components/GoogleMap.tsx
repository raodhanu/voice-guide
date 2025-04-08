import React, { useState, useMemo, useEffect, useRef } from "react";
import { GoogleMap as ReactGoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getGoogleMapsApiKey, mapLibraries, DUBAI_CENTER } from "utils/maps";

export interface DirectionsOptions {
  /** Origin of the route */

  origin: { location: { lat: number; lng: number }; name: string };
  destination: { location: { lat: number; lng: number }; name: string };
  /** Travel mode for directions - defaults to DRIVING */
  travelMode?: google.maps.TravelMode;
}

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
  // No longer using directions prop to avoid errors
  // directions?: google.maps.DirectionsResult | null;
  directionsOptions?: DirectionsOptions;
  onPlaceSelect?: (place: Place) => void;
  className?: string;
}

// This component handles displaying a loading state when the map isn't ready
function MapLoadingState({ className }: { className?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`}>
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
}

// This component handles displaying an error state
function MapErrorState({ className, errorMessage = "Error loading maps" }: { className?: string; errorMessage?: string }) {
  // Check specifically for RefererNotAllowedMapError
  const isRefererError = errorMessage && errorMessage.includes("RefererNotAllowedMapError");
  
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`}>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M11.9945 16H12.0035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Sorry! Something went wrong.</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {isRefererError 
            ? "This page didn't load Google Maps correctly because the API key is not authorized for this domain. See the JavaScript console for technical details." 
            : errorMessage}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {isRefererError && (
            <p>The API key needs to be configured to allow access from: <br />
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-xs">https://sumanrao.databutton.app</code></p>
          )}
        </div>
      </div>
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
  // directions = null,
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
  
  // Directions functionality is disabled

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: mapLibraries,
  });

  // Calculate appropriate map zoom - simplified without directions
  const mapZoom = useMemo(() => {
    return zoom;
  }, [zoom]);
  
  // Directions functionality is disabled

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
    // Log the error in detail
    console.error("Google Maps load error:", loadError);
    // Handle RefererNotAllowedMapError more explicitly
    if (loadError.message.includes("RefererNotAllowedMapError")) {
      console.warn("Google Maps API key is not authorized for this domain. Please update API key restrictions in Google Cloud Console to include: https://sumanrao.databutton.app");
    }
    return <MapErrorState className={className} errorMessage={loadError.message} />;
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

      {/* Directions functionality is disabled */}
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
