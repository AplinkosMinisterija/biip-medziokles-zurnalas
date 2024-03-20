export enum Env {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  DEVELOPMENT = 'DEVELOPMENT',
}

export const __ENV__ = process.env.APP_ENV || Env.DEVELOPMENT;

export const DEV_OR_STG = __ENV__ !== Env.PRODUCTION;

export const config = {
  ENV: __ENV__,
  NAME: process.env.NAME,
  BASE_URL: process.env.BASE_URL,
  DEV_EMAIL: process.env.DEV_EMAIL,
  DEV_PASSWORD: process.env.DEV_PASSWORD,
};
