import { getFirebaseAnalytics } from '../firebase';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';

let initialized = false;

export async function startAuthTelemetry(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
}) {
  if (initialized) return;
  const a = await getFirebaseAnalytics();
  if (!a) return;
  initialized = true;
  setUserId(a, user.uid);
  if (user.email) setUserProperties(a, { email_domain: user.email.split('@')[1] });
  logEvent(a, 'login');
}

export async function track(name: string, params?: Record<string, unknown>) {
  const a = await getFirebaseAnalytics();
  if (!a) return;
  logEvent(a, name, params);
}
