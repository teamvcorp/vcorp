/**
 * Whitelist of allowed domains for cross-origin requests
 * Add your external site domains here
 */
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://api.thevacorp.com',
  'https://thevacorp.com',
  'https://www.thevacorp.com',
  'https://fyght4.com',
  'https://www.fyght4.com',
  'https://spiritof.com',
  'https://www.spiritof.com',
  'https://edyensgate.com',
  'https://www.edyensgate.com',
  // Add more domains as needed
];

/**
 * Configure CORS headers for API responses
 * @param {Request} request - Incoming request object
 * @param {Response} response - Response object to add headers to
 * @returns {Object} CORS headers object
 */
export function configureCORS(request) {
  const origin = request.headers.get('origin');
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Handle OPTIONS preflight requests
 * @param {Request} request - Incoming request object
 * @returns {Response} Response with CORS headers
 */
export function handleCORSPreflight(request) {
  return new Response(null, {
    status: 204,
    headers: configureCORS(request),
  });
}

/**
 * Validate if origin is whitelisted
 * @param {string} origin - Origin to validate
 * @returns {boolean} True if origin is allowed
 */
export function isOriginAllowed(origin) {
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Validate and sanitize redirect URL
 * @param {string} redirectUrl - URL to redirect to after authentication
 * @returns {string|null} Valid redirect URL or null if invalid
 */
export function validateRedirectUrl(redirectUrl) {
  if (!redirectUrl) return null;

  try {
    const url = new URL(redirectUrl);
    const origin = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
    
    if (!isOriginAllowed(origin)) {
      console.warn('Redirect URL origin not whitelisted:', origin);
      return null;
    }

    return redirectUrl;
  } catch (error) {
    console.error('Invalid redirect URL:', redirectUrl);
    return null;
  }
}
