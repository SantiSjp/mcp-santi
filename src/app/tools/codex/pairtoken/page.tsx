"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function TokenPairsPage() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [pairs, setPairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const fetchPairs = async () => {
    setLoading(true);
    setError(null);
    setPairs([]);
    setChecked(false);
    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "codex_get_token_pairs",
        arguments: { tokenAddress: tokenAddress.trim() },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];
      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);
        if (parsed.status === "error") {
          setError(parsed.message);
        } else {
          setPairs(parsed.pairs);
        }
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      client.close();
      setLoading(false);
      setChecked(true);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Codex/GetTokenPairs" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <input
          type="text"
          placeholder="Enter token address (0x...)"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
        />

        <button
          onClick={fetchPairs}
          disabled={loading || tokenAddress.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Token Pairs"}
        </button>

        <div className="mt-8 w-11/12 max-w-5xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">{error}</div>
          )}

          {pairs.length > 0 && (
            <div className="border-2 border-green-400 p-4 overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Token0</th>
                    <th className="border-b-2 border-green-400 pb-2">Token1</th>
                    <th className="border-b-2 border-green-400 pb-2">Exchange Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.map((p, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2">{p.token0Data.name} ({p.token0Data.symbol})</td>
                      <td className="py-2">{p.token1Data.name} ({p.token1Data.symbol})</td>
                      <td className="py-2 break-all">{p.exchangeHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && pairs.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No trading pairs found for this token.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
