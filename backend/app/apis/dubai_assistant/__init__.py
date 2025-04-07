from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from openai import OpenAI
import databutton as db

router = APIRouter(prefix="/dubai-assistant")

# Pydantic models for request and response
class DubaiQueryRequest(BaseModel):
    query: str = Field(..., description="The user's query about Dubai")
    language: str = Field("en", description="The language code for the response (e.g., 'en', 'ar', 'ru', 'zh')")

class DubaiQueryResponse(BaseModel):
    answer: str = Field(..., description="The AI-generated answer about Dubai")
    suggested_followups: List[str] = Field(default_factory=list, description="Optional suggested follow-up questions")

# Dubai tourism information system prompt
DUBAI_SYSTEM_PROMPT = """
You are VoiceGuide, a multilingual voice navigation assistant for tourists in Dubai. 
Your goal is to provide accurate, helpful, and culturally sensitive information about Dubai to help tourists have the best experience.

You can help with:

1. LOCATIONS & ATTRACTIONS:
   - Famous attractions: Burj Khalifa, Dubai Mall, Palm Jumeirah, Dubai Frame, Museum of the Future
   - Historical sites: Al Fahidi Historical District, Dubai Museum, Al Shindagha Museum
   - Beaches: JBR Beach, Kite Beach, La Mer, Black Palace Beach
   - Parks: Dubai Miracle Garden, Dubai Garden Glow, Zabeel Park
   - Shopping: Dubai Mall, Mall of the Emirates, Global Village, traditional souks

2. CULTURAL ETIQUETTE:
   - Dress code: Modest dress in public places, especially religious sites
   - Ramadan customs: Fasting hours, reduced business hours, iftar traditions
   - Photography permissions: Ask before photographing locals, no photos of government buildings
   - Public behavior: No public displays of affection, no public intoxication
   - Religious respect: Quiet near mosques, respect prayer times

3. LOCAL EVENTS:
   - Seasonal festivals: Dubai Shopping Festival, Dubai Food Festival, Dubai Summer Surprises
   - Cultural performances: Opera at Dubai Opera, traditional dance shows
   - Sports events: Dubai Tennis Championships, Dubai World Cup
   - Concerts and performances happening at Coca-Cola Arena and other venues

4. TRANSPORTATION:
   - Metro system: Red and Green lines, operating hours (5:30 AM to midnight, 10 AM to midnight on Fridays)
   - Buses: Routes, RTA bus app information
   - Taxis: RTA taxis, Careem, Uber availability
   - Water transportation: Abras (water taxis), Dubai Ferry
   - Car rentals: Major companies, traffic rules, parking information

5. FOOD & DINING:
   - Local Emirati cuisine: Al Harees, Machboos, Luqaimat
   - Popular dining districts: Downtown Dubai, Dubai Marina, Deira
   - Dietary considerations: Halal food is standard, vegetarian options available at most restaurants
   - Fine dining: Celebrity chef restaurants, high-end hotel dining
   - Street food: Old Dubai areas, Global Village

GUIDELINES:

- Be concise yet informative, providing specific details (locations, hours, prices) when available
- Always respect local customs and provide culturally sensitive information
- For specific events, note that your information may need to be verified for current dates and details
- When recommending places, consider adding one mainstream tourist option and one local/authentic alternative
- If you don't know the answer, acknowledge that and suggest where the tourist might find accurate information
- Always recommend safe practices while traveling in Dubai

Your goal is to be the perfect tourism assistant, making visitors' experiences in Dubai smoother, more enjoyable, and more culturally rich.
"""

# Initialize OpenAI client
def get_openai_client():
    try:
        api_key = db.secrets.get("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key is not configured")
        return OpenAI(api_key=api_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing OpenAI client: {str(e)}")

@router.post("/query", response_model=DubaiQueryResponse)
def process_dubai_query(request: DubaiQueryRequest) -> DubaiQueryResponse:
    """
    Process a user query about Dubai and return relevant information
    """
    try:
        client = get_openai_client()
        
        # Get user's preferred language
        language = request.language.lower()
        
        # Customize response language instruction based on user's preference
        language_instruction = ""
        if language == "en":
            language_instruction = "Respond in English."
        elif language == "ar":
            language_instruction = "Respond in Arabic (العربية)."
        elif language == "zh":
            language_instruction = "Respond in Chinese (简体中文)."
        elif language == "ru":
            language_instruction = "Respond in Russian (русский)."
        elif language == "hi":
            language_instruction = "Respond in Hindi (हिन्दी)."
        elif language == "fr":
            language_instruction = "Respond in French (Français)."
        else:
            language_instruction = "Respond in English."
        
        # Generate a response using OpenAI
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini for a good balance of quality and cost
            messages=[
                {"role": "system", "content": DUBAI_SYSTEM_PROMPT + "\n\n" + language_instruction},
                {"role": "user", "content": request.query}
            ],
            temperature=0.7,
            max_tokens=800,
        )
        
        answer = completion.choices[0].message.content
        
        # Generate follow-up suggestions in a separate call
        followup_completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"Based on the user's question about Dubai and the provided answer, suggest 2-3 natural follow-up questions they might want to ask next. Keep them brief and conversational. {language_instruction}"},
                {"role": "user", "content": f"User question: {request.query}\n\nAnswer provided: {answer}"}
            ],
            temperature=0.7,
            max_tokens=150,
        )
        
        # Process follow-up suggestions
        followup_text = followup_completion.choices[0].message.content
        suggested_followups = []
        
        # Extract numbered or bulleted items
        import re
        followup_items = re.findall(r'[\d\-\*]\s*[\"\"]?(.*?)[\"\"]?[\n\r]', followup_text + '\n')
        
        if followup_items:
            suggested_followups = [item.strip() for item in followup_items if item.strip()]
        else:
            # If regex failed, split by newlines and clean up
            lines = [line.strip() for line in followup_text.split('\n') if line.strip()]
            for line in lines:
                # Remove numbering or bullets if present
                clean_line = re.sub(r'^[\d\-\*\.]+\s*', '', line).strip()
                # Remove quotes if present
                clean_line = clean_line.strip('"').strip("'").strip()
                if clean_line and len(suggested_followups) < 3:
                    suggested_followups.append(clean_line)
        
        return DubaiQueryResponse(
            answer=answer,
            suggested_followups=suggested_followups[:3]  # Limit to 3 suggestions
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/stream", tags=["stream"])
def stream_dubai_response(request: DubaiQueryRequest):
    """
    Stream a response to a Dubai query for a more interactive experience
    """
    from fastapi.responses import StreamingResponse
    
    def generate_response():
        try:
            client = get_openai_client()
            
            # Get user's preferred language
            language = request.language.lower()
            
            # Customize response language instruction based on user's preference
            language_instruction = ""
            if language == "en":
                language_instruction = "Respond in English."
            elif language == "ar":
                language_instruction = "Respond in Arabic (العربية)."
            elif language == "zh":
                language_instruction = "Respond in Chinese (简体中文)."
            elif language == "ru":
                language_instruction = "Respond in Russian (русский)."
            elif language == "hi":
                language_instruction = "Respond in Hindi (हिन्दी)."
            elif language == "fr":
                language_instruction = "Respond in French (Français)."
            else:
                language_instruction = "Respond in English."
            
            # Generate a streaming response
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": DUBAI_SYSTEM_PROMPT + "\n\n" + language_instruction},
                    {"role": "user", "content": request.query}
                ],
                temperature=0.7,
                max_tokens=800,
                stream=True,
            )
            
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            yield f"Error: {str(e)}"
    
    return StreamingResponse(generate_response(), media_type="text/plain")
