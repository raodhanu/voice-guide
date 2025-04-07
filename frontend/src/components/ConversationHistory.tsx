import React from "react";
import { speechSynthesizer } from "../utils/speechSynthesis";

export interface ConversationEntry {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
  language: string;
}

interface Props {
  entries: ConversationEntry[];
  language: string;
  className?: string;
  onReplayAudio: (text: string, language: string) => void;
}

export function ConversationHistory({
  entries,
  language,
  className = "",
  onReplayAudio,
}: Props) {
  // Function to download conversation history as a text file
  const downloadConversation = () => {
    // Create formatted text content
    let content = `VoiceGuide Conversation (${new Date().toLocaleString()})
\n`;
    
    // Sort entries chronologically before adding to download content
    const sortedEntries = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    sortedEntries.forEach(entry => {
      const speaker = entry.type === "user" ? "You" : "VoiceGuide";
      const time = new Intl.DateTimeFormat(language, { 
        hour: "2-digit", 
        minute: "2-digit",
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(entry.timestamp);
      content += `[${time}] ${speaker}: ${entry.text}\n\n`;
    });
    
    // Create blob and download link
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voiceguide-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // Get appropriate title based on current language
  const getLocalizedTitle = () => {
    switch (language) {
      case "ar-AE":
        return "سجل المحادثة";
      case "zh-CN":
        return "对话历史";
      case "ru-RU":
        return "История разговора";
      case "hi-IN":
        return "वार्तालाप इतिहास";
      case "es-ES":
        return "Historial de conversación";
      case "de-DE":
        return "Gesprächsverlauf";
      case "fr-FR":
        return "Historique des conversations";
      default:
        return "Conversation History";
    }
  };

  // Format timestamp based on current language
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    return new Intl.DateTimeFormat(language, options).format(date);
  };

  if (entries.length === 0) {
    return null;
  }

  // Create a copy of entries and sort in reverse chronological order (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className={`rounded-xl bg-white shadow-md p-6 ${className}`}> 
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{getLocalizedTitle()}</h3>
        
        {entries.length > 0 && (
          <button
            onClick={downloadConversation}
            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center text-xs text-gray-700"
            title="Download conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="ml-1">
              {language === "ar-AE" ? "تنزيل" : 
              language === "zh-CN" ? "下载" : 
              language === "ru-RU" ? "Скачать" : 
              language === "hi-IN" ? "डाउनलोड" :
              language === "es-ES" ? "Descargar" :
              language === "de-DE" ? "Herunterladen" :
              language === "fr-FR" ? "Télécharger" : "Download"}
            </span>
          </button>
        )}
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2"> 
        {sortedEntries.map((entry) => (
          <div 
            key={entry.id}
            className={`p-3 rounded-xl ${entry.type === "user" ? "bg-gray-100" : "bg-primary/5 border border-primary/10"} ${entry.language === "ar-AE" ? "text-right" : ""}`} 
          > 
            <div className="flex items-center justify-between mb-1"> 
              <span className="text-xs text-gray-500 font-medium"> 
                {entry.type === "user" ? 
                  (language === "ar-AE" ? "أنت" : 
                   language === "zh-CN" ? "您" : 
                   language === "ru-RU" ? "Вы" : 
                   language === "hi-IN" ? "आप" :
                   language === "es-ES" ? "Tú" :
                   language === "de-DE" ? "Sie" :
                   language === "fr-FR" ? "Vous" : "You") : 
                  (language === "ar-AE" ? "دليل صوتي" : 
                   language === "zh-CN" ? "语音导览" : 
                   language === "ru-RU" ? "Голосовой гид" : 
                   language === "hi-IN" ? "वॉइसगाइड" :
                   language === "es-ES" ? "Guía de Voz" :
                   language === "de-DE" ? "Sprachführer" :
                   language === "fr-FR" ? "Guide Vocal" : "VoiceGuide")}
              </span> 
              <span className="text-xs text-gray-500">{formatTime(entry.timestamp)}</span> 
            </div> 
            
            <p className="text-sm whitespace-pre-wrap">{entry.text}</p> 
            
            {entry.type === "assistant" && (
              <div className="mt-2 flex justify-end"> 
                <button 
                  onClick={() => onReplayAudio(entry.text, entry.language)} 
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center text-xs text-gray-700" 
                  title={language === "ar-AE" ? "إعادة الاستماع" : 
                         language === "zh-CN" ? "重新播放" : 
                         language === "ru-RU" ? "Воспроизвести" : 
                         language === "hi-IN" ? "पुनः चलाएं" :
                         language === "es-ES" ? "Volver a reproducir" :
                         language === "de-DE" ? "Wiedergeben" :
                         language === "fr-FR" ? "Réécouter" : "Replay"} 
                > 
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg> 
                  <span className="ml-1"> 
                    {language === "ar-AE" ? "استماع" : 
                     language === "zh-CN" ? "播放" : 
                     language === "ru-RU" ? "Аудио" : 
                     language === "hi-IN" ? "सुनें" :
                     language === "es-ES" ? "Escuchar" :
                     language === "de-DE" ? "Hören" :
                     language === "fr-FR" ? "Écouter" : "Listen"} 
                  </span> 
                </button> 
              </div> 
            )} 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
}
