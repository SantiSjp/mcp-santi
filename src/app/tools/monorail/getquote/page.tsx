"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client"; // Usa o client centralizado
import HeaderTyping from "@/components/header";

export default function GetQuotePage() {
  const fullText = "Tools/Monorail/GetQuote";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);
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

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    setQuote(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "monorail_get_quote",
        arguments: { amount, from, to },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.status === "success") {
          setQuote(parsed.metadata);
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
        <HeaderTyping 
          text="Tools/Monorail/GetQuote" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* FORMULÁRIO */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-4xl px-4">
          <input
            type="text"
            placeholder="From Token (address or symbol)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm w-60 focus:outline-none focus:bg-green-400 focus:text-black transition-all"
          />
          <input
            type="text"
            placeholder="To Token (address or symbol)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm w-60 focus:outline-none focus:bg-green-400 focus:text-black transition-all"
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm w-40 focus:outline-none focus:bg-green-400 focus:text-black transition-all"
          />
        </div>

        <button
          onClick={fetchQuote}
          disabled={loading || !from || !to || !amount}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Quote"}
        </button>

        {/* RESULTADO */}
        <div className="mt-8 w-11/12 max-w-4xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {quote && (
            <div className="border-2 border-green-400 p-6 w-full">
              <div className="mb-4">
                <strong className="text-green-300">From:</strong> {quote.from}
              </div>
              <div className="mb-4">
                <strong className="text-green-300">To:</strong> {quote.to}
              </div>
              <div className="mb-4">
                <strong className="text-green-300">Input Amount:</strong> {quote.amountInput}
              </div>
              <div className="mb-4">
                <strong className="text-green-300">Expected Output:</strong> {quote.expectedOutput}
              </div>
              <div className="mb-4">
                <strong className="text-green-300">Minimum Guaranteed Output:</strong> {quote.minimumGuaranteedOutput}
              </div>
              <div className="mb-4">
                <strong className="text-green-300">Hops:</strong> {quote.hops}
              </div>
              <div className="mb-4">
                <strong className="text-green-300">Price Impact:</strong> {quote.priceImpactPercent}% 
              </div>
              {quote.warning && (
                <div className="mt-4 text-yellow-400 font-bold">
                  ⚠️ {quote.warning}
                </div>
              )}
            </div>
          )}

          {checked && !quote && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No quote found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
