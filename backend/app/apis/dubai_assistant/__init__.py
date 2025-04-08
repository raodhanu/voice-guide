from fastapi import APIRouter, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from openai import OpenAI
import databutton as db

router = APIRouter(prefix="/dubai-assistant")

# Define CORS headers
def add_cors_headers(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, X-CSRF-Token"
    return response

# Pydantic models for request and response
class DubaiQueryRequest(BaseModel):
    query: str = Field(..., description="The user's query about Dubai")
    language: str = Field("en", description="The language code for the response (e.g., 'en', 'ar', 'ru', 'zh')")

class EtiquetteInfo(BaseModel):
    category: str = Field(..., description="The category of etiquette information")
    advice: str = Field(..., description="The main advice about this etiquette category")
    additional_info: Optional[str] = Field(None, description="Additional information about the etiquette")
    do_tips: Optional[List[str]] = Field(None, description="List of things to do")
    dont_tips: Optional[List[str]] = Field(None, description="List of things not to do")

class DubaiQueryResponse(BaseModel):
    answer: str = Field(..., description="The AI-generated answer about Dubai")
    suggested_followups: List[str] = Field(default_factory=list, description="Optional suggested follow-up questions")
    etiquette_info: Optional[EtiquetteInfo] = Field(None, description="Cultural etiquette information if the query is about cultural customs")

# Etiquette categories
ETIQUETTE_CATEGORIES = [
    "dress-code", "greetings", "religious-customs", "dining", 
    "public-behavior", "business", "home-visits", "gender-interactions"
]

# Function to detect if a query is about cultural etiquette
def is_etiquette_query(query: str) -> bool:
    etiquette_terms = [
        "etiquette", "custom", "tradition", "dress code", "clothing", 
        "wear", "greet", "greeting", "handshake", "gesture", 
        "nod", "bow", "religious", "islam", "mosque", "ramadan",
        "dining", "eat", "food", "restaurant", "table manner",
        "public", "behavior", "conduct", "appropriate", "acceptable",
        "photo", "picture", "business", "meeting", "professional",
        "card", "gift", "home", "visit", "house", "gender", "male", "female",
        "prayer", "modest", "modesty", "rude", "polite", "offensive"
    ]
    
    query_lower = query.lower()
    return any(term in query_lower for term in etiquette_terms)

# Function to detect which etiquette category a query belongs to
def detect_etiquette_category(query: str) -> str:
    query_lower = query.lower()
    
    # Category-specific keywords
    category_patterns = {
        "dress-code": ["dress", "wear", "clothes", "attire", "outfit", "modest", "clothing"],
        "greetings": ["greet", "handshake", "hello", "salaam", "gesture", "wave", "bow"],
        "religious-customs": ["mosque", "islam", "prayer", "ramadan", "religious", "faith", "holy"],
        "dining": ["eat", "food", "dining", "restaurant", "meal", "breakfast", "lunch", "dinner", "table"],
        "public-behavior": ["public", "behavior", "acceptable", "allowed", "illegal", "law", "rule", "pda"],
        "business": ["business", "meeting", "professional", "office", "work", "colleague", "card"],
        "home-visits": ["home", "house", "visit", "invitation", "invit", "guest", "host"],
        "gender-interactions": ["gender", "man", "woman", "male", "female", "interaction", "touch"]
    }
    
    # Check each category for matches
    for category, keywords in category_patterns.items():
        if any(keyword in query_lower for keyword in keywords):
            return category
    
    # Default to public-behavior if no specific match found
    return "public-behavior"

# Dubai tourism information system prompt
DUBAI_SYSTEM_PROMPT = """
You are VoiceGuide, a multilingual voice navigation assistant for tourists in Dubai. 
Your goal is to provide accurate, helpful, and culturally sensitive information about Dubai to help tourists have the best experience.

You should respond in the language that the user has selected, which will be indicated in a separate instruction. Be natural and conversational, using appropriate cultural context for the language you're responding in.

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
def process_dubai_query(request: DubaiQueryRequest, response: Response) -> DubaiQueryResponse:
    # Add CORS headers
    add_cors_headers(response)
    """
    Process a user query about Dubai and return relevant information
    """
    try:
        client = get_openai_client()
        
        # Get user's preferred language
        language_code = request.language.lower()
        
        # Extract primary language code (e.g., 'en' from 'en-US')
        if '-' in language_code:
            language = language_code.split('-')[0]
        else:
            language = language_code
        
        # Customize response language instruction based on user's preference
        language_instruction = ""
        if language == "en":
            language_instruction = "Respond in English."
        elif language == "ar":
            language_instruction = "Respond in Arabic (العربية). Make sure all text is in proper Arabic."
        elif language == "zh":
            language_instruction = "Respond in simplified Chinese (简体中文). Make sure all text is in proper Chinese characters."
        elif language == "ru":
            language_instruction = "Respond in Russian (русский). Make sure all text is in proper Cyrillic characters."
        elif language == "hi":
            language_instruction = "Respond in Hindi (हिन्दी). Make sure all text is in proper Hindi using Devanagari script."
        elif language == "es":
            language_instruction = "Respond in Spanish (Español). Make sure all text is in proper Spanish."
        elif language == "de":
            language_instruction = "Respond in German (Deutsch). Make sure all text is in proper German."
        elif language == "fr":
            language_instruction = "Respond in French (Français). Make sure all text is in proper French."
        else:
            language_instruction = "Respond in English."
        
        # Check if this is a cultural etiquette query
        is_etiquette = is_etiquette_query(request.query)
        etiquette_category = detect_etiquette_category(request.query) if is_etiquette else None
        
        # Prepare specialized instructions for etiquette queries
        specialized_instructions = ""
        if is_etiquette:
            specialized_instructions = f"""
This is a question about CULTURAL ETIQUETTE in Dubai, specifically about {etiquette_category.replace('-', ' ')}.

In addition to your regular answer, please provide the following structured information that I can extract:
1. A clear, concise piece of advice about this specific etiquette category (1-2 sentences).
2. 3-5 specific things tourists SHOULD DO regarding this etiquette.
3. 3-5 specific things tourists SHOULD NOT DO regarding this etiquette.

Format this at the end of your response like this:
[ETIQUETTE_INFO]
Category: {etiquette_category}
Advice: (main advice here)
Additional: (any additional context)
Do:
- (do item 1)
- (do item 2)
- (etc.)
Dont:
- (don't item 1)
- (don't item 2)
- (etc.)
[/ETIQUETTE_INFO]
"""
        
        # Generate a response using OpenAI
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini for a good balance of quality and cost
            messages=[
                {"role": "system", "content": DUBAI_SYSTEM_PROMPT + "\n\n" + language_instruction + specialized_instructions},
                {"role": "user", "content": request.query}
            ],
            temperature=0.7,
            max_tokens=1000,
        )
        
        full_response = completion.choices[0].message.content
        
        # Extract etiquette info if present
        etiquette_info = None
        answer = full_response
        
        if is_etiquette:
            import re
            etiquette_match = re.search(r'\[ETIQUETTE_INFO\]\s*(.+?)\s*\[\/ETIQUETTE_INFO\]', full_response, re.DOTALL)
            
            if etiquette_match:
                etiquette_text = etiquette_match.group(1)
                
                # Remove the etiquette info block from the main answer
                answer = full_response.replace(etiquette_match.group(0), '').strip()
                
                # Parse etiquette information
                category_match = re.search(r'Category:\s*(.+?)\s*(?:\n|$)', etiquette_text)
                advice_match = re.search(r'Advice:\s*(.+?)\s*(?:\n|$)', etiquette_text)
                additional_match = re.search(r'Additional:\s*(.+?)\s*(?:\n|$)', etiquette_text)
                
                do_items = re.findall(r'Do:\s*(?:[-*•]\s*(.+?)\s*(?:\n|$))+', etiquette_text)
                if not do_items:
                    do_items = re.findall(r'(?<=Do:\s*\n)\s*[-*•]\s*(.+?)\s*(?:\n|$)', etiquette_text)
                
                dont_items = re.findall(r'Dont:\s*(?:[-*•]\s*(.+?)\s*(?:\n|$))+', etiquette_text)
                if not dont_items:
                    dont_items = re.findall(r'(?<=Dont:\s*\n)\s*[-*•]\s*(.+?)\s*(?:\n|$)', etiquette_text)
                
                # Create etiquette info object if basic fields are present
                if category_match and advice_match:
                    category = category_match.group(1).strip()
                    advice = advice_match.group(1).strip()
                    additional_info = additional_match.group(1).strip() if additional_match else None
                    
                    # Further process do/don't items if not properly extracted
                    if not do_items:
                        do_section = re.search(r'Do:\s*\n(.+?)(?:Dont:|\[|\/)', etiquette_text, re.DOTALL)
                        if do_section:
                            do_items = [item.strip().lstrip('-*•').strip() for item in do_section.group(1).strip().split('\n') if item.strip()]
                    
                    if not dont_items:
                        dont_section = re.search(r'Dont:\s*\n(.+?)(?:\[|\/)', etiquette_text, re.DOTALL)
                        if dont_section:
                            dont_items = [item.strip().lstrip('-*•').strip() for item in dont_section.group(1).strip().split('\n') if item.strip()]
                    
                    etiquette_info = EtiquetteInfo(
                        category=etiquette_category,
                        advice=advice,
                        additional_info=additional_info,
                        do_tips=do_items if do_items else None,
                        dont_tips=dont_items if dont_items else None
                    )
        
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
            suggested_followups=suggested_followups[:3],  # Limit to 3 suggestions
            etiquette_info=etiquette_info
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/stream", tags=["stream"])
def stream_dubai_response(request: DubaiQueryRequest, response: Response):
    """
    Stream a response to a Dubai query for a more interactive experience
    """
    from fastapi.responses import StreamingResponse
    
    # Add CORS headers
    add_cors_headers(response)
    
    def generate_response():
        try:
            client = get_openai_client()
            
            # Get user's preferred language
            language_code = request.language.lower()
            
            # Extract primary language code (e.g., 'en' from 'en-US')
            if '-' in language_code:
                language = language_code.split('-')[0]
            else:
                language = language_code
            
            # Customize response language instruction based on user's preference
            language_instruction = ""
            if language == "en":
                language_instruction = "Respond in English."
            elif language == "ar":
                language_instruction = "Respond in Arabic (العربية). Make sure all text is in proper Arabic."
            elif language == "zh":
                language_instruction = "Respond in simplified Chinese (简体中文). Make sure all text is in proper Chinese characters."
            elif language == "ru":
                language_instruction = "Respond in Russian (русский). Make sure all text is in proper Cyrillic characters."
            elif language == "hi":
                language_instruction = "Respond in Hindi (हिन्दी). Make sure all text is in proper Hindi using Devanagari script."
            elif language == "es":
                language_instruction = "Respond in Spanish (Español). Make sure all text is in proper Spanish."
            elif language == "de":
                language_instruction = "Respond in German (Deutsch). Make sure all text is in proper German."
            elif language == "fr":
                language_instruction = "Respond in French (Français). Make sure all text is in proper French."
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
