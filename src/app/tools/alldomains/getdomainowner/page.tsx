"use client";

import { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function HomePage() {
  const [domainTld, setDomainTld] = useState("");
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);


  const handleConfirm = async () => {
    setLoading(true);
    setOwner(null);
    setError(null);
    setChecked(false);
    const client = await createClient();

    try {    

      const result = await client.callTool({
        name: "get_owner_from_domain_tld",
        arguments: { domainTld },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      console.log(content);

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.error) {
          setError(parsed.error);
        } else if (parsed.owner) {
          setOwner(parsed.owner);
        } else {
          setError("No owner found for this domain.");
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
      setChecked(true);
    }
  };

  const isUnregistered = (owner: string | null) => {
    return owner === "0x0000000000000000000000000000000000000000";
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO NO TOPO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Alldomains/GetOwnerFromDomainTld" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* FORMULÁRIO CENTRALIZADO */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6">
        <input
          type="text"
          placeholder="Enter full domain (e.g., miester.mon)"
          value={domainTld}
          onChange={(e) => setDomainTld(e.target.value)}
          className="bg-black border-2 border-green-400 px-6 py-4 text-green-400 placeholder-green-600 text-lg w-96 focus:outline-none focus:bg-green-400 focus:text-black transition-all"
        />
        <button
          onClick={handleConfirm}
          disabled={loading || domainTld.trim() === ""}
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

          {owner && !isUnregistered(owner) && (
            <div className="border-2 border-green-400 p-4 flex flex-col gap-2">
              <div>👤 <strong>Owner Address:</strong> {owner}</div>
            </div>
          )}

          {owner && isUnregistered(owner) && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              ⚠️ This domain is not registered.
            </div>
          )}

          {checked && !owner && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No owner found for this domain.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
