"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderTyping from "@/components/header";

export default function HomePage() {
  const router = useRouter(); 

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO NO TOPO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Nad.Fun" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* BOTÕES CENTRALIZADOS */}
      <div className="flex flex-1 flex-col justify-center items-center gap-10">
        {/* Linha 1: 3 botões */}
        <div className="flex gap-8">
          <button
            onClick={() => router.push("nadfun/getaccountpositions")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Account Positions
          </button>
          <button
            onClick={() => router.push("nadfun/getcreatedtokens")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Created Tokens
          </button>
          <button
            onClick={() => router.push("nadfun/gettokeninfo")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Token Info
          </button>
          <button
            onClick={() => router.push("nadfun/gettokenholders")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Token Holders
          </button>
        </div>

        {/* Linha 2: 1 botão */}
        <div className="flex gap-8">
          <button
            onClick={() => router.push("nadfun/gettokenbycreation")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Token By Creation
          </button>
          <button
            onClick={() => router.push("nadfun/gettokenbylasttrade")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Token By Last Trade
          </button>
          <button
            onClick={() => router.push("nadfun/gettokenbymarketcap")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Get Token By Market Cap
          </button>
        </div>
      </div>
    </main>
  );
}
