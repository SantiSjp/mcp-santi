"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function CodexNetworksPage() {
  const [loading, setLoading] = useState(false);
  const [networks, setNetworks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const [displayPage, setDisplayPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchNetworks = async () => {
    setLoading(true);
    setNetworks([]);
    setError(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "codex_get_networks",
        arguments: {},
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.data) {
          const sorted = parsed.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
          setNetworks(sorted);
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
      setDisplayPage(1);
    }
  };

  const handleNextDisplayPage = () => {
    if (displayPage * ITEMS_PER_PAGE < networks.length) {
      setDisplayPage(displayPage + 1);
    }
  };

  const handlePrevDisplayPage = () => {
    if (displayPage > 1) {
      setDisplayPage(displayPage - 1);
    }
  };

  const paginatedNetworks = networks.slice(
    (displayPage - 1) * ITEMS_PER_PAGE,
    displayPage * ITEMS_PER_PAGE
  );

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono relative">
      {/* HEADER */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Codex/GetNetworks" 
          className="text-3xl" 
          speed={50} 
        />
      </div>

      {/* FORM */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <button
          onClick={fetchNetworks}
          disabled={loading}
          className="border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Networks"}
        </button>

        {/* RESULT */}
        <div className="mt-8 w-11/12 max-w-6xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {networks.length > 0 && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <thead>
                  <tr>
                    <th className="border-b-2 border-green-400 pb-2">Network ID</th>
                    <th className="border-b-2 border-green-400 pb-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNetworks.map((network, idx) => (
                    <tr key={idx} className="border-t border-green-400">
                      <td className="py-2">{network.id}</td>
                      <td className="py-2 break-all">{network.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {checked && networks.length === 0 && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No networks found.
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {networks.length > 0 && (
          <div className="flex gap-6 mt-8 mb-12 justify-center">
            <button
              onClick={handlePrevDisplayPage}
              disabled={loading || displayPage === 1}
              className="border-2 border-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>
            <span className="text-green-400 self-center">Page {displayPage}</span>
            <button
              onClick={handleNextDisplayPage}
              disabled={loading || displayPage * ITEMS_PER_PAGE >= networks.length}
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
