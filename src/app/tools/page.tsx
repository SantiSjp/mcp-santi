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
          text="Tools" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* BOTÕES CENTRALIZADOS */}
      <div className="flex flex-1 flex-col justify-center items-center gap-10">
        {/* Linha 1: 3 botões */}
        <div className="flex gap-8">
          <button 
          onClick={() => router.push("tools/alldomains")}
          className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all">
            All Domains
          </button>
          <button 
          onClick={() => router.push("tools/codex")}
          className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all">
            Codex
          </button>
          <button 
          onClick={() => router.push("tools/magiceden")}
          className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all">
            Magic Eden
          </button>
        </div>

        {/* Linha 2: 2 botões */}
        <div className="flex gap-8">
          <button 
          onClick={() => router.push("tools/monorail")}
          className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all">
            Monorail
          </button>
          <button 
          onClick={() => router.push("tools/nadfun")}
          className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all">
            Nad.Fun
          </button>
        </div>
      </div>
    </main>
  );
}
