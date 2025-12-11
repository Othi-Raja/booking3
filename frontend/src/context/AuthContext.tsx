import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  user: { id: number; name: string; role: 'admin' | 'user' } | null;
  login: (role: 'admin' | 'user') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: number; name: string; role: 'admin' | 'user' } | null>(null);

  const login = (role: 'admin' | 'user') => {
    setUser({ id: 1, name: role === 'admin' ? 'Admin User' : 'Regular User', role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
