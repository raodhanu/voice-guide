import React, { useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";

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
  onReplayAudio: (text: string, language: string) => void;
  className?: string;
}

export function ConversationHistory({
  entries,
  language,
  onReplayAudio,
  className = ""
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom of the conversation container only, not the whole page
  useEffect(() => {
    // Only scroll the conversation container itself, not the page
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.conversation-scroll');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [entries]);

  // Get language-specific labels
  const getConversationHistoryLabel = () => {
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
        return "Historique de conversation";
      default:
        return "Conversation History";
    }
  };
  
  // Format time based on language
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };
  
  // State to manage dropdown visibility
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  // Process markdown text to plain text
  const processMarkdownText = (text: string): string => {
    // Replace headings
    let processedText = text.replace(/#+\s+(.+)/g, '$1');
    
    // Replace bold and italic
    processedText = processedText.replace(/\*\*(.+?)\*\*/g, '$1');
    processedText = processedText.replace(/\*(.+?)\*/g, '$1');
    processedText = processedText.replace(/__(.+?)__/g, '$1');
    processedText = processedText.replace(/_(.+?)_/g, '$1');
    
    // Replace links
    processedText = processedText.replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)');
    
    // Replace lists
    processedText = processedText.replace(/^\s*[-*+]\s+/gm, '• ');
    processedText = processedText.replace(/^\s*\d+\.\s+/gm, '$1. ');
    
    // Replace inline code
    processedText = processedText.replace(/`(.+?)`/g, '$1');
    
    // Replace code blocks
    processedText = processedText.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```(?:[^\n]+)?\n([\s\S]*?)```/g, '$1');
    });
    
    return processedText;
  };

  // Handle downloading conversation history
  const handleDownloadConversation = (format: 'pdf' | 'txt') => {
    if (format === "pdf") {
      try {
        // Create a new PDF document with jsPDF directly
        const doc = new jsPDF();
        
        // Add a title
        const title = getConversationHistoryLabel();
        doc.setFontSize(18);
        doc.setTextColor(79, 70, 229); // indigo color
        doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });
        
        // Settings for text
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        let yPosition = 40; // Start position after title
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const textWidth = pageWidth - 2 * margin;
        
        // Loop through each conversation entry
        entries.forEach((entry, index) => {
          // Check if we need a new page
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Set color based on entry type
          const textColor = entry.type === "user" ? [217, 119, 6] : [13, 148, 136];
          
          // Add sender (You or VoiceGuide)
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.setFontSize(12);
          doc.text(
            entry.type === "user" ? (language === "ar-AE" ? "أنت" : "You") : "VoiceGuide", 
            margin, 
            yPosition
          );
          yPosition += 8;
          
          // Add message text with word wrap
          doc.setTextColor(60, 60, 60);
          doc.setFontSize(10);
          
          // Process markdown to plain text for PDF
          const processedText = processMarkdownText(entry.text);
          
          // Split text into multiple lines to fit page width
          const textLines = doc.splitTextToSize(processedText, textWidth);
          textLines.forEach(line => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
          });
          
          // Add timestamp
          doc.setTextColor(107, 114, 128); // Gray color
          doc.setFontSize(8);
          const timestamp = formatTime(entry.timestamp);
          doc.text(timestamp, pageWidth - margin, yPosition, { align: 'right' });
          
          // Add space between entries
          yPosition += 15;
          
          // Add a subtle separator line if not the last entry
          if (index < entries.length - 1) {
            doc.setDrawColor(229, 231, 235); // Light gray
            doc.line(margin, yPosition - 8, pageWidth - margin, yPosition - 8);
          }
        });
        
        // Save the PDF
        doc.save("VoiceGuide-Conversation.pdf");
      } catch (error) {
        console.error("PDF generation error:", error);
        alert("There was an error generating the PDF. Please try the text option instead.");
      }
    } else {
      // Generate text content
      let textContent = `${getConversationHistoryLabel()}\n\n`;
      
      entries.forEach(entry => {
        const speaker = entry.type === "user" ? (language === "ar-AE" ? "أنت" : "You") : "VoiceGuide";
        // Process markdown to plain text
        const processedText = processMarkdownText(entry.text);
        textContent += `${speaker}:\n${processedText}\n${formatTime(entry.timestamp)}\n\n`;
      });
      
      // Create a blob and download it
      const blob = new Blob([textContent], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "VoiceGuide-Conversation.txt");
    }
    
    // Hide dropdown after selection
    setShowDropdown(false);
  };
  
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  // Get empty history message
  const getEmptyHistoryMessage = () => {
    switch (language) {
      case "ar-AE":
        return "لا توجد محادثات سابقة.";
      case "zh-CN":
        return "没有之前的对话。";
      case "ru-RU":
        return "Нет предыдущих разговоров.";
      case "hi-IN":
        return "कोई पिछली बातचीत नहीं।";
      case "es-ES":
        return "No hay conversaciones anteriores.";
      case "de-DE":
        return "Keine vorherigen Gespräche.";
      case "fr-FR":
        return "Pas de conversations précédentes.";
      default:
        return "No previous conversations.";
    }
  };

  return (
    <motion.div 
      className={`rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white dark:from-gray-900 to-indigo-50/20 dark:to-indigo-950/20 ${className} relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 30px)`, backgroundSize: '40px 40px' }}></div>
      </div>
      
      {/* Decorative Arabic-inspired corner elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-tl-3xl bg-indigo-200/10 transform rotate-45"></div>
      <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100/10 to-transparent"></div>
      {/* Top decorative border - removed conversation header from here */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent"></div>
      
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-50/30 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-50/30 to-transparent"></div>
        
        {/* Arabic-inspired pattern elements */}
        <div className="absolute top-10 right-10 w-16 h-16 opacity-5" style={{ 
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '10px 10px'
        }}></div>
        <div className="absolute bottom-20 left-12 w-20 h-20 opacity-5" style={{ 
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '8px 8px'
        }}></div>
        
        <div className="relative p-4 max-h-[400px] overflow-y-auto conversation-scroll">
          <div className="mb-4 flex justify-end">
            <div className="relative inline-block text-left">
              <button
                onClick={(e) => { e.stopPropagation(); toggleDropdown(); }}
                className="flex items-center gap-1.5 text-sm text-primary/90 hover:text-primary transition-colors px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/15"
                title={language.startsWith("ar") ? "تنزيل المحادثة" : "Download conversation"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16V4M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {language === "ar-AE" ? "تنزيل" : 
                 language === "zh-CN" ? "下载" : 
                 language === "ru-RU" ? "Скачать" :
                 language === "hi-IN" ? "डाउनलोड" :
                 language === "es-ES" ? "Descargar" :
                 language === "de-DE" ? "Herunterladen" :
                 language === "fr-FR" ? "Télécharger" : "Download"}
              </button>
              
              {showDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 dark:ring-opacity-20 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1 dark:bg-gray-800" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleDownloadConversation('pdf')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 w-full text-left"
                      role="menuitem"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 7C18.45 7 18 6.55 18 6V3C18 2.45 18.45 2 19 2C19.55 2 20 2.45 20 3V6C20 6.55 19.55 7 19 7Z" fill="currentColor"/>
                        <path d="M5 7C4.45 7 4 6.55 4 6V3C4 2.45 4.45 2 5 2C5.55 2 6 2.45 6 3V6C6 6.55 5.55 7 5 7Z" fill="currentColor"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 16H12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownloadConversation('txt')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 w-full text-left"
                      role="menuitem"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10H9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 10H17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 14H17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Text (.txt)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* We're now dynamically generating the PDF content */}
          
          <AnimatePresence>
            {entries.length > 0 ? (
              <div className="space-y-4">
                {/* Reverse the entries array to show newest messages first */}
                {[...entries].reverse().map((entry, index) => (
                  <motion.div 
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * Math.min(index, 5) }} // Cap delay at 5 items
                    className={`flex ${entry.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl shadow-sm relative 
                        ${entry.type === "user" 
                          ? "bg-gradient-to-br from-amber-50 dark:from-amber-900 to-amber-100 dark:to-amber-800 text-gray-800 dark:text-gray-200 border border-amber-100/50 dark:border-amber-700/50" 
                          : "bg-gradient-to-br from-teal-50 dark:from-teal-900 to-teal-100 dark:to-teal-800 text-gray-800 dark:text-gray-200 border border-teal-100/50 dark:border-teal-700/50"} 
                        p-3 pb-6 transition-all duration-300 hover:shadow-md`
                      }
                    >
                      {/* Arabic-inspired decorative corner elements */}
                      <div className={`absolute ${entry.type === "user" ? "top-0 left-0" : "top-0 right-0"} w-6 h-6 overflow-hidden`}>
                        <div 
                          className={`absolute transform -rotate-45 ${entry.type === "user" ? "bg-gradient-to-br from-amber-100/30 to-transparent" : "bg-gradient-to-br from-teal-100/30 to-transparent"} w-8 h-8 -top-4 -left-4`}
                        ></div>
                      </div>
                      <div 
                        className={`absolute h-3 w-3 ${entry.type === "user" ? "right-[9px] bg-amber-100 border-r border-b border-amber-100/60" : "left-[9px] bg-teal-100 border-l border-b border-teal-100/60"} -bottom-1.5 transform rotate-45`}
                      ></div>
                      
                      {/* Message content */}
                      <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-li:my-0.5">
                        {/* Language indicator when different from UI language */}
                        {entry.language && entry.language !== language && (
                          <div className="flex items-center mb-2 py-1 px-2 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 w-fit">
                            <span className="text-xs font-medium mr-1">
                              {entry.language === "en-US" ? "🇺🇸" : 
                               entry.language === "ar-AE" ? "🇦🇪" : 
                               entry.language === "zh-CN" ? "🇨🇳" : 
                               entry.language === "ru-RU" ? "🇷🇺" : 
                               entry.language === "hi-IN" ? "🇮🇳" : 
                               entry.language === "es-ES" ? "🇪🇸" : 
                               entry.language === "de-DE" ? "🇩🇪" : 
                               entry.language === "fr-FR" ? "🇫🇷" : ""}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                              {entry.language === "en-US" ? "English" : 
                               entry.language === "ar-AE" ? "Arabic" : 
                               entry.language === "zh-CN" ? "Chinese" : 
                               entry.language === "ru-RU" ? "Russian" : 
                               entry.language === "hi-IN" ? "Hindi" : 
                               entry.language === "es-ES" ? "Spanish" : 
                               entry.language === "de-DE" ? "German" : 
                               entry.language === "fr-FR" ? "French" : 
                               entry.language.split('-')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <ReactMarkdown>{entry.text}</ReactMarkdown>
                      </div>
                      
                      {/* Time and controls */}
                      <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                        <span className="text-xs text-gray-500 font-light">{formatTime(entry.timestamp)}</span>
                        
                        {entry.type === "assistant" && (
                          <button
                            onClick={() => onReplayAudio(entry.text, entry.language)}
                            className="ml-1.5 p-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-200 text-teal-600 hover:text-teal-700 hover:shadow-sm group"
                            title="Replay audio"
                            aria-label="Replay audio"
                          >
                            <svg 
                              width="10" 
                              height="10" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="group-hover:scale-110 transition-transform duration-200"
                            >
                              <path d="M21.62 11.08L8.62001 2.55C8.22001 2.28 7.73 2.13 7.23 2.13C6.72 2.13 6.23001 2.28 5.84001 2.55C5.45001 2.82 5.13 3.2 4.92 3.63C4.71 4.06 4.62 4.55 4.65 5.04V20.96C4.62 21.45 4.71 21.94 4.92 22.37C5.13 22.8 5.45001 23.18 5.84001 23.45C6.23001 23.72 6.72 23.87 7.23 23.87C7.73 23.87 8.22001 23.72 8.62001 23.45L21.62 14.92C22.01 14.65 22.33 14.28 22.54 13.85C22.75 13.42 22.86 12.94 22.86 12.46C22.86 11.97 22.75 11.49 22.54 11.06C22.33 10.63 22.01 10.25 21.62 9.98L21.62 11.08Z" fill="currentColor"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} className="pb-2" />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-[200px] text-center"
              >
                <div className="relative w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 rounded-full border border-indigo-100/20"></div>
                  <svg 
                    className="w-10 h-10 text-indigo-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                  
                  {/* Decorative circles */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-100/50"></div>
                  <div className="absolute -bottom-2 -left-1 w-4 h-4 rounded-full bg-indigo-100/30"></div>
                </div>
                <p className="text-gray-500 bg-white/50 px-4 py-2 rounded-full shadow-sm border border-indigo-100/10">
                  {getEmptyHistoryMessage()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Removed the lines at the bottom of the panel */}
    </motion.div>
  );
}
