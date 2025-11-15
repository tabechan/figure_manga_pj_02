import crypto from 'crypto';

const NFC_SECRET = process.env.NFC_SECRET || 'dev-nfc-secret-key-change-in-production';

export function generateNfcSignature(tagUid: string, timestamp: number): string {
  const message = `${tagUid}|${timestamp}`;
  const hmac = crypto.createHmac('sha256', NFC_SECRET);
  hmac.update(message);
  const signature = hmac.digest('base64url');
  return signature.substring(0, 10);
}

export function verifyNfcSignature(
  tagUid: string,
  timestamp: number,
  providedSignature: string
): boolean {
  const expectedSignature = generateNfcSignature(tagUid, timestamp);
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(providedSignature)
  );
}

export function isTimestampValid(timestamp: number, maxAgeMs: number = 300000): boolean {
  const now = Date.now();
  const age = now - timestamp;
  return age >= 0 && age <= maxAgeMs;
}
