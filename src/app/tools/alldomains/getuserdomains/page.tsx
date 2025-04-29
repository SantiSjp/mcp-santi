"use client";

import { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function HomePage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false); // 👈 novo para saber que o usuário já confirmou

  const handleConfirm = async () => {
    setLoading(true);
    setDomains([]);
    setError(null);
    setChecked(false);
    const client = await createClient();

    try {      
      const result = await client.callTool({
        name: "get_all_user_domains",
        arguments: { address }
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      console.log(content);
      
      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.error) {
          setError(parsed.error);
        } else {
          setDomains(parsed.domains.map((d: any) => d.domain));
        }
      } else {
        setError("Unexpected response format.");
      }

    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      client.close();
      setLoading(false);
      setChecked(true); // ✅ marcou que terminou a consulta
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO NO TOPO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Alldomains/GetUserDomains" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* FORMULÁRIO CENTRALIZADO */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6">
        <input
          type="text"
          placeholder="Enter your wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-black border-2 border-green-400 px-6 py-4 text-green-400 placeholder-green-600 text-lg w-96 focus:outline-none focus:bg-green-400 focus:text-black transition-all"
        />
        <button
          onClick={handleConfirm}
          disabled={loading || address.trim() === ""}
          className="border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Confirm"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-5/6 max-w-4xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {domains.length > 0 && (
            <ul className="border-2 border-green-400 p-4 flex flex-col gap-2">
              {domains.map((domain, index) => (
                <li key={index}>🌐 {domain}</li>
              ))}
            </ul>
          )}

          {/* Se não houver erro, e já consultou, mas lista vazia */}
          {checked && domains.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No domains found for this address.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
