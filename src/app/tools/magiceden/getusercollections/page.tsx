"use client";

import { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

const CHAINS = [
  "monad-testnet","ethereum", "abstract", "apechain", "arbitrum", "base", "berachain", "bsc", "polygon", "sei"
];

export default function HomePage() {
  const fullText = "Tools/MagicEden/GetUserCollections";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [chain, setChain] = useState("monad-testnet");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [displayPage, setDisplayPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  const fetchUserCollections = async () => {
    setLoading(true);
    setCollections([]);
    setError(null);
    setChecked(false);
    
    const client = await createClient();
  

    try {
      const result = await client.callTool({
        name: "magiceden_get_user_collections",
        arguments: { chain, user: address.trim() },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.collections) {
          setCollections(parsed.collections);
        } else {
          setError("Unexpected response format.");
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
      setDisplayPage(1);
    }
  };

  const handleNextDisplayPage = () => {
    if (displayPage * ITEMS_PER_PAGE < collections.length) {
      setDisplayPage(displayPage + 1);
    }
  };

  const handlePrevDisplayPage = () => {
    if (displayPage > 1) {
      setDisplayPage(displayPage - 1);
    }
  };

  const paginatedCollections = collections.slice(
    (displayPage - 1) * ITEMS_PER_PAGE,
    displayPage * ITEMS_PER_PAGE
  );

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/MagicEden/GetUserCollections" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* FORMULÁRIO */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        {/* Linha de Inputs */}
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-7xl px-4">
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-52"
          >
            {CHAINS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter user wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
          />
        </div>

        <button
          onClick={fetchUserCollections}
          disabled={loading || address.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Collections"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-7xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {collections.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Collection Name</th>
                    <th className="border-b-2 border-green-400 pb-2">Floor Price (MON)</th>
                    <th className="border-b-2 border-green-400 pb-2">Tokens Owned</th>
                    <th className="border-b-2 border-green-400 pb-2">Tokens On Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCollections.map((col, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2 break-all">{col.name}</td>
                      <td className="py-2">{col.floorPrice !== null ? `${col.floorPrice} MON` : "N/A"}</td>
                      <td className="py-2">{col.tokensOwned !== null ? col.tokensOwned : "N/A"}</td>
                      <td className="py-2">{col.tokensOnSale !== null ? col.tokensOnSale : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && collections.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No collections found for this user.
            </div>
          )}
        </div>

        {/* Paginação */}
        {collections.length > 0 && (
          <div className="flex gap-6 mt-8 mb-12 justify-center">
            <button
              onClick={handlePrevDisplayPage}
              disabled={loading || displayPage === 1}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>
            <span className="text-green-400 self-center">Page {displayPage}</span>
            <button
              onClick={handleNextDisplayPage}
              disabled={loading || displayPage * ITEMS_PER_PAGE >= collections.length}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
