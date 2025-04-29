"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function TokensPage() {
  const fullText = "Tools/Monorail/GetTokens";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [search, setSearch] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [page, setPage] = useState(0);
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

  const fetchTokens = async () => {
    setLoading(true);
    setTokens([]);
    setError(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "monorail_get_tokens",
        arguments: { find: search.trim(), limit: "50", offset: "0" },
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
      setPage(0);
    }
  };

  const paginatedTokens = tokens.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if ((page + 1) * ITEMS_PER_PAGE < tokens.length) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* Título */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Monorail/GetTokens" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* Formulário */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-7xl px-4">
          <input
            type="text"
            placeholder="Optional: Search token by name or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-96"
          />
        </div>

        <button
          onClick={fetchTokens}
          disabled={loading}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Tokens"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-7xl">
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
                    <th className="border-b-2 border-green-400 pb-2">Address</th>
                    <th className="border-b-2 border-green-400 pb-2">Decimals</th>
                    <th className="border-b-2 border-green-400 pb-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTokens.map((token, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2 break-all">{token.name}</td>
                      <td className="py-2">{token.symbol}</td>
                      <td className="py-2 break-all">{token.address}</td>
                      <td className="py-2">{token.decimals}</td>
                      <td className="py-2">{token.balance ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && tokens.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No tokens found.
            </div>
          )}
        </div>

        {/* Paginação */}
        {tokens.length > 0 && (
          <div className="flex gap-6 mt-8 mb-12 justify-center">
            <button
              onClick={handlePrevPage}
              disabled={loading || page === 0}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>
            <span className="text-green-400 self-center">Page {page + 1}</span>
            <button
              onClick={handleNextPage}
              disabled={loading || (page + 1) * ITEMS_PER_PAGE >= tokens.length}
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
