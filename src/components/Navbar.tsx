
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, UserCircle2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AdaptED <span className="text-primary">AI</span></span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/upload" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Upload Materials
              </Link>
              <Link to="/process" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Assignment Help
              </Link>
              <Link to="/signup">
                <Button className="ml-4" variant="default">Sign Up</Button>
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/upload" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Upload Materials
            </Link>
            <Link 
              to="/process" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Assignment Help
            </Link>
            <Link 
              to="/signup" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full" variant="default">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
