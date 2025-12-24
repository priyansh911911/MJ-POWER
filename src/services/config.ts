export const fqConfig = {
    tokenPath: process.env.NEXT_PUBLIC_FQ_TOKEN_PATH || 'src/services/tokens.json',
    dev: {
        appName: 's3_mjpower_solar',
        serverUrl: 'http://localhost:4466',
    },
    prod: {
        appName: 's3_mjpower_solar',
        serverUrl: '/.netlify/functions',
    },
};
