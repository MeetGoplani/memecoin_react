import { ethers } from "ethers";

const projectId = "YOUR_INFURA_PROJECT_ID"; // Replace with your Infura project ID

const CHAIN_DATA = {
  1: {
    chainName: "Ethereum Mainnet",
    rpcUrl: `https://eth.llamarpc.com`,
    blockExplorerUrls: ["https://etherscan.io"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  137: {
    chainName: "Polygon Mainnet",
    rpcUrl: `https://polygon-bor-rpc.publicnode.com	`,
    blockExplorerUrls: ["https://polygonscan.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  42161: {
    chainName: "Arbitrum One",
    rpcUrl: `https://arbitrum.drpc.org`,
    blockExplorerUrls: ["https://arbiscan.io"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  10: {
    chainName: "Optimism",
    rpcUrl: `https://mainnet.optimism.io`,
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

// Example chain data for a network that might not be added yet.


export async function switchOrAddChain(chainId) {
  const chainInfo = CHAIN_DATA[chainId];
  if (!chainInfo) {
    throw new Error("Invalid chain ID");
  }
  
  const hexChainId = `0x${chainId.toString(16)}`;
  
  try {
    // First try to add the chain
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: hexChainId,
          chainName: chainInfo.chainName,
          nativeCurrency: chainInfo.nativeCurrency,
          rpcUrls: [chainInfo.rpcUrl],
          blockExplorerUrls: chainInfo.blockExplorerUrls,
        }],
      });
    } catch (addError) {
      // Chain might already exist, continue to switch
      console.log("Chain might already exist:", addError);
    }

    // Then switch to the chain
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });

  } catch (error) {
    console.error("Failed to switch chains:", error);
    throw error;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.getNetwork(); // Verify connection
  
  return provider;
}