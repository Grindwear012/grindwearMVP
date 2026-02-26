'use client';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  db: Firestore,
  name: string,
  email: string,
  password: string
): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly.
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      
      // Update Auth Profile
      await updateProfile(user, { displayName: name });

      // Split name into first and last for the Customer entity
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Create Customer document in Firestore
      const customerRef = doc(db, 'customers', user.uid);
      setDoc(customerRef, {
        id: user.uid,
        firstName: firstName || 'User',
        lastName: lastName || '',
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    })
    .catch((error) => {
      // Errors are typically caught by higher-level listeners or toasts in the UI
      console.error('Sign up error:', error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password);
}
