from fastapi import APIRouter, Response
import databutton as db

router = APIRouter()

# Define CORS headers
def add_cors_headers(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, X-CSRF-Token"
    return response

class MapSettings:
    api_key: str

@router.get("/api-key")
def get_google_maps_api_key(response: Response):
    # Add CORS headers
    add_cors_headers(response)
    """Get the Google Maps API key. This endpoint should only be called from the frontend."""
    api_key = db.secrets.get("GOOGLE_MAPS_API_KEY")
    
    if not api_key:
        return {"api_key": "", "error": "Google Maps API key not found"}
    
    return {"api_key": api_key}
