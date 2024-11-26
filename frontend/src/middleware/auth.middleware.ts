import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from '@/lib/firebase-admin';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    uid: string;
    email: string;
    role?: string;
    customClaims?: {
      [key: string]: any;
    };
  };
}

export const withAuth = (handler: any) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await verifyIdToken(token);

      // Attach user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: decodedToken.role,
        customClaims: decodedToken.customClaims
      };

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

export const withRole = (roles: string[]) => {
  return (handler: any) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        // First apply authentication
        await withAuth((req: AuthenticatedRequest, res: NextApiResponse) => {
          const userRole = req.user?.role;
          
          if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
          }

          return handler(req, res);
        })(req, res);
      } catch (error) {
        console.error('Role verification error:', error);
        return res.status(403).json({ error: 'Forbidden' });
      }
    };
  };
};

export const withSubscription = (handler: any) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // First apply authentication
      await withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const hasActiveSubscription = req.user?.customClaims?.hasActiveSubscription;
        
        if (!hasActiveSubscription) {
          return res.status(403).json({ error: 'Active subscription required' });
        }

        return handler(req, res);
      })(req, res);
    } catch (error) {
      console.error('Subscription verification error:', error);
      return res.status(403).json({ error: 'Subscription required' });
    }
  };
};
