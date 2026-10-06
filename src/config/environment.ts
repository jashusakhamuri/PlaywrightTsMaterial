import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.ENV || 'qa';

dotenv.config({
  path: path.resolve(
    __dirname,
    'environments',
    `${environment}.env`
  )
});

if (!process.env.BASE_URL) {
  throw new Error(
    `BASE_URL is not defined for environment: ${environment}`
  );
}

export const env = {
  baseUrl: process.env.BASE_URL
};