import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'judge' | 'rider';

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  judge: { email: 'scoringsystem@test.com', password: 'ChangeTheTide!' },
  rider: { email: 'leonardo.casati@harlemkitesurfing.com', password: 'ChangeTheTide!' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [role, setRole] = useState<UserRole | null>(() =>
    (localStorage.getItem('userRole') as UserRole | null) ?? null
  );

  const login = (email: string, password: string, asRole: UserRole): boolean => {
    const creds = CREDENTIALS[asRole];
    if (email === creds.email && password === creds.password) {
      setIsAuthenticated(true);
      setRole(asRole);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', asRole);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
