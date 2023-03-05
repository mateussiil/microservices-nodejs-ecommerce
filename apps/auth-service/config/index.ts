import * as yup from 'yup';
import { Asserts } from 'yup';

const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET: process.env.SECRET,
  JWT_KEY: process.env.JWT_KEY,
  SMTP_SERVER: process.env.SMTP_SERVER,
  SMTP_FROM: process.env.SMTP_FROM,

  NODE_PUBLIC_STRIPE_PUBLISHABLE_KEY:
  process.env.NODE_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  GITHUB_ID: process.env.GITHUB_ID || '',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '',
};

const envSchema = yup.object({
  SECRET: yup.string().required(),
  NODE_PUBLIC_STRIPE_PUBLISHABLE_KEY: yup.string().required(),
  STRIPE_SECRET_KEY: yup.string().required(),
  STRIPE_WEBHOOK_SECRET: yup.string().required()
});

export interface AppConfig extends Asserts<typeof envSchema> {}

const config: AppConfig = envSchema.validateSync(env);

export default config;
