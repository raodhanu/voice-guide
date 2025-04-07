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
      <div className={`rounded-xl bg-white shadow-md overflow-hidden ${className}`}>
        <div className="p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="h-6 w-48 bg-gray-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!etiquetteInfo) return null;
  
  return (
    <div className={`rounded-xl bg-white shadow-md overflow-hidden ${className}`}>
      <div className="p-6">
        {/* Header with icon and title */}
        <div className="flex items-center mb-4">
          {category && (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${category.color}`}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d={category.icon} />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-medium">{getLocalizedTitle()}</h3>
        </div>
        
        {/* Main advice */}
        <div className={`prose max-w-none mb-6 ${language === "ar-AE" ? "text-right" : ""}`}>
          <p>{etiquetteInfo.advice}</p>
          {etiquetteInfo.additional_info && (
            <p className="text-sm text-muted-foreground mt-2">{etiquetteInfo.additional_info}</p>
          )}
        </div>
        
        {/* Do's and Don'ts */}
        {(etiquetteInfo.do_tips?.length || etiquetteInfo.dont_tips?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {etiquetteInfo.do_tips?.length > 0 && (
              <div className={`bg-green-50 rounded-lg p-4 ${language === "ar-AE" ? "text-right" : ""}`}>
                <h4 className="font-medium text-green-700 mb-2">
                  {language === "ar-AE" ? "افعل" : 
                   language === "zh-CN" ? "请做" : 
                   language === "ru-RU" ? "Рекомендуется" : 
                   language === "hi-IN" ? "करें" :
                   language === "es-ES" ? "Recomendado" :
                   language === "de-DE" ? "Empfohlen" :
                   language === "fr-FR" ? "À faire" :
                   "Do's"}
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-green-800">
                  {etiquetteInfo.do_tips.map((tip, index) => (
                    <li key={`do-${index}`}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {etiquetteInfo.dont_tips?.length > 0 && (
              <div className={`bg-red-50 rounded-lg p-4 ${language === "ar-AE" ? "text-right" : ""}`}>
                <h4 className="font-medium text-red-700 mb-2">
                  {language === "ar-AE" ? "لا تفعل" : 
                   language === "zh-CN" ? "请勿" : 
                   language === "ru-RU" ? "Не рекомендуется" : 
                   language === "hi-IN" ? "न करें" :
                   language === "es-ES" ? "No recomendado" :
                   language === "de-DE" ? "Nicht empfohlen" :
                   language === "fr-FR" ? "À éviter" :
                   "Don'ts"}
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-red-800">
                  {etiquetteInfo.dont_tips.map((tip, index) => (
                    <li key={`dont-${index}`}>{tip}</li>
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
