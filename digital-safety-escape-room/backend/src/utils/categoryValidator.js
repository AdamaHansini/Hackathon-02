const CATEGORIES = ['PHISHING', 'PASSWORD', 'FAKE_QR', 'SCAM_MESSAGE'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

const CATEGORY_TERMS = {
  PHISHING: ['phish', 'sender', 'domain', 'link', 'email', 'credential', 'verify', 'verification', 'password reset', 'bank alert'],
  PASSWORD: ['password', 'passphrase', 'credential', 'reuse', 'manager', 'mfa', '2fa', 'authentication', 'brute force', 'entropy'],
  FAKE_QR: ['qr', 'scan', 'scanning', 'barcode', 'destination url', 'quish'],
  SCAM_MESSAGE: ['scam', 'message', 'sms', 'text', 'whatsapp', 'refund', 'scholarship', 'internship', 'delivery', 'kyc', 'payment', 'prize']
};

export function validateChallenge(challenge) {
  const errors = [];
  const warnings = [];
  const category = String(challenge.category || '').trim().toUpperCase();
  const options = Array.isArray(challenge.options) ? challenge.options : [];
  const warningSigns = Array.isArray(challenge.warningSigns) ? challenge.warningSigns : [];
  const difficulty = String(challenge.difficulty || '').trim().toUpperCase();
  const points = Number(challenge.points);
  const searchableText = [challenge.title, challenge.scenario, challenge.question, challenge.explanation]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (!CATEGORIES.includes(category)) errors.push(`Category must be one of: ${CATEGORIES.join(', ')}.`);
  if (!String(challenge.question || '').trim()) errors.push('Question is required.');
  if (options.length < 2) errors.push('At least two answer options are required.');
  if (!String(challenge.correctAnswer || '').trim()) errors.push('Correct answer is required.');
  if (options.length > 0 && !options.some(option => String(option).trim() === String(challenge.correctAnswer || '').trim())) {
    errors.push('Correct answer must exactly match one answer option.');
  }
  if (!String(challenge.explanation || '').trim()) errors.push('Explanation is required.');
  if (!DIFFICULTIES.includes(difficulty)) errors.push('Difficulty must be EASY, MEDIUM, or HARD.');
  if (!Number.isFinite(points) || points <= 0) errors.push('Points must be a positive number.');

  if (challenge.active !== false && warningSigns.length === 0) {
    errors.push('At least one warning sign is required before activation.');
  }

  if (CATEGORIES.includes(category)) {
    const matchesCategory = CATEGORY_TERMS[category].some(term => searchableText.includes(term));
    if (!matchesCategory) {
      warnings.push(`The content does not appear to match the ${category} category.`);
      if (challenge.active !== false) errors.push(warnings[warnings.length - 1]);
    }
  }

  return { valid: errors.length === 0, errors, warnings, category };
}

export { CATEGORIES, DIFFICULTIES };
