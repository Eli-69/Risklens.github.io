import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export type ScanResult = {
  url: string;
  score: number;
  verdict: string;
  source?: string;
};

export async function saveScanResult(result: ScanResult) {
  if (!auth.currentUser) {
    throw new Error("User not logged in");
  }

  await addDoc(collection(db, "users", auth.currentUser.uid, "scans"), {
    url: result.url,
    score: result.score,
    verdict: result.verdict,
    source: result.source || "manual",
    checkedAt: serverTimestamp(),
  });
}

export async function getUserScans(): Promise<
  Array<{
    id: string;
    url: string;
    score: number;
    verdict: string;
    source?: string;
    checkedAt?: any;
  }>
> {
  if (!auth.currentUser) {
    throw new Error("User not logged in");
  }

  const q = query(
    collection(db, "users", auth.currentUser.uid, "scans"),
    orderBy("checkedAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<{
    id: string;
    url: string;
    score: number;
    verdict: string;
    source?: string;
    checkedAt?: any;
  }>;
}