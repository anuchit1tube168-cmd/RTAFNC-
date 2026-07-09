import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db, serverTimestamp } from '../firebase';

const txCollection = collection(db, 'transactions');
const usersCollection = collection(db, 'users');
const auditCollection = collection(db, 'auditLogs');
const appSettingsRef = doc(db, 'settings', 'app');

export const defaultSettings = {
  organizationName: import.meta.env.VITE_ORG_NAME || 'วิทยาลัยพยาบาลทหารอากาศ',
  fiscalYear: new Date().getFullYear() + 543,
  categories: [
    'อาหาร/เครื่องดื่ม',
    'การเดินทาง/พาหนะ',
    'วัสดุสำนักงาน',
    'งานกิจการนักเรียน',
    'ฝึก/อบรม',
    'รายรับอื่น ๆ'
  ]
};

export async function ensureUserProfile(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName || user.email,
      role: 'staff',
      department: '',
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await addAudit('create_user_profile', 'users', user.uid, user.uid, user.email);
    return { uid: user.uid, role: 'staff', active: true, email: user.email, displayName: user.displayName || user.email };
  }
  return { uid: user.uid, ...snap.data() };
}

export function watchSettings(callback) {
  return onSnapshot(appSettingsRef, (snapshot) => {
    callback(snapshot.exists() ? { ...defaultSettings, ...snapshot.data() } : defaultSettings);
  }, () => callback(defaultSettings));
}

export async function saveSettings(settings, userProfile) {
  const nextSettings = {
    ...settings,
    categories: String(settings.categoriesText || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    fiscalYear: Number(settings.fiscalYear || defaultSettings.fiscalYear),
    updatedAt: serverTimestamp(),
    updatedBy: userProfile.uid,
    updatedByEmail: userProfile.email
  };
  delete nextSettings.categoriesText;
  await setDoc(appSettingsRef, nextSettings, { merge: true });
  await addAudit('update_settings', 'settings', 'app', userProfile.uid, userProfile.email);
  return nextSettings;
}

export function watchTransactions(userProfile, callback) {
  if (!userProfile) return () => {};
  const constraints = [orderBy('date', 'desc'), limit(200)];
  const q = userProfile.role === 'staff'
    ? query(txCollection, where('createdBy', '==', userProfile.uid), ...constraints)
    : query(txCollection, ...constraints);
  return onSnapshot(q, (snapshot) => {
    const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    callback(rows);
  });
}

export async function addTransaction(payload, userProfile) {
  const now = serverTimestamp();
  const ref = await addDoc(txCollection, {
    ...payload,
    amount: Number(payload.amount || 0),
    createdBy: userProfile.uid,
    createdByEmail: userProfile.email,
    status: userProfile.role === 'admin' ? 'approved' : 'pending',
    createdAt: now,
    updatedAt: now
  });
  await addAudit('create_transaction', 'transactions', ref.id, userProfile.uid, userProfile.email);
  return ref.id;
}

export async function updateTransaction(id, payload, userProfile) {
  await updateDoc(doc(db, 'transactions', id), {
    ...payload,
    amount: Number(payload.amount || 0),
    updatedAt: serverTimestamp()
  });
  await addAudit('update_transaction', 'transactions', id, userProfile.uid, userProfile.email);
}

export async function approveTransaction(id, status, userProfile) {
  await updateDoc(doc(db, 'transactions', id), {
    status,
    approvedBy: userProfile.uid,
    approvedByEmail: userProfile.email,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  await addAudit(`${status}_transaction`, 'transactions', id, userProfile.uid, userProfile.email);
}

export async function removeTransaction(id, userProfile) {
  await deleteDoc(doc(db, 'transactions', id));
  await addAudit('delete_transaction', 'transactions', id, userProfile.uid, userProfile.email);
}

async function addAudit(action, targetCollection, targetId, actorUid, actorEmail) {
  await addDoc(auditCollection, {
    action,
    targetCollection,
    targetId,
    actorUid,
    actorEmail,
    timestamp: serverTimestamp()
  });
}

export { usersCollection };
