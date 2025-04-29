// app/tools/nadfun/GetAccountPositions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

const POSITION_TYPES = ["all", "open", "close"];

export default function GetAccountPositionsPage() {
  const fullText = "Tools/Nadfun/GetAccountPositions";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const [address, setAddress] = useState("");
  const [positionType, setPositionType] = useState("all");

  const [positions, setPositions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
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

  const fetchPositions = async () => {
    setLoading(true);
    setError(null);
    setChecked(false);
    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "nadfun_get_account_positions",
        arguments: {
          address: address.trim(),
          positionType,
          page,
          limit,
        },
      });

      const content = result?.content && Array.isArray(result.content) ? result.content[0] : undefined;
      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);
        if (parsed.status === "error") {
          setError(parsed.message);
        } else {
          setPositions(parsed.positions || []);
        }
      } else {
        setError("Invalid response format.");
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
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (positions.length === limit) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (checked) fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* Header */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping text={fullText} className="text-3xl" speed={50} />
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-7xl px-4">
          <input
            type="text"
            placeholder="Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 text-sm focus:outline-none focus:bg-green-400 focus:text-black w-[500px]"
          />
          <select
            value={positionType}
            onChange={(e) => setPositionType(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 text-sm focus:outline-none focus:bg-green-400 focus:text-black"
          >
            {POSITION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setPage(1);
              fetchPositions();
            }}
            disabled={loading || address.trim() === ""}
            className="border-2 border-green-400 px-8 py-2 text-lg hover:bg-green-400 hover:text-black disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Positions"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-8 w-11/12 max-w-7xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {positions.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr className="border-b border-green-400">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Token</th>
                    <th className="pb-2">Symbol</th>
                    <th className="pb-2">Price (MON)</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">PnL (Total / Realized / Unrealized)</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos: any, i: number) => {
                    const token = pos.token;
                    const position = pos.position;
                    const market = pos.market;

                    return (
                      <tr key={i} className="border-t border-green-400 align-top">
                        <td className="py-2"></td>
                        <td className="py-2 whitespace-pre-wrap">{token.name}</td>
                        <td className="py-2">{token.symbol}</td>
                        <td className="py-2">{market.price}</td>
                        <td className="py-2">{position.current_token_amount}</td>
                        <td className="py-2 whitespace-pre-wrap">
                          {`${position.total_pnl} / ${position.realized_pnl} / ${position.unrealized_pnl}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {checked && positions.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No positions found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {positions.length > 0 && (
          <div className="flex gap-6 mt-8 mb-12 justify-center">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center">Page {page}</span>
            <button
              onClick={handleNext}
              disabled={positions.length < limit}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
