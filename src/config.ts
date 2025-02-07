import * as dotenv from 'dotenv';
dotenv.config();

export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultSecretKey',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  },
};
