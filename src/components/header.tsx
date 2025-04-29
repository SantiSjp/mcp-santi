'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ConnectButton from './connectButton';

interface HeaderTypingProps {
  text: string;
  className?: string;
  speed?: number; // Optional typing speed
}

export default function HeaderTyping({ text, className = "", speed = 50 }: HeaderTypingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/tools');
    }
  };

  return (
    <header className="relative w-full py-6">
      {/* Botão de Voltar - não aparece na homepage */}
      {pathname !== '/' && (
        <div className="absolute top-6 left-8 hidden md:flex items-center">
          <button
            onClick={handleBack}
            className="border-2 border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-all font-mono"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Botão de Conexão no canto superior direito */}
      <div className="absolute top-6 right-8 hidden md:flex items-center gap-4">
        <ConnectButton />
      </div>

      {/* Título centralizado com cursor piscando */}
      <div className="flex justify-center">
        <h1 className={`flex items-center ${className}`}>
          {displayedText}
          <span className="ml-2 animate-blink">█</span>
        </h1>
      </div>
    </header>
  );
}
