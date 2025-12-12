export const API_BASE_URL = 'https://v5.frontql.dev';
export const DATABASE = 's3_mjpower_solar';

export const fqConfig = {
  tokenPath: process.env.NEXT_PUBLIC_TOKEN_PATH || 'src/services/tokens.json',
  dev: {
    appName: 's3_mjpower_solar',
    serverUrl: 'https://v5.frontql.dev',
  },
  prod: {
    appName: 's3_mjpower_solar',
    serverUrl: 'https://v5.frontql.dev',
  },
};