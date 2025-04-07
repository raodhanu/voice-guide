/**
 * Utility for handling speech recognition using the Web Speech API
 */

// Interface for the SpeechRecognition event callbacks
export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Types for browser compatibility
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

import './speech-types';

// Get the appropriate SpeechRecognition constructor for the browser
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class SpeechRecognizer {
  private recognition: any;
  private isListening: boolean = false;
  private callbacks: SpeechRecognitionCallbacks = {};

  constructor() {
    if (!SpeechRecognition) {
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure the recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US'; // Default to English

    // Setup event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks.onStart) this.callbacks.onStart();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!this.callbacks.onResult) return;
      
      const resultIndex = event.resultIndex;
      const results = event.results;
      
      if (resultIndex >= results.length) return;
      
      const result = results[resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      this.callbacks.onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      if (this.callbacks.onError) this.callbacks.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };
  }

  /**
   * Set the language for speech recognition
   * @param lang Language code (e.g., 'en-US', 'ar-AE', 'zh-CN', 'ru-RU', 'hi-IN', 'es-ES', 'de-DE', 'fr-FR')
   */
  public setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Start listening for speech
   * @param callbacks Object containing callback functions for different speech recognition events
   */
  public startListening(callbacks: SpeechRecognitionCallbacks = {}) {
    if (!this.recognition) {
      if (callbacks.onError) callbacks.onError('Speech Recognition not supported');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.callbacks = callbacks;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (callbacks.onError) callbacks.onError('Failed to start speech recognition');
    }
  }

  /**
   * Stop listening for speech
   */
  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  /**
   * Check if speech recognition is supported in this browser
   */
  public static isSupported(): boolean {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}

// Create a singleton instance for easy import
export const speechRecognizer = new SpeechRecognizer();
