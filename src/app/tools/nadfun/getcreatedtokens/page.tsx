"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function CreatedTokensPage() {
  const fullText = "Tools/Nadfun/GetCreatedTokens";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  const fetchCreatedTokens = async (fetchPage = 1) => {
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setTokens([]);
    setChecked(false);
    
    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "nadfun_get_created_tokens",
        arguments: { 
          address: address.trim(),
          page: fetchPage,
          limit: ITEMS_PER_PAGE
        },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.tokens) {
          setTokens(parsed.tokens);
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
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCreatedTokens(nextPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchCreatedTokens(prevPage);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCreatedTokens(1);
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Nadfun/GetCreatedTokens" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* FORMULÁRIO */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-7xl px-4">
          <input
            type="text"
            placeholder="Enter creator wallet address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || address.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Created Tokens"}
        </button>

        {/* RESULTADO */}
        <div className="mt-8 w-11/12 max-w-7xl mb-8">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {tokens.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Name</th>
                    <th className="border-b-2 border-green-400 pb-2">Symbol</th>
                    <th className="border-b-2 border-green-400 pb-2">Price (MON)</th>
                    <th className="border-b-2 border-green-400 pb-2">Supply</th>
                    <th className="border-b-2 border-green-400 pb-2">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2 break-words">{t.token.name}</td>
                      <td className="py-2">{t.token.symbol}</td>
                      <td className="py-2">{t.price}</td>
                      <td className="py-2">{t.token.total_supply}</td>
                      <td className="py-2">{t.market_cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && tokens.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No tokens found for this creator.
            </div>
          )}
        </div>

        {/* PAGINAÇÃO */}
        {tokens.length > 0 && (
          <div className="flex gap-6 mt-4 mb-12 justify-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>
            <span className="text-green-400 self-center">Page {page}</span>
            <button
              onClick={handleNextPage}
              disabled={tokens.length < ITEMS_PER_PAGE || loading}
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
