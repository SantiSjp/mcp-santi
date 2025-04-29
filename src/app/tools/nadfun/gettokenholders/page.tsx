"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function TokenHoldersPage() {
  const fullText = "Tools/Nadfun/GetTokenHolders";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [tokenAddress, setTokenAddress] = useState("");
  const [holders, setHolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5; // fixado em 5 por página

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  const fetchTokenHolders = async () => {
    setLoading(true);
    setError(null);
    setHolders([]);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "nadfun_get_token_holders",
        arguments: {
          tokenAddress: tokenAddress.trim(),
          page,
          limit,
        },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.holders) {
          setHolders(parsed.holders);
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

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => (p > 1 ? p - 1 : 1));

  useEffect(() => {
    if (checked) fetchTokenHolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* Header */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping text="Tools/Nadfun/GetTokenHolders" className="text-3xl" speed={50} />
      </div>

      {/* Formulário */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-7xl px-4">
          <input
            type="text"
            placeholder="Enter token address (0x...)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
          />
        </div>

        <button
          onClick={() => { setPage(1); fetchTokenHolders(); }}
          disabled={loading || tokenAddress.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Holders"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-7xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {holders.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Address</th>
                    <th className="border-b-2 border-green-400 pb-2">Balance</th>
                    <th className="border-b-2 border-green-400 pb-2">Dev?</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.map((h, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2 break-all">{h.accountAddress}</td>
                      <td className="py-2">{h.balance}</td>
                      <td className="py-2">{h.isDev ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && holders.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No holders found.
            </div>
          )}

          {/* Paginação */}
          {holders.length > 0 && (
            <div className="flex gap-6 mt-8 mb-12 justify-center">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-green-400 self-center">Page {page}</span>
              <button
                onClick={handleNextPage}
                className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}