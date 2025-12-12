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
  return method + ":" + _url + ">" + uniqueKey(tokenStr);
}

const makeRequest = async (method: HttpMethod, endpoint: string, options: RequestOptions = {}): Promise<unknown> => {
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

  if (token) {
    headers["token"] = token;
  } else {
    headers["token-key"] = key;
    headers["token-path"] = FQ_FULL_TOKEN_PATH;
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
        "app": FQ_APP_NAME,
        "token": process.env.NEXT_PUBLIC_AUTH_KEY || "",
      },
      body: body ? JSON.stringify(body) : null,
    };

    let url = endpoint;
    if (params.page || params.sort || params.search) {
      const query = new URLSearchParams(params as Record<string, string>);
      url += `?${query.toString()}`;
    }

    const final_url = token ? FQ_PROD_SERVER_URL + url : FQ_DEV_SERVER_URL + url

    console.log(final_url, requestConfig)

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

export const _DATABASE = FQ_APP_NAME;
export const _BASE_URL = FQ_PROD_SERVER_URL;

const IMAGES_BASE_URL = process.env.NEXT_PUBLIC_IMAGES_BASE_URL || "https://uploads.backendservices.in/storage/admin/packages/";
const UPLOADS_API_URL = process.env.NEXT_PUBLIC_UPLOADS_API_URL || "https://uploads.backendservices.in/api";

export const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("folder", "packages");
  formData.append("image", file);
  
  try {
    const response = await fetch(UPLOADS_API_URL, {
      method: "POST",
      headers: {
        username: process.env.NEXT_PUBLIC_UPLOAD_USERNAME || "admin",
        password: process.env.NEXT_PUBLIC_UPLOAD_PASSWORD || "arodos",
      },
      body: formData,
    });
    
    if (!response.ok) throw new Error(`Upload failed with status ${response.status}`);
    const data = await response.json();
    
    const path = data?.files?.image;
    if (!path) return null;
    
    const parts = path.split("/");
    return parts[parts.length - 1] || null;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

export const getImageUrl = (file: string): string => {
  if (!file) return '';
  if (file.startsWith('http://') || file.startsWith('https://')) return file;
  return `${IMAGES_BASE_URL}${file}`;
};

export default Api;