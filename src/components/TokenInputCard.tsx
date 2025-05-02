import React from 'react';
import { motion } from 'framer-motion';

interface TokenInputCardProps {
  label: string;
  balance: string;
  value: string;
  onChange: (value: string) => void;
  onMaxClick?: () => void;
  disabled?: boolean;
  tokenSymbol: string;
}

const TokenInputCard: React.FC<TokenInputCardProps> = ({
  label,
  balance,
  value,
  onChange,
  onMaxClick,
  disabled = false,
  tokenSymbol
}) => {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </label>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Balance: {balance} {tokenSymbol}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative flex-grow">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="0.0"
            className={`w-full py-2 pr-16 pl-3 bg-white dark:bg-gray-800 rounded-lg border ${
              disabled 
                ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
            } transition-all outline-none text-lg font-medium text-gray-900 dark:text-white`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {!disabled && onMaxClick && (
              <motion.button
                type="button"
                onClick={onMaxClick}
                className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                MAX
              </motion.button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-700 dark:text-purple-300 font-medium">
          <div className="w-5 h-5 rounded-full bg-purple-600 dark:bg-purple-500"></div>
          <span>{tokenSymbol}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenInputCard;