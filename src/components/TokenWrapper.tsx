import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, ArrowRight, Loader2, Wallet } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { formatBalance } from '../utils/helpers';
import TokenInputCard from './TokenInputCard';
import TransactionHistory from './TransactionHistory';

enum ConversionType {
  WRAP = 'wrap',
  UNWRAP = 'unwrap'
}

const TokenWrapper: React.FC = () => {
  const { account, snftBalance, wsnftBalance, wrap, unwrap, isProcessing } = useWeb3();
  const [activeTab, setActiveTab] = useState<'convert' | 'history'>('convert');
  const [amount, setAmount] = useState<string>('');
  const [conversionType, setConversionType] = useState<ConversionType>(ConversionType.WRAP);
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (value: string) => {
    // Allow empty string or numbers only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (conversionType === ConversionType.WRAP) {
      setAmount(snftBalance);
    } else {
      setAmount(wsnftBalance);
    }
  };

  const toggleConversionType = () => {
    setConversionType(prevType => 
      prevType === ConversionType.WRAP ? ConversionType.UNWRAP : ConversionType.WRAP
    );
    setAmount('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      if (conversionType === ConversionType.WRAP) {
        if (parseFloat(amount) > parseFloat(snftBalance)) {
          setError('Amount exceeds your SNFT balance');
          return;
        }
        await wrap(amount);
      } else {
        if (parseFloat(amount) > parseFloat(wsnftBalance)) {
          setError('Amount exceeds your WSNFT balance');
          return;
        }
        await unwrap(amount);
      }
      setAmount('');
      setError(null);
    } catch (err) {
      setError('Transaction failed. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    setError(null);
  }, [conversionType, amount]);

  if (!account) {
    return (
      <motion.div 
        className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Wallet className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet to use the SNFT Token Wrapper.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            className={`py-2 px-4 rounded-lg transition-all ${
              activeTab === 'convert'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-700 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('convert')}
          >
            Convert Tokens
          </button>
          <button
            className={`py-2 px-4 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-700 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'convert' ? (
          <motion.div
            key="convert"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
                  {conversionType === ConversionType.WRAP ? 'Wrap SNFT to WSNFT' : 'Unwrap WSNFT to SNFT'}
                </h2>

                <div className="space-y-4">
                  <div className="relative">
                    <TokenInputCard
                      label={conversionType === ConversionType.WRAP ? 'From (SNFT)' : 'From (WSNFT)'}
                      balance={conversionType === ConversionType.WRAP ? snftBalance : wsnftBalance}
                      value={amount}
                      onChange={handleAmountChange}
                      onMaxClick={handleMaxClick}
                      tokenSymbol={conversionType === ConversionType.WRAP ? 'SNFT' : 'WSNFT'}
                    />
                    
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
                      <button
                        type="button"
                        onClick={toggleConversionType}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
                      >
                        <ArrowDownUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <TokenInputCard
                    label={conversionType === ConversionType.WRAP ? 'To (WSNFT)' : 'To (SNFT)'}
                    balance={conversionType === ConversionType.WRAP ? wsnftBalance : snftBalance}
                    value={amount}
                    onChange={() => {}}
                    disabled={true}
                    tokenSymbol={conversionType === ConversionType.WRAP ? 'WSNFT' : 'SNFT'}
                  />
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {conversionType === ConversionType.WRAP ? 'Wrap SNFT' : 'Unwrap WSNFT'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  The conversion rate is always 1:1. There are no additional fees other than gas costs.
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TransactionHistory />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenWrapper;