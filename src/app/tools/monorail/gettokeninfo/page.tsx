"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function TokenInfoPage() {
  const fullText = "Tools/Monorail/GetTokenInfo";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [contractAddress, setContractAddress] = useState("");
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
        name: "monorail_get_token_info",
        arguments: { contractAddress: contractAddress.trim() },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error" || parsed.status === "empty") {
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
      {/* Título */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Monorail/GetTokenInfo" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* Formulário */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-7xl px-4">
          <input
            type="text"
            placeholder="Enter contract address (0x...)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
          />
        </div>

        <button
          onClick={fetchTokenInfo}
          disabled={loading || contractAddress.trim() === ""}
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
                    <td className="py-2 font-bold">Decimals:</td>
                    <td className="py-2">{token.decimals}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Address:</td>
                    <td className="py-2 break-all">{token.address}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">Categories:</td>
                    <td className="py-2">{token.categories.length > 0 ? token.categories.join(", ") : "None"}</td>
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
