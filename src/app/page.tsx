"use client";

import { useRouter } from "next/navigation"; // 👈 importar o roteador do Next.js
import HeaderTyping from "@/components/header";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO NO TOPO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Monad Context Protocol Server" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* BOTÕES NO CENTRO */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex gap-10">
          <button
            onClick={() => router.push("/tools")}
            className="border-2 border-green-400 px-10 py-4 text-xl hover:bg-green-400 hover:text-black transition-all"
          >
            Start
          </button>
        </div>
      </div>
    </main>
  );
}
