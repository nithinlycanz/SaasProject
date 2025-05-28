import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="youtube-container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-youtube-black">
          {/* <Youtube className="h-8 w-8 text-youtube-red" /> */}
        <span className="text-xl font-bold transition-colors hover:text-youtube-black">
  <span className="text-youtube-red">Thumb</span> AI
</span>

        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-youtube-black hover:text-youtube-red transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/generator" className="text-youtube-black hover:text-youtube-red transition-colors">
                Generator
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;