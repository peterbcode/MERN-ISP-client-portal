// Security utilities for input validation and SQL injection prevention

// SQL injection patterns to detect and block
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(--|#|\/\*|\*\/)/,
  /(\bOR\b.*=.*\bOR\b)/i,
  /(\bAND\b.*=.*\bAND\b)/i,
  /(\'|\"|`|;|\||--)/,
  /(\bWHERE\b.*\bOR\b)/i,
  /(\bHAVING\b.*\bOR\b)/i,
  /(\bGROUP BY\b.*\bHAVING\b)/i,
  /(\bORDER BY\b.*\bCASE\b)/i,
  /(\bUNION\b.*\bSELECT\b)/i,
  /(\bEXEC\b|\bEXECUTE\b)/i,
  /(\bXP_\w+|\bSP_\w+)/i,
  /(\bCONVERT\b|\bCAST\b)/i,
  /(\bSUBSTRING\b|\bCHAR\b|\bASCII\b)/i,
  /(\bWAITFOR\b|\bDELAY\b)/i,
  /(\bSHUTDOWN\b|\bRESTART\b)/i,
  /(\bTRUNCATE\b|\bBACKUP\b)/i,
  /(\bLOAD_FILE\b|\bINTO\b)/i,
  /(\bOUTFILE\b|\bDUMPFILE\b)/i,
  /(\bBENCHMARK\b|\bSLEEP\b)/i,
  /(\bUSER\b|\bDATABASE\b|\bVERSION\b)/i,
  /(\b@@\w+)/i,
  /(\b0x[0-9a-fA-F]+)/i,
  /(\bCHAR\b.*\(\s*\d+\s*\))/i,
  /(\bASCII\b.*\(\s*\w+\s*\))/i,
  /(\bORD\b.*\(\s*\w+\s*\))/i,
  /(\bLENGTH\b.*\(\s*\w+\s*\))/i,
  /(\bSUBSTR\b.*\(\s*\w+\s*\))/i,
  /(\bCONCAT\b.*\(\s*\w+\s*\))/i,
  /(\bLOWER\b.*\(\s*\w+\s*\))/i,
  /(\bUPPER\b.*\(\s*\w+\s*\))/i,
  /(\bREPLACE\b.*\(\s*\w+\s*\))/i,
  /(\bINSTR\b.*\(\s*\w+\s*\))/i,
  /(\bLOCATE\b.*\(\s*\w+\s*\))/i,
  /(\bINSTR\b.*\(\s*\w+\s*\))/i,
  /(\bPOSITION\b.*\(\s*\w+\s*\))/i,
  /(\bLIKE\b.*\%\w+\%)/i,
  /(\bLIKE\b.*\_\w+)/i,
  /(\bLIKE\b.*\[.*\])/i,
  /(\bLIKE\b.*\^.*\$)/i,
  /(\bREGEXP\b.*\w+)/i,
  /(\bRLIKE\b.*\w+)/i,
  /(\bMATCH\b.*\w+)/i,
  /(\bAGAINST\b.*\w+)/i,
  /(\bFULLTEXT\b.*\w+)/i,
  /(\bBOOLEAN\b.*\w+)/i,
  /(\bNATURAL\b.*\w+)/i,
  /(\bLANGUAGE\b.*\w+)/i,
  /(\bQUERY\b.*\w+)/i,
  /(\bEXPANSION\b.*\w+)/i,
  /(\bWITH\b.*\w+)/i,
  /(\bRECURSIVE\b.*\w+)/i,
  /(\bCTE\b.*\w+)/i,
  /(\bWINDOW\b.*\w+)/i,
  /(\bOVER\b.*\w+)/i,
  /(\bPARTITION\b.*\w+)/i,
  /(\bRANGE\b.*\w+)/i,
  /(\bROWS\b.*\w+)/i,
  /(\bUNBOUNDED\b.*\w+)/i,
  /(\bPRECEDING\b.*\w+)/i,
  /(\bFOLLOWING\b.*\w+)/i,
  /(\bCURRENT\b.*\w+)/i,
  /(\bROW\b.*\w+)/i,
  /(\bFIRST\b.*\w+)/i,
  /(\bLAST\b.*\w+)/i,
  /(\bVALUE\b.*\w+)/i,
  /(\bIGNORE\b.*\w+)/i,
  /(\bNULLS\b.*\w+)/i,
  /(\bRESPECT\b.*\w+)/i,
  /(\bONLY\b.*\w+)/i,
  /(\bTIES\b.*\w+)/i,
  /(\bDENSE_RANK\b.*\w+)/i,
  /(\bRANK\b.*\w+)/i,
  /(\bROW_NUMBER\b.*\w+)/i,
  /(\bLAG\b.*\w+)/i,
  /(\bLEAD\b.*\w+)/i,
  /(\bFIRST_VALUE\b.*\w+)/i,
  /(\bLAST_VALUE\b.*\w+)/i,
  /(\bNTH_VALUE\b.*\w+)/i,
  /(\bNTILE\b.*\w+)/i,
  /(\bCUME_DIST\b.*\w+)/i,
  /(\bPERCENT_RANK\b.*\w+)/i,
  /(\bPERCENTILE_CONT\b.*\w+)/i,
  /(\bPERCENTILE_DISC\b.*\w+)/i,
  /(\bMEDIAN\b.*\w+)/i,
  /(\bMODE\b.*\w+)/i,
  /(\bSTDDEV\b.*\w+)/i,
  /(\bSTDDEV_SAMP\b.*\w+)/i,
  /(\bSTDDEV_POP\b.*\w+)/i,
  /(\bVAR_SAMP\b.*\w+)/i,
  /(\bVAR_POP\b.*\w+)/i,
  /(\bVAR\b.*\w+)/i,
  /(\bVARIANCE\b.*\w+)/i,
  /(\bCOVAR_SAMP\b.*\w+)/i,
  /(\bCOVAR_POP\b.*\w+)/i,
  /(\bCORR\b.*\w+)/i,
  /(\bCORRELATION\b.*\w+)/i,
  /(\bREGR_SLOPE\b.*\w+)/i,
  /(\bREGR_INTERCEPT\b.*\w+)/i,
  /(\bREGR_COUNT\b.*\w+)/i,
  /(\bREGR_R2\b.*\w+)/i,
  /(\bREGR_AVGX\b.*\w+)/i,
  /(\bREGR_AVGY\b.*\w+)/i,
  /(\bREGR_SXX\b.*\w+)/i,
  /(\bREGR_SYY\b.*\w+)/i,
  /(\bREGR_SXY\b.*\w+)/i,
  /(\bREGR\b.*\w+)/i,
  /(\bLINEAR\b.*\w+)/i,
  /(\bLOG\b.*\w+)/i,
  /(\bEXP\b.*\w+)/i,
  /(\bSQRT\b.*\w+)/i,
  /(\bPOWER\b.*\w+)/i,
  /(\bMOD\b.*\w+)/i,
  /(\bDIV\b.*\w+)/i,
  /(\bINTEGER\b.*\w+)/i,
  /(\bDECIMAL\b.*\w+)/i,
  /(\bNUMERIC\b.*\w+)/i,
  /(\bREAL\b.*\w+)/i,
  /(\bDOUBLE\b.*\w+)/i,
  /(\bFLOAT\b.*\w+)/i,
  /(\bSMALLINT\b.*\w+)/i,
  /(\bTINYINT\b.*\w+)/i,
  /(\bBIGINT\b.*\w+)/i,
  /(\bMEDIUMINT\b.*\w+)/i,
  /(\bINT\b.*\w+)/i,
  /(\bCHAR\b.*\w+)/i,
  /(\bVARCHAR\b.*\w+)/i,
  /(\bTEXT\b.*\w+)/i,
  /(\bLONGTEXT\b.*\w+)/i,
  /(\bMEDIUMTEXT\b.*\w+)/i,
  /(\bTINYTEXT\b.*\w+)/i,
  /(\bENUM\b.*\w+)/i,
  /(\bSET\b.*\w+)/i,
  /(\bDATE\b.*\w+)/i,
  /(\bTIME\b.*\w+)/i,
  /(\bDATETIME\b.*\w+)/i,
  /(\bTIMESTAMP\b.*\w+)/i,
  /(\bYEAR\b.*\w+)/i,
  /(\bBLOB\b.*\w+)/i,
  /(\bLONGBLOB\b.*\w+)/i,
  /(\bMEDIUMBLOB\b.*\w+)/i,
  /(\bTINYBLOB\b.*\w+)/i,
  /(\bBINARY\b.*\w+)/i,
  /(\bVARBINARY\b.*\w+)/i,
  /(\bGEOMETRY\b.*\w+)/i,
  /(\bPOINT\b.*\w+)/i,
  /(\bLINESTRING\b.*\w+)/i,
  /(\bPOLYGON\b.*\w+)/i,
  /(\bMULTIPOINT\b.*\w+)/i,
  /(\bMULTILINESTRING\b.*\w+)/i,
  /(\bMULTIPOLYGON\b.*\w+)/i,
  /(\bGEOMETRYCOLLECTION\b.*\w+)/i,
  /(\bSPATIAL\b.*\w+)/i,
  /(\bINDEX\b.*\w+)/i,
  /(\bKEY\b.*\w+)/i,
  /(\bPRIMARY\b.*\w+)/i,
  /(\bFOREIGN\b.*\w+)/i,
  /(\bREFERENCES\b.*\w+)/i,
  /(\bUNIQUE\b.*\w+)/i,
  /(\bCHECK\b.*\w+)/i,
  /(\bDEFAULT\b.*\w+)/i,
  /(\bNOT\b.*\bNULL\b)/i,
  /(\bAUTO_INCREMENT\b)/i,
  /(\bUNSIGNED\b)/i,
  /(\bZEROFILL\b)/i,
  /(\bCOLLATE\b)/i,
  /(\bCHARACTER\b.*\bSET\b)/i,
  /(\bCOLLATION\b)/i,
  /(\bENGINE\b)/i,
  /(\bAUTO_INCREMENT\b)/i,
  /(\bDEFAULT\b)/i,
  /(\bCOMMENT\b)/i,
  /(\bVISIBLE\b)/i,
  /(\bINVISIBLE\b)/i,
  /(\bCOMPRESSED\b)/i,
  /(\bCOMPACT\b)/i,
  /(\bREDUNDANT\b)/i,
  /(\bDYNAMIC\b)/i,
  /(\bFIXED\b)/i,
  /(\bROW_FORMAT\b)/i,
  /(\bAVG_ROW_LENGTH\b)/i,
  /(\bMAX_ROWS\b)/i,
  /(\bMIN_ROWS\b)/i,
  /(\bCHECKSUM\b)/i,
  /(\bPAGE_CHECKSUM\b)/i,
  /(\bDELAY_KEY_WRITE\b)/i,
  /(\bROW_FORMAT\b)/i,
  /(\bSTATS_AUTO_RECALC\b)/i,
  /(\bSTATS_PERSISTENT\b)/i,
  /(\bSTATS_SAMPLE_PAGES\b)/i,
  /(\bPACK_KEYS\b)/i,
  /(\bKEY_BLOCK_SIZE\b)/i,
  /(\bDATA_DIRECTORY\b)/i,
  /(\bINDEX_DIRECTORY\b)/i,
  /(\bMAX_DATA_LENGTH\b)/i,
  /(\bNODEGROUP\b)/i,
  /(\bTABLESPACE\b)/i,
  /(\bSTORAGE\b)/i,
  /(\bDISK\b)/i,
  /(\bMEMORY\b)/i,
  /(\bTEMPORARY\b)/i,
  /(\bMERGE\b)/i,
  /(\bMRG_MYISAM\b)/i,
  /(\bBLACKHOLE\b)/i,
  /(\bEXAMPLE\b)/i,
  /(\bFEDERATED\b)/i,
  /(\bARCHIVE\b)/i,
  /(\bCSV\b)/i,
  /(\bNDB\b)/i,
  /(\bNDBCLUSTER\b)/i,
  /(\bBERKELEYDB\b)/i,
  /(\bPERFORMANCE_SCHEMA\b)/i,
  /(\bINFORMATION_SCHEMA\b)/i,
  /(\bMYSQL\b)/i,
  /(\bSYS\b)/i,
  /(\bPERFORMANCE_SCHEMA\b)/i,
  /(\bINFORMATION_SCHEMA\b)/i
];

// XSS patterns to detect and block
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  /<input\b[^>]*>/gi,
  /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
  /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
  /<option\b[^>]*>/gi,
  /<button\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
  /onfocus\s*=/gi,
  /onblur\s*=/gi,
  /onchange\s*=/gi,
  /onsubmit\s*=/gi,
  /onkeydown\s*=/gi,
  /onkeyup\s*=/gi,
  /onkeypress\s*=/gi,
  /onmousedown\s*=/gi,
  /onmouseup\s*=/gi,
  /onmousemove\s*=/gi,
  /onmouseout\s*=/gi,
  /onmouseenter\s*=/gi,
  /onmouseleave\s*=/gi,
  /ondrag\s*=/gi,
  /ondrop\s*=/gi,
  /oncopy\s*=/gi,
  /oncut\s*=/gi,
  /onpaste\s*=/gi,
  /onreset\s*=/gi,
  /onselect\s*=/gi,
  /onunload\s*=/gi,
  /onabort\s*=/gi,
  /oncanplay\s*=/gi,
  /oncanplaythrough\s*=/gi,
  /oncuechange\s*=/gi,
  /ondurationchange\s*=/gi,
  /onemptied\s*=/gi,
  /onended\s*=/gi,
  /onloadeddata\s*=/gi,
  /onloadedmetadata\s*=/gi,
  /onloadstart\s*=/gi,
  /onpause\s*=/gi,
  /onplay\s*=/gi,
  /onplaying\s*=/gi,
  /onprogress\s*=/gi,
  /onratechange\s*=/gi,
  /onseeked\s*=/gi,
  /onseeking\s*=/gi,
  /onstalled\s*=/gi,
  /onsuspend\s*=/gi,
  /ontimeupdate\s*=/gi,
  /onvolumechange\s*=/gi,
  /onwaiting\s*=/gi,
  /onwheel\s*=/gi,
  /ontouchstart\s*=/gi,
  /ontouchend\s*=/gi,
  /ontouchmove\s*=/gi,
  /ontouchcancel\s*=/gi,
  /onpointerdown\s*=/gi,
  /onpointerup\s*=/gi,
  /onpointermove\s*=/gi,
  /onpointerover\s*=/gi,
  /onpointerout\s*=/gi,
  /onpointerenter\s*=/gi,
  /onpointerleave\s*=/gi,
  /ongotpointercapture\s*=/gi,
  /onlostpointercapture\s*=/gi,
  /oncontextmenu\s*=/gi,
  /ondblclick\s*=/gi,
  /ondragend\s*=/gi,
  /ondragenter\s*=/gi,
  /ondragexit\s*=/gi,
  /ondragleave\s*=/gi,
  /ondragover\s*=/gi,
  /ondragstart\s*=/gi,
  /ondrop\s*=/gi,
  /onmessage\s*=/gi,
  /onmousedown\s*=/gi,
  /onmouseup\s*=/gi,
  /onmouseover\s*=/gi,
  /onmousemove\s*=/gi,
  /onmouseout\s*=/gi,
  /onmouseenter\s*=/gi,
  /onmouseleave\s*=/gi,
  /onkeydown\s*=/gi,
  /onkeyup\s*=/gi,
  /onkeypress\s*=/gi,
  /onload\s*=/gi,
  /onunload\s*=/gi,
  /onabort\s*=/gi,
  /onerror\s*=/gi,
  /onfocus\s*=/gi,
  /onblur\s*=/gi,
  /onchange\s*=/gi,
  /onreset\s*=/gi,
  /onselect\s*=/gi,
  /onsubmit\s*=/gi,
  /onresize\s*=/gi,
  /onscroll\s*=/gi,
  /onbeforeunload\s*=/gi,
  /onstorage\s*=/gi,
  /onhashchange\s*=/gi,
  /onpopstate\s*=/gi,
  /onpagehide\s*=/gi,
  /onpageshow\s*=/gi,
  /ondevicemotion\s*=/gi,
  /ondeviceorientation\s*=/gi,
  /ondeviceorientationabsolute\s*=/gi,
  /onbeforeprint\s*=/gi,
  /onafterprint\s*=/gi,
  /ononline\s*=/gi,
  /onoffline\s*=/gi,
  /onmessage\s*=/gi,
  /onclose\s*=/gi,
  /onopen\s*=/gi,
  /onshow\s*=/gi,
  /onhide\s*=/gi,
  /ontoggle\s*=/gi,
  /onbeforeinstallprompt\s*=/gi,
  /onbeforeunload\s*=/gi,
  /onunload\s*=/gi,
  /onabort\s*=/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /onresize\s*=/gi,
  /onscroll\s*=/gi,
  /onblur\s*=/gi,
  /onfocus\s*=/gi,
  /onchange\s*=/gi,
  /onreset\s*=/gi,
  /onselect\s*=/gi,
  /onsubmit\s*=/gi,
  /onkeydown\s*=/gi,
  /onkeyup\s*=/gi,
  /onkeypress\s*=/gi,
  /onmousedown\s*=/gi,
  /onmouseup\s*=/gi,
  /onmouseover\s*=/gi,
  /onmousemove\s*=/gi,
  /onmouseout\s*=/gi,
  /onmouseenter\s*=/gi,
  /onmouseleave\s*=/gi,
  /ondrag\s*=/gi,
  /ondrop\s*=/gi,
  /oncopy\s*=/gi,
  /oncut\s*=/gi,
  /onpaste\s*=/gi,
  /oncontextmenu\s*=/gi,
  /onwheel\s*=/gi,
  /ondoubleclick\s*=/gi,
  /onpointerdown\s*=/gi,
  /onpointerup\s*=/gi,
  /onpointermove\s*=/gi,
  /onpointerover\s*=/gi,
  /onpointerout\s*=/gi,
  /onpointerenter\s*=/gi,
  /onpointerleave\s*=/gi
];

