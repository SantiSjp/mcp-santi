"use client";

import { useEffect, useState } from "react";
import HeaderTyping from "@/components/header";
import { createClient } from "@/lib/client";

export default function TokenInfoPage() {
  const fullText = "Tools/Codex/GetTokenInfo";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
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
    setTokenData(null);
    setError(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "codex_get_token_info",
        arguments: { address: address.trim() },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);
        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.token) {
          setTokenData(parsed.token);
        } else {
          setError("Unexpected response format.");
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
        <HeaderTyping text={fullText} className="text-3xl" speed={50} />
      </div>

      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-4xl px-4">
          <input
            type="text"
            placeholder="Enter token address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
          />
        </div>

        <button
          onClick={fetchTokenInfo}
          disabled={loading || !address.trim()}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Fetching..." : "Get Token Info"}
        </button>

        <div className="mt-8 w-11/12 max-w-4xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {tokenData && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <tbody>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Name:</td>
                    <td className="py-2">{tokenData.name}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Symbol:</td>
                    <td className="py-2">{tokenData.symbol}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Total Supply:</td>
                    <td className="py-2">{tokenData.totalSupply}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Decimals:</td>
                    <td className="py-2">{tokenData.decimals}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Circulating Supply:</td>
                    <td className="py-2">{tokenData.info?.circulatingSupply || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Description:</td>
                    <td className="py-2">{tokenData.info?.description || "(none)"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {checked && !tokenData && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No token info found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
