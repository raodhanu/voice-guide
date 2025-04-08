import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Place } from "components/GoogleMap";
import ErrorBoundary from "./ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LocationType, DirectionsInfoType, LocationQueryResponseType, TravelMode } from "utils/types";

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

  const [travelMode, setTravelMode] = useState<TravelMode>(TravelMode.DRIVING);
  const [directionOptions, setDirectionOptions] = useState<any>(null);
  
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  // Completely remove directions functionality to avoid errors
  useEffect(() => {
    setDirectionOptions(null);
  }, []);

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
      <div className={`bg-gradient-to-br from-white dark:from-gray-900 to-amber-50/30 dark:to-amber-950/20 rounded-xl shadow-md overflow-hidden backdrop-blur-sm relative ${className}`}>
        {/* Decorative pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(60deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`, backgroundSize: '25px 25px' }}></div>
        </div>
        
        {/* Arabic-inspired decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-br from-amber-100/10 to-transparent"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-tl-3xl bg-amber-200/10 transform rotate-45"></div>
        
        {/* Decorative top border inspired by Arabic patterns */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="p-6 h-64 flex items-center justify-center relative">
          {/* Decorative corner element */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M64 0H32v32H0v32h64V0z" fill="currentColor"/>
            </svg>
          </div>
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-inner opacity-70 animate-pulse"></div>
              <div className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary border-t-transparent animate-spin shadow-md"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-100/50"></div>
              <div className="absolute -bottom-2 -left-1 w-5 h-5 rounded-full bg-amber-100/30"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 animate-pulse mt-4 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full shadow-sm border border-amber-100/20 dark:border-amber-800/20">
              Loading location data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className={`bg-gradient-to-br from-white dark:from-gray-900 to-amber-50/30 dark:to-amber-950/20 rounded-xl shadow-md overflow-hidden relative ${className}`}>
        {/* Decorative pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 30px)`, backgroundSize: '40px 40px' }}></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-tl-3xl bg-amber-200/10 transform rotate-45"></div>
        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-br from-amber-100/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary/5 to-transparent opacity-30"></div>
        
        {/* Decorative top border inspired by Arabic patterns */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="p-8 text-center relative">
          {/* Arabic-inspired pattern elements */}
          <div className="absolute top-10 right-10 w-16 h-16 opacity-5" style={{ 
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '10px 10px'
          }}></div>
          
          {/* Map icon with Arabic-inspired design */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shadow-md relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 rounded-full border border-amber-200/50"></div>
            <div className="absolute inset-1 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-300"></div>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500 group-hover:scale-110 transition-transform duration-300">
              <path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200 group relative inline-block">
            Explore Dubai
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 max-w-sm mx-auto leading-relaxed">Ask about places in Dubai to see them on the map.</p>
          
          <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-amber-100/50 dark:border-amber-800/30 max-w-sm mx-auto shadow-sm relative overflow-hidden">
            {/* Decorative corner element */}
            <div className="absolute top-0 left-0 w-6 h-6 overflow-hidden">
              <div className="absolute transform -rotate-45 bg-gradient-to-br from-amber-100/30 to-transparent w-8 h-8 -top-4 -left-4"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Try asking: <span className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer">"Show me the Burj Khalifa"</span> or <span className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer">"How do I get from Dubai Mall to Palm Jumeirah?"</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { locations, directions, map_center, zoom_level } = locationData;

  return (
    <div className={`bg-gradient-to-br from-white dark:from-gray-900 to-amber-50/20 dark:to-amber-950/20 rounded-xl shadow-md overflow-hidden relative ${className}`}>
      {/* Decorative pattern background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(60deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`, backgroundSize: '30px 30px' }}></div>
      </div>
      
      {/* Arabic-inspired decorative corner elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-tl-3xl bg-amber-200/10 transform rotate-45"></div>
      <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-br from-amber-100/10 to-transparent"></div>
      
      {/* Decorative top border inspired by Arabic patterns */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      {/* Map container */}
      <div className="w-full h-[300px] mb-4 relative shadow-inner overflow-hidden dark:shadow-gray-900">
        {/* Decorative overlay for map edges */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-white/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-white/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-white/30 to-transparent z-10 pointer-events-none"></div>
        <ErrorBoundary fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-100/20 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 mx-auto mb-3 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-1 font-medium">Map unavailable</p>
              <p className="text-sm text-gray-500">Please try again later</p>
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
            directionsOptions={directionOptions}
          />
        </ErrorBoundary>
      </div>

      {/* Location details */}
      <div className="p-5 relative">
        {/* Decorative corner element */}
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M96 0C96 53.0203 53.0203 96 0 96V0H96Z" fill="currentColor"/>
          </svg>
        </div>
        {selectedPlace && (
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 backdrop-blur-sm border border-amber-100/50 dark:border-amber-800/30 shadow-sm relative overflow-hidden mb-4">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-6 h-6 overflow-hidden">
              <div className="absolute transform -rotate-45 bg-gradient-to-br from-amber-100/30 to-transparent w-8 h-8 -top-4 -left-4"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M96 0C96 53.0203 53.0203 96 0 96V0H96Z" fill="currentColor"/>
              </svg>
            </div>
            
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shadow-sm relative">
                <div className="absolute inset-0 rounded-full border border-amber-200/50"></div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                  <path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-medium mb-1 text-gray-800 group relative inline-block">
                  {selectedPlace.name}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </h3>
                
                {selectedPlace.category && (
                  <div className="inline-block px-3 py-1 text-xs rounded-full bg-gradient-to-r from-secondary/30 to-primary/10 text-primary mb-2 mt-1 border border-secondary/20 shadow-sm">
                    {selectedPlace.category}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed pl-11">{selectedPlace.description}</p>
          </div>
        )}

        {/* Directions functionality has been removed */}

        {/* Other locations */}
        {locations.length > 1 && !directions && (
          <>
            <div className="my-4"></div>
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center shadow-sm relative">
                <div className="absolute inset-0 rounded-full border border-indigo-200/50"></div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
                  <path d="M7.5 4.5H16.5C17.12 4.5 17.67 4.82 18 5.29C18.33 5.76 18.33 6.36 18 6.83L13.5 13V18L10.5 15V13L6 6.83C5.67 6.36 5.67 5.76 6 5.29C6.33 4.82 6.88 4.5 7.5 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 relative inline-block">
                Other Locations:
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-200 transform scale-x-100 transition-transform duration-300"></span>
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {locations
                .filter((place) => place.id !== selectedPlace?.id)
                .map((place) => (
                  <button
                    key={place.id}
                    className="text-left p-3 rounded-lg transition-all duration-300 text-sm relative overflow-hidden group bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-amber-100/30 hover:border-amber-200/50 hover:shadow-sm"
                    onClick={() => setSelectedPlace(place)}
                  >
                    {/* Arabic-inspired decorative corner element */}
                    <div className="absolute top-0 right-0 w-5 h-5 overflow-hidden opacity-70">
                      <div className="absolute transform rotate-45 bg-gradient-to-br from-amber-100/40 to-transparent w-5 h-5 -top-2.5 -right-2.5 group-hover:bg-gradient-to-br group-hover:from-amber-200/40"></div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-amber-100/50 mr-2 group-hover:bg-amber-100 transition-colors duration-300 flex-shrink-0"></div>
                      <span className="relative z-10 transition-colors duration-300 group-hover:text-gray-800">{place.name}</span>
                    </div>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-100/0 via-white/30 to-amber-100/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
