import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monadTestnet } from '@reown/appkit/networks'

export const projectId = "b2e530dcc97e94a7786f1af5f5dedf9e"

if (!projectId) {
  throw new Error('Project ID is not defined')}

export const networks = [monadTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig