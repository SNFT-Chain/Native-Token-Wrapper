import React from 'react';
import { Clock, ArrowDownUp, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { formatDate, truncateAddress } from '../utils/helpers';

const TransactionHistory: React.FC = () => {
  const { transactions } = useWeb3();

  if (!transactions.length) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
            <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your conversion transactions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div 
              key={tx.hash}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'wrap' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    <ArrowDownUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {tx.type === 'wrap' ? 'Wrapped SNFT' : 'Unwrapped WSNFT'}
                    </h4>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(tx.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span>{tx.amount} {tx.type === 'wrap' ? 'SNFT → WSNFT' : 'WSNFT → SNFT'}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://texplorer.snft.in/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </a>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Tx Hash:</span>
                  <span className="text-gray-900 dark:text-gray-300 font-mono">{truncateAddress(tx.hash)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;