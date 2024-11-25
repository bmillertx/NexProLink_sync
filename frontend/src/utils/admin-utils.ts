import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const ADMIN_EMAIL = 'brian.miller.allen@gmail.com';

export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }

    const userData = userSnap.data();
    return userData.role === 'admin' || userData.email === ADMIN_EMAIL;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
