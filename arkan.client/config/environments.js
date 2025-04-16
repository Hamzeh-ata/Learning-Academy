import { resolve } from 'path';
import { config } from 'dotenv';

export function loadEnvironment() {
  const envFile = `.env${process.env.NODE_ENV === 'production' ? '.production' : ''}`;
  config({ path: resolve(process.cwd(), envFile) });
}
