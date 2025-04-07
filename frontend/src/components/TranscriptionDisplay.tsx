import React from "react";

interface Props {
  transcript: string;
  isListening: boolean;
  finalTranscript: string;
  className?: string;
  language?: string;
}

export function TranscriptionDisplay({ transcript, isListening, finalTranscript, className = "", language = "en-US" }: Props) {
  return (
    <div className={`rounded-xl bg-white shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {language === "ar-AE" && "النص المكتوب"}
          {language === "zh-CN" && "转录"}
          {language === "ru-RU" && "Транскрипция"}
          {language === "en-US" && "Transcription"}
          {language === "hi-IN" && "प्रतिलेखन"}
          {language === "es-ES" && "Transcripción"}
          {language === "de-DE" && "Transkription"}
          {language === "fr-FR" && "Transcription"}
        </h3>
        {isListening && (
          <div className="flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              {language === "ar-AE" && "جاري الاستماع..."}
              {language === "zh-CN" && "正在聆听..."}
              {language === "ru-RU" && "Слушаю..."}
              {language === "en-US" && "Listening..."}
              {language === "hi-IN" && "सुन रहा है..."}
              {language === "es-ES" && "Escuchando..."}
              {language === "de-DE" && "Höre zu..."}
              {language === "fr-FR" && "En écoute..."}
            </span>
          </div>
        )}
      </div>
      
      {/* Current transcript */}
      <div className="mb-4">
        <p className="italic text-gray-600">
          {transcript ? transcript : isListening ? "Speak now..." : "Press the microphone button to start speaking"}
        </p>
      </div>
      
      {/* Final transcripts */}
      {finalTranscript && (
        <div>
          <div className="h-px bg-gray-200 my-4"></div>
          <h4 className="text-sm font-medium mb-2">Previous Messages</h4>
          <p className="text-gray-800">{finalTranscript}</p>
        </div>
      )}
    </div>
  );
}