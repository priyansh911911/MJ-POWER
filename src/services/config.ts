export const fqConfig = {
    tokenPath: process.env.NEXT_PUBLIC_TOKEN_PATH || 'src/services/tokens.json',
    dev: {
        appName: process.env.NEXT_PUBLIC_DATABASE || 's3_mjpower_solar',
        serverUrl: process.env.NODE_ENV === 'production' ? '/api' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4466'),
    },
    prod: {
        appName: process.env.NEXT_PUBLIC_DATABASE || 's3_mjpower_solar',
        serverUrl: process.env.NODE_ENV === 'production' ? '/api' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4466'),
    },
};
