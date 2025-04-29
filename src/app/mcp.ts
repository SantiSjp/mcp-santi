import { initializeMcpApiHandler } from "../lib/mcp-api-handler";

// Nadfun Tools
import { getAccountPositionsTool } from "../lib/tools/nadfun/getAccountPositions";
import { getCreatedTokensTool } from "../lib/tools/nadfun/getCreatedTokens";
import { getMemeTokenInfoTool } from "../lib/tools/nadfun/getMemeTokenInfo";
import { getTokenHoldersTool } from "../lib/tools/nadfun/getTokenHolders";
import { getTokensByCreationTimeTool } from "../lib/tools/nadfun/getTokensByCreationTime";
import { getTokensByLatestTradeTool } from "../lib/tools/nadfun/getTokensByLatestTrade";
import { getTokensByMarketCapTool } from "../lib/tools/nadfun/getTokensByMarketCap";
import { buyFromDexTool } from "../lib/tools/nadfun/buyFromDexTool";
import { sellToDexTool } from "../lib/tools/nadfun/sellToDexTool";

// Monorail Tools
import { getTokenInfoTool } from "../lib/tools/monorail/getTokenTool";
import { getTokensTool } from "../lib/tools/monorail/getTokensTool";
import { getWalletBalancesTool } from "../lib/tools/monorail/getWalletBalancesTool";
import { getQuoteTool } from "../lib/tools/monorail/getQuoteTool";

// Magic Eden Tools
import { getCollectionsTool } from "../lib/tools/magicEden/getCollectionsTool";
import { getTrendingCollectionsTool } from "../lib/tools/magicEden/getTrendingCollectionsTool";
import { getUserActivityTool } from "../lib/tools/magicEden/getUserActivityTool";
import { getUserCollectionsTool } from "../lib/tools/magicEden/getUserCollectionsTool";

// AllDomains Tools
import { getAllUserDomainsTool } from "../lib/tools/alldomains/getAllUserDomainsTool";
import { getMainDomainTool } from "../lib/tools/alldomains/getMainDomainTool";
import { getNameRecordFromDomainTldTool } from "../lib/tools/alldomains/getNameRecordFromDomainTldTool";
import { getOwnerFromDomainTldTool } from "../lib/tools/alldomains/getOwnerFromDomainTldTool";
import { getUserDomainsByTldTool } from "../lib/tools/alldomains/getUserDomainsByTldTool";

// Blockvision
import {getAccountTokensTool} from "../lib/tools/blockvision/getAccountTokensTool";
import {getAccountNFTsTool} from "../lib/tools/blockvision/getAccountNFTsTool";
import {getMonadTokenHoldersTool} from "../lib/tools/blockvision/getTokenHoldersTool";

// Codex
import { getCodexNetworksTool } from "../lib/tools/codex/getNetworksTool";
import { getNetworkStatusTool } from "../lib/tools/codex/getNetworkStatus";
import { getMonadTokenInfoTool } from "../lib/tools/codex/gettokeninfo";
import { getTokenPairsTool } from "../lib/tools/codex/getTokenPairsTool";
import { getNftCollectionMetadataTool } from "../lib/tools/codex/getNftCollectionMetadataTool";

export const mcpHandler = initializeMcpApiHandler(
  async (server) => {

    async function registerGroup(groupName: string, tools: any[]) {
      for (const tool of tools) {
        server.tool(tool.name, tool.description, tool.inputSchema.shape, tool.handler);
      }
    }
    
    await registerGroup("Nadfun", [
      getAccountPositionsTool,
      getCreatedTokensTool,
      getMemeTokenInfoTool,
      getTokenHoldersTool,
      getTokensByCreationTimeTool,
      getTokensByLatestTradeTool,
      getTokensByMarketCapTool,
      buyFromDexTool,
      sellToDexTool,
    ]);
  
    await registerGroup("AllDomains", [
      getAllUserDomainsTool,
      getMainDomainTool,
      getNameRecordFromDomainTldTool,
      getOwnerFromDomainTldTool,
      getUserDomainsByTldTool,
    ]);
  
    await registerGroup("Magic Eden", [
      getCollectionsTool,
      getTrendingCollectionsTool,
      getUserCollectionsTool,
      getUserActivityTool
    ]);
  
    await registerGroup("Monorail", [
      getTokenInfoTool,
      getTokensTool,
      getWalletBalancesTool,
      getQuoteTool,
    ]);

    await registerGroup("blockvision", [
      getAccountTokensTool,
      getAccountNFTsTool,
      getMonadTokenHoldersTool
    ]);
    
    await registerGroup("codex",[
      getCodexNetworksTool,
      getNetworkStatusTool,
      getMonadTokenInfoTool,
      getTokenPairsTool,
      getNftCollectionMetadataTool
    ]);
    
  },
  {
    capabilities: {
      tools: {        
      },
    },
  }
);
