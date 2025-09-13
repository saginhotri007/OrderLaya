import React, { createContext, useState, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  // add other user fields if needed
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = (jwt: string, userData: User) => {
    setToken(jwt);
    setUser(userData);
    // optionally, store in AsyncStorage for persistence
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // optionally, remove from AsyncStorage
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
