import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';

// How long to wait before showing the loading spinner (in ms)
const LOADING_DELAY = 300;

// Minimum time to show the loading spinner once it appears (in ms)
const MIN_LOADING_TIME = 500;

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState('');
  const [content, setContent] = useState(children);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;
    let minLoadingTimeout: NodeJS.Timeout;
    let loadingStartTime = 0;

    // If the pathname changed, start the loading process
    if (location.pathname !== prevPathname) {
      setShowContent(false);
      
      // Set a delay before showing the loading indicator to prevent flashing
      // for quick transitions
      loadingTimeout = setTimeout(() => {
        setLoading(true);
        loadingStartTime = Date.now();
      }, LOADING_DELAY);

      // Update the content with a small delay to ensure the animation plays
      setTimeout(() => {
        setContent(children);
        
        // Calculate how much longer we need to show the loading state
        const timeElapsed = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - timeElapsed);
        
        minLoadingTimeout = setTimeout(() => {
          setLoading(false);
          setShowContent(true);
          setPrevPathname(location.pathname);
        }, remainingTime);
      }, 100);
    }

    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(minLoadingTimeout);
    };
  }, [location.pathname, children, prevPathname]);

  return (
    <>
      {loading && <LoadingSpinner fullPage size="lg" />}
      
      <div
        className={`transition-all duration-300 ${
          showContent ? 'opacity-100 animate-page-in' : 'opacity-0 animate-page-out'
        }`}
      >
        {content}
      </div>
    </>
  );
}