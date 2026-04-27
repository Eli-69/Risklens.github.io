import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export type ScanResult = {
  url: string;
  score: number;
  verdict: string;
  source?: string;
  modelResult?: any;
};

function getDomainFromUrl(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

function getClassification(score: number) {
  if (score >= 60) return "dangerous";
  if (score >= 30) return "suspicious";
  return "safe";
}

export async function saveScanResult(result: ScanResult) {
  if (!auth.currentUser) {
    throw new Error("User not logged in");
  }

  const domain = getDomainFromUrl(result.url);
  const classification = getClassification(result.score);

  const scanData = {
    url: result.url,
    domain,
    score: result.score,
    verdict: result.verdict,
    classification,
    source: result.source || "manual",
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email || "",
    createdAt: serverTimestamp(),
    checkedAt: serverTimestamp(),
    modelResult: result.modelResult || {},
  };

  await addDoc(collection(db, "siteScans"), scanData);

  await addDoc(
    collection(db, "users", auth.currentUser.uid, "scans"),
    scanData
  );
}

export async function getUserScans() {
  if (!auth.currentUser) {
    throw new Error("User not logged in");
  }

  const q = query(
    collection(db, "users", auth.currentUser.uid, "scans"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getLatestScanForDomain(domain: string) {
  const q = query(
    collection(db, "siteScans"),
    where("domain", "==", domain),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data(),
  };
}

export async function getAllSiteScans() {
  const q = query(collection(db, "siteScans"), orderBy("createdAt", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}