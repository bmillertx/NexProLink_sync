import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';

const SESSION_EXPIRATION = 60 * 60 * 24 * 5 * 1000; // 5 days

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idToken } = req.body;

  try {
    if (!idToken) {
      throw new Error('No ID token provided');
    }

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Only allow session creation for verified emails or admins
    if (!decodedToken.email_verified && !decodedToken.admin) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    // Create a session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRATION,
    });

    // Set cookie options
    const options = {
      maxAge: SESSION_EXPIRATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict' as const,
    };

    // Set the session cookie
    res.setHeader(
      'Set-Cookie',
      `session=${sessionCookie}; ${Object.entries(options)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    );

    return res.status(200).json({ sessionCookie });
  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
}
