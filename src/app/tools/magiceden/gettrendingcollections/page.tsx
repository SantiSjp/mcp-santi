"use client";

import { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createClient } from "@/lib/client";

const CHAINS = [
  "ethereum", "abstract", "apechain", "arbitrum", "base", "berachain", "bsc", "monad-testnet", "polygon", "sei"
];

const PERIODS = [
  "5m", "10m", "30m", "1h", "6h", "1d", "24h", "7d", "30d"
];

const SORT_OPTIONS = [
  "sales", "volume"
];

export default function HomePage() {
  const fullText = "Tools/MagicEden/GetTrendingCollections";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [chain, setChain] = useState("monad-testnet");
  const [period, setPeriod] = useState("1d");
  const [sortBy, setSortBy] = useState("sales");

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

  const fetchTrendingCollections = async () => {
    setLoading(true);
    setCollections([]);
    setError(null);
    setChecked(false);
    const client = await createClient();

    try {    

      const args = { chain, period, sortBy, limit: "10" };

      const result = await client.callTool({
        name: "magiceden_get_trending_collections",
        arguments: args,
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
        <h1 className="text-2xl flex items-center">
          {displayedText}
          <span className="ml-2 animate-blink">█</span>
        </h1>
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

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-40"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-40"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchTrendingCollections}
          disabled={loading}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Trending"}
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
                    <th className="border-b-2 border-green-400 pb-2">Rank</th>
                    <th className="border-b-2 border-green-400 pb-2">Name</th>
                    <th className="border-b-2 border-green-400 pb-2">Floor Price</th>
                    <th className="border-b-2 border-green-400 pb-2">Sales Count</th>
                    <th className="border-b-2 border-green-400 pb-2">All Time Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCollections.map((col, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2">{col.rank}</td>
                      <td className="py-2 break-all">{col.name}</td>
                      <td className="py-2">{col.floorPrice !== null ? `${col.floorPrice}` : "N/A"}</td>
                      <td className="py-2">{col.salesCount !== null ? col.salesCount : "N/A"}</td>
                      <td className="py-2">{col.allTimeVolume !== null ? col.allTimeVolume : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && collections.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No trending collections found for this chain.
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
