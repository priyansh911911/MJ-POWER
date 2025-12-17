import tokens from "./tokens.json";
import { fqConfig } from './config';

const FQ_APP_NAME = fqConfig.prod.appName;
const FQ_DEV_SERVER_URL = fqConfig.dev.serverUrl;
const FQ_PROD_SERVER_URL = fqConfig.prod.serverUrl;
const FQ_FULL_TOKEN_PATH = fqConfig.tokenPath;



interface Tokens {
  [key: string]: string | false;
}

function uniqueKey(input: string): string {
  let x = 5381;
  for (let i = 0; i < input.length; i++) {
    x = ((x << 5) + x) ^ input.charCodeAt(i);
  }
  let y;
  let key = "";
  for (let i = 0; i < 8; i++) {
    x ^= x << 13; x ^= x >>> 17;
    x ^= x << 5; y = (x >>> 0) % 62;
    y = y < 10 ? 48 + y : y < 36 ? 87 + y : 29 + y;
    key += String.fromCharCode(y);
  }
  return key;
}


type HttpMethod = "get" | "post" | "put" | "delete" | "sql";

type RequestOptions = {
  loading?: boolean;
  body?: {
    sql: "string";
    params: [{ [key: string]: string | number }];
  } | Record<string, any>;
  key?: string;
  page?: string;
  sort?: string;
  joins?: string;
  filter?: string;
  search?: string;
  nearby?: string;
  hidden?: string;
  fields?: string;
  session?: string;
  validation?: string;
  permissions?: string;
};

function cleanUrlPath(urlPath: String) {
  let urlPathArr = urlPath.split('/');
  if (urlPathArr.length > 2) {
    urlPathArr.pop();
  }
  return urlPathArr.join('/');
}

function getKey(method: HttpMethod, url: string, options: RequestOptions) {
  const _url = cleanUrlPath(url);

  const request: any = {
    fields: options?.fields,
    hidden: options?.hidden,
    filter: options?.filter,
    nearby: options?.nearby,
    collections: options?.joins,
    permissions: options?.permissions,
    validation: options?.validation
  };

  request["body_is_array"] = Array.isArray(options.body || {});

  let tokenStr = method + ">" + _url;
  for (let key in request) {
    tokenStr += key + ":" + request[key];
  }
  const finalKey = method + ":" + _url + ">" + uniqueKey(tokenStr);
  
  console.log('🔑 TOKEN GENERATION DEBUG:');
  console.log('Method:', method);
  console.log('Original URL:', url);
  console.log('Cleaned URL:', _url);
  console.log('Token String:', tokenStr);
  console.log('Generated Key:', finalKey);
  console.log('Unique Hash:', uniqueKey(tokenStr));
  
  return finalKey;
}

const makeRequest = async (method: HttpMethod, endpoint: string, options: RequestOptions = {}): Promise<unknown> => {
  // Debug: Log all API calls to detect duplicate requests
  console.log(`🔍 API CALL: ${method.toUpperCase()} ${endpoint}`);
  if (endpoint.includes('products')) {
    console.log('⚠️ PRODUCTS API CALL DETECTED');
    console.trace('Call stack for products API');
  }
  const {
    body,
    page,
    sort,
    joins,
    hidden,
    fields,
    filter,
    search,
    nearby,
    session,
    validation,
    permissions,
    loading = true,
  } = options;

  const headers: any = {};

  if (hidden) headers.hidden = hidden;
  if (filter) headers.filter = filter;
  if (fields) headers.fields = fields;
  if (session) headers.session = session;
  if (nearby) headers.nearby = nearby;
  if (joins) headers.collections = joins;
  if (validation) headers.validation = validation;
  if (permissions) headers.permissions = permissions;

  const key = getKey(method, endpoint, options);
  const token = (tokens as Tokens)[key] || false;

  console.log('🔐 TOKEN LOOKUP DEBUG:');
  console.log('Looking for key:', key);
  console.log('Available tokens:', Object.keys(tokens));
  console.log('Token found:', !!token);
  console.log('Token value:', token);

  if (token) {
    headers["token"] = token;
    console.log('✅ Using existing token');
  } else {
    headers["token-key"] = key;
    headers["token-path"] = FQ_FULL_TOKEN_PATH;
    console.log('⚠️ No token found, sending token-key for generation');
  }

  const params: { [key: string]: string | number | boolean | object | undefined } = {
    page: page,
    sort: sort,
    search: search,
  };

  try {
    if (loading) {
      console.log("Loading started...");
    }

    const requestConfig: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        ...headers,
        "Content-Type": "application/json",
        app: FQ_APP_NAME,
      },
      body: body ? JSON.stringify(body) : null,
    };

    let url = endpoint;
    if (params.page || params.sort || params.search) {
      const query = new URLSearchParams(params as Record<string, string>);
      url += `?${query.toString()}`;
    }

    const final_url = FQ_PROD_SERVER_URL + url

    console.log('=== API Request Details ===');
    console.log('URL:', final_url);
    console.log('Method:', requestConfig.method);
    console.log('Headers:', requestConfig.headers);
    console.log('Body (parsed):', JSON.parse(requestConfig.body || '{}'));
    console.log('========================');

    const response = await fetch(final_url, requestConfig);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(`${method.toUpperCase()} Error:`, error.message);
    throw error;
  } finally {
    if (loading) {
      console.log("Loading completed.");
    }
  }
};

const Api = {
  get: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("get", endpoint, options),
  put: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("put", endpoint, options),
  post: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("post", endpoint, options),
  delete: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("delete", endpoint, options),
  sql: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("post", `/sql-${endpoint.replace("/", "")}`, options),
};

export default Api;