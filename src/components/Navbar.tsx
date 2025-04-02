import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Brain, Upload, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "glass shadow-md" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 dark-icon" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Adapt<span className="gradient-text">ED AI</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <NavLink to="/upload" active={isActive('/upload')}>
                <Upload className="w-4 h-4 mr-1.5 dark-icon" />
                Upload
              </NavLink>
              <Link to="/process">
                <Button variant="default" size="sm" className="ml-4 rounded-full shadow-sm hover:shadow animate-scale-in">
                  <Sparkles className="mr-1.5 h-4 w-4 dark-icon" />
                  AI Process
                </Button>
              </Link>
              {/* Theme toggle */}
              <div className="ml-3">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          <div className="flex items-center md:hidden">
            {/* Theme toggle for mobile */}
            <div className="mr-2">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="glass inline-flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-gray-400 hover:text-primary focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6 dark-icon" /> : <Menu className="block h-6 w-6 dark-icon" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-scale-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass m-2 rounded-xl shadow-lg">
            <MobileNavLink to="/upload" onClick={() => setIsOpen(false)}>
              <Upload className="w-5 h-5 mr-2 dark-icon" />
              Upload Materials
            </MobileNavLink>
            <Link 
              to="/process" 
              className="block w-full py-2"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full rounded-xl shadow-sm" variant="default">
                <Sparkles className="mr-2 h-5 w-5 dark-icon" />
                AI Process
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
      ${active 
        ? "bg-primary/10 text-primary" 
        : "text-gray-700 hover:text-primary dark:text-gray-300 hover:bg-primary/5"
      }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, onClick, children }: MobileNavLinkProps) => (
  <Link 
    to={to} 
    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-primary hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-800/50 transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
