import * as crypto from 'crypto';
import { dbConnection } from '../secretFIle';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac('sha512', dbConnection.SALT);
  hmac.update(p);
  return hmac.digest('hex');
};
