import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { fetchAuthSession, signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, signUp as amplifySignUp } from 'aws-amplify/auth';
import { generateClient } from '@aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

declare global {
  interface Window {
    __DEV_MODE__?: boolean;
  }
}

const DEV_MODE = window.__DEV_MODE__ === true;

interface User extends Omit<AuthUser, 'username'> {
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  organizationRole: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  username: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<{ isSignedIn: boolean; nextStep?: any }>;
  signUp: (username: string, password: string, email: string, name: string) => Promise<{ isSignUpComplete: boolean; userId?: string; nextStep?: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isSignedIn: boolean;
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(DEV_MODE);

  const checkUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const { username, userId } = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;

      if (idToken) {
        setUser({
          id: userId,
          username,
          email: idToken.payload.email as string,
          firstName: idToken.payload['custom:firstName'] as string || '',
          lastName: idToken.payload['custom:lastName'] as string || '',
          organizationName: idToken.payload['custom:organizationName'] as string || '',
          organizationRole: idToken.payload['custom:organizationRole'] as string || '',
          subscriptionTier: idToken.payload['custom:subscriptionTier'] as string || '',
          subscriptionStatus: idToken.payload['custom:subscriptionStatus'] as string || '',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const signInUser = async (username: string, password: string) => {
    try {
      await amplifySignIn({ username, password });
      await checkUser();
      return { isSignedIn: true };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signUpUser = async (username: string, password: string, email: string, name: string) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      if (!isSignUpComplete) {
        console.log('Additional steps required', nextStep);
        return { isSignUpComplete, nextStep };
      }
      await checkUser();
      return { isSignUpComplete, userId };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const toggleDevMode = () => {
    setIsDevMode(prev => !prev);
    checkUser();
  };

  const contextValue: AuthContextType = {
    user,
    signIn: signInUser,
    signOut: signOutUser,
    signUp: signUpUser,
    isLoading,
    isSignedIn: !!user,
    isDevMode,
    toggleDevMode,
  };

  return (
    <AuthContext.Provider > {contextValue}>
      {children}
    </AuthContext.Provider>/
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};