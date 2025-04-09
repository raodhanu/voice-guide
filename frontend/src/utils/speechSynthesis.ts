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
    // Extract primary language code (e.g., 'en' from 'en-US')
    const primaryLang = lang.split('-')[0].toLowerCase();
    
    // First try exact match
    const exactMatches = this.getVoices().filter(voice => 
      voice.lang.toLowerCase() === lang.toLowerCase()
    );
    
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // Then try matching by primary language code
    return this.getVoices().filter(voice => 
      voice.lang.toLowerCase().startsWith(primaryLang)
    );
  }
  
  /**
   * Get the default voice for a language
   * @param lang Language code
   */
  public getDefaultVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
    // Try to get exact language match first
    const voices = this.getVoicesForLanguage(lang);
    
    // Try to get a voice with 'default' flag first
    const defaultVoice = voices.find(voice => voice.default);
    if (defaultVoice) return defaultVoice;
    
    // Otherwise, return the first voice for this language
    if (voices.length > 0) {
      return voices[0];
    }
    
    // Improved fallback logic below when no matching voice is found
    console.log(`No exact voice match found for ${lang}, trying alternative approaches`);
    
    // Step 1: Try more permissive language matching with just primary language code
    const primaryLang = lang.split('-')[0].toLowerCase();
    const allVoices = this.getVoices();
    
    // Find any voice containing the primary language code
    const looseMatches = allVoices.filter(voice => 
      voice.lang.toLowerCase().includes(primaryLang)
    );
    
    if (looseMatches.length > 0) {
      console.log(`Found ${looseMatches.length} voices with loose match for '${primaryLang}'`);
      return looseMatches[0];
    }
    
    // Step 2: Try language family/region fallbacks for better voice quality
    const regionFallbacks: Record<string, string[]> = {
      'ar': ['ar', 'fa', 'ur', 'en-GB', 'fr-FR', 'en-US'],      // Arabic - try Persian, Urdu, then European voices
      'zh': ['zh', 'ja', 'ko', 'en-US', 'en-GB'],               // Chinese - try other Asian languages first
      'ru': ['ru', 'uk', 'pl', 'cs', 'bg', 'de-DE', 'en-GB'],   // Russian - try Slavic languages first
      'hi': ['hi', 'bn', 'ur', 'en-IN', 'en-GB', 'en-US'],      // Hindi - try Indian/South Asian voices
      'es': ['es', 'pt', 'it', 'fr', 'en-US', 'en-GB'],         // Spanish - try Romance languages first
      'de': ['de', 'nl', 'sv', 'da', 'en-GB', 'en-US'],         // German - try Germanic languages first
      'fr': ['fr', 'it', 'es', 'pt', 'en-GB', 'en-US'],         // French - try Romance languages first
    };
    
    // Try each fallback in order until we find a voice
    const fallbacks = regionFallbacks[primaryLang] || ['en-US', 'en-GB', 'en'];
    
    for (const fallbackLang of fallbacks) {
      // Try exact fallback first
      const exactFallbackMatches = allVoices.filter(voice => 
        voice.lang.toLowerCase() === fallbackLang.toLowerCase()
      );
      
      if (exactFallbackMatches.length > 0) {
        console.log(`Using '${fallbackLang}' as fallback for '${lang}'`);
        // Prefer default voice if available
        const defaultFallback = exactFallbackMatches.find(v => v.default);
        return defaultFallback || exactFallbackMatches[0];
      }
      
      // Try with just primary language code of fallback
      const primaryFallback = fallbackLang.split('-')[0].toLowerCase();
      const looseFallbackMatches = allVoices.filter(voice => 
        voice.lang.toLowerCase().startsWith(primaryFallback)
      );
      
      if (looseFallbackMatches.length > 0) {
        console.log(`Using '${primaryFallback}' as loose fallback for '${lang}'`);
        // Prefer default voice if available
        const defaultLooseFallback = looseFallbackMatches.find(v => v.default);
        return defaultLooseFallback || looseFallbackMatches[0];
      }
    }
    
    // Final fallback - use ANY available voice rather than returning null
    if (allVoices.length > 0) {
      console.log(`No specific fallback found for '${lang}', using first available voice`);
      // Try to find a default voice
      const anyDefault = allVoices.find(v => v.default);
      return anyDefault || allVoices[0];
    }
    
    // If we get here, there are no voices available at all
    console.warn(`No voices available in this browser for any language`);
    return null;
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
    
    // Only set voice if it's available, as some browsers may throw errors otherwise
    if (options.voice) {
      try {
        this.utterance.voice = options.voice;
      } catch (error) {
        console.warn('Error setting voice:', error);
        // Continue without setting voice - browser will use its default
      }
    }
    
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
