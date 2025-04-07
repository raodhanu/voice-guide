// Type definitions for the Web Speech API

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export {}; // This file needs to be a module