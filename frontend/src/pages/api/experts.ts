import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const expertsRef = collection(db, 'profiles');
    const expertsQuery = query(expertsRef, where('role', '==', 'consultant'));
    const expertsSnapshot = await getDocs(expertsQuery);
    
    const experts = expertsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    return res.status(500).json({ 
      message: 'Error fetching experts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
