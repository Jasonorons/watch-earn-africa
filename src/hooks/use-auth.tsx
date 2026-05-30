import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  signOut: async () => {},
  signIn: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = storage.getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const signIn = (email: string) => {
    const newUser = { email, id: email };
    storage.setSession(newUser);
    setUser(newUser);
  };

  const signOut = async () => {
    storage.clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);