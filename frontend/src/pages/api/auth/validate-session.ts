import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionCookie } = req.body;

  try {
    if (!sessionCookie) {
      throw new Error('No session cookie provided');
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Create a custom token for client-side auth
    const customToken = await auth.createCustomToken(decodedClaims.uid, {
      role: decodedClaims.role || 'client',
      email_verified: decodedClaims.email_verified,
    });

    return res.status(200).json({ 
      valid: true,
      customToken,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        role: decodedClaims.role || 'client',
        email_verified: decodedClaims.email_verified,
      }
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(401).json({ 
      valid: false,
      error: 'Invalid session' 
    });
  }
}
