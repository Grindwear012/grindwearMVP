'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Initializes Firebase Client SDK.
 * Optimized for Next.js App Router (SSR, Build, and Client-side).
 */
export function initializeFirebase() {
  const apps = getApps();
  
  // If an app is already initialized, reuse it.
  if (apps.length > 0) {
    return getSdks(apps[0]);
  }

  // Always use the explicit config during build and on the client for maximum reliability.
  // Providing the public config here ensures 'next build' and SSR work without 
  // environment-specific crashes or discovery warnings.
  const firebaseApp = initializeApp(firebaseConfig);

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
