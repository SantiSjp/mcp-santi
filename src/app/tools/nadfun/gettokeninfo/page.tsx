"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function MemeTokenInfoPage() {
  const fullText = "Tools/Nadfun/GetMemeTokenInfo";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [tokenAddress, setTokenAddress] = useState("");
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

  const fetchTokenInfo = async () => {
    setLoading(true);
    setError(null);
    setToken(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "nadfun_get_meme_token_info",
        arguments: { tokenAddress: tokenAddress.trim() },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.token) {
          setToken(parsed.token);
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

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* TÍTULO */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping text="Tools/Nadfun/GetMemeTokenInfo" className="text-3xl" speed={50} />
      </div>

      {/* FORMULÁRIO */}
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
          onClick={fetchTokenInfo}
          disabled={loading || tokenAddress.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Token Info"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-4xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {token && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <tbody>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Name:</td>
                    <td className="py-2">{token.name}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Symbol:</td>
                    <td className="py-2">{token.symbol}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Creator:</td>
                    <td className="py-2 break-all">{token.creator}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Price:</td>
                    <td className="py-2">{token.price ?? "N/A"}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Total Supply:</td>
                    <td className="py-2">{token.totalSupply}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">Description:</td>
                    <td className="py-2">{token.description || "(no description)"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {checked && !token && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No token information found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
