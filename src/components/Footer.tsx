import React from 'react';
import { Github, Twitter, Linkedin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">SNFT Wrapper</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              A decentralized application to convert between Native SNFT and Wrapped SNFT tokens on the SNFT Network.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Network Information</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-400 min-w-28">Chain Name:</span>
                    <span className="text-gray-900 dark:text-gray-300">SNFT Testnet</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-400 min-w-28">Chain ID:</span>
                    <span className="text-gray-900 dark:text-gray-300">98889</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-400 min-w-28">Native Token:</span>
                    <span className="text-gray-900 dark:text-gray-300">SNFT (SNFT)</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} SNFT. All rights reserved.
          </div>
          
          <div className="flex space-x-4">
         
            <a 
              href="https://www.linkedin.com/company/snft/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              aria-label="Linkedin"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/snftchain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://t.me/snftpro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/SNFT-Chain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
