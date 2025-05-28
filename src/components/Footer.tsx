import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-youtube-black text-white py-8">
      <div className="youtube-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-youtube-gray">
              &copy; {new Date().getFullYear()} Thumb AI
            </p>
            <p className="text-xs text-youtube-gray mt-1">
              All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-youtube-gray hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            {/* <a href="#" className="text-youtube-gray hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;