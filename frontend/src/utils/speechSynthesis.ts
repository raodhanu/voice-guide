/**
 * Utility for handling speech synthesis using the Web Speech API
 */

// Interface for speech synthesis options
export interface SpeechSynthesisOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export class SpeechSynthesizer {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Chrome loads voices asynchronously, so we need to set up an event listener
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  /**
   * Load available voices
   */
  private loadVoices(): void {
    const voices = this.synthesis.getVoices();
    if (voices.length > 0) {
      this.availableVoices = voices;
    }
  }
  
  /**
   * Get all available voices
   */
  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0) {
      this.loadVoices();
    }
    return this.availableVoices;
  }
  
  /**
   * Get voices for a specific language
   * @param lang Language code (e.g., 'en-US', 'ar-AE')
   */
  public getVoicesForLanguage(lang: string): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice => 
      voice.lang.toLowerCase().includes(lang.toLowerCase())
    );
  }
  
  /**
   * Get the default voice for a language
   * @param lang Language code
   */
  public getDefaultVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
    const voices = this.getVoicesForLanguage(lang);
    
    // Try to get a voice with 'default' flag first
    const defaultVoice = voices.find(voice => voice.default);
    if (defaultVoice) return defaultVoice;
    
    // Otherwise, return the first voice for this language
    return voices.length > 0 ? voices[0] : null;
  }
  
  /**
   * Speak the given text
   * @param options Speech synthesis options
   */
  public speak(options: SpeechSynthesisOptions): void {
    if (!options.text.trim()) return;
    
    // Cancel any ongoing speech
    this.stop();
    
    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(options.text);
    
    // Set options
    if (options.lang) this.utterance.lang = options.lang;
    if (options.rate !== undefined) this.utterance.rate = options.rate;
    if (options.pitch !== undefined) this.utterance.pitch = options.pitch;
    if (options.volume !== undefined) this.utterance.volume = options.volume;
    if (options.voice) this.utterance.voice = options.voice;
    
    // Set event handlers
    this.utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (options.onStart) options.onStart();
    };
    
    this.utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (options.onEnd) options.onEnd();
    };
    
    this.utterance.onerror = (event) => {
      if (options.onError) options.onError(event.error);
    };
    
    this.utterance.onpause = () => {
      this.isPaused = true;
      if (options.onPause) options.onPause();
    };
    
    this.utterance.onresume = () => {
      this.isPaused = false;
      if (options.onResume) options.onResume();
    };
    
    // Start speaking
    this.synthesis.speak(this.utterance);
  }
  
  /**
   * Pause speech
   */
  public pause(): void {
    if (this.isSpeaking && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
    }
  }
  
  /**
   * Resume speech
   */
  public resume(): void {
    if (this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
    }
  }
  
  /**
   * Stop speech
   */
  public stop(): void {
    try {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    } catch (error) {
      console.error('Error cancelling speech synthesis:', error);
    }
  }
  
  /**
   * Check if speech synthesis is currently speaking
   */
  public isSpeakingNow(): boolean {
    return this.isSpeaking;
  }
  
  /**
   * Check if speech synthesis is currently paused
   */
  public isPausedNow(): boolean {
    return this.isPaused;
  }
  
  /**
   * Check if speech synthesis is supported in this browser
   */
  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Create a singleton instance for easy import
export const speechSynthesizer = new SpeechSynthesizer();
