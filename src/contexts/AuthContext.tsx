import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Capability, PERMISSION_MATRIX } from '../types/auth';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  hasCapability: (capability: Capability) => boolean;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'u_1',
  name: 'John Discovery',
  email: 'john@discovery.ai',
  role: UserRole.PRO_USER, // Default starting role for demo
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);

  const hasCapability = (capability: Capability): boolean => {
    if (!user) return false;
    return PERMISSION_MATRIX[user.role].includes(capability);
  };

  const switchRole = (role: UserRole) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setUser(prev => prev ? { ...prev, role } : null);
      setIsLoading(false);
    }, 300);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || UserRole.GUEST, 
      isLoading, 
      hasCapability, 
      switchRole,
      logout 
    }}>
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
