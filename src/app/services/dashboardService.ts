import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

function getUid() {
  if (!auth.currentUser) {
    throw new Error('User not logged in');
  }

  return auth.currentUser.uid;
}

export async function saveSite(site: {
  domain: string;
  url: string;
  riskScore: number;
}) {
  const uid = getUid();

  await addDoc(collection(db, 'users', uid, 'savedSites'), {
    domain: site.domain,
    url: site.url,
    riskScore: site.riskScore,
    savedDate: serverTimestamp(),
  });
}

export async function getSavedSites() {
  const uid = getUid();

  const q = query(
    collection(db, 'users', uid, 'savedSites'),
    orderBy('savedDate', 'desc')
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addReview(review: {
  domain: string;
  url: string;
  comment: string;
  rating: number;
}) {
  const uid = getUid();

  await addDoc(collection(db, 'users', uid, 'reviews'), {
    domain: review.domain,
    url: review.url,
    comment: review.comment,
    rating: review.rating,
    date: serverTimestamp(),
  });
}

export async function getReviews() {
  const uid = getUid();

  const q = query(
    collection(db, 'users', uid, 'reviews'),
    orderBy('date', 'desc')
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}