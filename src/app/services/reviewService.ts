import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export async function submitSiteReview(review: {
  name: string;
  rating: number;
  review: string;
  url: string;
  domain: string;
}) {
  if (!auth.currentUser) {
    throw new Error('User must be logged in to submit a review.');
  }

  const docRef = await addDoc(collection(db, 'siteReviews'), {
    name: review.name,
    rating: review.rating,
    review: review.review,
    url: review.url,
    domain: review.domain,
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getReviewsForSite(url: string) {
  const q = query(
    collection(db, 'siteReviews'),
    where('url', '==', url),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getMyReviews() {
  if (!auth.currentUser) {
    throw new Error('User not logged in');
  }

  const q = query(
    collection(db, 'siteReviews'),
    where('userId', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getAllSiteReviews() {
  const q = query(
    collection(db, 'siteReviews'),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}