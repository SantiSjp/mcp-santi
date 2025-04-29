"use client";

import { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

const CHAINS = [
  "ethereum", "abstract", "apechain", "arbitrum", "base", "berachain", "bsc", "monad-testnet", "polygon", "sei"
];

export default function HomePage() {
  const fullText = "Tools/MagicEden/GetUserActivity";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [chain, setChain] = useState("monad");
  const [userInput, setUserInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
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

  const fetchUserActivity = async () => {
    setLoading(true);
    setActivities([]);
    setError(null);
    setChecked(false);
    const client = await createClient();

    try {
      const users = userInput.trim();      

      const result = await client.callTool({
        name: "magiceden_get_user_activity",
        arguments: { chain, users },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.activities) {
          setActivities(parsed.activities);
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
    if (displayPage * ITEMS_PER_PAGE < activities.length) {
      setDisplayPage(displayPage + 1);
    }
  };

  const handlePrevDisplayPage = () => {
    if (displayPage > 1) {
      setDisplayPage(displayPage - 1);
    }
  };

  const paginatedActivities = activities.slice(
    (displayPage - 1) * ITEMS_PER_PAGE,
    displayPage * ITEMS_PER_PAGE
  );

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/MagicEden/GetUserActivity" 
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
            placeholder="Wallet address"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[600px]"
          />
        </div>

        <button
          onClick={fetchUserActivity}
          disabled={loading}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Activity"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-7xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {activities.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Type</th>
                    <th className="border-b-2 border-green-400 pb-2">Collection</th>
                    <th className="border-b-2 border-green-400 pb-2">Token</th>
                    <th className="border-b-2 border-green-400 pb-2">Price (MON)</th>
                    <th className="border-b-2 border-green-400 pb-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map((activity, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2 capitalize">{activity.type}</td>
                      <td className="py-2">{activity.collectionName}</td>
                      <td className="py-2">{activity.tokenName}</td>
                      <td className="py-2">{activity.price !== null ? `${activity.price} MON` : "N/A"}</td>
                      <td className="py-2">{formatDate(activity.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && activities.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No recent activities found for these users.
            </div>
          )}
        </div>

        {/* Paginação */}
        {activities.length > 0 && (
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
              disabled={loading || displayPage * ITEMS_PER_PAGE >= activities.length}
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
