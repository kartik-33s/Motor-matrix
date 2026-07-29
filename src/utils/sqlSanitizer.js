/**
 * Utility functions for SQL Injection detection and input sanitization
 */

// Regex patterns commonly associated with SQL Injection attacks
const SQL_INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // Single quote, double dash, hash
  /((\%3D)|(=))[^\n]*((%27)|(\')|(\-\-)|(\%3B)|(;))/i, // Equal sign with quotes or semicolon
  /\b(OR|AND)\b\s+[\'"]?1[\'"]?\s*=\s*[\'"]?1[\'"]?/i, // Tautology (OR 1=1, AND 1=1)
  /\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT|SELECT\s+.*FROM|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+.*SET|ALTER\s+TABLE|TRUNCATE\s+TABLE|EXEC\s*\(|EXECUTE\s*\(|INFORMATION_SCHEMA)\b/i, // Dangerous SQL keywords
  /(\/\*|\*\/|;|--|\bEXP\b|\bSLEEP\b|\bBENCHMARK\b)/i, // Semicolon, comments, sleeping functions
];

/**
 * Checks if a string contains known SQL injection patterns
 * @param {string} input - The input string to validate
 * @returns {boolean} True if a suspicious pattern is detected
 */
export const hasSqlInjectionPattern = (input) => {
  if (!input || typeof input !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
};

/**
 * Sanitizes input string by stripping potential dangerous SQL characters
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/['";\\-]/g, ''); // Remove quotes, semicolons, backslashes, dashes
};
