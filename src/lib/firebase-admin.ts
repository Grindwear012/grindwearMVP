import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * @fileOverview Server-side Firebase Admin SDK initialization.
 * This should ONLY be imported in server actions, API routes, or route handlers.
 */

let adminApp: App;

// The replace(/\\n/g, '\n') is critical for parsing multiline private keys from environment variables.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Check for required variables and existing apps to avoid crashes during build
if (!getApps().length && process.env.FIREBASE_PROJECT_ID && privateKey) {
  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
  }
} else if (getApps().length > 0) {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp!);
export const adminAuth = getAuth(adminApp!);
export { adminApp! as adminApp };
