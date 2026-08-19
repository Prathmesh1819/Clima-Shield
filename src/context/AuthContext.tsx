import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  isFirebaseConfigured, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  createFirestoreRider,
  getFirestoreRider,
  updateFirestoreRider,
  FirebaseUser
} from '../lib/firebase';
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
  isFirebaseActive: boolean;
  login: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerRider: (profileData: Omit<RiderProfile, 'riderId' | 'createdAt' | 'updatedAt' | 'profileCompleted'>, password: string) => Promise<{ success: boolean; riderId?: string; message?: string }>;
  sendResetEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updatedFields: Partial<RiderProfile>) => Promise<boolean>;
  logout: () => void;
  refreshRider: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [riderProfile, setRiderProfile] = useState<RiderProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Firebase Auth state listener or LocalStorage fallback
  useEffect(() => {
    async function initAuth() {
      await StorageService.init();

      if (isFirebaseConfigured && auth) {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
          if (fbUser) {
            const profile = await getFirestoreRider(fbUser.uid);
            if (profile) {
              setRiderProfile(profile);
              setUser({
                id: fbUser.uid,
                role: profile.role || 'rider',
                riderId: profile.riderId,
                name: profile.fullName,
                email: fbUser.email || profile.email,
                phone: profile.phone
              });
            } else {
              // Fallback for admin or unlinked fb user
              setUser({
                id: fbUser.uid,
                role: fbUser.email === 'admin@climashield.in' ? 'admin' : 'rider',
                name: fbUser.displayName || fbUser.email || 'ClimaShield User',
                email: fbUser.email || undefined
              });
            }
          } else {
            setUser(null);
            setRiderProfile(null);
          }
          setIsLoading(false);
        });
        return () => unsubscribe();
      } else {
        // Fallback to StorageService session
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
    }

    initAuth();
  }, []);

  const refreshRider = async () => {
    if (user?.id && isFirebaseConfigured) {
      const profile = await getFirestoreRider(user.id);
      if (profile) setRiderProfile(profile);
    } else if (user?.riderId) {
      const profile = StorageService.getRiderById(user.riderId);
      if (profile) setRiderProfile(profile);
    }
  };

  // LOGIN METHOD
  const login = async (phoneOrEmail: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanInput = phoneOrEmail.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        // Firebase Auth login via Email + Password
        const emailToUse = cleanInput.includes('@') ? cleanInput : `${cleanInput}@climashield.in`;
        const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
        const profile = await getFirestoreRider(cred.user.uid);
        
        let sessionUser: SessionUser;
        if (profile) {
          sessionUser = {
            id: cred.user.uid,
            role: profile.role || 'rider',
            riderId: profile.riderId,
            name: profile.fullName,
            email: cred.user.email || profile.email,
            phone: profile.phone
          };
          setRiderProfile(profile);
        } else {
          sessionUser = {
            id: cred.user.uid,
            role: cred.user.email === 'admin@climashield.in' ? 'admin' : 'rider',
            name: cred.user.email || 'ClimaShield User',
            email: cred.user.email || undefined
          };
        }

        setUser(sessionUser);
        return { success: true };
      } catch (err: any) {
        console.error('Firebase Auth Login Error:', err);
        let msg = 'Invalid credentials. Please check your email/mobile and password.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Incorrect email or password. Please try again.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Please enter a valid email address format.';
        }
        return { success: false, message: msg };
      }
    } else {
      // LocalStorage Fallback Login
      await StorageService.init();
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
        sessionUser = { id: matchAcc.id, role: 'admin', name: 'ClimaShield Admin', email: matchAcc.phoneOrEmail };
        setRiderProfile(null);
      } else {
        const profile = matchAcc.riderId ? StorageService.getRiderById(matchAcc.riderId) : null;
        if (!profile) return { success: false, message: 'Rider profile not found.' };
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
    }
  };

  // REGISTER METHOD
  const registerRider = async (
    data: Omit<RiderProfile, 'riderId' | 'createdAt' | 'updatedAt' | 'profileCompleted'>, 
    password: string
  ): Promise<{ success: boolean; riderId?: string; message?: string }> => {
    const newRiderId = StorageService.generateRiderId();
    const nowStr = new Date().toISOString();

    let completion = 80;
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

    if (isFirebaseConfigured && auth) {
      try {
        const emailToUse = data.email || `${data.phone}@climashield.in`;
        const cred = await createUserWithEmailAndPassword(auth, emailToUse, password);
        
        // Save to Firestore under `/riders/{cred.user.uid}`
        await createFirestoreRider(cred.user.uid, fullProfile);

        const sessionUser: SessionUser = {
          id: cred.user.uid,
          role: 'rider',
          riderId: newRiderId,
          name: data.fullName,
          email: emailToUse,
          phone: data.phone
        };

        setUser(sessionUser);
        setRiderProfile(fullProfile);
        return { success: true, riderId: newRiderId };
      } catch (err: any) {
        console.error('Firebase Registration Error:', err);
        let msg = 'Registration failed. Please check your details.';
        if (err.code === 'auth/email-already-in-use') {
          msg = 'An account with this email/mobile already exists. Please login instead.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password is too weak. Please choose a stronger password.';
        }
        return { success: false, message: msg };
      }
    } else {
      // LocalStorage Fallback Register
      await StorageService.init();

      const existingPhone = StorageService.getRiderByContact(data.phone);
      if (existingPhone) {
        return { success: false, message: 'Mobile number already registered with ClimaShield.' };
      }

      StorageService.saveRider(fullProfile);

      const passwordHash = await hashPassword(password);
      StorageService.saveAccount({
        id: `acc_${newRiderId}_phone`,
        phoneOrEmail: data.phone,
        passwordHash,
        role: 'rider',
        riderId: newRiderId,
        createdAt: nowStr
      });

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
    }
  };

  // PASSWORD RESET METHOD
  const sendResetEmail = async (email: string): Promise<{ success: boolean; message?: string }> => {
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset link sent to your email address.' };
      } catch (err: any) {
        return { success: false, message: 'Failed to send reset email. Ensure email address is correct.' };
      }
    } else {
      return { success: true, message: '[Demo Mode] Password reset requested. Use password "Rider@123" to login.' };
    }
  };

  // UPDATE PROFILE METHOD
  const updateProfile = async (updatedFields: Partial<RiderProfile>): Promise<boolean> => {
    if (!riderProfile) return false;
    const updated = {
      ...riderProfile,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    if (user?.id && isFirebaseConfigured) {
      await updateFirestoreRider(user.id, updatedFields);
    } else {
      StorageService.saveRider(updated);
    }

    setRiderProfile(updated);
    return true;
  };

  // LOGOUT METHOD
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('SignOut error:', err);
      }
    }
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
      isFirebaseActive: isFirebaseConfigured,
      login,
      registerRider,
      sendResetEmail,
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
