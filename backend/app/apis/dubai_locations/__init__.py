from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import databutton as db
import json

router = APIRouter(prefix="/dubai-locations")

# Define CORS headers
def add_cors_headers(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, X-CSRF-Token"
    return response

# Pydantic models for request and response
class LocationQueryRequest(BaseModel):
    query: str = Field(..., description="The user's query about a location in Dubai")
    current_location: Optional[Dict[str, float]] = Field(None, description="The user's current location (lat/lng) if available")

class Location(BaseModel):
    id: str
    name: str
    category: str
    location: Dict[str, float]
    description: str
    image_url: Optional[str] = None

class DirectionsInfo(BaseModel):
    origin: Location
    destination: Location
    distance_text: str
    duration_text: str
    steps: List[str]

class LocationQueryResponse(BaseModel):
    locations: List[Location] = Field(default_factory=list)
    primary_location: Optional[str] = None
    directions: Optional[DirectionsInfo] = None
    map_center: Dict[str, float] = Field(default={"lat": 25.2048, "lng": 55.2708})
    zoom_level: int = 11

# Dubai popular locations database (hardcoded for simplicity)
DUBAI_LOCATIONS = [
    {
        "id": "burj-khalifa",
        "name": "Burj Khalifa",
        "category": "attraction",
        "location": {"lat": 25.197197, "lng": 55.274376},
        "description": "The world's tallest building, standing at 828 meters with 163 floors. Features observation decks, restaurants, and offices.",
        "image_url": "https://images.unsplash.com/photo-1582672060674-bc2bd808a8ce"
    },
    {
        "id": "dubai-mall",
        "name": "The Dubai Mall",
        "category": "shopping",
        "location": {"lat": 25.198765, "lng": 55.279533},
        "description": "One of the world's largest shopping malls with over 1,200 stores, an aquarium, ice rink, and cinema.",
        "image_url": "https://images.unsplash.com/photo-1582672060674-bc2bd808a8ce"
    },
    {
        "id": "palm-jumeirah",
        "name": "Palm Jumeirah",
        "category": "attraction",
        "location": {"lat": 25.119721, "lng": 55.138782},
        "description": "Artificial archipelago in the shape of a palm tree, home to luxury hotels, apartments, and beaches.",
        "image_url": "https://images.unsplash.com/photo-1620158232350-613006b21253"
    },
    {
        "id": "dubai-marina",
        "name": "Dubai Marina",
        "category": "attraction",
        "location": {"lat": 25.076090, "lng": 55.133300},
        "description": "An artificial canal city with a 7 km promenade, luxury residences, yachts, and dining options.",
        "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
    },
    {
        "id": "dubai-frame",
        "name": "Dubai Frame",
        "category": "attraction",
        "location": {"lat": 25.234700, "lng": 55.300333},
        "description": "A 150-meter-tall architectural landmark offering panoramic views of old and new Dubai.",
        "image_url": "https://images.unsplash.com/photo-1563268edn-a2232wer1234"
    },
    {
        "id": "al-fahidi",
        "name": "Al Fahidi Historical District",
        "category": "historical",
        "location": {"lat": 25.263681, "lng": 55.296453},
        "description": "A historic district showcasing the traditional Arabian lifestyle with wind-tower architecture, museums, and art galleries.",
        "image_url": "https://images.unsplash.com/photo-1548111396-c3d47c36a76c"
    },
    {
        "id": "jbr-beach",
        "name": "JBR Beach",
        "category": "beach",
        "location": {"lat": 25.082690, "lng": 55.134724},
        "description": "A popular beachfront with shops, restaurants, and entertainment along The Walk at JBR.",
        "image_url": "https://images.unsplash.com/photo-1551918120-9739cb430c6d"
    },
    {
        "id": "dubai-museum",
        "name": "Dubai Museum",
        "category": "historical",
        "location": {"lat": 25.263272, "lng": 55.297556},
        "description": "Located in the Al Fahidi Fort, it's the main museum in Dubai displaying the city's history and cultural heritage.",
        "image_url": "https://images.unsplash.com/photo-1563268edn-a2232wer1234"
    },
    {
        "id": "miracle-garden",
        "name": "Dubai Miracle Garden",
        "category": "attraction",
        "location": {"lat": 25.060996, "lng": 55.246525},
        "description": "The world's largest natural flower garden featuring over 50 million flowers in stunning designs and arrangements.",
        "image_url": "https://images.unsplash.com/photo-1586769412527-ab755ae0c889"
    },
    {
        "id": "mall-of-emirates",
        "name": "Mall of the Emirates",
        "category": "shopping",
        "location": {"lat": 25.117970, "lng": 55.200651},
        "description": "A large shopping mall featuring the famous indoor ski resort Ski Dubai, along with hundreds of stores and restaurants.",
        "image_url": "https://images.unsplash.com/photo-1554919700-28f461160500"
    }
]

# Function to process location queries using OpenAI
def process_location_query(query: str) -> dict:
    """Process a location query to identify places and directions requests"""
    try:
        from openai import OpenAI
        
        # Initialize OpenAI client
        api_key = db.secrets.get("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key is not configured")
        
        client = OpenAI(api_key=api_key)
        
        # Prepare the system prompt with all possible locations
        locations_info = "Available Dubai locations:\n"
        for loc in DUBAI_LOCATIONS:
            locations_info += f"- {loc['name']} (ID: {loc['id']}, Category: {loc['category']})\n"
        
        system_prompt = f"""
        You are a location search system for a Dubai tourism app. 
        Your task is to parse user queries about places in Dubai and identify which locations they're asking about.
        
        {locations_info}
        
        Output a JSON object with the following fields:
        1. "location_ids": List of location IDs that match the query (use IDs from the list above)
        2. "primary_location_id": The main location being asked about (single ID, should be in location_ids)
        3. "is_directions_request": Boolean, true if the user is asking for directions between places
        4. "origin_id": If asking for directions, the starting location ID (can be null)
        5. "destination_id": If asking for directions, the destination location ID (can be null)
        
        For example, if someone asks "What is the Burj Khalifa?", you would respond with:
        {{
          "location_ids": ["burj-khalifa"],
          "primary_location_id": "burj-khalifa",
          "is_directions_request": false,
          "origin_id": null,
          "destination_id": null
        }}
        
        If someone asks "How do I get from Palm Jumeirah to Dubai Mall?", you would respond with:
        {{
          "location_ids": ["palm-jumeirah", "dubai-mall"],
          "primary_location_id": "dubai-mall",
          "is_directions_request": true,
          "origin_id": "palm-jumeirah",
          "destination_id": "dubai-mall"
        }}
        
        If a location isn't in the list, don't include it in the results.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ]
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
        
    except Exception as e:
        print(f"Error processing location query: {str(e)}")
        # If there's an error, return a fallback with Burj Khalifa
        return {
            "location_ids": ["burj-khalifa"],
            "primary_location_id": "burj-khalifa",
            "is_directions_request": False,
            "origin_id": None,
            "destination_id": None
        }

# Mock directions generator (in a real app, this would use Google Maps Directions API)
def generate_directions(origin_id: str, destination_id: str) -> DirectionsInfo:
    """Generate directions between two locations"""
    # Find the origin and destination locations
    origin = next((loc for loc in DUBAI_LOCATIONS if loc["id"] == origin_id), None)
    destination = next((loc for loc in DUBAI_LOCATIONS if loc["id"] == destination_id), None)
    
    if not origin or not destination:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Calculate a very simple distance (straight-line)
    import math
    
    lat1, lng1 = origin["location"]["lat"], origin["location"]["lng"]
    lat2, lng2 = destination["location"]["lat"], destination["location"]["lng"]
    
    # Calculate distance in kilometers using Haversine formula
    R = 6371  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    
    # Assume average speed of 35 km/h in Dubai traffic
    duration_hours = distance / 35
    duration_minutes = int(duration_hours * 60)
    
    # Generate mock directions
    steps = [
        f"Start from {origin['name']}",
        "Head to the main road",
        f"Continue towards {destination['name']}",
        f"Arrive at {destination['name']}"
    ]
    
    return DirectionsInfo(
        origin=Location(**origin),
        destination=Location(**destination),
        distance_text=f"{distance:.1f} km",
        duration_text=f"{duration_minutes} mins",
        steps=steps
    )

@router.post("/query", response_model=LocationQueryResponse)
async def query_location(request: LocationQueryRequest, response: Response) -> LocationQueryResponse:
    # Add CORS headers
    add_cors_headers(response)
    """Process a location query and return relevant information"""
    try:
        # Process the query to identify locations
        result = process_location_query(request.query)
        
        # Get the identified locations
        location_ids = result.get("location_ids", [])
        primary_location_id = result.get("primary_location_id")
        is_directions_request = result.get("is_directions_request", False)
        origin_id = result.get("origin_id")
        destination_id = result.get("destination_id")
        
        # Retrieve the location information
        locations = [Location(**loc) for loc in DUBAI_LOCATIONS if loc["id"] in location_ids]
        
        # Default map center
        map_center = {"lat": 25.2048, "lng": 55.2708}  # Dubai center
        zoom_level = 11
        
        # Set the map center to the primary location if available
        if primary_location_id:
            primary_loc = next((loc for loc in DUBAI_LOCATIONS if loc["id"] == primary_location_id), None)
            if primary_loc:
                map_center = primary_loc["location"]
                zoom_level = 14
        
        # Generate directions if requested
        directions = None
        if is_directions_request and origin_id and destination_id:
            directions = generate_directions(origin_id, destination_id)
            # Adjust zoom to fit the route
            zoom_level = 12
        
        return LocationQueryResponse(
            locations=locations,
            primary_location=primary_location_id,
            directions=directions,
            map_center=map_center,
            zoom_level=zoom_level
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying location: {str(e)}")
