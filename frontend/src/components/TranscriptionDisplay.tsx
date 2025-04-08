import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  transcript: string;
  isListening: boolean;
  finalTranscript: string;
  className?: string;
  language: string;
}

export function TranscriptionDisplay({
  transcript,
  isListening,
  finalTranscript,
  className = "",
  language
}: Props) {
  // Get language-specific labels
  const getYouSaidLabel = () => {
    switch (language) {
      case "ar-AE":
        return "قلت:";
      case "zh-CN":
        return "你说:";
      case "ru-RU":
        return "Вы сказали:";
      case "hi-IN":
        return "आपने कहा:";
      case "es-ES":
        return "Usted dijo:";
      case "de-DE":
        return "Sie sagten:";
      case "fr-FR":
        return "Vous avez dit:";
      default:
        return "You said:";
    }
  };

  const getListeningLabel = () => {
    switch (language) {
      case "ar-AE":
        return "الاستماع...";
      case "zh-CN":
        return "正在听...";
      case "ru-RU":
        return "Слушаю...";
      case "hi-IN":
        return "सुन रहा हूँ...";
      case "es-ES":
        return "Escuchando...";
      case "de-DE":
        return "Höre zu...";
      case "fr-FR":
        return "À l'écoute...";
      default:
        return "Listening...";
    }
  };

  // Function to parse transcript string into individual questions
  const parseQuestions = (text: string): string[] => {
    if (!text) return [];
    // Split by newlines or by questions ending with ? character
    const questions = text.split(/\n+/).filter(q => q.trim().length > 0);
    return questions;
  };

  return (
    <motion.div 
      className={`rounded-2xl overflow-hidden bg-gradient-to-br from-white dark:from-gray-900 to-amber-50/30 dark:to-amber-950/20 shadow-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-50/50"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-orange-50/30"></div>
        
        {/* Arabic-inspired decorative patterns */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-100/30 to-orange-100/30 w-16 h-16 -top-8 -left-8"></div>
        </div>
        
        {/* Arabic-inspired decorative elements */}
        <div className="absolute top-5 right-5 w-24 h-24">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-5">
            <path d="M40 0L49.4 30.6L80 40L49.4 49.4L40 80L30.6 49.4L0 40L30.6 30.6L40 0Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute bottom-2 left-20 w-16 h-16">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
            <circle cx="30" cy="30" r="30" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="30" cy="30" r="20" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"/>
            <circle cx="30" cy="30" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1"/>
          </svg>
        </div>
        
        <div className="relative">
          <div className="flex items-center mb-4 space-x-2 group justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/0 via-white/30 dark:via-amber-700/30 to-amber-100/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.3516 6.56006C11.0716 6.19006 11.8916 5.95006 12.7816 5.95006" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.34961 9.65039V11.3504C4.34961 15.5704 7.77961 19.0004 11.9996 19.0004C16.2196 19.0004 19.6496 15.5704 19.6496 11.3504V9.65039" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 21.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium ml-2">{getYouSaidLabel()}</h3>
            </div>
          </div>

          <div className="mb-4 min-h-[120px] relative">
            <AnimatePresence mode="wait">
              {isListening && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-0.5"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75 mr-0.5"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <span className="text-red-500 font-medium text-sm">{getListeningLabel()}</span>
                  </div>
                  
                  <motion.div 
                    className="mt-2 p-4 bg-gradient-to-r from-white dark:from-gray-900 to-amber-50/50 dark:to-amber-950/30 rounded-lg border border-amber-200/50 dark:border-amber-800/30 text-gray-800 dark:text-gray-200 shadow-sm relative overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Decorative microphone sound waves */}
                    <div className="absolute right-2 top-2 opacity-10">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 11V13C3 17.97 7.03 22 12 22C16.97 22 21 17.97 21 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 17C9.79 17 8 15.21 8 13V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V13C16 15.21 14.21 17 12 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <motion.path 
                          d="M8 12V13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13V12" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      </svg>
                    </div>
                    {transcript || <span className="italic text-gray-400">...</span>}
                  </motion.div>
                </motion.div>
              )}
              
              {!isListening && finalTranscript && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-y-auto max-h-[400px]"
                >
                  {/* Parse and display questions in separate boxes, in reverse order (last in, first out) */}
                  <div className="space-y-3">
                    {parseQuestions(finalTranscript).reverse().map((question, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-3 bg-gradient-to-r from-white dark:from-gray-900 to-amber-50 dark:to-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800/30 text-gray-800 dark:text-gray-200 shadow-sm relative"
                      >
                        <div className="flex">
                          <div className="rounded-full bg-amber-100 h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                            <span className="text-amber-800 text-sm">•</span>
                          </div>
                          <div className="flex-1">{question}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {!isListening && !finalTranscript && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-[100px] p-4 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-amber-50/20 dark:to-amber-950/20 rounded-lg border border-dashed border-amber-200/50 dark:border-amber-800/30 text-gray-500 dark:text-gray-400 relative overflow-hidden"
                >
                  {/* Decorative sound wave pattern */}
                  <div className="absolute inset-x-0 bottom-0 h-8 opacity-10 overflow-hidden">
                    <svg width="100%" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 12 Q 25 2, 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" fill="none" />
                    </svg>
                  </div>
                  <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                  <p className="text-center">
                    {language === "ar-AE" ? "اضغط على زر الميكروفون للبدء" :
                     language === "zh-CN" ? "点击麦克风按钮开始" :
                     language === "ru-RU" ? "Нажмите кнопку микрофона, чтобы начать" :
                     language === "hi-IN" ? "शुरू करने के लिए माइक्रोफोन बटन दबाएं" :
                     language === "es-ES" ? "Presione el botón del micrófono para comenzar" :
                     language === "de-DE" ? "Drücken Sie die Mikrofontaste, um zu beginnen" :
                     language === "fr-FR" ? "Appuyez sur le bouton du microphone pour commencer" :
                     "Click the microphone button to start"}
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
