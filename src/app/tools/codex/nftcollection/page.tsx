"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import HeaderTyping from "@/components/header";

export default function GetNftCollectionMetadataPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    setCollection(null);
    setChecked(false);

    const client = await createClient();

    try {
      const result = await client.callTool({
        name: "codex_get_nft_collection_metadata",
        arguments: { address: address.trim() },
      });

      const content = (result?.content as { type: string; text: string }[])?.[0];

      if (content?.type === "text") {
        const parsed = JSON.parse(content.text);

        if (parsed.status === "error") {
          setError(parsed.message);
        } else if (parsed.metadata) {
          setCollection(parsed.metadata);
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
      {/* Header */}
      <div className="absolute top-8 w-full flex justify-center">
        <HeaderTyping 
          text="Tools/Codex/NftCollection"
          className="text-3xl" 
          speed={50}
        />
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col justify-center items-center gap-6 mt-32">
        <div className="flex gap-4 flex-wrap justify-center w-full max-w-6xl px-4">
          <input
            type="text"
            placeholder="Enter NFT collection address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black border-2 border-green-400 px-4 py-2 text-green-400 placeholder-green-600 text-sm focus:outline-none focus:bg-green-400 focus:text-black transition-all w-[500px]"
          />
        </div>

        <button
          onClick={fetchCollection}
          disabled={loading || address.trim() === ""}
          className="mt-4 border-2 border-green-400 px-8 py-4 text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Fetch Metadata"}
        </button>

        {/* Resultado */}
        <div className="mt-8 w-11/12 max-w-6xl">
          {error && (
            <div className="border-2 border-red-400 text-red-400 p-4">
              {error}
            </div>
          )}

          {collection && (
            <div className="border-2 border-green-400 p-4 w-full overflow-x-auto">
              <table className="w-full text-left border-collapse break-words">
                <tbody>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Name:</td>
                    <td className="py-2">{collection.name}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Symbol:</td>
                    <td className="py-2">{collection.symbol}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">ERC Type:</td>
                    <td className="py-2">{collection.ercType}</td>
                  </tr>
                  <tr className="border-b border-green-400">
                    <td className="py-2 font-bold">Address:</td>
                    <td className="py-2 break-all">{collection.address}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">Image:</td>
                    <td className="py-2 break-all">
                      {collection.image ? (
                        <a href={collection.image} target="_blank" rel="noopener noreferrer" className="underline">
                          View Image
                        </a>
                      ) : (
                        "No Image"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {checked && !collection && !error && (
            <div className="border-2 border-yellow-400 text-yellow-400 p-4">
              No metadata found for this address.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
