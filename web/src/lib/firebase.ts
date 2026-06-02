import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

const config = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _analytics: Analytics | null = null;
let _appCheck: AppCheck | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(config);
  if (import.meta.env.PUBLIC_RECAPTCHA_V3_SITE_KEY) {
    try {
      _appCheck = initializeAppCheck(_app, {
        provider: new ReCaptchaV3Provider(
          import.meta.env.PUBLIC_RECAPTCHA_V3_SITE_KEY as string,
        ),
        isTokenAutoRefreshEnabled: true,
      });
    } catch {
      /* already initialized */
    }
  }
  if (import.meta.env.DEV) {
    const w = self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string };
    w.FIREBASE_APPCHECK_DEBUG_TOKEN =
      import.meta.env.PUBLIC_USE_EMULATORS === 'true' || true;
  }
  return _app;
}

export function getAppCheck(): AppCheck | null {
  if (_appCheck) return _appCheck;
  getFirebaseApp();
  return _appCheck;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  if (import.meta.env.PUBLIC_USE_EMULATORS === 'true') {
    try {
      connectAuthEmulator(_auth, 'http://127.0.0.1:9099', {
        disableWarnings: true,
      });
    } catch {
      /* already connected */
    }
  }
  return _auth;
}

export function getDb(): Firestore {
  if (_db) return _db;
  _db = initializeFirestore(getFirebaseApp(), {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  if (import.meta.env.PUBLIC_USE_EMULATORS === 'true') {
    try {
      connectFirestoreEmulator(_db, '127.0.0.1', 8080);
    } catch {
      /* already connected */
    }
  }
  return _db;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (_analytics) return _analytics;
  if (typeof window === 'undefined') return null;
  const ok = await isSupported();
  if (!ok) return null;
  _analytics = getAnalytics(getFirebaseApp());
  return _analytics;
}
