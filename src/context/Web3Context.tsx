import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import WrappedSNFTAbi from '../contracts/WrappedSNFT.json';

// Constants
const CHAIN_ID = 98889;
const RPC_URL = 'https://trpc.snft.in';
const CONTRACT_ADDRESS = '0x8501BCb82BA3fda93d2087cEad9e40eEc6074575'; // Replace with actual contract address
const EXPLORER_URL = 'https://texplorer.snft.in';

interface Transaction {
  hash: string;
  type: 'wrap' | 'unwrap';
  amount: string;
  timestamp: number;
}

interface Web3ContextType {
  account: string | null;
  snftBalance: string;
  wsnftBalance: string;
  networkStatus: boolean;
  isProcessing: boolean;
  transactions: Transaction[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  wrap: (amount: string) => Promise<void>;
  unwrap: (amount: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [snftBalance, setSnftBalance] = useState<string>('0');
  const [wsnftBalance, setWsnftBalance] = useState<string>('0');
  const [networkStatus, setNetworkStatus] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTxs = localStorage.getItem('transactions');
    return savedTxs ? JSON.parse(savedTxs) : [];
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found. Please install MetaMask first.');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (parseInt(chainId, 16) !== CHAIN_ID) {
        try {
          // Try to switch to the SNFT network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.toBeHex(CHAIN_ID) }],
          });
        } catch (switchError: any) {
          // If the network is not added yet, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: ethers.toBeHex(CHAIN_ID),
                    chainName: 'SNFT Testnet',
                    nativeCurrency: {
                      name: 'SNFT',
                      symbol: 'SNFT',
                      decimals: 18,
                    },
                    rpcUrls: [RPC_URL],
                    blockExplorerUrls: [EXPLORER_URL],
                  },
                ],
              });
            } catch (addError) {
              toast.error('Failed to add the SNFT network.');
              return;
            }
          } else {
            toast.error('Failed to switch to the SNFT network.');
            return;
          }
        }
      }

      // Set account
      setAccount(accounts[0]);
      
      // Set provider and signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
      
      const ethersSigner = await ethersProvider.getSigner();
      setSigner(ethersSigner);
      
      setNetworkStatus(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet.');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setNetworkStatus(false);
    toast.success('Wallet disconnected');
  };

  const updateBalances = useCallback(async () => {
    if (!account || !provider || !signer) return;
    
    try {
      // Get native SNFT balance
      const balance = await provider.getBalance(account);
      setSnftBalance(ethers.formatEther(balance));
      
      // Get WSNFT balance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, WrappedSNFTAbi, provider);
      const wsnftBalance = await contract.balanceOf(account);
      setWsnftBalance(ethers.formatEther(wsnftBalance));
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  }, [account, provider, signer]);

  const wrap = async (amount: string) => {
    if (!signer || !account) {
      toast.error('Wallet not connected');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, WrappedSNFTAbi, signer);
      const parsedAmount = ethers.parseEther(amount);
      
      // Call the deposit function with the exact amount of SNFT
      const tx = await contract.deposit({ value: parsedAmount });
      
      // Add transaction to history
      const newTx: Transaction = {
        hash: tx.hash,
        type: 'wrap',
        amount,
        timestamp: Date.now(),
      };
      
      const updatedTxs = [newTx, ...transactions].slice(0, 10); // Keep only the 10 most recent transactions
      setTransactions(updatedTxs);
      localStorage.setItem('transactions', JSON.stringify(updatedTxs));
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Update balances
      await updateBalances();
      
      toast.success('Successfully wrapped SNFT!');
    } catch (error) {
      console.error('Error wrapping SNFT:', error);
      toast.error('Failed to wrap SNFT. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const unwrap = async (amount: string) => {
    if (!signer || !account) {
      toast.error('Wallet not connected');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, WrappedSNFTAbi, signer);
      const parsedAmount = ethers.parseEther(amount);
      
      // Call the withdraw function
      const tx = await contract.withdraw(parsedAmount);
      
      // Add transaction to history
      const newTx: Transaction = {
        hash: tx.hash,
        type: 'unwrap',
        amount,
        timestamp: Date.now(),
      };
      
      const updatedTxs = [newTx, ...transactions].slice(0, 10); // Keep only the 10 most recent transactions
      setTransactions(updatedTxs);
      localStorage.setItem('transactions', JSON.stringify(updatedTxs));
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Update balances
      await updateBalances();
      
      toast.success('Successfully unwrapped WSNFT!');
    } catch (error) {
      console.error('Error unwrapping WSNFT:', error);
      toast.error('Failed to unwrap WSNFT. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Update balances when account or provider changes
  useEffect(() => {
    if (account && provider) {
      updateBalances();
    }
  }, [account, provider, updateBalances]);

  return (
    <Web3Context.Provider 
      value={{
        account,
        snftBalance,
        wsnftBalance,
        networkStatus,
        isProcessing,
        transactions,
        connectWallet,
        disconnectWallet,
        wrap,
        unwrap,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};