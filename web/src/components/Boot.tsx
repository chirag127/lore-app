import { useEffect } from 'react';
import { useAuthStore } from '../lib/stores/auth';
import { bootstrapTheme } from '../lib/stores/theme';
import { getFirebaseAnalytics } from '../lib/firebase';

export function ClientBootstrap() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    bootstrapTheme();
    const unsub = init();
    getFirebaseAnalytics().catch(() => undefined);
    return unsub;
  }, [init]);
  return null;
}
