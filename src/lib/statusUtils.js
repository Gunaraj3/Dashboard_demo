/**
 * Normalizes OCR status values to a consistent "GOOD" or "NG" format.
 * 
 * GOOD: good, Good, GOOD, ok
 * NG: bad, Bad, BAD, ng, NG, not good, and everything else
 * 
 * @param {string} status The raw status from backend
 * @returns {string} Normalized status "GOOD" or "NG"
 */
export const normalizeStatus = (status) => {
  if (!status) return 'NG';
  
  const s = status.toLowerCase().trim();
  
  // GOOD variations
  if (['good', 'ok'].includes(s)) {
    return 'GOOD';
  }
  
  // Everything else is NG (as per user's "not good and something similar" logic)
  return 'NG';
};
