"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function NetworkStatusPage() {
  const [networkId, setNetworkId] = useState("10143"); // Default para Monad Testnet
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const fetchNetworkStatus = async () => {
    setLoading(true);
    setStatus(null);
    setError(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "codex_get_network_status",
        arguments: {
          networkId: networkId.trim(),
        },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else {
          setStatus(parsed.metadata);
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
        <HeaderTyping text="Tools/Codex/GetNetworkStatus" className="text-3xl" speed={50} />
      </div>

      {/* Formulário */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-4xl px-4">
          <input
            type="text"
            placeholder="Enter Network ID (e.g., 10143)"
            value={networkId}
            onChange={(e) => setNetworkId(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-80"
          />
        </div>

        <button
          onClick={fetchNetworkStatus}
          disabled={loading || networkId.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Network Status"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-4xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {status && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <tbody>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Network Name:</td>
                    <td className="py-2">{status.networkName}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Network ID:</td>
                    <td className="py-2">{status.networkId}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Last Processed Block:</td>
                    <td className="py-2">{status.lastProcessedBlock}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">Last Processed Timestamp:</td>
                    <td className="py-2">{new Date(Number(status.lastProcessedTimestamp) * 1000).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {checked && !status && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No network status found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
