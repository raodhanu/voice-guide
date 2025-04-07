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
    
    // Adjust speech rate for better comprehension in different languages
    let rate = 1.0;
    if (language === 'ar-AE') {
      rate = 0.9; // Slightly slower for Arabic
    } else if (language === 'zh-CN') {
      rate = 0.85; // Slower for Chinese to improve clarity
    } else if (language === 'ru-RU') {
      rate = 0.95; // Slightly slower for Russian
    } else if (language === 'hi-IN') {
      rate = 0.9; // Slightly slower for Hindi
    } else if (language === 'es-ES') {
      rate = 0.95; // Slightly slower for Spanish
    } else if (language === 'de-DE') {
      rate = 1.0; // Normal rate for German
    } else if (language === 'fr-FR') {
      rate = 0.95; // Slightly slower for French
    }
    
    // Get the default voice for the current language
    const voice = speechSynthesizer.getDefaultVoiceForLanguage(language);
    
    speechSynthesizer.speak({
      text: response,
      lang: language,
      voice: voice,
      rate: rate,
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
        <h3 className="text-lg font-medium">
          {language === "ar-AE" && "مساعد دليل صوتي"}
          {language === "zh-CN" && "语音导览助手"}
          {language === "ru-RU" && "Голосовой помощник"}
          {language === "en-US" && "VoiceGuide Assistant"}
          {language === "hi-IN" && "वॉइसगाइड सहायक"}
          {language === "es-ES" && "Asistente de Guía de Voz"}
          {language === "de-DE" && "Sprachführer-Assistent"}
          {language === "fr-FR" && "Assistant Guide Vocal"}
        </h3>
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
          <p className="text-gray-500 italic">
            {language === "ar-AE" && "جاري إنشاء الرد حول دبي..."}
            {language === "zh-CN" && "正在生成关于迪拜的回答..."}
            {language === "ru-RU" && "Генерирую ответ о Дубае..."}
            {language === "en-US" && "Generating response about Dubai..."}
            {language === "hi-IN" && "दुबई के बारे में जवाब तैयार कर रहा है..."}
            {language === "es-ES" && "Generando respuesta sobre Dubái..."}
            {language === "de-DE" && "Generiere Antwort über Dubai..."}
            {language === "fr-FR" && "Génération de réponse sur Dubaï..."}
          </p>
        ) : response ? (
          <div className={`whitespace-pre-wrap ${language === "ar-AE" ? "text-right" : ""}`}>{response}</div>
        ) : (
          <p className="text-gray-500 italic">
            {language === "ar-AE" && "اسألني أي شيء عن دبي! يمكنني المساعدة بخصوص المعالم السياحية، آداب التعامل الثقافية، المواصلات، الفعاليات المحلية، وتوصيات الطعام."}
            {language === "zh-CN" && "问我关于迪拜的任何问题！我可以帮助您了解景点、文化礼仪、交通、当地活动和美食推荐。"}
            {language === "ru-RU" && "Спросите меня о чем угодно в Дубае! Я могу помочь с достопримечательностями, культурным этикетом, транспортом, местными событиями и рекомендациями по еде."}
            {language === "en-US" && "Ask me anything about Dubai! I can help with attractions, cultural etiquette, transportation, local events, and food recommendations."}
            {language === "hi-IN" && "दुबई के बारे में कुछ भी पूछें! मैं आपको पर्यटन स्थलों, सांस्कृतिक शिष्टाचार, परिवहन, स्थानीय कार्यक्रमों और भोजन सुझावों के बारे में मदद कर सकता हूं।"}
            {language === "es-ES" && "¡Pregúntame lo que quieras sobre Dubái! Puedo ayudarte con atracciones, etiqueta cultural, transporte, eventos locales y recomendaciones de comida."}
            {language === "de-DE" && "Fragen Sie mich alles über Dubai! Ich kann Ihnen bei Sehenswürdigkeiten, kulturellen Gepflogenheiten, Transport, lokalen Veranstaltungen und Essensempfehlungen helfen."}
            {language === "fr-FR" && "Demandez-moi n'importe quoi sur Dubaï ! Je peux vous aider avec les attractions, l'étiquette culturelle, les transports, les événements locaux et les recommandations de restaurants."}
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
