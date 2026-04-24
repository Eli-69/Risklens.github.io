import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export async function submitSiteReport(report: {
  url: string;
  category: string;
  description: string;
}) {
  const user = auth.currentUser;

  const docRef = await addDoc(collection(db, 'siteReports'), {
    url: report.url,
    category: report.category,
    description: report.description,
    status: 'pending',
    createdAt: serverTimestamp(),
    submittedBy: user ? user.uid : null,
    submittedByEmail: user ? user.email : null,
  });

  return docRef.id;
}