# Monad Context Protocol (MCP) 🟩

> A futuristic, terminal-style blockchain toolkit built for developers exploring the Monad ecosystem and beyond.


---

## 🧠 Overview

**Monad Context Protocol (MCP)** is a full-featured, modular tool server and interface that lets you explore and interact with dozens of on-chain utilities across protocols. Inspired by the feel of a retro terminal, it delivers high-utility tool execution in a modern Next.js environment.

Key features:
- 🧰 Dozens of blockchain utilities grouped by provider
- ⚡ Fast access via dynamic routes and tool names
- 🧪 Typed input validation using `zod`
- 🧪 Built-in pagination and error handling
- 🧠 Clean visual interface powered by TailwindCSS
- 🔌 Connect with your wallet (EVM)

Live deployment: [mcp-santi.vercel.app](https://mcp-santi.vercel.app)

---

## 🧩 Tool Namespaces

### `alldomains/`

| Tool                             | Description                             |
|----------------------------------|-----------------------------------------|
| `getAllUserDomainsTool.ts`       | List all user domains                   |
| `getMainDomainTool.ts`           | Get a user's primary domain             |
| `getNameRecordFromDomainTldTool.ts` | Retrieve domain record data         |
| `getOwnerFromDomainTldTool.ts`   | Check who owns a specific domain        |
| `getUserDomainsByTldTool.ts`     | Filter user's domains by TLD            |

---

### `codex/`

| Tool                                 | Description                                         |
|--------------------------------------|-----------------------------------------------------|
| `getNetworksTool.ts`                 | Fetch supported chains from Codex                  |
| `getNetworkStatusTool.ts`            | Fetch block + timestamp info for a given network  |
| `getTokenInfo.ts`                    | Get token metadata                                 |
| `getTokenPairsTool.ts`               | Get trading pairs for a token                      |
| `getNftCollectionMetadataTool.ts`    | Fetch metadata of an NFT collection               |

---

### `magicEden/`

| Tool                            | Description                              |
|---------------------------------|------------------------------------------|
| `getCollectionsTool.ts`         | List available collections               |
| `getTrendingCollectionsTool.ts` | Fetch trending collections               |
| `getUserActivityTool.ts`        | User activity feed                       |
| `getUserCollectionsTool.ts`     | Fetch collections owned by a wallet      |

---

### `monorail/`

| Tool                          | Description                          |
|-------------------------------|--------------------------------------|
| `getQuoteTool.ts`             | Fetch DEX quote                      |
| `getTokensTool.ts`            | Get list of tradable tokens          |
| `getTokenTool.ts`             | Fetch token data                     |
| `getWalletBalancesTool.ts`    | Get balances from a wallet           |

---

### `nadfun/`

| Tool                             | Description                              |
|----------------------------------|------------------------------------------|
| `getAccountPositions.ts`         | Show MON-related positions for a wallet  |
| `getCreatedTokens.ts`            | Tokens created by an address             |
| `getMemeTokenInfo.ts`            | Meme token info                          |
| `getTokenHolders.ts`             | Token holders data                       |
| `getTokensByCreationTime.ts`     | Tokens sorted by creation time           |
| `getTokensByLatestTrade.ts`      | Tokens by latest trades                  |
| `getTokensByMarketCap.ts`        | Top tokens by market cap                 |

---

## 🌐 Live Interface

You can use all tools from your browser using the retro-themed terminal UI:

🔗 [https://mcp-santi.vercel.app](https://mcp-santi.vercel.app)

- Styled in a green-on-black cyberpunk aesthetic
- Wallet connection support (EVM)
- Typed tool routes under `/tools/:namespace/:tool`

---

## 📁 Folder Structure

/tools ├── alldomains/ ├── blockvision/ ├── codex/ ├── magicEden/ ├── monorail/ └── nadfun/

Each tool exports:
- `name`: tool name
- `description`: what the tool does
- `inputSchema`: a Zod schema for validation
- `handler`: the async logic that runs

---

## 🛠 Tech Stack

- `Next.js` (App Router)
- `TailwindCSS`
- `zod`
- `ethers.js`, `@codex-data/sdk`, and external APIs
- MCP-compatible with future AI integrations

---

## 🚀 Getting Started

```bash
npm install
npm run dev
