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
    <div className={`flex items-center ${className}`}>
      <label htmlFor="language-select" className="text-sm font-medium mr-2">
        Language:
      </label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="rounded-md border border-gray-300 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      
      <div className="ml-2 text-xs text-gray-500">
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
