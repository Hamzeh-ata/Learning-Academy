import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useNavigationBlock(message, shouldConfirm, onConfirm) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackNavigation = (event) => {
      if (shouldConfirm) {
        window.history.pushState(null, document.title, location.pathname);

        const userConfirmed = window.confirm(message);
        if (userConfirmed) {
          onConfirm(); // Execute the callback if the user confirms
        } else {
          event.preventDefault();
          navigate(location.pathname); // Prevent navigation if not confirmed
        }
      }
    };

    window.addEventListener('popstate', handleBackNavigation);

    return () => {
      window.removeEventListener('popstate', handleBackNavigation);
    };
  }, [navigate, location, shouldConfirm, message, onConfirm]);

  useEffect(() => {
    window.history.pushState(null, document.title, location.pathname);
  }, [location]);
}
