import { useAuth0 } from '@auth0/auth0-react';

export const useAppAuth = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    isLoading,
    error
  } = useAuth0();

  const login = () => loginWithRedirect({
    appState: { returnTo: window.location.pathname }
  });

  const signUp = () => loginWithRedirect({
    authorizationParams: {
      screen_hint: 'signup'
    }
  });

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    signUp,
    logout
  };
};

