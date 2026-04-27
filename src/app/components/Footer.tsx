import { Send } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../assets/logo.svg';
import { Link } from 'react-router';

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#2c3e4f] text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-6">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Logo + Tagline */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img
                src={Logo}
                alt="RiskLens Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-semibold text-white">
                RiskLens
              </span>
            </Link>

            <p className="text-sm text-gray-400">
              Browse safer. Stay informed.
            </p>
          </div>

          {/* RIGHT: Email Signup */}
          <div className="w-full max-w-md md:ml-auto">
            <h4 className="font-semibold text-white mb-4 text-base">
              Stay up to date
            </h4>

            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 bg-[#3d4f5f] text-white text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
              />

              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-green-400 transition-colors"
              >
                <Send className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}