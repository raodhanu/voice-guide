import React, { useState, useEffect, useCallback } from "react";
import { VoiceIcon } from "components/VoiceIcon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FeatureCard } from "components/FeatureCard";
import { TranscriptionDisplay } from "components/TranscriptionDisplay";
import { AIResponseDisplay } from "components/AIResponseDisplay";
import { ThemeSwitcher } from "components/ThemeSwitcher";
import { LanguageSelector } from "components/LanguageSelector";
import { LocationDisplay } from "components/LocationDisplay";
import { ConversationHistory, ConversationEntry } from "components/ConversationHistory";
import { CulturalEtiquetteDisplay } from "components/CulturalEtiquetteDisplay";
import { speechSynthesizer } from "utils/speechSynthesis";
import { speechRecognizer } from "utils/speechRecognition";
import { toast, Toaster } from "sonner";
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
  
  // Handle language change with proper UI updates
  const handleLanguageChange = (newLanguage: string) => {
    console.log(`Language changed from ${language} to ${newLanguage}`);
    
    // Update language state
    setLanguage(newLanguage);
    
    // Re-initialize speech recognizer with new language
    if (speechRecognizer) {
      speechRecognizer.setLanguage(newLanguage);
    }
    
    // Re-initialize speech synthesizer preferences for new language
    if (speechSynthesizer) {
      // This ensures the default voice for the new language is selected
      const voice = speechSynthesizer.getDefaultVoiceForLanguage(newLanguage);
      console.log(`Set default voice for ${newLanguage}: ${voice?.name || 'No matching voice'}`); 
    }
    
    // Clear only temporary response data but keep conversation history and final transcript
    setAiResponse("");
    setTranscript("");
    setSuggestedFollowups([]);
    setEtiquetteInfo(null);
    setLocationData(null);
    
    // Display a toast notification about language change
    let languageName = "English";
    switch (newLanguage) {
      case "ar-AE": languageName = "العربية"; break;
      case "zh-CN": languageName = "中文"; break;
      case "ru-RU": languageName = "Русский"; break;
      case "hi-IN": languageName = "हिन्दी"; break;
      case "es-ES": languageName = "Español"; break;
      case "de-DE": languageName = "Deutsch"; break;
      case "fr-FR": languageName = "Français"; break;
    }
    
    toast.success(`Language changed to ${languageName}`);
    // Do NOT clear finalTranscript or conversationHistory here to preserve between language switches
  };
  
  // Clear all conversation data
  const clearConversation = () => {
    // Only show toast if there's actually something to clear
    const hasContent = finalTranscript || aiResponse || conversationHistory.length > 0 || etiquetteInfo || locationData;
    
    if (hasContent) {
      setFinalTranscript("");
      setAiResponse("");
      setTranscript("");
      setSuggestedFollowups([]);
      setConversationHistory([]);
      setEtiquetteInfo(null);
      setLocationData(null);
      
      toast.success(language === "ar-AE" ? "تم مسح المحادثة" :
                   language === "zh-CN" ? "对话已清除" :
                   language === "ru-RU" ? "Разговор очищен" :
                   language === "hi-IN" ? "बातचीत साफ़ हो गई" :
                   language === "es-ES" ? "Conversación borrada" :
                   language === "de-DE" ? "Konversation gelöscht" :
                   language === "fr-FR" ? "Conversation effacée" :
                   "Conversation cleared");
    }
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
              const currentLanguage = language; // Capture current language at the time of input
              
              // Add user query to conversation history with current language
              const userEntry: ConversationEntry = {
                id: Date.now().toString(),
                type: "user",
                text: userQuery,
                timestamp: new Date(),
                language: currentLanguage
              };
              
              setConversationHistory(prev => [...prev, userEntry]);
              processQuery(userQuery, currentLanguage); // Pass the current language to keep consistency
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
  }, [isListening, isSpeechSupported, language]); // Add language to dependency array
  
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
  const processQuery = async (query: string, currentLanguage?: string) => {
    // Use provided language or current language state
    const queryLanguage = currentLanguage || language;
    
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
      // Extract primary language code (e.g., 'en' from 'en-US')
      const primaryLanguageCode = queryLanguage.split('-')[0];
      
      // Use language code to send to API
      console.log(`Sending query in language: ${primaryLanguageCode}`);
      const response = await brain.process_dubai_query({ 
        query,
        language: primaryLanguageCode
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
      
      // Add AI response to conversation history with the language it was generated in
      const assistantEntry: ConversationEntry = {
        id: Date.now().toString(),
        type: "assistant",
        text: data.answer,
        timestamp: new Date(),
        language: queryLanguage // Store the language this response was generated in
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
    
    const currentLanguage = language; // Capture current language at the time of click
    
    // Add user followup to conversation history with current language
    const userEntry: ConversationEntry = {
      id: Date.now().toString(),
      type: "user",
      text: followup,
      timestamp: new Date(),
      language: currentLanguage
    };
    
    setConversationHistory(prev => [...prev, userEntry]);
    
    // Process the followup query with the current language
    processQuery(followup, currentLanguage);
  };
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {transform: translateX(-100%)}
          100% {transform: translateX(100%)}
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .pattern-zigzag-sm {
          background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%), 
                           linear-gradient(225deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%), 
                           linear-gradient(45deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%), 
                           linear-gradient(315deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%);
          background-position: 15px 0, 15px 0, 0 0, 0 0;
          background-size: 30px 30px;
        }
        
        .arabic-pattern {
          background-image: radial-gradient(circle at 50% 50%, rgba(0, 128, 128, 0.03) 5%, transparent 7%),
                           radial-gradient(circle at 20% 20%, rgba(0, 128, 128, 0.05) 3%, transparent 5%);
          background-size: 20px 20px;
        }
      `}</style>
      <Toaster position="top-center" richColors expandable />
    <div className="min-h-screen">
      {/* Theme switcher */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f5f9fc] to-[#e6f1f9] dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800">
        {/* Dubai skyline background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.databutton.com/public/82cebedb-c155-45fc-9609-59aaa17eea42/public.avif" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover brightness-[0.85]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        </div>
        
        {/* Decorative elements inspired by Arabic architecture */}
        <div className="absolute top-10 left-10 opacity-30 hidden lg:block">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 0L74.4 45.6L120 60L74.4 74.4L60 120L45.6 74.4L0 60L45.6 45.6L60 0Z" fill="white"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-30 hidden lg:block">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="40" fill="white"/>
            <circle cx="40" cy="40" r="30" fill="transparent" stroke="white" strokeWidth="2"/>
            <circle cx="40" cy="40" r="20" fill="transparent" stroke="white" strokeWidth="2"/>
            <circle cx="40" cy="40" r="10" fill="transparent" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mx-auto">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.34961 9.65039V11.3504C4.34961 15.5704 7.77961 19.0004 11.9996 19.0004C16.2196 19.0004 19.6496 15.5704 19.6496 11.3504V9.65039" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 22H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 filter drop-shadow-lg">
              <span className="block">VoiceGuide</span>
              <span className="block text-2xl md:text-3xl mt-3 font-normal tracking-wide">Your Voice-Activated Guide to Dubai</span>
            </h1>
            
            <p className="text-xl text-white/90 dark:text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
              Navigate, explore, and understand Dubai with ease through voice assistance in your language
            </p>
            
            <div className="flex flex-col items-center">
              <button 
                onClick={toggleListening}
                className={`${isListening ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"} text-white font-medium py-5 px-10 rounded-full flex items-center justify-center mx-auto transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden backdrop-blur-sm mb-4 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white`}
                disabled={!isSpeechSupported}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full animate-shimmer"></span>
                <div className={`w-12 h-12 rounded-full ${isListening ? 'bg-red-700 dark:bg-red-800' : 'bg-primary/80 dark:bg-blue-900'} flex items-center justify-center mr-3 group-hover:mr-4 transition-all duration-300 shadow-inner`}>
                  <VoiceIcon size={28} isListening={isListening} />
                </div>
                <span className="text-lg font-semibold tracking-wide">
                  {isListening ? "Stop Listening" : "Start Speaking"}
                </span>
              </button>
              

            </div>

            <div className="mt-6 max-w-xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-white/80 mb-3 text-sm font-medium">Select Your Language:</p>
              <div className="grid grid-cols-4 gap-2 relative z-10">
                {/* Decorative elements */}
                <div className="absolute -top-1/2 -right-1/4 w-32 h-32 rounded-full bg-blue-100/30 filter blur-xl"></div>
                <div className="absolute -bottom-1/4 -left-1/4 w-24 h-24 rounded-full bg-teal-100/20 filter blur-lg"></div>
                <button 
                  onClick={() => handleLanguageChange("en-US")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "en-US" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇺🇸</span>
                  <span>English</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("ar-AE")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "ar-AE" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇦🇪</span>
                  <span>Arabic</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("zh-CN")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "zh-CN" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇨🇳</span>
                  <span>Chinese</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("ru-RU")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "ru-RU" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇷🇺</span>
                  <span>Russian</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("hi-IN")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "hi-IN" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇮🇳</span>
                  <span>Hindi</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("es-ES")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "es-ES" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇪🇸</span>
                  <span>Spanish</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("de-DE")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "de-DE" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇩🇪</span>
                  <span>German</span>
                </button>
                <button 
                  onClick={() => handleLanguageChange("fr-FR")} 
                  className={`px-3 py-2 text-sm rounded-xl flex flex-col items-center justify-center ${language === "fr-FR" ? "bg-primary text-white ring ring-white/30 dark:bg-blue-800 dark:ring-white/20" : "bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700"} transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-lg mb-1">🇫🇷</span>
                  <span>French</span>
                </button>
              </div>
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
      <section className="py-12 px-4 overflow-hidden relative dark:bg-slate-900 dark:text-white">
        {/* Decorative background with Arabic-inspired patterns */}
        <div className="absolute inset-0 arabic-pattern opacity-20"></div>
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10">
            {/* Arabic-inspired decorative corner element */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
                <path d="M120 0v40c0 44.1-35.9 80-80 80H0V80C0 35.9 35.9 0 80 0h40z" fill="currentColor"/>
                <path d="M90 30v15c0 24.8-20.2 45-45 45H30V75c0-24.8 20.2-45 45-45h15z" fill="white"/>
                <path d="M75 45v7.5c0 12.4-10.1 22.5-22.5 22.5H45V67.5c0-12.4 10.1-22.5 22.5-22.5H75z" fill="currentColor"/>
              </svg>
            </div>
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">
                {language === "ar-AE" && "محادثتك"}
                {language === "zh-CN" && "你的对话"}
                {language === "ru-RU" && "Ваш разговор"}
                {language === "en-US" && "Your Conversation"}
                {language === "hi-IN" && "आपकी बातचीत"}
                {language === "es-ES" && "Tu conversación"}
                {language === "de-DE" && "Ihr Gespräch"}
                {language === "fr-FR" && "Votre conversation"}
              </h2>
              <p className="text-muted-foreground dark:text-gray-300">
                {language === "ar-AE" && "استخدم الزر أدناه للتحدث إلى مساعد دبي الصوتي"}
                {language === "zh-CN" && "使用下面的按钮与迪拜语音助手交谈"}
                {language === "ru-RU" && "Используйте кнопку ниже, чтобы поговорить с голосовым помощником Дубая"}
                {language === "en-US" && "Use the button below to speak with Dubai voice assistant"}
                {language === "hi-IN" && "दुबई वॉइस सहायक से बात करने के लिए नीचे दिए गए बटन का उपयोग करें"}
                {language === "es-ES" && "Usa el botón de abajo para hablar con el asistente de voz de Dubái"}
                {language === "de-DE" && "Benutzen Sie die Schaltfläche unten, um mit dem Dubai-Sprachassistenten zu sprechen"}
                {language === "fr-FR" && "Utilisez le bouton ci-dessous pour parler avec l'assistant vocal de Dubaï"}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleListening}
                className={`${isListening ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"} text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white`}
                disabled={!isSpeechSupported}
              >
                <VoiceIcon size={22} isListening={isListening} />
                <span className="ml-2 group-hover:ml-3 transition-all duration-300">
                  {isListening ? 
                    (language === "ar-AE" ? "إيقاف الاستماع" : 
                     language === "zh-CN" ? "停止聆听" : 
                     language === "ru-RU" ? "Остановить" : 
                     language === "en-US" ? "Stop" :
                     language === "hi-IN" ? "रोकें" :
                     language === "es-ES" ? "Detener" :
                     language === "de-DE" ? "Stoppen" :
                     language === "fr-FR" ? "Arrêter" : "Stop") : 
                    (language === "ar-AE" ? "ابدأ التحدث" : 
                     language === "zh-CN" ? "开始说话" : 
                     language === "ru-RU" ? "Начать" : 
                     language === "en-US" ? "Speak" :
                     language === "hi-IN" ? "बोलें" :
                     language === "es-ES" ? "Hablar" :
                     language === "de-DE" ? "Sprechen" :
                     language === "fr-FR" ? "Parler" : "Speak")}
                </span>
              </button>
              
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange} 
              />
              
              {/* Clear button next to language selector */}
              {(finalTranscript || aiResponse || conversationHistory.length > 0 || etiquetteInfo || locationData) && (
                <button 
                  onClick={clearConversation}
                  className="px-4 py-2 rounded-lg text-white bg-red-500/80 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {language === "ar-AE" ? "مسح" :
                   language === "zh-CN" ? "清除" :
                   language === "ru-RU" ? "Очистить" :
                   language === "hi-IN" ? "साफ़" :
                   language === "es-ES" ? "Limpiar" :
                   language === "de-DE" ? "Löschen" :
                   language === "fr-FR" ? "Effacer" :
                   "Clear"}
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
        
        {/* Decorative divider with sand dune shape */}
        <div className="relative h-24 my-8 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                  className="fill-[#f3f4f6] dark:fill-slate-800" fillOpacity="0.6"></path>
          </svg>
        </div>
        
        {/* Information Sections with Accordions */}
        <div className="container mx-auto max-w-4xl mt-8">
          <Accordion type="multiple" defaultValue={["locations", "etiquette", "history"]} className="space-y-6">
            {/* Location Information */}
            {(locationData || isLocationLoading) && (
              <AccordionItem value="locations" className="border rounded-xl overflow-hidden shadow-sm border-amber-100/50 dark:border-amber-800/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/50 dark:to-gray-800">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-3 shadow-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-600">
                        <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3.62 8.49C5.59 -0.169 18.42 -0.159 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200">Location Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pt-1">
                  <LocationDisplay 
                    locationData={locationData}
                    isLoading={isLocationLoading}
                    className="w-full rounded-t-none" 
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* Cultural Etiquette */}
            {(etiquetteInfo || isEtiquetteLoading) && (
              <AccordionItem value="etiquette" className="border rounded-xl overflow-hidden shadow-sm border-indigo-100/50 dark:border-indigo-800/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/50 dark:to-gray-800">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center mr-3 shadow-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                        <path d="M22 2L13.8 10.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 6.17C14.89 6.89 16.35 8.35 17.07 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.00007 11.9999C9.00007 10.2199 8.43007 8.5499 7.44007 7.1699C6.45007 5.7899 5.00007 4.7899 3.33007 4.3999L2.22007 4.1499C2.08007 4.1199 1.96007 4.1999 1.96007 4.3499V4.7599C1.96007 9.9199 6.04007 13.9999 11.2001 13.9999H11.6101C11.7601 13.9999 11.8401 13.8799 11.8101 13.7399L11.5601 12.6199C11.1801 10.9499 10.1801 9.4999 8.80007 8.5099C8.57007 8.3499 8.81007 7.9999 9.07007 8.1399C10.3001 8.8599 11.2501 9.9999 11.7201 11.3999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200">Cultural Etiquette</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pt-1">
                  <CulturalEtiquetteDisplay
                    etiquetteInfo={etiquetteInfo}
                    isLoading={isEtiquetteLoading}
                    className="w-full rounded-t-none"
                    language={language}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* Conversation History */}
            {conversationHistory.length > 0 && (
              <AccordionItem value="history" className="border rounded-xl overflow-hidden shadow-sm border-teal-100/50 dark:border-teal-800/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-teal-50 to-white dark:from-teal-950/50 dark:to-gray-800">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center mr-3 shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-600">
                          <path d="M8.5 10.5H15.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 18.43H11L15.45 21.39C16.11 21.83 17 21.36 17 20.56V18.43C20 18.43 22 16.43 22 13.43V7.42999C22 4.42999 20 2.42999 17 2.42999H7C4 2.42999 2 4.42999 2 7.42999V13.43C2 16.43 4 18.43 7 18.43Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.5 14.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-lg font-medium text-gray-800 dark:text-gray-200">Conversation History</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pt-1">
                  <ConversationHistory 
                    entries={conversationHistory}
                    language={language}
                    onReplayAudio={handleReplayAudio}
                    className="w-full rounded-t-none"
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 relative overflow-hidden dark:bg-slate-800 dark:text-white">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64">
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
              <path fillRule="evenodd" clipRule="evenodd" d="M120 240C186.274 240 240 186.274 240 120C240 53.7258 186.274 0 120 0C53.7258 0 0 53.7258 0 120C0 186.274 53.7258 240 120 240ZM120 200C164.183 200 200 164.183 200 120C200 75.8172 164.183 40 120 40C75.8172 40 40 75.8172 40 120C40 164.183 75.8172 200 120 200Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
              <path d="M90 0L112.5 67.5L180 90L112.5 112.5L90 180L67.5 112.5L0 90L67.5 67.5L90 0Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
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
              description="Communicate and receive information in your language, with support for English, Arabic, Chinese, Russian, Hindi, Spanish, German, and French." 
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
                className={`${isListening ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"} text-white font-medium py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 group dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white`}
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
      <section className="py-20 px-4 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-[2rem] mx-4 mb-16 relative overflow-hidden border border-secondary/10 shadow-lg">
        {/* Arabic-inspired geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`, backgroundSize: '20px 20px' }}></div>
        </div>
        {/* Decorative patterns inspired by Arabic designs */}
        <div className="absolute top-0 left-0 w-full h-16 bg-secondary/5 pattern-zigzag-sm"></div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-primary/5 pattern-zigzag-sm"></div>
        
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16 relative">
            <span className="relative inline-block">
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 22H16C20.5 22 22 20.5 22 16V8C22 3.5 20.5 2 16 2H8C3.5 2 2 3.5 2 8V16C2 20.5 3.5 22 8 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              How VoiceGuide Works
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-secondary to-primary rounded-full"></span>
            </span>
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-stretch max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12 md:mb-0 md:w-1/3 group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span>1</span>
              </div>
              <div className="h-20"></div> {/* Spacer for icon */}
              <h3 className="text-xl font-semibold mb-3 border-b-2 border-primary/30 pb-2 group-hover:text-primary transition-colors duration-300">Speak</h3>
              <p className="text-muted-foreground">Ask a question or request information about Dubai in your preferred language</p>
              <div className="mt-4 text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">🗣️</div>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-16">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center mb-12 md:mb-0 md:w-1/3 group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span>2</span>
              </div>
              <div className="h-20"></div> {/* Spacer for icon */}
              <h3 className="text-xl font-semibold mb-3 border-b-2 border-primary/30 pb-2 group-hover:text-primary transition-colors duration-300">Process</h3>
              <p className="text-muted-foreground">VoiceGuide translates and processes your request using advanced AI technology</p>
              <div className="mt-4 text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">🧠</div>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-16">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center md:w-1/3 group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span>3</span>
              </div>
              <div className="h-20"></div> {/* Spacer for icon */}
              <h3 className="text-xl font-semibold mb-3 border-b-2 border-primary/30 pb-2 group-hover:text-primary transition-colors duration-300">Listen</h3>
              <p className="text-muted-foreground">Receive personalized voice guidance with maps and visual information when needed</p>
              <div className="mt-4 text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">🔊</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8 px-4 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {/* Subtle decorative footer pattern */}
        <div className="absolute inset-0 pattern-zigzag-sm opacity-5"></div>
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} VoiceGuide. Your Voice-Activated Guide to Dubai.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
