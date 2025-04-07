import React, { useState, useEffect } from "react";
import { speechSynthesizer } from "../utils/speechSynthesis";

interface Props {
  response: string;
  isLoading: boolean;
  suggestedFollowups: string[];
  onFollowupClick: (followup: string) => void;
  className?: string;
  language?: string;
}

export function AIResponseDisplay({
  response,
  isLoading,
  suggestedFollowups,
  onFollowupClick,
  className = "",
  language = "en-US",
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTtsSupported, setIsTtsSupported] = useState(true);
  
  // Check if speech synthesis is supported
  useEffect(() => {
    setIsTtsSupported('speechSynthesis' in window);
  }, []);
  
  // Reset speaking state when response changes
  useEffect(() => {
    if (isSpeaking) {
      speechSynthesizer.stop();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [response]);
  
  // Play the AI response
  const handlePlayResponse = () => {
    if (!response) return;
    
    if (isPaused) {
      speechSynthesizer.resume();
      setIsPaused(false);
      return;
    }
    
    if (isSpeaking) {
      speechSynthesizer.pause();
      setIsPaused(true);
      return;
    }
    
    // Get the default voice for the current language
    const voice = speechSynthesizer.getDefaultVoiceForLanguage(language);
    
    speechSynthesizer.speak({
      text: response,
      lang: language,
      voice: voice,
      rate: 1.0,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: (error) => {
        console.error("Speech synthesis error:", error);
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onPause: () => setIsPaused(true),
      onResume: () => setIsPaused(false),
    });
  };
  
  // Stop the AI response
  const handleStopResponse = () => {
    speechSynthesizer.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };
  return (
    <div className={`rounded-xl bg-white shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">VoiceGuide Assistant</h3>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          )}
          
          {/* TTS Controls */}
          {isTtsSupported && response && !isLoading && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePlayResponse}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                title={isPaused ? "Resume" : (isSpeaking ? "Pause" : "Listen")}
              >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                ) : isSpeaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                )}
              </button>
              
              {isSpeaking && (
                <button
                  onClick={handleStopResponse}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  title="Stop">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Response */}
      <div className="mb-6 prose max-w-none">
        {isLoading && !response ? (
          <p className="text-gray-500 italic">Generating response about Dubai...</p>
        ) : response ? (
          <div className="whitespace-pre-wrap">{response}</div>
        ) : (
          <p className="text-gray-500 italic">
            Ask me anything about Dubai! I can help with attractions, cultural etiquette, transportation, 
            local events, and food recommendations.
          </p>
        )}
      </div>

      {/* Suggested Followups */}
      {suggestedFollowups.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">You might want to ask:</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedFollowups.map((followup, index) => (
              <button
                key={index}
                onClick={() => onFollowupClick(followup)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors duration-200"
              >
                {followup}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
