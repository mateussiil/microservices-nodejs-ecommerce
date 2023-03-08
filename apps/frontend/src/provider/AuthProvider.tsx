import React, { ReactElement, createContext, useContext, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string, password: string }) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children:ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login: AuthContextData["login"] = async (credentials) => {
    const res = await fetch('http://localhost:3001/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if(data.user){
      setUser(data);

      return data.user as User
    }

    return null;
  };

  const logout = async () => {
    const res = await fetch('http://localhost:3001/auth/signin', {
      method: 'POST',
    });

    if(res.status === 200){
      setUser(null);
    }
  };

  const getCurrent = async () => {
    const res = await fetch('http://localhost:3001/auth/current-user', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    const data = await res.json();

    if(data.user){
      return data.user;
    }

    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
