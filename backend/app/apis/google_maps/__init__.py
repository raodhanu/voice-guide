from fastapi import APIRouter
import databutton as db

router = APIRouter()

class MapSettings:
    api_key: str

@router.get("/api-key")
def get_google_maps_api_key():
    """Get the Google Maps API key. This endpoint should only be called from the frontend."""
    api_key = db.secrets.get("GOOGLE_MAPS_API_KEY")
    
    if not api_key:
        return {"api_key": "", "error": "Google Maps API key not found"}
    
    return {"api_key": api_key}
