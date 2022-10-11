import * as crypto from 'crypto';
import { SALT } from '../secretFile';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac('sha512', SALT);
  hmac.update(p);
  return hmac.digest('hex');
};
