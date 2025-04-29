"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 importa o useRouter

export default function HomePage() {
  const fullText = "Tools/MagicEden";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const router = useRouter(); // 👈 inicializa o router

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO NO TOPO */}
      <div className="absolute top-8 w-full flex justify-center">
        <h1 className="text-3xl flex items-center">
          {displayedText}
          <span className="ml-2 animate-blink">█</span>
        </h1>
      </div>

      {/* BOTÕES CENTRALIZADOS */}
      <div className="flex flex-1 flex-col justify-center items-center gap-10">
        {/* Linha 1: 3 botões */}
        <div className="flex gap-8">
          <button
            onClick={() => router.push("magiceden/getcollection")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Collection
          </button>
          <button
            onClick={() => router.push("magiceden/gettrendingcollections")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Trending Collections
          </button>
          <button
            onClick={() => router.push("magiceden/getuseractivity")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get User Activity
          </button>
        </div>   
        {/* Linha 2: 1 botão */}
        <div className="flex gap-8">
          <button
            onClick={() => router.push("magiceden/getusercollections")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get User Collections
          </button>
        </div>     
      </div>
    </main>
  );
}
