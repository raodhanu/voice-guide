import React from "react";

interface Props {
  size?: number;
  color?: string;
  isListening?: boolean;
}

export function VoiceIcon({ size = 24, color = "currentColor", isListening = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isListening ? "animate-pulse" : ""}
    >
      <path
        d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.35 10.05V11.5C4.35 15.69 7.82 19.05 12 19.05C16.18 19.05 19.65 15.58 19.65 11.39V10.05"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.58 6.43C11.38 6.1 12.27 6.07 13.11 6.36"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 8.55C11.73 8.41 12.28 8.41 12.81 8.55"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19.05V22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
