import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createConfig, WagmiProvider } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import App from './App'

const projectId = 'a3a68cbd94bd5ae02d1959ab0011ebd3'

const metadata = {
  name: 'Memecoin',
  description: 'Memecoin Token Creator',
  url: 'https://memecoin.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, polygon, arbitrum, optimism]

// Updated RPC URLs to match chaindata.js
const rpcUrls = {
  mainnet: 'https://eth.llamarpc.com',
  polygon: 'https://polygon.llamarpc.com',
  arbitrum: 'https://arbitrum.llamarpc.com',
  optimism: 'https://mainnet.optimism.io'
}

const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata,
  rpcUrls 
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#000000',
  }
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)