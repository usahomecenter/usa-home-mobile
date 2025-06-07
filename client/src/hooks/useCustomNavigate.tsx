import { useCallback } from 'react';
import { useLocation } from 'wouter';

// Custom hook to provide navigation functionality similar to React Router's useNavigate
export function useNavigate() {
  const [, setLocation] = useLocation();
  
  // Navigate to a new path
  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', to);
    }
    setLocation(to);
  }, [setLocation]);
  
  return navigate;
}