import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, AuthUser,  } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { signUp as amplifySignUp, confirmSignUp,  } from 'aws-amplify/auth';
import { User } from '../hooks/useAuth';

const client = generateClient<Schema>();
declare global {
  interface Window {
    __DEV_MODE__?: boolean;
  }
}

// Set this in your index.html or main entry point
// window.__DEV_MODE__ = true; // Set this to true to enable dev mode

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

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    if (isDevMode) {
      setUser({
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        organizationName: 'Dev Org',
        organizationRole: 'ADMIN',
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        userId: 'dev-user-id',
        username: 'dev-user'
      } as User);
      setIsLoading(false);
      return;
    }

    try {
      const session = await fetchAuthSession();
      if (session.tokens) {
        const authUser = await getCurrentUser();
        const { data: userData } = await client.models.User.get({ id: authUser.userId });
        
        if (userData) {
          setUser({
            ...authUser,
            ...userData,
            organizationName: userData.organizationName || '',
            organizationRole: userData.organizationRole || '',
          } as User);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignIn = async (username: string, password: string): Promise<{ isSignedIn: boolean, nextStep?: any }> => {
    try {
      if (isDevMode) {
        // Simulate sign-in for dev mode
        setUser({
          id: 'dev-user-id',
          username: 'dev-user',
          email: 'dev@example.com',
          role: 'ADMIN',
          permissions: ['ALL'],
        });
        return { isSignedIn: true };
      }

      const { isSignedIn, nextStep } = await amplifySignIn({ username, password });

      if (!isSignedIn) {
        return { isSignedIn, nextStep };
      }

      await checkUser();
      return { isSignedIn };
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  async function signOutUser() {
    try {
      if (isDevMode) {
        setUser(null);
        return;
      }

      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async function signUpUser(username: string, password: string, email: string, name: string) {
    try {
      if (isDevMode) {
        // Simulate sign-up for dev mode
        console.log('Dev mode sign-up:', { username, email, name });
        return { isSignUpComplete: true, userId: 'dev-user-id' };
      }

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
        console.log('Confirmation may be required');
        return { isSignUpComplete, userId, nextStep };
      }

      return { isSignUpComplete, userId };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  function toggleDevMode() {
    setIsDevMode(prev => !prev);
    checkUser();
  }

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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
