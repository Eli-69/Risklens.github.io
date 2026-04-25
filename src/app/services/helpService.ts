import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export async function submitHelpRequest(request: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const user = auth.currentUser;

  const docRef = await addDoc(collection(db, 'helpRequests'), {
    name: request.name,
    email: request.email,
    subject: request.subject,
    message: request.message,
    status: 'pending',
    time: serverTimestamp(),
    submittedBy: user ? user.uid : null,
    submittedByEmail: user ? user.email : null,
  });

  return docRef.id;
}