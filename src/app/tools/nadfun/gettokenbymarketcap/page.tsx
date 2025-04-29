"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function TokensByMarketCapPage() {
  const fullText = "Tools/NadFun/GetTokensByMarketCap";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [page, setPage] = useState(1);
  const LIMIT = 5;

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
        name: "nadfun_get_tokens_by_market_cap",
        arguments: { page, limit: LIMIT },
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

  useEffect(() => {
    fetchTokens();
  }, [page]);

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* Título */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping text="Tools/NadFun/GetTokensByMarketCap" className="text-3xl" speed={50} />
      </div>

      {/* Formulário */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
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
                    <th className="border-b-2 border-green-400 pb-2">Price (MON)</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2 break-all">{token.token_info.name}</td>
                      <td className="py-2">{token.token_info.symbol}</td>
                      <td className="py-2">{token.market_info.price}</td>
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
        <div className="flex gap-6 mt-8 mb-12 justify-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Page
          </button>
          <span className="text-green-400 self-center">Page {page}</span>
          <button
            onClick={handleNextPage}
            className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all"
          >
            Next Page
          </button>
        </div>
      </div>
    </main>
  );
}
