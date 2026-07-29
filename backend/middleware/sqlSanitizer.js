/**
 * Express middleware to detect and reject potential SQL Injection payloads in requests
 */

const SQL_INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\b(OR|AND)\b\s+[\'"]?1[\'"]?\s*=\s*[\'"]?1[\'"]?/i,
  /\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT|SELECT\s+.*FROM|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+.*SET|ALTER\s+TABLE|TRUNCATE\s+TABLE|EXEC\s*\(|EXECUTE\s*\(|INFORMATION_SCHEMA)\b/i,
  /(\/\*|\*\/|;|--|\bEXP\b|\bSLEEP\b|\bBENCHMARK\b)/i,
];

const containsSqlInjection = (value) => {
  if (!value || typeof value !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
};

export const sanitizeSqlInjection = (req, res, next) => {
  const checkObject = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && containsSqlInjection(val)) {
        return true;
      } else if (typeof val === 'object' && val !== null && checkObject(val)) {
        return true;
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    return res.status(400).json({
      message: 'Security Alert: Request contains illegal characters or potential SQL injection vector.',
    });
  }

  next();
};
