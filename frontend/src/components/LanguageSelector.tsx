import React from "react";

interface Props {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  className = "",
}: Props) {
  // Supported languages with their codes, names and flag emojis
  const languages: LanguageOption[] = [
    { code: "en-US", name: "English", flag: "🇺🇸" },
    { code: "ar-AE", name: "Arabic", flag: "🇦🇪" },
    { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
    { code: "ru-RU", name: "Russian", flag: "🇷🇺" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
  ];

  return (
    <div className={`flex items-center ${className} relative group`}>
      {/* Decorative elements */}
      <div className="absolute -z-10 inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -right-2 -top-2 w-6 h-6 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L14.7 8.3L23 11L14.7 13.7L12 22L9.3 13.7L1 11L9.3 8.3L12 0Z" fill="currentColor"/>
        </svg>
      </div>
      
      <label 
        htmlFor="language-select" 
        className="text-sm font-medium mr-2 relative overflow-hidden group-hover:text-primary transition-colors duration-300"
      >
        <span className="relative z-10">Language:</span>
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </label>
      
      <div className="relative">
        <select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="appearance-none rounded-md bg-white/80 dark:bg-gray-800/80 border border-amber-100 dark:border-amber-800/50 py-1.5 pl-2 pr-8 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)'
          }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="py-1">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow with Arabic-inspired design */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-amber-500 group-hover:text-primary transition-colors duration-300">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="ml-2 text-xs bg-gradient-to-r from-primary/10 to-secondary/10 px-2 py-0.5 rounded-full font-medium text-gray-600 border border-transparent group-hover:border-amber-100/50 transition-all duration-300 shadow-sm">
        {currentLanguage === "ar-AE" && "تحدث بالعربية"}
        {currentLanguage === "zh-CN" && "用中文说话"}
        {currentLanguage === "ru-RU" && "Говорите по-русски"}
        {currentLanguage === "en-US" && "Speak in English"}
        {currentLanguage === "hi-IN" && "हिंदी में बोलें"}
        {currentLanguage === "es-ES" && "Habla en español"}
        {currentLanguage === "de-DE" && "Sprechen Sie Deutsch"}
        {currentLanguage === "fr-FR" && "Parlez en français"}
      </div>
    </div>
  );
}
