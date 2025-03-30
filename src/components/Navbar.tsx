
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, UserCircle2, Upload, Sparkles, BarChart4 } from 'lucide-react';

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
      scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-white dark:bg-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Brain className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Adapt<span className="gradient-text">ED AI</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                <BarChart4 className="w-4 h-4 mr-1.5" />
                Dashboard
              </NavLink>
              <NavLink to="/upload" active={isActive('/upload')}>
                <Upload className="w-4 h-4 mr-1.5" />
                Upload Materials
              </NavLink>
              <NavLink to="/process" active={isActive('/process')}>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Assignment Help
              </NavLink>
              <Link to="/signup">
                <Button variant="default" size="sm" className="ml-4 rounded-full shadow-sm hover:shadow animate-scale-in">
                  <UserCircle2 className="mr-1.5 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-scale-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg">
            <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)}>
              <BarChart4 className="w-5 h-5 mr-2" />
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/upload" onClick={() => setIsOpen(false)}>
              <Upload className="w-5 h-5 mr-2" />
              Upload Materials
            </MobileNavLink>
            <MobileNavLink to="/process" onClick={() => setIsOpen(false)}>
              <Sparkles className="w-5 h-5 mr-2" />
              Assignment Help
            </MobileNavLink>
            <Link 
              to="/signup" 
              className="block w-full py-2"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full rounded-lg shadow-sm" variant="default">
                <UserCircle2 className="mr-2 h-5 w-5" />
                Sign Up
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
    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
