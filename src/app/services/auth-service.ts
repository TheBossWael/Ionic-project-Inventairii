import { Injectable, signal } from '@angular/core';
import { auth, db } from '../firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  UserCredential,
} from 'firebase/auth';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { updateDoc } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../models/userModel';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);

  constructor() {

  onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      this.user.set(null);
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      this.user.set(userDoc.data() as User);
    }
  });
}

  // Register new user
  async register(email: string, password: string, Username: string, role: User['role']) {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await updateProfile(userCredential.user, { displayName: Username });

    const newUser: User = { uid, email, Username, role };

    await setDoc(doc(db, 'users', uid), newUser);

    this.user.set(newUser);
    return newUser;
  }

  // Login existing user
  async login(email: string, password: string) {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data() as User | undefined;

    if (!userData) throw new Error('User data not found in Firestore');

    this.user.set(userData);
    return userData;
  }

  // Logout user
  async logout() {
    await signOut(auth);
    this.user.set(null);
  }

  // Get current user
  get currentUser(): User | null {
    return this.user();
  }

  // Check if current user has the expected role
  hasRole(expectedRoles: string[]): boolean {
    const currentUser = this.currentUser;
    if (!currentUser) return false;
    return expectedRoles.includes(currentUser.role);
  }


  // Send Password Reset Email
  async sendPasswordReset(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  // Update user profile (email, password, role)
async updateProfileData(oldPassword: string, newEmail?: string, newPassword?: string, newRole?: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No user is currently logged in.');

  // Step 1: Reauthenticate user
  const credential = EmailAuthProvider.credential(currentUser.email!, oldPassword);
  await reauthenticateWithCredential(currentUser, credential);

  // Step 2: Update email if provided
  if (newEmail && newEmail !== currentUser.email) {
    await updateEmail(currentUser, newEmail);
    await updateDoc(doc(db, 'users', currentUser.uid), { email: newEmail });
  }

  // Step 3: Update password if provided
  if (newPassword && newPassword.trim() !== '') {
    await updatePassword(currentUser, newPassword);
  }

  // Step 4: Update role if provided
  if (newRole) {
    await updateDoc(doc(db, 'users', currentUser.uid), { role: newRole });
  }

  // Step 5: Refresh user data in Firestore
  const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
  const updatedUser = userDoc.data() as User;

  this.user.set(updatedUser);
  return updatedUser;
}

}
