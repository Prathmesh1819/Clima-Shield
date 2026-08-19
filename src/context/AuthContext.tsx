import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService, hashPassword } from '../services/storageService';
import { RiderProfile } from '../types/rider';

interface SessionUser {
  id: string;
  role: 'rider' | 'admin';
  riderId?: string;
  name: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: SessionUser | null;
  riderProfile: RiderProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerRider: (profileData: Omit<RiderProfile, 'riderId' | 'createdAt' | 'updatedAt' | 'profileCompleted'>, password: string) => Promise<{ success: boolean; riderId?: string; message?: string }>;
  updateProfile: (updatedFields: Partial<RiderProfile>) => Promise<boolean>;
  logout: () => void;
  refreshRider: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [riderProfile, setRiderProfile] = useState<RiderProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize storage & check session
  useEffect(() => {
    async function initAuth() {
      await StorageService.init();
      const session = StorageService.getSession();
      if (session) {
        setUser(session);
        if (session.riderId) {
          const profile = StorageService.getRiderById(session.riderId);
          setRiderProfile(profile);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const refreshRider = () => {
    if (user?.riderId) {
      const profile = StorageService.getRiderById(user.riderId);
      setRiderProfile(profile);
    }
  };

  const login = async (phoneOrEmail: string, password: string): Promise<{ success: boolean; message?: string }> => {
    await StorageService.init();
    const cleanInput = phoneOrEmail.trim().toLowerCase();
    const accounts = StorageService.getAccounts();

    const inputHash = await hashPassword(password);

    const matchAcc = accounts.find(a => 
      a.phoneOrEmail.trim().toLowerCase() === cleanInput && a.passwordHash === inputHash
    );

    if (!matchAcc) {
      return { success: false, message: 'Invalid phone/email or password.' };
    }

    let sessionUser: SessionUser;

    if (matchAcc.role === 'admin') {
      sessionUser = {
        id: matchAcc.id,
        role: 'admin',
        name: 'ClimaShield Admin',
        email: matchAcc.phoneOrEmail
      };
      setRiderProfile(null);
    } else {
      const profile = matchAcc.riderId ? StorageService.getRiderById(matchAcc.riderId) : null;
      if (!profile) {
        return { success: false, message: 'Rider profile associated with account not found.' };
      }
      sessionUser = {
        id: matchAcc.id,
        role: 'rider',
        riderId: profile.riderId,
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone
      };
      setRiderProfile(profile);
    }

    setUser(sessionUser);
    StorageService.setSession(sessionUser);
    return { success: true };
  };

  const registerRider = async (
    data: Omit<RiderProfile, 'riderId' | 'createdAt' | 'updatedAt' | 'profileCompleted'>, 
    password: string
  ): Promise<{ success: boolean; riderId?: string; message?: string }> => {
    await StorageService.init();

    // Check duplicate phone or email
    const existingPhone = StorageService.getRiderByContact(data.phone);
    if (existingPhone) {
      return { success: false, message: 'Mobile number already registered with ClimaShield.' };
    }

    if (data.email) {
      const existingEmail = StorageService.getRiderByContact(data.email);
      if (existingEmail) {
        return { success: false, message: 'Email address already registered with ClimaShield.' };
      }
    }

    const newRiderId = StorageService.generateRiderId();
    const nowStr = new Date().toISOString();

    // Calculate profile completion percentage
    let completion = 80; // Base completion after 4 steps
    if (data.emergencyContact?.name && data.emergencyContact?.phone) completion += 10;
    if (data.preferredWorkingZone) completion += 5;

    const fullProfile: RiderProfile = {
      ...data,
      riderId: newRiderId,
      profileCompleted: completion,
      protectionStatus: 'ACTIVE',
      planId: 'PLAN-GOLD-300',
      role: 'rider',
      createdAt: nowStr,
      updatedAt: nowStr
    };

    StorageService.saveRider(fullProfile);

    // Save password account credentials (for both phone & email if present)
    const passwordHash = await hashPassword(password);

    StorageService.saveAccount({
      id: `acc_${newRiderId}_phone`,
      phoneOrEmail: data.phone,
      passwordHash,
      role: 'rider',
      riderId: newRiderId,
      createdAt: nowStr
    });

    if (data.email) {
      StorageService.saveAccount({
        id: `acc_${newRiderId}_email`,
        phoneOrEmail: data.email,
        passwordHash,
        role: 'rider',
        riderId: newRiderId,
        createdAt: nowStr
      });
    }

    // Auto-login session
    const sessionUser: SessionUser = {
      id: `acc_${newRiderId}_phone`,
      role: 'rider',
      riderId: newRiderId,
      name: data.fullName,
      email: data.email,
      phone: data.phone
    };

    setUser(sessionUser);
    setRiderProfile(fullProfile);
    StorageService.setSession(sessionUser);

    return { success: true, riderId: newRiderId };
  };

  const updateProfile = async (updatedFields: Partial<RiderProfile>): Promise<boolean> => {
    if (!riderProfile) return false;
    const updated = {
      ...riderProfile,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    StorageService.saveRider(updated);
    setRiderProfile(updated);
    return true;
  };

  const logout = () => {
    setUser(null);
    setRiderProfile(null);
    StorageService.clearSession();
  };

  return (
    <AuthContext.Provider value={{
      user,
      riderProfile,
      isAuthenticated: !!user,
      isLoading,
      login,
      registerRider,
      updateProfile,
      logout,
      refreshRider
    }}>
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
