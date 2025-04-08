import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speechSynthesizer } from "utils/speechSynthesis";
import ReactMarkdown from "react-markdown";

interface Props {
  response: string;
  isLoading: boolean;
  suggestedFollowups: string[];
  onFollowupClick: (followup: string) => void;
  className?: string;
  language: string;
}

export function AIResponseDisplay({
  response,
  isLoading,
  suggestedFollowups,
  onFollowupClick,
  className = "",
  language
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  
  // Determine if we should auto-read response
  useEffect(() => {
    if (response && !isLoading) {
      handleSpeakResponse();
    }
  }, [response, isLoading]);
  
  // Get language-specific labels
  const getAssistantLabel = () => {
    switch (language) {
      case "ar-AE":
        return "مساعد دبي:";
      case "zh-CN":
        return "迪拜助手:";
      case "ru-RU":
        return "Помощник Дубая:";
      case "hi-IN":
        return "दुबई सहायक:";
      case "es-ES":
        return "Asistente de Dubái:";
      case "de-DE":
        return "Dubai-Assistent:";
      case "fr-FR":
        return "Assistant de Dubaï:";
      default:
        return "Dubai Assistant:";
    }
  };
  
  const getPlayLabel = () => {
    switch (language) {
      case "ar-AE":
        return "استمع";
      case "zh-CN":
        return "收听";
      case "ru-RU":
        return "Слушать";
      case "hi-IN":
        return "सुनें";
      case "es-ES":
        return "Escuchar";
      case "de-DE":
        return "Anhören";
      case "fr-FR":
        return "Écouter";
      default:
        return "Listen";
    }
  };
  
  const getPauseLabel = () => {
    switch (language) {
      case "ar-AE":
        return "توقف";
      case "zh-CN":
        return "暂停";
      case "ru-RU":
        return "Пауза";
      case "hi-IN":
        return "रोकें";
      case "es-ES":
        return "Pausar";
      case "de-DE":
        return "Pause";
      case "fr-FR":
        return "Pause";
      default:
        return "Pause";
    }
  };
  
  const getStopLabel = () => {
    switch (language) {
      case "ar-AE":
        return "أوقف";
      case "zh-CN":
        return "停止";
      case "ru-RU":
        return "Стоп";
      case "hi-IN":
        return "बंद करें";
      case "es-ES":
        return "Detener";
      case "de-DE":
        return "Stopp";
      case "fr-FR":
        return "Arrêt";
      default:
        return "Stop";
    }
  };
  
  const getResumeLabel = () => {
    switch (language) {
      case "ar-AE":
        return "استأنف";
      case "zh-CN":
        return "继续";
      case "ru-RU":
        return "Продолжить";
      case "hi-IN":
        return "जारी रखें";
      case "es-ES":
        return "Reanudar";
      case "de-DE":
        return "Fortsetzen";
      case "fr-FR":
        return "Reprendre";
      default:
        return "Resume";
    }
  };
  
  const getAskMeLabel = () => {
    switch (language) {
      case "ar-AE":
        return "اسألني شيئًا آخر:";
      case "zh-CN":
        return "问我别的:";
      case "ru-RU":
        return "Спросите меня еще:";
      case "hi-IN":
        return "मुझसे कुछ और पूछें:";
      case "es-ES":
        return "Pregúntame algo más:";
      case "de-DE":
        return "Frag mich etwas anderes:";
      case "fr-FR":
        return "Demandez-moi autre chose:";
      default:
        return "Ask me something else:";
    }
  };
  
  const getLoadingLabel = () => {
    switch (language) {
      case "ar-AE":
        return "جارٍ التفكير...";
      case "zh-CN":
        return "思考中...";
      case "ru-RU":
        return "Думаю...";
      case "hi-IN":
        return "सोच रहा हूँ...";
      case "es-ES":
        return "Pensando...";
      case "de-DE":
        return "Nachdenken...";
      case "fr-FR":
        return "Réflexion...";
      default:
        return "Thinking...";
    }
  };
  
  // Handle speaking response
  const handleSpeakResponse = () => {
    if (isSpeaking) {
      // If already speaking and not paused, stop speaking
      if (!isPaused) {
        speechSynthesizer.pause();
        setIsPaused(true);
      } else {
        // If paused, resume speaking
        speechSynthesizer.resume();
        setIsPaused(false);
      }
      return;
    }
    
    if (!response) return;
    
    const voice = speechSynthesizer.getDefaultVoiceForLanguage(language);
    
    // Adjust speech rate based on language
    let rate = 1.0;
    if (language === 'ar-AE') {
      rate = 0.9;
    } else if (language === 'zh-CN') {
      rate = 0.85;
    } else if (language === 'ru-RU') {
      rate = 0.95;
    } else if (language === 'hi-IN') {
      rate = 0.9;
    } else if (language === 'es-ES') {
      rate = 0.95;
    } else if (language === 'de-DE') {
      rate = 1.0;
    } else if (language === 'fr-FR') {
      rate = 0.95;
    }
    
    speechSynthesizer.speak({
      text: response,
      lang: language,
      voice: voice,
      rate: rate,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: (error) => {
        console.error("Speech synthesis error:", error);
        setIsSpeaking(false);
        setIsPaused(false);
      }
    });
  };
  
  // Handle stopping speech
  const handleStopSpeech = () => {
    speechSynthesizer.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <motion.div 
      className={`rounded-2xl overflow-hidden bg-gradient-to-br from-white dark:from-gray-900 to-blue-50 dark:to-blue-950/20 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="p-5 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-teal-50/50"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue-50/30"></div>
        
        {/* Arabic-inspired decorative patterns */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform -rotate-45 bg-gradient-to-r from-teal-100/30 to-blue-100/30 w-16 h-16 -top-8 -right-8"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-teal-100 to-teal-200 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7.81V13.5C22 18.09 18.09 22 13.5 22H10.5C5.91 22 2 18.09 2 13.5V10.5C2 5.91 5.91 2 10.5 2H16.19C17.07 2 17.78 2.64 17.86 3.51C17.92 4.21 18.4 4.83 19.08 5.09C20.22 5.53 21 6.62 21 7.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.2 21.4C17.46 21.78 16.64 22 15.79 22H13.5C8.91 22 5 18.09 5 13.5V11.21C5 10.36 5.22 9.54 5.6 8.8C6.22 7.53 7.27 6.54 8.58 6.03C9.4 5.71 10.2 5.55 11 5.55H12.53C13.11 5.55 13.65 5.73 14.1 6.05C14.55 6.37 14.89 6.83 15.08 7.37C15.23 7.8 15.51 8.17 15.86 8.43C16.22 8.7 16.66 8.87 17.14 8.87H19.08C19.68 8.87 20.25 9.11 20.7 9.54C21.16 9.98 21.42 10.56 21.41 11.17V15.79C21.41 17.86 20.1 19.7 18.2 20.67V21.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 13.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 17H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium">{getAssistantLabel()}</h3>

            {/* Audio controls */}
            <div className="ml-auto flex items-center space-x-2">
              {response && (
                <AnimatePresence mode="wait">
                  {!isSpeaking ? (
                    <motion.button
                      key="play"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleSpeakResponse}
                      className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 transition-all duration-200 shadow-sm border border-teal-200" 
                      title={getPlayLabel()}
                      aria-label={getPlayLabel()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.96484 3.46484V20.5348C7.96484 22.2648 9.83484 23.3048 11.2848 22.3448L21.0348 15.8148C21.3848 15.5548 21.6748 15.2248 21.8748 14.8348C22.0748 14.4448 22.1748 14.0148 22.1748 13.5748V10.4248C22.1748 9.98484 22.0748 9.55484 21.8748 9.16484C21.6748 8.77484 21.3848 8.44484 21.0348 8.18484L11.2848 1.65484C9.83484 0.694844 7.96484 1.73484 7.96484 3.46484Z" fill="currentColor"/>
                        <path d="M3.00195 7.5V16.5C3.00195 17.22 3.58195 17.8 4.30195 17.8H7.00195V6.2H4.30195C3.58195 6.2 3.00195 6.78 3.00195 7.5Z" fill="currentColor"/>
                      </svg>
                    </motion.button>
                  ) : isPaused ? (
                    <motion.button
                      key="resume"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleSpeakResponse}
                      className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 transition-all duration-200 shadow-sm border border-teal-200" 
                      title={getResumeLabel()}
                      aria-label={getResumeLabel()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.96484 3.46484V20.5348C7.96484 22.2648 9.83484 23.3048 11.2848 22.3448L21.0348 15.8148C21.3848 15.5548 21.6748 15.2248 21.8748 14.8348C22.0748 14.4448 22.1748 14.0148 22.1748 13.5748V10.4248C22.1748 9.98484 22.0748 9.55484 21.8748 9.16484C21.6748 8.77484 21.3848 8.44484 21.0348 8.18484L11.2848 1.65484C9.83484 0.694844 7.96484 1.73484 7.96484 3.46484Z" fill="currentColor"/>
                        <path d="M3.00195 7.5V16.5C3.00195 17.22 3.58195 17.8 4.30195 17.8H7.00195V6.2H4.30195C3.58195 6.2 3.00195 6.78 3.00195 7.5Z" fill="currentColor"/>
                      </svg>
                    </motion.button>
                  ) : (
                    <motion.button
                      key="pause"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleSpeakResponse}
                      className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 transition-all duration-200 shadow-sm border border-amber-200"
                      title={getPauseLabel()}
                      aria-label={getPauseLabel()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" fill="currentColor"/>
                        <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" fill="currentColor"/>
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              )}
              
              {isSpeaking && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleStopSpeech}
                  className="flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 transition-all duration-200 shadow-sm border border-red-200"
                  title={getStopLabel()}
                  aria-label={getStopLabel()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 8.65V15.35C21 17.1 19.1 19 17.35 19H6.65C4.9 19 3 17.1 3 15.35V8.65C3 6.9 4.9 5 6.65 5H17.35C19.1 5 21 6.9 21 8.65Z" fill="currentColor"/>
                  </svg>
                </motion.button>
              )}
            </div>
          </div>

          <div className="mb-4 min-h-[120px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-0.5"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-75 mr-0.5"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <span className="ml-2 text-teal-500 font-medium text-sm">{getLoadingLabel()}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center p-6 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <div className="relative w-12 h-12 mb-4">
                      <motion.div 
                        className="absolute inset-0 rounded-full border-4 border-t-teal-300 border-r-teal-300 border-b-teal-100 border-l-teal-100"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <p className="text-center text-gray-500">
                      {language === "ar-AE" ? "جارٍ معالجة طلبك..." :
                       language === "zh-CN" ? "正在处理您的请求..." :
                       language === "ru-RU" ? "Обработка вашего запроса..." :
                       language === "hi-IN" ? "आपके अनुरोध पर कार्रवाई की जा रही है..." :
                       language === "es-ES" ? "Procesando su solicitud..." :
                       language === "de-DE" ? "Verarbeite Ihre Anfrage..." :
                       language === "fr-FR" ? "Traitement de votre demande..." :
                       "Processing your request..."}
                    </p>
                  </div>
                </motion.div>
              ) : response ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    ref={responseRef}
                    className={`p-4 bg-gradient-to-r from-white dark:from-gray-900 to-teal-50 dark:to-teal-950/30 rounded-lg border border-teal-100 dark:border-teal-900/50 text-gray-800 dark:text-gray-200 shadow-sm overflow-y-auto max-h-[200px] prose prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-teal-700 dark:prose-strong:text-teal-400 ${isSpeaking && !isPaused ? 'border-teal-300 dark:border-teal-700 ring-1 ring-teal-300/30 dark:ring-teal-700/30' : ''}`}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReactMarkdown>{response}</ReactMarkdown>
                    
                    {/* Audio indicator */}
                    {isSpeaking && !isPaused && (
                      <div className="mt-3 flex items-center py-2 px-3 rounded-full bg-teal-50 text-teal-500 text-xs w-fit">
                        <div className="flex space-x-0.5 mr-1.5">
                          <motion.div 
                            className="w-1 h-2 bg-teal-400 rounded"
                            animate={{ height: [2, 6, 2] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                          />
                          <motion.div 
                            className="w-1 h-2 bg-teal-400 rounded"
                            animate={{ height: [6, 2, 6] }}
                            transition={{ duration: 0.75, repeat: Infinity, repeatType: "reverse" }}
                          />
                          <motion.div 
                            className="w-1 h-2 bg-teal-400 rounded"
                            animate={{ height: [4, 8, 4] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                          />
                        </div>
                        <span>Speaking...</span>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Suggested followups */}
                  {suggestedFollowups.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="mt-4"
                    >
                      <h4 className="text-sm font-medium text-gray-600 mb-2">{getAskMeLabel()}</h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestedFollowups.map((followup, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            onClick={() => onFollowupClick(followup)}
                            className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 rounded-full border border-teal-200 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-700 shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5"
                          >
                            {followup}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-[150px] p-4 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.5-4.5c.6.068 1.2.127 1.8.175 1.584.233 2.707 1.626 2.707 3.225V6.5a3.5 3.5 0 00-3.5-3.5h-9A3.5 3.5 0 004.5 6.5v6.75z"></path>
                  </svg>
                  <p className="text-center">
                    {language === "ar-AE" ? "قل مرحبًا للحصول على مساعدة" :
                     language === "zh-CN" ? "打个招呼获取帮助" :
                     language === "ru-RU" ? "Скажите 'привет', чтобы получить помощь" :
                     language === "hi-IN" ? "मदद के लिए हैलो कहें" :
                     language === "es-ES" ? "Diga hola para obtener ayuda" :
                     language === "de-DE" ? "Sagen Sie Hallo für Hilfe" :
                     language === "fr-FR" ? "Dites bonjour pour obtenir de l'aide" :
                     "Say hello to get assistance"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