/**
 * Validates input against SQL injection patterns
 */
export function validateSQLInjection(input) {
  if (typeof input !== 'string') return true;
  
  const cleanInput = input.trim();
  
  // Check against all SQL injection patterns
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(cleanInput)) {
      console.warn('SQL injection attempt detected:', cleanInput);
      return false;
    }
  }
  
  return true;
}

/**
 * Validates input against XSS patterns
 */
export function validateXSS(input) {
  if (typeof input !== 'string') return true;
  
  const cleanInput = input.trim();
  
  // Check against all XSS patterns
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(cleanInput)) {
      console.warn('XSS attempt detected:', cleanInput);
      return false;
    }
  }
  
  return true;
}

/**
 * Comprehensive input validation
 */
export function validateInput(input, options = {}) {
  const {
    maxLength = 1000,
    minLength = 0,
    allowEmpty = false,
    type = 'string',
    sanitize = true
  } = options;
  
  // Type checking
  if (typeof input !== type) {
    return { valid: false, error: `Expected ${type}, got ${typeof input}` };
  }
  
  // Empty check
  if (!allowEmpty && (!input || input.trim() === '')) {
    return { valid: false, error: 'Field cannot be empty' };
  }
  
  // Length validation
  if (input && input.length > maxLength) {
    return { valid: false, error: `Maximum length is ${maxLength} characters` };
  }
  
  if (input && input.length < minLength) {
    return { valid: false, error: `Minimum length is ${minLength} characters` };
  }
  
  // Security validations
  if (sanitize && typeof input === 'string') {
    if (!validateSQLInjection(input)) {
      return { valid: false, error: 'Invalid characters detected' };
    }
    
    if (!validateXSS(input)) {
      return { valid: false, error: 'Invalid content detected' };
    }
  }
  
  return { valid: true, error: null };
}

