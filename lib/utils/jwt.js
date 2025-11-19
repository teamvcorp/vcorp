import jwt from 'jsonwebtoken';

// Generate a secure secret if not provided (for development)
const JWT_SECRET = process.env.JWT_SECRET || 'vcorp-dev-secret-please-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; // Default 7 days

/**
 * Generate a JWT token for authenticated user
 * @param {Object} user - User object from database
 * @returns {string} JWT token
 */
export function generateAuthToken(user) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    programs: user.programs.map(p => ({
      programId: p.programId,
      tier: p.tier,
      status: p.status,
    })),
    accountStatus: user.accountStatus,
    emailVerified: !!user.emailVerified,
    
    // Stripe customer information for external sites
    stripeCustomerId: user.stripeCustomerId || null,
    stripeDefaultPaymentMethod: user.stripePaymentMethodId || null,
    
    // Payment method details (if available)
    stripePaymentMethods: user.stripePaymentMethodId ? [{
      id: user.stripePaymentMethodId,
      type: 'card',
      last4: user.paymentMethodLast4 || null,
      brand: user.paymentMethodBrand || null,
    }] : [],
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: 'api.thevacorp.com',
    audience: 'vcorp-network',
  });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'api.thevacorp.com',
      audience: 'vcorp-network',
    });
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Refresh a JWT token (generates new token with updated expiry)
 * @param {string} token - Current valid token
 * @returns {string|null} New token or null if original token invalid
 */
export function refreshAuthToken(token) {
  const decoded = verifyAuthToken(token);
  if (!decoded) return null;

  // Remove JWT standard claims before re-signing
  const { iat, exp, iss, aud, ...payload } = decoded;
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: 'api.thevacorp.com',
    audience: 'vcorp-network',
  });
}
