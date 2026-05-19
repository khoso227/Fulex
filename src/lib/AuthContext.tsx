import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

interface UserData {
  uid: string;
  email: string | null;
  role: 'driver' | 'owner' | 'admin';
  displayName: string | null;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt: any;
  fuelPreferences?: string[]; 
  salary?: number;
  cnic?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  theme: 'dark' | 'light';
  setRole: (role: 'driver' | 'owner') => Promise<void>;
  clearRole: () => Promise<void>;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Sync theme with body class
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        setLoading(true);
        // Start listening to the user document for changes
        const { onSnapshot } = await import('firebase/firestore');
        unsubscribeDoc = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore snapshot error:", error);
          setLoading(false);
        });
      } else {
        if (unsubscribeDoc) unsubscribeDoc();
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const setRole = async (role: 'driver' | 'owner') => {
    if (!user) return;
    const path = `users/${user.uid}`;
    
    try {
      // If the user email is the special admin email, we allow them to be admin.
      // But if they are explicitly choosing a role (from RoleSelection), we should probably let them.
      // However, usually admins want to stay admins. 
      // Let's make it so they can choose, but if they haven't chosen, they are admin.
      const finalRole = role; // Just use what they chose. The admin override can be handled in logic if needed via email check.
      
      const data = {
        uid: user.uid,
        email: user.email,
        role: finalRole,
        displayName: user.displayName || user.email?.split('@')[0] || 'Member',
        createdAt: serverTimestamp(),
        isAdmin: user.email === 'khososarang816@gmail.com' // Explicitly mark as admin
      };
      await setDoc(doc(db, 'users', user.uid), data);
      setUserData({ ...data, createdAt: new Date().toISOString() } as unknown as UserData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const clearRole = async () => {
    setUserData(null);
    // Locally clear, usually user wants to re-select
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, theme, setRole, clearRole, toggleTheme }}>
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
