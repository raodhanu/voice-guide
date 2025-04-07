import React, { useState, useEffect } from "react";
import { GoogleMap, Place } from "components/GoogleMap";
import ErrorBoundary from "./ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LocationType, DirectionsInfoType, LocationQueryResponseType } from "utils/types";

// Convert API types to component types
const mapLocationToPlace = (location: LocationType): Place => ({
  id: location.id,
  name: location.name,
  location: location.location,
  description: location.description,
  category: location.category,
  image: location.image_url
});

interface Props {
  locationData: LocationQueryResponseType | null;
  isLoading: boolean;
  className?: string;
}

export function LocationDisplay({ locationData, isLoading, className = "" }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  // Update selected place when primary location changes
  useEffect(() => {
    if (locationData?.locations && locationData.primary_location) {
      const primary = locationData.locations.find(
        (location) => location.id === locationData.primary_location
      );
      if (primary) {
        setSelectedPlace(mapLocationToPlace(primary));
      }
    }
  }, [locationData]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
        <div className="p-4 h-64 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
        <div className="p-4 text-center">
          <p className="text-gray-500">Ask about places in Dubai to see them on the map.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try: "Show me the Burj Khalifa" or "How do I get from Dubai Mall to Palm Jumeirah?"
          </p>
        </div>
      </div>
    );
  }

  const { locations, directions, map_center, zoom_level } = locationData;

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {/* Map container */}
      <div className="w-full h-[300px] mb-4">
        <ErrorBoundary fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <p className="text-gray-500 mb-1">Map unavailable</p>
              <p className="text-sm text-gray-400">Please try again later</p>
            </div>
          </div>
        }>
          <GoogleMap
            center={map_center}
            zoom={zoom_level}
            places={locations.map(mapLocationToPlace)}
            selectedPlaceId={selectedPlace?.id}
            onPlaceSelect={setSelectedPlace}
            className="h-full w-full"
          />
        </ErrorBoundary>
      </div>

      {/* Location details */}
      <div className="p-4">
        {selectedPlace && (
          <div>
            <h3 className="text-lg font-medium mb-1">{selectedPlace.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{selectedPlace.description}</p>
            
            {selectedPlace.category && (
              <div className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-primary mb-3">
                {selectedPlace.category}
              </div>
            )}
          </div>
        )}

        {/* Directions */}
        {directions && (
          <>
            <Separator className="my-3" />
            <div>
              <h4 className="font-medium mb-2">Directions</h4>
              <div className="flex justify-between mb-2 text-sm">
                <span>
                  <span className="font-medium">From:</span> {directions.origin.name}
                </span>
                <span>
                  <span className="font-medium">To:</span> {directions.destination.name}
                </span>
              </div>
              <div className="flex justify-between mb-3 text-sm text-primary font-medium">
                <span>{directions.distance_text}</span>
                <span>{directions.duration_text}</span>
              </div>
              
              <div className="text-sm">
                <h5 className="font-medium mb-1">Steps:</h5>
                <ol className="space-y-1 ml-4 list-decimal">
                  {directions.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}

        {/* Other locations */}
        {locations.length > 1 && !directions && (
          <>
            <Separator className="my-3" />
            <h4 className="font-medium mb-2">Other Locations:</h4>
            <div className="grid grid-cols-2 gap-2">
              {locations
                .filter((place) => place.id !== selectedPlace?.id)
                .map((place) => (
                  <button
                    key={place.id}
                    className="text-left p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                    onClick={() => setSelectedPlace(place)}
                  >
                    {place.name}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
