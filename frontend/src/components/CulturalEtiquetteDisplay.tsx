import React from "react";
import { EtiquetteResponse, etiquetteCategories, getEtiquetteCategoryById } from "utils/culturalEtiquette";

interface Props {
  etiquetteInfo?: EtiquetteResponse;
  isLoading?: boolean;
  className?: string;
  language?: string;
}

export function CulturalEtiquetteDisplay({
  etiquetteInfo,
  isLoading = false,
  className = "",
  language = "en-US",
}: Props) {
  if (!etiquetteInfo && !isLoading) return null;
  
  // Find the category for the response
  const category = etiquetteInfo?.category ? 
    getEtiquetteCategoryById(etiquetteInfo.category) : undefined;
  
  // Get appropriate title based on current language
  const getLocalizedTitle = () => {
    if (!etiquetteInfo) return "";
    
    const base = category?.name || "Cultural Guidance";
    
    switch (language) {
      case "ar-AE":
        return base === "Cultural Guidance" ? "إرشادات ثقافية" : base;
      case "zh-CN":
        return base === "Cultural Guidance" ? "文化指导" : base;
      case "ru-RU":
        return base === "Cultural Guidance" ? "Культурные рекомендации" : base;
      case "hi-IN":
        return base === "Cultural Guidance" ? "सांस्कृतिक मार्गदर्शन" : base;
      case "es-ES":
        return base === "Cultural Guidance" ? "Orientación Cultural" : base;
      case "de-DE":
        return base === "Cultural Guidance" ? "Kulturelle Hinweise" : base;
      case "fr-FR":
        return base === "Cultural Guidance" ? "Conseils Culturels" : base;
      default:
        return base;
    }
  };
  
  if (isLoading) {
    return (
      <div className={`rounded-xl bg-gradient-to-br from-white dark:from-gray-900 to-amber-50/30 dark:to-amber-950/20 shadow-md overflow-hidden relative ${className}`}>
        {/* Decorative elements */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-100/10"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-100/10"></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(120deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`, backgroundSize: '20px 20px' }}></div>
        </div>
        
        <div className="p-6 animate-pulse relative dark:text-gray-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 shadow-sm relative">
              <div className="absolute inset-0 rounded-full border border-amber-200/50"></div>
            </div>
            <div className="h-6 w-48 bg-gradient-to-r from-amber-200/50 dark:from-amber-800/50 to-amber-100/30 dark:to-amber-800/30 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-amber-100/40 dark:from-amber-800/40 to-amber-50/20 dark:to-amber-900/20 rounded-md w-full relative overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-amber-100/40 dark:from-amber-800/40 to-amber-50/20 dark:to-amber-900/20 rounded-md w-5/6 relative overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-amber-100/40 dark:from-amber-800/40 to-amber-50/20 dark:to-amber-900/20 rounded-md w-4/6 relative overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!etiquetteInfo) return null;
  
  return (
    <div className={`rounded-xl bg-gradient-to-br from-white dark:from-gray-900 to-amber-50/30 dark:to-amber-950/20 shadow-md overflow-hidden relative ${className}`}>
      {/* Decorative pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(60deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`, backgroundSize: '30px 30px' }}></div>
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-tl-3xl bg-primary/5 transform rotate-45 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary/5 to-transparent opacity-30"></div>
      
      {/* Decorative top border inspired by Arabic patterns */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="p-6 relative">
        {/* Header with icon and title */}
        <div className="flex items-center mb-6">
          {category && (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-md relative group ${category.color} transition-all duration-300 hover:shadow-lg`}>
              {/* Decorative border */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute inset-1 rounded-full border border-white/10"></div>
              
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
              >
                <path d={category.icon} />
              </svg>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 group relative inline-block">
              {getLocalizedTitle()}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </h3>
            {category && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
            )}
          </div>
        </div>
        
        {/* Main advice */}
        <div className={`prose max-w-none mb-6 ${language === "ar-AE" ? "text-right" : ""} bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg border border-amber-100/50 dark:border-amber-800/30 shadow-sm relative overflow-hidden dark:prose-invert`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-4 bg-gradient-to-l from-amber-100/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-32 h-4 bg-gradient-to-r from-amber-100/20 to-transparent"></div>
          
          <p className="leading-relaxed dark:text-gray-300">{etiquetteInfo.advice}</p>
          {etiquetteInfo.additional_info && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-amber-50/50 dark:bg-amber-950/30 p-2 rounded border-l-2 border-amber-200 dark:border-amber-800">{etiquetteInfo.additional_info}</p>
          )}
        </div>
        
        {/* Do's and Don'ts */}
        {(etiquetteInfo.do_tips?.length || etiquetteInfo.dont_tips?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {etiquetteInfo.do_tips?.length > 0 && (
              <div className={`bg-gradient-to-br from-green-50 dark:from-green-950 to-green-50/70 dark:to-green-950/50 rounded-lg p-5 ${language === "ar-AE" ? "text-right" : ""} backdrop-blur-sm border border-green-100 dark:border-green-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
                {/* Decorative corner element */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-tl-2xl bg-green-100/30 transform rotate-45 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-3 flex items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-green-600">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.75 12L10.58 14.83L16.25 9.17001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {language === "ar-AE" ? "افعل" : 
                   language === "zh-CN" ? "请做" : 
                   language === "ru-RU" ? "Рекомендуется" : 
                   language === "hi-IN" ? "करें" :
                   language === "es-ES" ? "Recomendado" :
                   language === "de-DE" ? "Empfohlen" :
                   language === "fr-FR" ? "À faire" :
                   "Do's"}
                </h4>
                <ul className="text-sm space-y-2 list-none ml-2 text-green-800 dark:text-green-300">
                  {etiquetteInfo.do_tips.map((tip, index) => (
                    <li key={`do-${index}`} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {etiquetteInfo.dont_tips?.length > 0 && (
              <div className={`bg-gradient-to-br from-red-50 dark:from-red-950 to-red-50/70 dark:to-red-950/50 rounded-lg p-5 ${language === "ar-AE" ? "text-right" : ""} backdrop-blur-sm border border-red-100 dark:border-red-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
                {/* Decorative corner element */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-tl-2xl bg-red-100/30 transform rotate-45 opacity-50 group-hover:scale-125 transition-transform duration-500"></div>
                <h4 className="font-medium text-red-700 dark:text-red-400 mb-3 flex items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-red-600">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 15L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {language === "ar-AE" ? "لا تفعل" : 
                   language === "zh-CN" ? "请勿" : 
                   language === "ru-RU" ? "Не рекомендуется" : 
                   language === "hi-IN" ? "न करें" :
                   language === "es-ES" ? "No recomendado" :
                   language === "de-DE" ? "Nicht empfohlen" :
                   language === "fr-FR" ? "À éviter" :
                   "Don'ts"}
                </h4>
                <ul className="text-sm space-y-2 list-none ml-2 text-red-800 dark:text-red-300">
                  {etiquetteInfo.dont_tips.map((tip, index) => (
                    <li key={`dont-${index}`} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
