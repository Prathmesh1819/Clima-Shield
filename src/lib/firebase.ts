import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { RiderProfile } from '../types/rider';
import { ClaimRecord } from '../types';

// Read Vite Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if valid Firebase configuration exists
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
  firebaseConfig.projectId
);

// Initialize Firebase App instance
const app = isFirebaseConfigured 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// FIRESTORE RIDER HELPER FUNCTIONS

/**
 * Creates a new rider document in Firestore under `/riders/{uid}`
 */
export async function createFirestoreRider(uid: string, profile: RiderProfile): Promise<boolean> {
  if (!db) return false;
  try {
    const riderRef = doc(db, 'riders', uid);
    const dataToSave = {
      ...profile,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(riderRef, dataToSave);
    return true;
  } catch (error) {
    console.error('Error creating Firestore rider doc:', error);
    return false;
  }
}

/**
 * Fetches rider profile from Firestore by UID
 */
export async function getFirestoreRider(uid: string): Promise<RiderProfile | null> {
  if (!db) return null;
  try {
    const riderRef = doc(db, 'riders', uid);
    const snap = await getDoc(riderRef);
    if (snap.exists()) {
      return snap.data() as RiderProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Firestore rider doc:', error);
    return null;
  }
}

/**
 * Updates an existing rider profile in Firestore
 */
export async function updateFirestoreRider(uid: string, fields: Partial<RiderProfile>): Promise<boolean> {
  if (!db) return false;
  try {
    const riderRef = doc(db, 'riders', uid);
    await updateDoc(riderRef, {
      ...fields,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating Firestore rider doc:', error);
    return false;
  }
}

/**
 * Fetches all riders (Admin access)
 */
export async function getAllFirestoreRiders(): Promise<RiderProfile[]> {
  if (!db) return [];
  try {
    const ridersRef = collection(db, 'riders');
    const snap = await getDocs(ridersRef);
    const list: RiderProfile[] = [];
    snap.forEach(d => list.push(d.data() as RiderProfile));
    return list;
  } catch (error) {
    console.error('Error fetching all riders from Firestore:', error);
    return [];
  }
}

/**
 * Saves a claim to Firestore under `/claims/{claimId}`
 */
export async function createFirestoreClaim(claim: ClaimRecord, riderId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const claimRef = doc(db, 'claims', claim.id);
    await setDoc(claimRef, {
      ...claim,
      riderId,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error saving claim to Firestore:', error);
    return false;
  }
}

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
};
export type { FirebaseUser };
