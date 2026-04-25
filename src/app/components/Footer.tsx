import Logo from '../../assets/logo.svg';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-[#2c3e4f] text-gray-300 py-10 mt-16">
      <div className="container mx-auto px-6 flex justify-center items-center">
        
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="RiskLens Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-semibold text-white">
              RiskLens
            </span>
          </Link>

          <p className="text-sm text-gray-400 mt-2">
            Browse safer. Stay informed.
          </p>
        </div>

      </div>
    </footer>
  );
}