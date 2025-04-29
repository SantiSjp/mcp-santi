'use client';

import { useEffect, useState } from 'react';
import ConnectButton from './connectButton';

interface HeaderTypingProps {
  text: string;
  className?: string;
  speed?: number; // opcional, para controlar a velocidade
}

export default function HeaderTyping({ text, className = "", speed = 50 }: HeaderTypingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <header className="relative w-full py-6">
        {/* Botão fixo no canto superior direito */}
        <div className="absolute top-6 right-8 hidden md:flex items-center gap-4">
            <ConnectButton />
        </div>

        {/* Texto centralizado */}
        <div className="flex justify-center">
            <h1 className={`flex items-center ${className}`}>
            {displayedText}
            <span className="ml-2 animate-blink">█</span>
            </h1>
        </div>
    </header> 
  );
}
