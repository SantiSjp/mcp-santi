"use client";

import { useEffect, useState } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export default function HomePage() {
  const fullText = "Tools/Blockvision/GetAccountNFTs";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [address, setAddress] = useState("");
  const [pageIndex, setPageIndex] = useState(1);

  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  const fetchNFTs = async (page: number) => {
    setLoading(true);
    setNfts([]);
    setError(null);
    setChecked(false);

    try {
      const origin = typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";

      const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

      const client = new Client(
        { name: "frontend-client", version: "1.0.0" },
        { capabilities: { prompts: {}, resources: {}, tools: {} } }
      );

      await client.connect(transport);

      const result = await client.callTool({
        name: "monad_get_account_nfts",
        arguments: { address, pageIndex: String(page) },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.error) {
          setError(parsed.error);
        } else if (parsed.nfts) {
          setNfts(parsed.nfts);
        } else {
          setError("Unexpected response format.");
        }
      } else {
        setError("Unexpected response format.");
      }

      client.close();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  const handleConfirm = () => {
    if (address.trim() !== "") {
      setPageIndex(1);
      fetchNFTs(1);
    }
  };

  const handleNextPage = () => {
    const nextPage = pageIndex + 1;
    setPageIndex(nextPage);
    fetchNFTs(nextPage);
  };

  const handlePrevPage = () => {
    if (pageIndex > 1) {
      const prevPage = pageIndex - 1;
      setPageIndex(prevPage);
      fetchNFTs(prevPage);
    }
  };

  function groupCollections() {
    const map = new Map<string, number>();

    nfts.forEach((nft) => {
      const collectionName = nft.collectionName || "Unnamed Collection";
      map.set(collectionName, (map.get(collectionName) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO NO TOPO */}
      <div className="absolute top-8 w-full flex justify-center">
        <h1 className="text-2xl flex items-center">
          {displayedText}
          <span className="ml-2 animate-blink">█</span>
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-24">
        <input
          type="text"
          placeholder="Enter wallet address"
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
        <div className="mt-8 w-11/12 max-w-6xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {nfts.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Collection Name</th>
                    <th className="border-b-2 border-green-400 pb-2">NFTs Count</th>
                  </tr>
                </thead>
                <tbody>
                  {groupCollections().map((collection, index) => (
                    <tr key={index} className="border-t border-green-400">
                      <td className="py-2 break-all">{collection.name}</td>
                      <td className="py-2">{collection.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && nfts.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No NFTs found for this address.
            </div>
          )}
        </div>

        {/* Paginação */}
        {nfts.length > 0 && (
          <div className="flex gap-6 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={loading || pageIndex === 1}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>
            <button
              onClick={handleNextPage}
              disabled={loading}
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
