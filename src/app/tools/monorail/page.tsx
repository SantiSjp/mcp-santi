"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 importa o useRouter
import HeaderTyping from "@/components/header";

export default function HomePage() {
  const fullText = "Tools/Alldomains";
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
        <HeaderTyping 
          text="Tools/Monorail" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* BOTÕES CENTRALIZADOS */}
      <div className="flex flex-1 flex-col justify-center items-center gap-10">
        {/* Linha 1: 3 botões */}
        <div className="flex gap-8">
          <button
            onClick={() => router.push("monorail/gettokens")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Tokens
          </button>
          <button
            onClick={() => router.push("monorail/gettokeninfo")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Token Info
          </button>
          <button
            onClick={() => router.push("monorail/getwalletbalances")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Wallet Balances
          </button>
        </div>

        {/* Linha 2: 1 botão */}
        <div className="flex gap-8">
          <button
            onClick={() => router.push("monorail/getquote")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Quote
          </button>
        </div>
      </div>
    </main>
  );
}
