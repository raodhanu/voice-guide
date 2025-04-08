import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface Props {
  className?: string;
}

export function ThemeSwitcher({ className = "" }: Props) {
  const { theme, setTheme } = useTheme();
  
  // Add dark mode styles to body
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("light")}
        title="Light mode"
        className="h-8 w-8 rounded-full bg-white dark:bg-transparent hover:bg-amber-100 dark:hover:bg-amber-950"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-600 dark:text-amber-300"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <span className="sr-only">Light</span>
      </Button>

      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("dark")}
        title="Dark mode"
        className="h-8 w-8 rounded-full bg-white dark:bg-transparent hover:bg-indigo-100 dark:hover:bg-indigo-950"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-600 dark:text-indigo-300"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        <span className="sr-only">Dark</span>
      </Button>

      <Button
        variant={theme === "system" ? "default" : "outline"}
        size="icon"
        onClick={() => setTheme("system")}
        title="System preference"
        className="h-8 w-8 rounded-full bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600 dark:text-gray-300"
        >
          <rect width="18" height="14" x="3" y="3" rx="2" />
          <path d="M7 21h10" />
          <path d="M12 17v4" />
        </svg>
        <span className="sr-only">System</span>
      </Button>
    </div>
  );
}
