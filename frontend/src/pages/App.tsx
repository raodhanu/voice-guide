import React, { useState, useEffect, useCallback } from "react";
import { VoiceIcon } from "components/VoiceIcon";
import { FeatureCard } from "components/FeatureCard";
import { TranscriptionDisplay } from "components/TranscriptionDisplay";
import { AIResponseDisplay } from "components/AIResponseDisplay";
import { LanguageSelector } from "components/LanguageSelector";
import { LocationDisplay } from "components/LocationDisplay";
import { ConversationHistory, ConversationEntry } from "components/ConversationHistory";
import { CulturalEtiquetteDisplay } from "components/CulturalEtiquetteDisplay";
import { speechSynthesizer } from "utils/speechSynthesis";
import { speechRecognizer } from "utils/speechRecognition";
import { toast } from "sonner";
import brain from "brain";

// Icons for features
const LanguageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5 16H16V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 8H8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3.62 8.49C5.59 -0.169 18.42 -0.159 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CultureIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L13.8 10.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6.17C14.89 6.89 16.35 8.35 17.07 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.00007 11.9999C9.00007 10.2199 8.43007 8.5499 7.44007 7.1699C6.45007 5.7899 5.00007 4.7899 3.33007 4.3999L2.22007 4.1499C2.08007 4.1199 1.96007 4.1999 1.96007 4.3499V4.7599C1.96007 9.9199 6.04007 13.9999 11.2001 13.9999H11.6101C11.7601 13.9999 11.8401 13.8799 11.8101 13.7399L11.5601 12.6199C11.1801 10.9499 10.1801 9.4999 8.80007 8.5099C8.57007 8.3499 8.81007 7.9999 9.07007 8.1399C10.3001 8.8599 11.2501 9.9999 11.7201 11.3999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.30994 17.1801C9.95994 18.3301 12.0299 18.6701 13.9999 17.9301L16.8999 16.9001C18.9699 16.1301 20.6599 14.4001 21.3999 12.3001L21.9999 10.4001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.1094 15.5498C11.2594 16.7398 13.0794 16.7298 14.2194 15.5398" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.3497 12.6399C13.1997 11.4499 11.3797 11.4599 10.2397 12.6499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TransportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.92999 7.92999L7.05999 10.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.95 13.95L19.08 16.08" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.92999 16.07L7.05999 13.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.95 10.06L19.08 7.92999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FoodIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 22H15.5C17.83 22 19.74 20.3 19.95 17.99L20.7 10.99C20.97 8.02 18.8 5.5 15.81 5.5C15.27 5.5 14.74 5.29 14.35 4.9L13.17 3.73C12.6 3.16 11.4 3.16 10.83 3.73L9.65 4.91C9.26 5.3 8.73 5.5 8.19 5.5C5.2 5.5 3.03 8.02 3.3 10.99L4.05 17.99C4.26 20.3 6.17 22 8.5 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15C10.33 15 9 13.67 9 12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  
  // AI response state
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedFollowups, setSuggestedFollowups] = useState<string[]>([]);
  const [etiquetteInfo, setEtiquetteInfo] = useState<any>(null);
  const [isEtiquetteLoading, setIsEtiquetteLoading] = useState(false);
  
  // Location data state
  const [locationData, setLocationData] = useState<any>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // Language setting
  const [language, setLanguage] = useState("en-US");
  
  // Conversation history
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  
  // Clear AI response data when language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // Clear the AI response and transcription data when language changes
    setAiResponse("");
    setTranscript("");
    setFinalTranscript("");
    setSuggestedFollowups([]);
    setEtiquetteInfo(null);
    setLocationData(null);
  };
  
  // Check if speech recognition is supported
  useEffect(() => {
    const supported = speechRecognizer.constructor.isSupported();
    setIsSpeechSupported(supported);
    
    if (!supported) {
      toast.error("Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.");
    }
  }, []);
  
  // Toggle speech recognition
  const toggleListening = useCallback(() => {
    if (!isSpeechSupported) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (isListening) {
      speechRecognizer.stopListening();
    } else {
      // Set the language for speech recognition
      speechRecognizer.setLanguage(language);
      
      speechRecognizer.startListening({
        onStart: () => {
          setIsListening(true);
        },
        onResult: (text, isFinal) => {
          setTranscript(text);
          
          if (isFinal) {
            setFinalTranscript(prev => {
              const newText = prev ? `${prev}\n${text}` : text;
              return newText;
            });
            setTranscript("");
            
            // Send the finalized transcript to the Dubai assistant API
            if (text.trim()) {
              const userQuery = text.trim();
              
              // Add user query to conversation history
              const userEntry: ConversationEntry = {
                id: Date.now().toString(),
                type: "user",
                text: userQuery,
                timestamp: new Date(),
                language: language
              };
              
              setConversationHistory(prev => [...prev, userEntry]);
              processQuery(userQuery);
            }
          }
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (error) => {
          toast.error(`Speech recognition error: ${error}`);
          setIsListening(false);
        }
      });
    }
  }, [isListening, isSpeechSupported]);
  
  // Determine if a query is asking about locations
  const isLocationQuery = (query: string): boolean => {
    // Simple heuristic check for location-related terms
    const locationTerms = [
      "where", "location", "address", "map", "show me", "find", 
      "get to", "directions", "distance", "how far", "near", 
      "burj", "dubai mall", "palm", "museum", "beach", "marina"
    ];
    const lowerQuery = query.toLowerCase();
    return locationTerms.some(term => lowerQuery.includes(term));
  };

  // Replay audio response from conversation history
  const handleReplayAudio = (text: string, entryLanguage: string) => {
    // Get the default voice for the language of the entry
    const voice = speechSynthesizer.getDefaultVoiceForLanguage(entryLanguage);
    
    // Adjust speech rate based on language
    let rate = 1.0;
    if (entryLanguage === 'ar-AE') {
      rate = 0.9;
    } else if (entryLanguage === 'zh-CN') {
      rate = 0.85;
    } else if (entryLanguage === 'ru-RU') {
      rate = 0.95;
    } else if (entryLanguage === 'hi-IN') {
      rate = 0.9; // Slightly slower for Hindi
    } else if (entryLanguage === 'es-ES') {
      rate = 0.95; // Slightly slower for Spanish
    } else if (entryLanguage === 'de-DE') {
      rate = 1.0; // Normal rate for German
    } else if (entryLanguage === 'fr-FR') {
      rate = 0.95; // Slightly slower for French
    }
    
    speechSynthesizer.speak({
      text: text,
      lang: entryLanguage,
      voice: voice,
      rate: rate,
      onStart: () => {},
      onEnd: () => {},
      onError: (error) => console.error("Speech synthesis error:", error)
    });
  };
  
  // Process query with Dubai assistant API
  const processQuery = async (query: string) => {
    setIsAiLoading(true);
    setIsEtiquetteLoading(true);
    
    // Check if this is a location query
    if (isLocationQuery(query)) {
      setIsLocationLoading(true);
      try {
        // Process location query
        const locationResponse = await brain.query_location({
          query
        });
        const locationResult = await locationResponse.json();
        setLocationData(locationResult);
      } catch (error) {
        console.error("Error processing location query:", error);
        setLocationData(null);
      } finally {
        setIsLocationLoading(false);
      }
    }
    
    // Always process with the assistant API for the textual response
    try {
      // Use language code to send to API
      const response = await brain.process_dubai_query({ 
        query,
        language: language.split('-')[0] // Extract primary language code (e.g., 'en' from 'en-US')
      });
      const data = await response.json();
      setAiResponse(data.answer);
      setSuggestedFollowups(data.suggested_followups || []);
      
      // Check if we have etiquette information
      if (data.etiquette_info) {
        setEtiquetteInfo(data.etiquette_info);
      } else {
        setEtiquetteInfo(null);
      }
      
      // Add AI response to conversation history
      const assistantEntry: ConversationEntry = {
        id: Date.now().toString(),
        type: "assistant",
        text: data.answer,
        timestamp: new Date(),
        language: language
      };
      
      setConversationHistory(prev => [...prev, assistantEntry]);
    } catch (error) {
      console.error("Error processing query:", error);
      toast.error("Failed to get response from the assistant");
      setAiResponse("I'm sorry, I couldn't process your request at the moment. Please try again later.");
    } finally {
      setIsAiLoading(false);
      setIsEtiquetteLoading(false);
    }
  };
  
  // Handle followup question click
  const handleFollowupClick = (followup: string) => {
    // Set the followup as if the user had spoken it
    setFinalTranscript(prev => {
      const newText = prev ? `${prev}\n${followup}` : followup;
      return newText;
    });
    
    // Add user followup to conversation history
    const userEntry: ConversationEntry = {
      id: Date.now().toString(),
      type: "user",
      text: followup,
      timestamp: new Date(),
      language: language
    };
    
    setConversationHistory(prev => [...prev, userEntry]);
    
    // Process the followup query
    processQuery(followup);
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dubai skyline background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.databutton.com/public/82cebedb-c155-45fc-9609-59aaa17eea42/public.avif" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover brightness-[0.85]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="block">VoiceGuide</span>
              <span className="block text-2xl md:text-3xl mt-2 font-normal">Your Voice-Activated Guide to Dubai</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              Navigate, explore, and understand Dubai with ease through voice assistance in your language
            </p>
            
            <button 
              onClick={toggleListening}
              className={`${isListening ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"} text-white font-medium py-4 px-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300 shadow-lg hover:shadow-xl group`}
              disabled={!isSpeechSupported}
            >
              <VoiceIcon size={28} isListening={isListening} />
              <span className="ml-3 text-lg group-hover:ml-4 transition-all duration-300">
                {isListening ? "Stop Listening" : "Start Speaking"}
              </span>
            </button>
            
            <div className="mt-8 flex justify-center space-x-2">
              <button 
                onClick={() => handleLanguageChange("en-US")} 
                className={`px-3 py-1 text-xs rounded-full ${language === "en-US" ? "bg-primary text-white" : "bg-white/20 text-white"} backdrop-blur-sm transition-colors duration-200`}
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageChange("ar-AE")} 
                className={`px-3 py-1 text-xs rounded-full ${language === "ar-AE" ? "bg-primary text-white" : "bg-white/20 text-white"} backdrop-blur-sm transition-colors duration-200`}
              >
                Arabic
              </button>
              <button 
                onClick={() => handleLanguageChange("zh-CN")} 
                className={`px-3 py-1 text-xs rounded-full ${language === "zh-CN" ? "bg-primary text-white" : "bg-white/20 text-white"} backdrop-blur-sm transition-colors duration-200`}
              >
                Chinese
              </button>
              <button 
                onClick={() => handleLanguageChange("ru-RU")} 
                className={`px-3 py-1 text-xs rounded-full ${language === "ru-RU" ? "bg-primary text-white" : "bg-white/20 text-white"} backdrop-blur-sm transition-colors duration-200`}
              >
                Russian
              </button>
            </div>
          </div>
        </div>
        
        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#FFFFFF"></path>
          </svg>
        </div>
      </section>

      {/* Conversation Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl mb-6 flex justify-end">
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>
        <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <TranscriptionDisplay 
            transcript={transcript} 
            isListening={isListening} 
            finalTranscript={finalTranscript} 
            className="h-full"
            language={language}
          />
          
          <AIResponseDisplay
            response={aiResponse}
            isLoading={isAiLoading}
            suggestedFollowups={suggestedFollowups}
            onFollowupClick={handleFollowupClick}
            className="h-full"
            language={language}
          />
        </div>
        
        {/* Map display section */}
        {(locationData || isLocationLoading) && (
          <div className="container mx-auto max-w-4xl mt-8">
            <h2 className="text-2xl font-bold mb-4">Location Information</h2>
            <LocationDisplay 
              locationData={locationData}
              isLoading={isLocationLoading}
              className="w-full" 
            />
          </div>
        )}
        
        {/* Cultural Etiquette display section */}
        {(etiquetteInfo || isEtiquetteLoading) && (
          <div className="container mx-auto max-w-4xl mt-8">
            <CulturalEtiquetteDisplay
              etiquetteInfo={etiquetteInfo}
              isLoading={isEtiquetteLoading}
              className="w-full"
              language={language}
            />
          </div>
        )}
        
        {/* Conversation History Section */}
        {conversationHistory.length > 0 && (
          <div className="container mx-auto max-w-4xl mt-8">
            <ConversationHistory 
              entries={conversationHistory}
              language={language}
              onReplayAudio={handleReplayAudio}
              className="w-full"
            />
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            <span className="relative inline-block">
              Discover What VoiceGuide Can Do
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LanguageIcon />}
              title="Multilingual Support"
              description="Communicate and receive information in your language, with support for English, Arabic, Chinese, and Russian." 
            />
            
            <FeatureCard 
              icon={<MapIcon />}
              title="Location Navigation"
              description="Get directions to popular attractions, hidden gems, and emergency services anywhere in Dubai." 
            />
            
            <FeatureCard 
              icon={<CultureIcon />}
              title="Cultural Guidance"
              description="Learn about local customs, etiquette, and cultural practices to ensure a respectful visit." 
            />
            
            <FeatureCard 
              icon={<TransportIcon />}
              title="Transportation Help"
              description="Navigate Dubai's metro, buses, taxis, and water taxis with real-time information and guidance." 
            />
            
            <FeatureCard 
              icon={<FoodIcon />}
              title="Food Recommendations"
              description="Discover restaurants and cafes that cater to your dietary preferences and restrictions." 
            />
            
            <div className="bg-white p-6 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 flex items-center justify-center border border-opacity-5 hover:border-opacity-10 border-primary">
              <button 
                onClick={toggleListening}
                className={`${isListening ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"} text-white font-medium py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 group`}
                disabled={!isSpeechSupported}
              >
                <VoiceIcon size={20} isListening={isListening} />
                <span className="ml-2 group-hover:ml-3 transition-all duration-300">{isListening ? "Stop" : "Try Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-3xl mx-4 mb-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            <span className="relative inline-block">
              How VoiceGuide Works
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </span>
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Speak</h3>
              <p className="text-muted-foreground">Ask a question or request information about Dubai in your language</p>
            </div>
            
            <div className="hidden md:block w-px h-24 bg-gray-300 mx-4 self-start mt-8"></div>
            
            <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Process</h3>
              <p className="text-muted-foreground">VoiceGuide translates and processes your request using advanced AI</p>
            </div>
            
            <div className="hidden md:block w-px h-24 bg-gray-300 mx-4 self-start mt-8"></div>
            
            <div className="flex flex-col items-center text-center md:w-1/3">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Listen</h3>
              <p className="text-muted-foreground">Receive personalized voice guidance with maps and visuals when needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} VoiceGuide. Your Voice-Activated Guide to Dubai.</p>
        </div>
      </footer>
    </div>
  );
}
