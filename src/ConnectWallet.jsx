import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useSwitchChain } from 'wagmi'
import { WalletOptions } from './wallet-options.jsx'
import { config } from './config.js'
import { ethers } from 'ethers'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined })
  
  const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7' // Hexadecimal
  const SEPOLIA_CHAIN_ID_DEC = 11155111 // Decimal
  
  const { switchChain, error: switchError, isLoading: isSwitching } = useSwitchChain(config)
  
  const [promptSwitch, setPromptSwitch] = useState(false)
  const [currentChain, setCurrentChain] = useState(null)

  // Effect to handle chain changes using window.ethereum
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleChainChanged = (chainIdHex) => {
      console.log("Chain changed to:", chainIdHex)
      const chainIdDec = parseInt(chainIdHex, 16)
      setCurrentChain(chainIdDec)
      if (isConnected) {
        if (chainIdDec !== SEPOLIA_CHAIN_ID_DEC) {
          setPromptSwitch(true)
        } else {
          setPromptSwitch(false)
        }
      }
    }

    // Register the event listener
    window.ethereum.on('chainChanged', handleChainChanged)

    // Fetch the initial chain ID
    window.ethereum.request({ method: 'eth_chainId' })
      .then((chainIdHex) => {
        handleChainChanged(chainIdHex)
      })
      .catch((error) => {
        console.error("Error fetching chain ID:", error)
      })

    // Cleanup the event listener on component unmount
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [isConnected])

  // Optional: Effect to monitor connection status and prompt switch if necessary
  useEffect(() => {
    if (isConnected && currentChain !== SEPOLIA_CHAIN_ID_DEC) {
      setPromptSwitch(true)
    } else {
      setPromptSwitch(false)
    }
  }, [isConnected, currentChain])

  const handleSwitch = async () => {
    console.log("Attempting to switch chain")
    try {
      console.log(switchChain, "checking function")
      const response = await switchChain({chainId: SEPOLIA_CHAIN_ID_DEC})
      console.log(response, "checking what went wrong")
    } catch (error) {
      console.error("Error switching chain:", error)
    }
  }

  if (promptSwitch) {
    return (
      <div style={styles.container}>
        <p>You are connected to the wrong network. Please switch to Sepolia.</p>
        <button onClick={handleSwitch} disabled={isSwitching} style={styles.button}>
          {isSwitching ? 'Switching...' : 'Switch to Sepolia'}
        </button>
        {switchError && <p style={styles.error}>Error switching chain: {switchError.message}</p>}
        <button onClick={disconnect} style={styles.disconnectButton}>
          Disconnect
        </button>
      </div>
    )
  }

  return isConnected ? <Account /> : <WalletOptions />
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  disconnectButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
}

export default ConnectWallet
