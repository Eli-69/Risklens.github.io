import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export async function logActivity(action: string, details?: string) {
  const user = auth.currentUser;

  await addDoc(collection(db, 'recentActivity'), {
    action,
    details: details || '',
    user: user?.email || 'Anonymous',
    userId: user?.uid || null,
    time: serverTimestamp(),
  });
}