/**
 * Sanitizes input by removing potentially dangerous content
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .trim();
}

/**
 * Enhanced password validation
 */
export function validatePassword(password) {
  const errors = [];
  
  if (!password || password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }
  
  // Check for at least 3 numbers
  const numberCount = (password.match(/\d/g) || []).length;
  if (numberCount < 3) {
    errors.push('Password must contain at least 3 numbers');
  }
  
  // Check for at least 2 special characters
  const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
  if (specialCharCount < 2) {
    errors.push('Password must contain at least 2 special characters');
  }
  
  // Check for at least 2 uppercase letters
  const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
  if (upperCaseCount < 2) {
    errors.push('Password must contain at least 2 uppercase letters');
  }
  
  // Check for at least 2 lowercase letters
  const lowerCaseCount = (password.match(/[a-z]/g) || []).length;
  if (lowerCaseCount < 2) {
    errors.push('Password must contain at least 2 lowercase letters');
  }
  
  // Check for common patterns
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /login/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password cannot contain common patterns');
      break;
    }
  }
  
  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain 3 or more repeated characters in a row');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(identifier, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    return true;
  }
  
  getRemainingRequests(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      return this.maxRequests;
    }
    
    const userRequests = this.requests.get(identifier);
    const validRequests = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
  
  getResetTime(identifier) {
    if (!this.requests.has(identifier)) {
      return 0;
    }
    
    const userRequests = this.requests.get(identifier);
    if (userRequests.length === 0) {
      return 0;
    }
    
    const oldestRequest = Math.min(...userRequests);
    return oldestRequest + this.windowMs;
  }
}

// Global rate limiter instance
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes
export const contactRateLimiter = new RateLimiter(3, 60 * 1000); // 3 requests per minute
