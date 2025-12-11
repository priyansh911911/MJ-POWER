import axios from "axios";
import tokens from "./tokens.json";

export const _DATABASE = "s3_mjpower_solar";
export const _BASE_URL = "https://v5.frontql.dev";
const local_host = "http://localhost:4466";
//export const API_KEY = "YOUR_ACTUAL_API_KEY"; // Replace with your real API key from https://v5.frontql.dev

function uniqueKey(input) {
  let code = input.charCodeAt(0);
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    code = (code << 5) - code + char;
    code &= code;
  }
  return btoa(code.toString()).substring(0, 8);
}

function getKey(method, url, options) {
  const pathname = "/" + url.split("/")[1];

  const request = {
    fields: options?.fields,
    hidden: options?.hidden,
    filter: options?.filter,
    nearby: options?.nearby,
    collections: options?.joins,
    permissions: options?.permissions,
    validation: options?.validation,
  };

  request["body_is_array"] = Array.isArray(options.body || {});

  let tokenStr = pathname;
  for (const key in request) {
    if (request[key]) {
      tokenStr += key + ":" + request[key];
    }
  }
  const key = method + ":" + pathname + ">" + uniqueKey(tokenStr);
  return key;
}

const makeRequest = async (method, endpoint, options = {}) => {
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

  const headers = {};

  if (hidden) headers.hidden = hidden;
  if (filter) headers.filter = filter;
  if (fields) headers.fields = fields;
  if (session) headers.session = session;
  if (joins) headers.collections = joins;
  if (validation) headers.validation = validation;
  if (permissions) headers.permissions = permissions;
  if (nearby) headers.nearby = nearby;

  const key = getKey(method, endpoint, options);
  const token = tokens[key] || false;

  if (!token) {
    headers["key"] = key;
  } else {
    headers.token = token;
  }

  const params = {
    page: page,
    sort: sort,
    search: search,
  };

  try {
    const baseHeaders = { app: _DATABASE };
    if (typeof API_KEY !== 'undefined' && API_KEY && API_KEY !== 'YOUR_ACTUAL_API_KEY') {
      baseHeaders['Authorization'] = `Bearer ${API_KEY}`;
    }

    const axiosInstance = axios.create({
      baseURL: _BASE_URL,
      headers: baseHeaders,
    });

    const requestConfig = {
      method,
      params,
      headers,
      data: body,
      url: endpoint,
    };

    const response = await axiosInstance(requestConfig);
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} Error:`, error.response?.data || error.message);
    throw error;
  }
};

const Api = {
  get: async (endpoint, options) => makeRequest("get", endpoint, options),
  put: async (endpoint, options) => makeRequest("put", endpoint, options),
  post: async (endpoint, options) => makeRequest("post", endpoint, options),
  delete: async (endpoint, options) => makeRequest("delete", endpoint, options),
  sql: async (endpoint, options) =>
    makeRequest("post", `/sql-${endpoint.replace("/", "")}`, options),
};

const IMAGES_BASE_URL = "https://uploads.backendservices.in/storage/admin/packages/";
const UPLOADS_API_URL = "https://uploads.backendservices.in/api";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("folder", "packages");
  formData.append("image", file);
  
  try {
    const response = await fetch(UPLOADS_API_URL, {
      method: "POST",
      headers: {
        username: "admin",
        password: "arodos",
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

export const getImageUrl = (file) => {
  if (!file) return '';
  if (file.startsWith('http://') || file.startsWith('https://')) return file;
  return `${IMAGES_BASE_URL}${file}`;
};

export default Api;
