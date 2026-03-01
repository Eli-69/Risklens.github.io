import { Button } from './ui/button';
import { Link } from 'react-router';
import Logo from '../../assets/logo.svg'; // SVG as a regular image

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo + Site Name */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="RiskLens Logo" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-900">RiskLens</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/report-site" className="text-gray-700 hover:text-gray-900 transition-colors">
              Report a site
            </Link>
            <Link to="/whos-at-risk" className="text-gray-700 hover:text-gray-900 transition-colors">
              Who's at risk
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-gray-900 transition-colors">
              Help
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
              Log in
            </Link>
          </div>

          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md">
            Add to Browser
          </Button>
        </div>
      </div>
    </nav>
  );
}