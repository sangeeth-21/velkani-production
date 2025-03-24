
import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminAuthContextType = {
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if admin is logged in when component mounts
    const admin = localStorage.getItem('admin');
    if (admin) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate against a backend
    // For demo purposes, we'll use hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin', 'true');
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('admin');
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAdminAuthenticated, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
