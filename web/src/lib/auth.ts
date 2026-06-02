import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut as fbSignOut,
  linkWithPopup,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

const github = new GithubAuthProvider();
github.addScope('read:user');
github.setCustomParameters({ allow_signup: 'true' });

const google = new GoogleAuthProvider();
google.addScope('profile');
google.addScope('email');
google.setCustomParameters({ prompt: 'select_account' });

export const providers = { github, google };

export async function signInWithGithub(): Promise<User> {
  const cred = await signInWithPopup(getFirebaseAuth(), github);
  return cred.user;
}

export async function signInWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(getFirebaseAuth(), google);
  return cred.user;
}

const EMAIL_LINK_KEY = '__ba_email_for_sign_in';

export async function startEmailLink(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  const actionCodeSettings = {
    url: `${window.location.origin}/finish-login`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem(EMAIL_LINK_KEY, email);
}

export async function completeEmailLink(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;
  const email = window.localStorage.getItem(EMAIL_LINK_KEY);
  if (!email) return null;
  const cred = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem(EMAIL_LINK_KEY);
  return cred.user;
}

export async function linkGithub(): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) throw new Error('not signed in');
  const cred = await linkWithPopup(auth.currentUser, github);
  return cred.user;
}

export async function signOut(): Promise<void> {
  await fbSignOut(getFirebaseAuth());
}
