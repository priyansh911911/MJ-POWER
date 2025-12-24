module.exports = [
"[project]/src/assets/data/storage.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"users":[{"id":1,"username":"admin","password":"admin123","role":"admin","name":"Admin User"},{"id":2,"username":"manager","password":"manager123","role":"manager","name":"Manager User"},{"id":3,"username":"partner","password":"partner123","role":"partner","name":"Partner User"},{"id":4,"username":"technician","password":"tech123","role":"technician","name":"Technician User"}],"customers":[{"id":1,"name":"John Smith","email":"john@example.com","password":"customer123","phone":"+1-555-0101","address":"123 Solar Street, Green City, CA 90210","assignedTo":"partner","assignedType":"partner"},{"id":2,"name":"Sarah Johnson","email":"sarah@example.com","password":"solar123","phone":"+1-555-0102","address":"456 Energy Avenue, Eco Town, CA 90211","assignedTo":"technician","assignedType":"technician"}],"products":[],"services":[],"categories":[{"id":1,"name":"Electronics","type":"product"},{"id":2,"name":"Appliances","type":"product"},{"id":3,"name":"Installation","type":"service"},{"id":4,"name":"Repair","type":"service"}],"tickets":[],"orders":[],"quotes":[],"commissions":[],"bonuses":[]});}),
"[project]/src/services/tokens.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"get:/users>icNfi78w":"M2gybDU0YnVpbGhl","post:/products>n11UdSra":"MWg4eWt4Znd6aW56","get:/tickets>XrEP6Yuf":"bTN6ZmV4MWh0eXJu","get:/services>CV9rqelz":"MXZwNDhoejNjamp4","get:/customers>HizYnjfP":"ZjJxOTJpbmFoNGJ4","get:/orders>KMLFnAqK":"eXR3ZThwNmd3enZt","get:/products>382Hl1ZH":"MTlvY3VpejNjamp4"});}),
"[project]/src/services/config.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fqConfig",
    ()=>fqConfig
]);
const fqConfig = {
    tokenPath: process.env.NEXT_PUBLIC_FQ_TOKEN_PATH || 'src/services/tokens.json',
    dev: {
        appName: 's3_mjpower_solar',
        serverUrl: 'http://localhost:4466'
    },
    prod: {
        appName: 's3_mjpower_solar',
        serverUrl: '/.netlify/functions'
    }
};
}),
"[project]/src/services/Api.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$tokens$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/services/tokens.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/config.ts [ssr] (ecmascript)");
;
;
const FQ_APP_NAME = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fqConfig"].prod.appName;
const FQ_DEV_SERVER_URL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fqConfig"].dev.serverUrl;
const FQ_PROD_SERVER_URL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fqConfig"].prod.serverUrl;
const FQ_FULL_TOKEN_PATH = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fqConfig"].tokenPath;
function uniqueKey(input) {
    let x = 5381;
    for(let i = 0; i < input.length; i++){
        x = (x << 5) + x ^ input.charCodeAt(i);
    }
    let y;
    let key = "";
    for(let i = 0; i < 8; i++){
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        y = (x >>> 0) % 62;
        y = y < 10 ? 48 + y : y < 36 ? 87 + y : 29 + y;
        key += String.fromCharCode(y);
    }
    return key;
}
function cleanUrlPath(urlPath) {
    let urlPathArr = urlPath.split('/');
    if (urlPathArr.length > 2) {
        urlPathArr.pop();
    }
    return urlPathArr.join('/');
}
function getKey(method, url, options) {
    const _url = cleanUrlPath(url);
    const request = {
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
    for(let key in request){
        tokenStr += key + ":" + request[key];
    }
    return method + ":" + _url + ">" + uniqueKey(tokenStr);
}
const makeRequest = async (method, endpoint, options = {})=>{
    const { body, page, sort, joins, hidden, fields, filter, search, nearby, session, validation, permissions, loading = true } = options;
    const headers = {};
    if (hidden) headers.hidden = hidden;
    if (filter) headers.filter = filter;
    if (fields) headers.fields = fields;
    if (session) headers.session = session;
    if (nearby) headers.nearby = nearby;
    if (joins) headers.collections = joins;
    if (validation) headers.validation = validation;
    if (permissions) headers.permissions = permissions;
    const key = getKey(method, endpoint, options);
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$tokens$2e$json__$28$json$29$__["default"][key] || false;
    if (token) {
        headers["token"] = token;
    } else {
        headers["token-key"] = key;
        headers["token-path"] = FQ_FULL_TOKEN_PATH;
    }
    const params = {
        page: page,
        sort: sort,
        search: search
    };
    try {
        if (loading) {
            console.log("Loading started...");
        }
        const requestConfig = {
            method: method.toUpperCase(),
            headers: {
                ...headers,
                "Content-Type": "application/json",
                app: FQ_APP_NAME
            },
            body: body ? JSON.stringify(body) : null
        };
        let url = endpoint;
        if (params.page || params.sort || params.search) {
            const query = new URLSearchParams(params);
            url += `?${query.toString()}`;
        }
        const final_url = token ? FQ_PROD_SERVER_URL + url : FQ_DEV_SERVER_URL + url;
        console.log(final_url, requestConfig);
        const response = await fetch(final_url, requestConfig);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`${method.toUpperCase()} Error:`, error.message);
        // Handle network errors specifically
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Unable to connect to server. Please check your internet connection or try again later.');
        }
        throw error;
    } finally{
        if (loading) {
            console.log("Loading completed.");
        }
    }
};
const Api = {
    get: async (endpoint, options)=>makeRequest("get", endpoint, options),
    put: async (endpoint, options)=>makeRequest("put", endpoint, options),
    post: async (endpoint, options)=>makeRequest("post", endpoint, options),
    delete: async (endpoint, options)=>makeRequest("delete", endpoint, options),
    sql: async (endpoint, options)=>makeRequest("post", `/sql-${endpoint.replace("/", "")}`, options)
};
const __TURBOPACK__default__export__ = Api;
}),
"[project]/src/events/fqlClient.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fql",
    ()=>fql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/Api.ts [ssr] (ecmascript)");
;
class FQLCollection {
    collection;
    constructor(collection){
        this.collection = collection;
    }
    async findMany(options = {}) {
        try {
            console.log(`FQL: Fetching ${this.collection}`);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.collection}`, {
                filter: options.filter,
                search: options.search,
                sort: options.sort,
                fields: options.fields,
                joins: options.joins,
                page: options.limit ? `1,${options.limit}` : undefined
            });
            console.log(`FQL: ${this.collection} result:`, result);
            return {
                result: result?.result || result?.data || result || []
            };
        } catch (err) {
            console.error(`FQL: Error fetching ${this.collection}:`, err);
            return {
                result: [],
                err: err
            };
        }
    }
    async findById(id, options = {}) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.collection}/${id}`, {
                fields: options.fields,
                joins: options.joins,
                session: options.useSession ? 'true' : undefined
            });
            return {
                result
            };
        } catch (err) {
            return {
                result: null,
                err: err
            };
        }
    }
    async findLast(options = {}) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.collection}/last`, {
                filter: options.filter,
                search: options.search,
                sort: options.sort,
                fields: options.fields,
                joins: options.joins,
                session: options.useSession ? 'true' : undefined
            });
            return {
                result
            };
        } catch (err) {
            return {
                result: null,
                err: err
            };
        }
    }
    async createOne(data, _options = {}) {
        try {
            console.log(`FQL: Creating ${this.collection}:`, data);
            console.log(`FQL: API endpoint will be: /${this.collection}`);
            // Ensure we're hitting the correct endpoint
            if (this.collection === 'products') {
                console.log('PRODUCTS: Forcing correct endpoint');
            }
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post(`/${this.collection}`, {
                body: data
            });
            console.log(`FQL: Create ${this.collection} result:`, result);
            return {
                result: result?.result || {
                    id: result?.id || Date.now()
                }
            };
        } catch (err) {
            console.error(`FQL: Error creating ${this.collection}:`, err);
            return {
                result: {
                    id: 0
                },
                err: err
            };
        }
    }
    async createMany(data, options = {}) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post(`/${this.collection}/batch`, {
                body: data,
                session: options.useSession ? 'true' : undefined
            });
            return {
                result
            };
        } catch (err) {
            return {
                result: {
                    ids: []
                },
                err: err
            };
        }
    }
    async updateById(id, data, options = {}) {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].put(`/${this.collection}/${id}`, {
                body: data,
                session: options.useSession ? 'true' : undefined
            });
            return {
                result: true
            };
        } catch (err) {
            return {
                result: false,
                err: err
            };
        }
    }
    async updateMany(records, options = {}) {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].put(`/${this.collection}/batch`, {
                body: records,
                session: options.useSession ? 'true' : undefined
            });
            return {
                result: true
            };
        } catch (err) {
            return {
                result: false,
                err: err
            };
        }
    }
    async softDeleteById(id, options = {}) {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].put(`/${this.collection}/${id}`, {
                body: {
                    is_deleted: 1
                },
                session: options.useSession ? 'true' : undefined
            });
            return {
                result: true
            };
        } catch (err) {
            return {
                result: false,
                err: err
            };
        }
    }
}
class FQLClient {
    sales = new FQLCollection('sales');
    purchases = new FQLCollection('purchases');
    purchase_entries = new FQLCollection('purchase_entries');
    receipts = new FQLCollection('receipts');
    customers = new FQLCollection('customers');
    vendors = new FQLCollection('vendors');
    items = new FQLCollection('items');
    units = new FQLCollection('units');
    areas = new FQLCollection('areas');
    clients = new FQLCollection('clients');
    roles = new FQLCollection('roles');
    users = new FQLCollection('users');
    products = new FQLCollection('products');
    services = new FQLCollection('services');
    orders = new FQLCollection('orders');
    tickets = new FQLCollection('tickets');
    quotes = new FQLCollection('quotes');
    async sql(query, params = [], options = {}) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].sql('query', {
                body: {
                    sql: query,
                    params
                },
                session: options.useSession ? 'true' : undefined
            });
            return {
                result
            };
        } catch (err) {
            return {
                result: [],
                err: err
            };
        }
    }
}
const fql = new FQLClient();
}),
"[project]/src/context/AppContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$data$2f$storage$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/assets/data/storage.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/Api.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/events/fqlClient.ts [ssr] (ecmascript)");
;
;
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])({});
const useApp = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
const AppProvider = ({ children })=>{
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$data$2f$storage$2e$json__$28$json$29$__["default"];
    });
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    });
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('dashboard');
    const [useCloud, setUseCloud] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        data
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        loadFromDatabase();
    }, []);
    const loadFromDatabase = async ()=>{
        try {
            const [customers, products, services, tickets, quotes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].customers.findMany({}),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].products.findMany({}),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].services.findMany({}),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].tickets.findMany({}),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].quotes.findMany({})
            ]);
            console.log('Setting data from FQL:', {
                customers: customers?.result || [],
                products: products?.result || [],
                services: services?.result || [],
                tickets: tickets?.result || [],
                quotes: quotes?.result || []
            });
            setData({
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$data$2f$storage$2e$json__$28$json$29$__["default"],
                customers: customers?.result || [],
                products: products?.result || [],
                services: services?.result || [],
                tickets: tickets?.result || [],
                quotes: quotes?.result || [],
                orders: [] // Use empty array until table is created
            });
        } catch (error) {
            console.error('Failed to load from database:', error);
        }
    };
    const syncToCloud = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post('/mjpower_data', {
                body: data
            });
        } catch (error) {
            console.error('Cloud sync failed:', error);
        }
    };
    const loadFromCloud = async ()=>{
        try {
            const cloudData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get('/mjpower_data');
            if (cloudData) {
                setData(cloudData);
            }
        } catch (error) {
            console.error('Cloud load failed:', error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        currentUser
    ]);
    const login = (username, password, customUser = null)=>{
        if (customUser) {
            setCurrentUser(customUser);
            return true;
        }
        const user = data.users?.find((u)=>u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };
    const logout = ()=>{
        setCurrentUser(null);
        setCurrentPage('dashboard');
    };
    const fetchData = async (key, query)=>{
        try {
            if (!query?.trim()) {
                setData((prev)=>({
                        ...prev,
                        [key]: []
                    }));
                return;
            }
            const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].products.findMany({});
            const filtered = products.result?.filter((item)=>item.name.toLowerCase().includes(query.toLowerCase())) || [];
            setData((prev)=>({
                    ...prev,
                    [key]: filtered
                }));
        } catch (error) {
            console.error("fetchData error:", error);
            setData((prev)=>({
                    ...prev,
                    [key]: []
                }));
        }
    };
    const updateData = (key, newData)=>{
        setData((prev)=>({
                ...prev,
                [key]: newData
            }));
    };
    const addItem = async (key, item)=>{
        try {
            console.log(`=== Adding item to ${key} ===`);
            console.log('Item data:', item);
            console.log('FQL collection exists:', !!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"][key]);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"][key].createOne(item, {});
            console.log('FQL response:', response);
            if (response.err) {
                console.log('API returned error, falling back to local storage');
                throw new Error(response.err.message || response.result);
            }
            const newItem = {
                ...item,
                id: response.result.id
            };
            setData((prev)=>({
                    ...prev,
                    [key]: [
                        ...prev[key] || [],
                        newItem
                    ]
                }));
            console.log(`Successfully added to ${key}:`, newItem);
            if (key === 'products') {
                setTimeout(async ()=>{
                    const currentProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].products.findMany({});
                    console.log('=== Current Products in Database ===', currentProducts);
                }, 1000);
            }
            return newItem;
        } catch (error) {
            console.error(`Database add failed for ${key}:`, error);
            const newItem = {
                ...item,
                id: Date.now()
            };
            setData((prev)=>({
                    ...prev,
                    [key]: [
                        ...prev[key] || [],
                        newItem
                    ]
                }));
            return newItem;
        }
    };
    const updateItem = async (key, id, updatedItem)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"][key].updateById(id, updatedItem, {
                useSession: true
            });
            setData((prev)=>({
                    ...prev,
                    [key]: prev[key].map((item)=>item.id === id ? {
                            ...item,
                            ...updatedItem
                        } : item)
                }));
        } catch (error) {
            console.error('Database update failed:', error);
            setData((prev)=>({
                    ...prev,
                    [key]: prev[key].map((item)=>item.id === id ? {
                            ...item,
                            ...updatedItem
                        } : item)
                }));
        }
    };
    const deleteItem = async (key, id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$events$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"][key].softDeleteById(id, {
                useSession: true
            });
            setData((prev)=>({
                    ...prev,
                    [key]: prev[key].filter((item)=>item.id !== id)
                }));
        } catch (error) {
            console.error('Database delete failed:', error);
            setData((prev)=>({
                    ...prev,
                    [key]: prev[key].filter((item)=>item.id !== id)
                }));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            data,
            currentUser,
            currentPage,
            setCurrentPage,
            login,
            logout,
            updateData,
            addItem,
            updateItem,
            deleteItem,
            useCloud,
            setUseCloud,
            syncToCloud,
            loadFromCloud,
            fetchData
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AppContext.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/assets/images/Logo.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/Logo.5b8a580c.png");}),
"[project]/src/assets/images/Logo.png.mjs { IMAGE => \"[project]/src/assets/images/Logo.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/images/Logo.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 552,
    height: 452,
    blurWidth: 8,
    blurHeight: 7,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAAqklEQVR42o2OvQrCMACEY1pjIYXqYG2aEiQKDoKDONtBURcFIe2iXSr4Myi0QaxTBcHZxcHHcPPxrIuDi37HccMtHwD/AvOwUGrobUy0Kshl+aZYxy332nx2DrW7gqD2OSqmWfaEGI827t6/DR678/oSBHN/EYYzSikBnHN2StN4OO1PeqLrxVG0PCbJVkq5YoxRoKoqpLZtOA41stVtQvC7xLIwQkj5Kf8CEi0bWzA9qscAAAAASUVORK5CYII="
};
}),
"[project]/src/widgets/App.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/images/Logo.png.mjs { IMAGE => "[project]/src/assets/images/Logo.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
;
;
;
;
const Login = ({ onBackToCustomer })=>{
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [isCustomerMode, setIsCustomerMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isRegistering, setIsRegistering] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const { login, addItem, data } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (isCustomerMode) {
            // Customer login - check against customers data
            const customer = data.customers.find((c)=>c.email === username && c.password === password);
            if (customer) {
                // Set customer as current user with customer role
                const customerUser = {
                    ...customer,
                    role: 'customer'
                };
                login(customer.email, customer.password, customerUser);
                setError('');
            } else {
                setError('Invalid customer credentials');
            }
        } else {
            if (login(username, password)) {
                setError('');
            } else {
                setError('Invalid credentials');
            }
        }
    };
    const handleRegister = (e)=>{
        e.preventDefault();
        // Check if customer already exists
        const existingCustomer = data.customers.find((c)=>c.email === username);
        if (existingCustomer) {
            setError('Customer with this email already exists');
            return;
        }
        // Add new customer
        const newCustomer = {
            name,
            email: username,
            phone,
            address,
            password,
            assignedTo: '',
            assignedType: 'partner'
        };
        addItem('customers', newCustomer);
        setError('');
        setIsRegistering(false);
        setName('');
        setPhone('');
        setAddress('');
        setUsername('');
        setPassword('');
        alert('Registration successful! You can now login.');
    };
    if (isCustomerMode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-blue-600 flex",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-center text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6 inline-block mb-6 shadow-2xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                    alt: "MJ POWER Solar",
                                    className: "w-32 h-auto"
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/App.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: "text-4xl font-bold mb-4",
                                children: "MJ POWER Solar"
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xl text-blue-100 mb-8",
                                children: "Your trusted partner in clean energy solutions"
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 p-4 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-2xl mb-2",
                                                children: "🌞"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 81,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: "Premium Solar Panels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 p-4 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-2xl mb-2",
                                                children: "⚡"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: "Expert Installation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 p-4 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-2xl mb-2",
                                                children: "🔧"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: "24/7 Support"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 90,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white/10 p-4 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-2xl mb-2",
                                                children: "💰"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: "Best Prices"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 94,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/widgets/App.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-full lg:w-1/2 bg-white flex items-center justify-center p-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "text-center mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "lg:hidden bg-blue-600 rounded-xl p-3 inline-block mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                            alt: "MJ POWER Solar",
                                            className: "w-16 h-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/App.tsx",
                                            lineNumber: 105,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-gray-900 mb-2",
                                        children: 'Fixed Text'
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600",
                                        children: 'Fixed Text'
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                onSubmit: isRegistering ? handleRegister : handleSubmit,
                                className: "space-y-4",
                                children: [
                                    isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-700 font-medium mb-2",
                                                children: "Full Name"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 118,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Enter your full name",
                                                value: name,
                                                onChange: (e)=>setName(e.target.value),
                                                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 121,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-700 font-medium mb-2",
                                                children: "Phone Number"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 134,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "tel",
                                                placeholder: "Enter your phone number",
                                                value: phone,
                                                onChange: (e)=>setPhone(e.target.value),
                                                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-700 font-medium mb-2",
                                                children: "Email Address"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                placeholder: "Enter your email",
                                                value: username,
                                                onChange: (e)=>setUsername(e.target.value),
                                                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 152,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-700 font-medium mb-2",
                                                children: "Password"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "password",
                                                placeholder: "Enter your password",
                                                value: password,
                                                onChange: (e)=>setPassword(e.target.value),
                                                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "block text-gray-700 font-medium mb-2",
                                                children: "Installation Address"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 184,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                placeholder: "Enter your address for solar installation",
                                                value: address,
                                                onChange: (e)=>setAddress(e.target.value),
                                                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
                                                rows: 3
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 187,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 183,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
                                        children: 'Fixed Text'
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setIsRegistering(false);
                                            setName('');
                                            setPhone('');
                                            setAddress('');
                                            setUsername('');
                                            setPassword('');
                                            setError('');
                                        },
                                        className: "w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 205,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-6 text-center space-y-3",
                                children: [
                                    !isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (onBackToCustomer) {
                                                onBackToCustomer();
                                            } else {
                                                setIsCustomerMode(!isCustomerMode);
                                                setError('');
                                                setUsername('');
                                                setPassword('');
                                            }
                                        },
                                        className: "text-blue-600 hover:text-blue-800 text-sm font-medium underline",
                                        children: 'Back to Customer Portal'
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 225,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setIsRegistering(true);
                                                setError('');
                                            },
                                            className: "text-blue-600 hover:text-blue-800 text-sm font-medium underline",
                                            children: "New customer? Create account"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/App.tsx",
                                            lineNumber: 244,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 243,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/widgets/App.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/widgets/App.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Staff Login UI (existing design)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute top-10 left-10 w-32 h-32 border-4 border-yellow-400 rotate-12"
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-20 right-20 w-40 h-40 border-4 border-yellow-400 -rotate-12"
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/2 left-1/4 w-24 h-24 border-4 border-green-400 rotate-45"
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/widgets/App.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-center mb-6 sm:mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-3 sm:p-4 inline-block mb-4 sm:mb-6 shadow-2xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$Logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                    alt: "MJ POWER Solar",
                                    className: "w-24 sm:w-32 h-auto"
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/App.tsx",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: "text-2xl sm:text-3xl font-bold text-black mb-2 drop-shadow-lg",
                                children: "Solar Staff Portal"
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm sm:text-base text-gray-700",
                                children: "Power the future with solar"
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-4 sm:space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-blue-900 font-semibold mb-2 text-sm sm:text-base flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "mr-2",
                                                children: "👤"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 288,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " Username"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Enter your username",
                                        value: username,
                                        onChange: (e)=>setUsername(e.target.value),
                                        className: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm sm:text-base transition-all",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-blue-900 font-semibold mb-2 text-sm sm:text-base flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "mr-2",
                                                children: "🔒"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/App.tsx",
                                                lineNumber: 302,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " Password"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        placeholder: "Enter your password",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value),
                                        className: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm sm:text-base transition-all",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/App.tsx",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "pt-2 sm:pt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 sm:py-4 rounded-lg hover:from-orange-700 hover:to-orange-600 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "mr-2",
                                            children: "⚡"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/App.tsx",
                                            lineNumber: 325,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Staff Login"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/App.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/App.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mt-6 text-center space-y-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (onBackToCustomer) {
                                    onBackToCustomer();
                                } else {
                                    setIsCustomerMode(!isCustomerMode);
                                    setError('');
                                    setUsername('');
                                    setPassword('');
                                }
                            },
                            className: "text-black hover:text-blue-600 text-sm font-semibold bg-gray-100 px-6 py-2 rounded-full hover:bg-gray-200 transition-all duration-200",
                            children: '🏠 Back to Customer Portal'
                        }, void 0, false, {
                            fileName: "[project]/src/widgets/App.tsx",
                            lineNumber: 333,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/App.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/widgets/App.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/widgets/App.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Login;
}),
"[project]/src/widgets/AppStore.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
// import logo from '../assets/images/Logo.png';
const Layout = ({ children })=>{
    const { currentUser, logout, setCurrentPage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [activeItem, setActiveItem] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('Dashboard');
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const menuItems = {
        admin: [
            {
                name: 'Dashboard',
                icon: '☀️'
            },
            {
                name: 'Customers',
                icon: '👥'
            },
            {
                name: 'Products',
                icon: '🔋'
            },
            {
                name: 'Services',
                icon: '⚡'
            },
            {
                name: 'Quotes',
                icon: '📋'
            },
            {
                name: 'Tickets',
                icon: '🎫'
            },
            {
                name: 'Add Technician',
                icon: '👨🔧'
            },
            {
                name: 'Add Partner',
                icon: '🤝'
            },
            {
                name: 'Reports',
                icon: '📊'
            }
        ],
        manager: [
            {
                name: 'Dashboard',
                icon: '☀️'
            },
            {
                name: 'Tickets',
                icon: '🎫'
            },
            {
                name: 'Reports',
                icon: '📊'
            }
        ],
        partner: [
            {
                name: 'Dashboard',
                icon: '☀️'
            },
            {
                name: 'Customers',
                icon: '👥'
            },
            {
                name: 'Tickets',
                icon: '🎫'
            }
        ],
        technician: [
            {
                name: 'Dashboard',
                icon: '☀️'
            },
            {
                name: 'Tickets',
                icon: '🎫'
            }
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 text-gray-900 flex relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-2 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: ()=>setSidebarOpen(!sidebarOpen),
                    className: "bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-yellow-400 hover:bg-white/20 transition-all",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-yellow-300 text-xl",
                        children: "☰"
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/AppStore.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/widgets/AppStore.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/widgets/AppStore.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden lg:block fixed top-2 left-2 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                    className: "bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-yellow-400 hover:bg-white/20 transition-all",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-yellow-300 text-lg",
                        children: "☰"
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/AppStore.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/widgets/AppStore.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/widgets/AppStore.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40",
                onClick: ()=>setSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/widgets/AppStore.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${sidebarCollapsed ? 'lg:-translate-x-full' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex-1 p-1 lg:p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-center mb-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-orange-500 p-2 rounded-xl flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-white font-bold text-xl",
                                        children: "MJ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/AppStore.tsx",
                                        lineNumber: 78,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/AppStore.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/AppStore.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-0.5 lg:space-y-1",
                                    children: menuItems[currentUser?.role]?.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setActiveItem(item.name);
                                                    setCurrentPage(item.name.toLowerCase());
                                                    setSidebarOpen(false);
                                                },
                                                className: `w-full flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-all duration-200 ${activeItem === item.name ? 'bg-orange-200 text-orange-800 shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-sm lg:text-base",
                                                        children: item.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/AppStore.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-xs",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/AppStore.tsx",
                                                        lineNumber: 98,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/AppStore.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, item.name, false, {
                                            fileName: "[project]/src/widgets/AppStore.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/AppStore.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/widgets/AppStore.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/widgets/AppStore.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-1.5 lg:p-2 border-t border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-medium text-gray-900",
                                            children: currentUser?.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/AppStore.tsx",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-600 capitalize",
                                            children: currentUser?.role
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/AppStore.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/AppStore.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: logout,
                                    className: "bg-red-500 hover:bg-red-600 text-white px-1.5 py-0.5 rounded text-xs transition-all",
                                    children: "Logout"
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/AppStore.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/AppStore.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/widgets/AppStore.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/widgets/AppStore.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64'} ml-0`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                    className: "p-3 sm:p-4 lg:p-6 pt-16 lg:pt-6",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/widgets/AppStore.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/widgets/AppStore.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/widgets/AppStore.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Layout;
}),
"[project]/src/pages/Customers.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const Customers = ()=>{
    const { data, addItem, updateItem, deleteItem, currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingCustomer, setEditingCustomer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        email: '',
        phone: '',
        address: '',
        assignedTo: '',
        assignedType: 'partner'
    });
    const canManageCustomers = [
        'admin',
        'partner'
    ].includes(currentUser?.role);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            if (editingCustomer) {
                await updateItem('customers', editingCustomer.id, formData);
            } else {
                await addItem('customers', formData);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Failed to save customer. Please try again.');
        }
    };
    const resetForm = ()=>{
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            assignedTo: '',
            assignedType: 'partner'
        });
        setShowForm(false);
        setEditingCustomer(null);
    };
    const handleEdit = (customer)=>{
        setFormData(customer);
        setEditingCustomer(customer);
        setShowForm(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-2 sm:p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-gray-900",
                        children: "Customers"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Customers.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    canManageCustomers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowForm(true),
                        className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base",
                        children: "Add Customer"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Customers.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Customers.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showForm && canManageCustomers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-lg border border-gray-200 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: editingCustomer ? 'Edit Customer' : 'Add Customer'
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Customers.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Customer Name",
                                value: formData.name,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        name: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                placeholder: "Email",
                                value: formData.email,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        email: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "tel",
                                placeholder: "Phone",
                                value: formData.phone,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        phone: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: formData.assignedType,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        assignedType: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "partner",
                                        children: "Partner"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "technician",
                                        children: "Technician"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "Address",
                                value: formData.address,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        address: e.target.value
                                    }),
                                className: "md:col-span-2 p-3 border border-gray-300 rounded-lg",
                                rows: 3
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg",
                                        children: editingCustomer ? 'Update Customer' : 'Add Customer'
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: resetForm,
                                        className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Customers.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Customers.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "block sm:hidden space-y-3",
                children: data.customers?.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-lg border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900",
                                        children: customer.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    canManageCustomers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleEdit(customer),
                                                className: "bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs",
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Customers.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>deleteItem('customers', customer.id),
                                                className: "bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs",
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Customers.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mb-1",
                                children: customer.email
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mb-1",
                                children: customer.phone
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: [
                                    customer.assignedTo,
                                    " (",
                                    customer.assignedType,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, customer.id, true, {
                        fileName: "[project]/src/pages/Customers.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/Customers.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Assigned To"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    canManageCustomers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Customers.tsx",
                                        lineNumber: 163,
                                        columnNumber: 38
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Customers.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Customers.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: data.customers?.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "border-t",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: customer.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Customers.tsx",
                                            lineNumber: 169,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: customer.email
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Customers.tsx",
                                            lineNumber: 170,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: customer.phone
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Customers.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: [
                                                customer.assignedTo,
                                                " (",
                                                customer.assignedType,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Customers.tsx",
                                            lineNumber: 172,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        canManageCustomers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEdit(customer),
                                                    className: "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm",
                                                    children: "Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Customers.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteItem('customers', customer.id),
                                                    className: "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm",
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Customers.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Customers.tsx",
                                            lineNumber: 174,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, customer.id, true, {
                                    fileName: "[project]/src/pages/Customers.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Customers.tsx",
                            lineNumber: 166,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Customers.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Customers.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Customers.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Customers;
}),
"[project]/src/lib/images.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getImageUrl",
    ()=>getImageUrl
]);
function getImageUrl(file) {
    if (!file) return '';
    if (file.startsWith('http://') || file.startsWith('https://')) return file;
    return `${"TURBOPACK compile-time value", "https://uploads.backendservices.in/storage/admin/packages/"}${file}`;
}
}),
"[project]/src/lib/uploads.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// @ts-nocheck
__turbopack_context__.s([
    "uploadImage",
    ()=>uploadImage
]);
async function uploadImage(file) {
    console.log('🖼️ Starting image upload...');
    console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Upload URL:', ("TURBOPACK compile-time value", "https://uploads.backendservices.in/api"));
    const formData = new FormData();
    formData.append("folder", "packages");
    formData.append("image", file);
    try {
        console.log('📤 Sending upload request...');
        const res = await fetch(("TURBOPACK compile-time value", "https://uploads.backendservices.in/api"), {
            method: "POST",
            headers: {
                username: "admin",
                password: "arodos"
            },
            body: formData
        });
        console.log('📥 Upload response status:', res.status);
        console.log('📥 Upload response ok:', res.ok);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Upload failed response:', errorText);
            throw new Error(`Upload failed with status ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        console.log('✅ Upload response data:', data);
        const p = data?.files?.image;
        console.log('📁 Image path from response:', p);
        if (!p) {
            console.error('❌ No image path in response');
            return null;
        }
        const parts = p.split("/");
        const filename = parts[parts.length - 1] || null;
        console.log('📄 Final filename:', filename);
        return filename;
    } catch (err) {
        console.error("❌ Upload Error:", err.message);
        console.error("❌ Full error:", err);
        return null;
    }
}
}),
"[project]/src/pages/Products.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$images$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/images.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uploads$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/uploads.ts [ssr] (ecmascript)");
;
;
;
;
;
const Products = ()=>{
    const { data, addItem, updateItem, deleteItem, currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingProduct, setEditingProduct] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        category: '',
        price: '',
        description: '',
        specifications: '',
        image: '',
        gstPercent: '18',
        partnerCommissionPercent: '10',
        technicianCommissionPercent: '5'
    });
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const canManageProducts = [
        'admin',
        'manager'
    ].includes(currentUser?.role);
    const productCategories = data.categories?.filter((c)=>c.type === 'product') || [];
    const handleImageUpload = async (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const imageUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uploads$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["uploadImage"])(file);
            setFormData({
                ...formData,
                image: imageUrl || ''
            });
        } catch (error) {
            alert('Image upload failed');
        }
        setUploading(false);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
    // Products are already loaded from AppContext, no need to fetch
    }, []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const productData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description || '',
            specifications: formData.specifications || '',
            image: formData.image || '',
            gstPercent: parseFloat(formData.gstPercent),
            partnerCommissionPercent: parseFloat(formData.partnerCommissionPercent),
            technicianCommissionPercent: parseFloat(formData.technicianCommissionPercent)
        };
        console.log('Submitting product data:', productData);
        try {
            if (editingProduct) {
                await updateItem('products', editingProduct.id, productData);
                console.log('Product updated successfully');
            } else {
                const result = await addItem('products', productData);
                console.log('Product added successfully:', result);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Check console for details.');
        }
    };
    const resetForm = ()=>{
        setFormData({
            name: '',
            category: '',
            price: '',
            description: '',
            specifications: '',
            image: '',
            gstPercent: '18',
            partnerCommissionPercent: '10',
            technicianCommissionPercent: '5'
        });
        setShowForm(false);
        setEditingProduct(null);
    };
    const handleEdit = (product)=>{
        setFormData(product);
        setEditingProduct(product);
        setShowForm(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-gray-900 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "mr-2",
                                children: "🔋"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Solar Products"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Products.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    canManageProducts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowForm(true),
                        className: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all w-full sm:w-auto whitespace-nowrap",
                        children: "+ Add Product"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Products.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Products.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showForm && canManageProducts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white/10 backdrop-blur-xl border border-yellow-400/30 p-4 sm:p-6 rounded-xl mb-4 shadow-lg relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-yellow-300 mb-4",
                        children: editingProduct ? 'Edit Product' : 'Add Product'
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Products.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Product Name (e.g., Solar Panel 500W)",
                                value: formData.name,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        name: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: "image/*",
                                        onChange: handleImageUpload,
                                        className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 outline-none transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-yellow-300 text-sm mt-1",
                                        children: "Uploading..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 134,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    formData.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$images$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(formData.image),
                                        alt: "Preview",
                                        className: "mt-2 h-20 w-20 object-cover rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 135,
                                        columnNumber: 34
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: formData.category,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        category: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all",
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select Category"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    productCategories.map((cat, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: cat.name,
                                            children: cat.name
                                        }, cat.id || index, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                placeholder: "Price (₹)",
                                value: formData.price,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        price: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "Product Description",
                                value: formData.description,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        description: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all",
                                rows: 3
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "Technical Specifications",
                                value: formData.specifications,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        specifications: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all",
                                rows: 2
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                placeholder: "GST %",
                                value: formData.gstPercent,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        gstPercent: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                placeholder: "Partner Commission %",
                                value: formData.partnerCommissionPercent,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        partnerCommissionPercent: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                placeholder: "Technician Commission %",
                                value: formData.technicianCommissionPercent,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        technicianCommissionPercent: e.target.value
                                    }),
                                className: "p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "sm:col-span-2 flex flex-col sm:flex-row gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all",
                                        children: editingProduct ? 'Update Product' : 'Add Product'
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: resetForm,
                                        className: "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Products.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Products.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Product Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 213,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Price"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "GST %"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Partner %"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 216,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Tech %"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    canManageProducts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 218,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Products.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: data.products?.length > 0 ? data.products.map((product)=>{
                                const hasImage = product.image && product.image.trim() !== "";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "border-t border-gray-200 hover:bg-gray-50 transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-900",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    hasImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$images$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(product.image),
                                                        alt: product.name,
                                                        className: "h-10 w-10 object-cover rounded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/Products.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "h-10 w-10 rounded bg-white/10 flex items-center justify-center text-xs text-blue-200",
                                                        children: "No Img"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/Products.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    product.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/Products.tsx",
                                                lineNumber: 229,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 228,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: product.category
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 244,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-green-600 font-semibold",
                                            children: [
                                                "₹",
                                                product.price
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 245,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: [
                                                product.gstPercent,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 246,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: [
                                                product.partnerCommissionPercent,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 247,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: [
                                                product.technicianCommissionPercent,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 248,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        canManageProducts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 whitespace-nowrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEdit(product),
                                                    className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg mr-2 text-sm transition-all",
                                                    children: "Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteItem("products", product.id),
                                                    className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-all",
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 250,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, product.id, true, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 227,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0));
                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    colSpan: canManageProducts ? 7 : 6,
                                    className: "p-6 text-center text-gray-500",
                                    children: 'No solar products added yet. Click "Add Product" to get started.'
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 270,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Products.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Products.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Products.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Products.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "md:hidden space-y-3",
                children: data.products?.length > 0 ? data.products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-gray-200 p-4 rounded-xl shadow-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                product.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$images$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(product.image),
                                    alt: product.name,
                                    className: "h-32 w-full object-cover rounded"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 287,
                                    columnNumber: 35
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-gray-700 font-semibold",
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Products.tsx",
                                        lineNumber: 289,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 288,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Category: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 292,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: product.category
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 293,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 291,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Price: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 296,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-green-600 font-bold",
                                            children: [
                                                "₹",
                                                product.price
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 297,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 295,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-semibold",
                                                    children: "GST: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-800",
                                                    children: [
                                                        product.gstPercent,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 302,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 300,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-semibold",
                                                    children: "Partner: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-800",
                                                    children: [
                                                        product.partnerCommissionPercent,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 304,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-semibold",
                                                    children: "Tech: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-800",
                                                    children: [
                                                        product.technicianCommissionPercent,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/Products.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 308,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 299,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                canManageProducts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleEdit(product),
                                            className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex-1 text-sm transition-all",
                                            children: "Edit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 315,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>deleteItem('products', product.id),
                                            className: "bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex-1 text-sm transition-all",
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Products.tsx",
                                            lineNumber: 321,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Products.tsx",
                                    lineNumber: 314,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Products.tsx",
                            lineNumber: 286,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, product.id, false, {
                        fileName: "[project]/src/pages/Products.tsx",
                        lineNumber: 285,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white border border-gray-200 p-6 rounded-xl text-center text-gray-500",
                    children: 'No solar products added yet. Click "Add Product" to get started.'
                }, void 0, false, {
                    fileName: "[project]/src/pages/Products.tsx",
                    lineNumber: 333,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Products.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Products.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Products;
}),
"[project]/src/pages/Services.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const Services = ()=>{
    const { data, addItem, updateItem, deleteItem, currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingService, setEditingService] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        category: '',
        price: '',
        description: '',
        duration: '',
        includes: ''
    });
    const canManageServices = [
        'admin',
        'manager'
    ].includes(currentUser?.role);
    const serviceCategories = data.categories.filter((c)=>c.type === 'service');
    const handleSubmit = (e)=>{
        e.preventDefault();
        const serviceData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description,
            duration: formData.duration,
            includes: formData.includes
        };
        if (editingService) {
            updateItem('services', editingService.id, serviceData);
        } else {
            addItem('services', serviceData);
        }
        resetForm();
    };
    const resetForm = ()=>{
        setFormData({
            name: '',
            category: '',
            price: '',
            description: '',
            duration: '',
            includes: ''
        });
        setShowForm(false);
        setEditingService(null);
    };
    const handleEdit = (service)=>{
        setFormData({
            name: service.name || '',
            category: service.category || '',
            price: service.price?.toString() || '',
            description: service.description || '',
            duration: service.duration || '',
            includes: service.includes || ''
        });
        setEditingService(service);
        setShowForm(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-lg sm:text-xl font-bold text-gray-900",
                        children: "Services"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Services.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    canManageServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowForm(true),
                        className: "btn-primary px-4 py-2 rounded w-full sm:w-auto text-sm whitespace-nowrap",
                        children: "Add Service"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Services.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Services.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showForm && canManageServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "glass-form p-3 sm:p-4 rounded-lg mb-4 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-base font-semibold text-green-400 mb-3",
                        children: editingService ? 'Edit Service' : 'Add Service'
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Services.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Service Name",
                                value: formData.name,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        name: e.target.value
                                    }),
                                className: "p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: formData.category,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        category: e.target.value
                                    }),
                                className: "p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm",
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        className: "bg-gray-700 text-green-100",
                                        children: "Select Category"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    serviceCategories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: cat.name,
                                            className: "bg-gray-700 text-green-100",
                                            children: cat.name
                                        }, cat.id, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 101,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                placeholder: "Price",
                                value: formData.price,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        price: e.target.value
                                    }),
                                className: "p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Duration (e.g., 2-3 hours)",
                                value: formData.duration,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        duration: e.target.value
                                    }),
                                className: "p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "Description",
                                value: formData.description,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        description: e.target.value
                                    }),
                                className: "p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm",
                                rows: 2
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "What's included",
                                value: formData.includes,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        includes: e.target.value
                                    }),
                                className: "p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm",
                                rows: 2
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "sm:col-span-2 flex flex-col sm:flex-row gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "btn-primary px-3 py-1.5 rounded text-sm",
                                        children: editingService ? 'Update Service' : 'Add Service'
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: resetForm,
                                        className: "btn-secondary px-3 py-1.5 rounded text-sm",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Services.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Services.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden md:block bg-white border border-gray-200 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-2 text-left text-gray-900 text-sm",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-2 text-left text-gray-900 text-sm",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-2 text-left text-gray-900 text-sm",
                                        children: "Price"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-2 text-left text-gray-900 text-sm",
                                        children: "Duration"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-2 text-left text-gray-900 text-sm",
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    canManageServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-2 text-left text-gray-900 text-sm",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Services.tsx",
                                        lineNumber: 156,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Services.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Services.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: data.services?.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "border-t border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-2 text-gray-900 text-sm",
                                            children: service.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-2 text-gray-700 text-sm",
                                            children: service.category
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 163,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-2 text-green-600 text-sm",
                                            children: [
                                                "₹",
                                                service.price
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-2 text-gray-700 text-sm",
                                            children: service.duration
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-2 text-gray-700 text-sm",
                                            children: service.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 166,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        canManageServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEdit(service),
                                                    className: "btn-info px-2 py-1 rounded mr-1 text-xs",
                                                    children: "Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Services.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteItem('services', service.id),
                                                    className: "btn-danger px-2 py-1 rounded text-xs",
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Services.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 168,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, service.id, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Services.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Services.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Services.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "md:hidden space-y-2",
                children: data.services?.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-gray-200 p-3 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Name: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-900",
                                            children: service.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 196,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Category: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 199,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: service.category
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 200,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Price: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-green-600",
                                            children: [
                                                "₹",
                                                service.price
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 204,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Duration: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: service.duration
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Description: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 211,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: service.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 212,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Includes: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 215,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: service.includes
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                canManageServices && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleEdit(service),
                                            className: "btn-info px-2 py-1 rounded flex-1 text-xs",
                                            children: "Edit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 220,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>deleteItem('services', service.id),
                                            className: "btn-danger px-2 py-1 rounded flex-1 text-xs",
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Services.tsx",
                                            lineNumber: 226,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Services.tsx",
                                    lineNumber: 219,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Services.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, service.id, false, {
                        fileName: "[project]/src/pages/Services.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/pages/Services.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Services.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Services;
}),
"[project]/src/pages/Orders.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const Orders = ()=>{
    const { data, updateItem, deleteItem, currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all');
    const canManageOrders = [
        'admin',
        'manager'
    ].includes(currentUser?.role);
    const filteredOrders = data.quotes?.filter((order)=>statusFilter === 'all' || order.status === statusFilter) || [];
    const handleStatusUpdate = (orderId, newStatus)=>{
        updateItem('orders', orderId, {
            status: newStatus
        });
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-gray-900 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "mr-2",
                                children: "📋"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Customer Quotes"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Orders.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        value: statusFilter,
                        onChange: (e)=>setStatusFilter(e.target.value),
                        className: "px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "All Quotes"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "pending",
                                children: "Pending"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "in-progress",
                                children: "In Progress"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "completed",
                                children: "Completed"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "cancelled",
                                children: "Cancelled"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Orders.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Orders.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Quote ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Customer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Address"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Items"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Subtotal"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Tax"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Total"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Date"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    canManageOrders && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-gray-900 font-semibold",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Orders.tsx",
                                        lineNumber: 62,
                                        columnNumber: 35
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Orders.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: filteredOrders.length > 0 ? filteredOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "border-t border-gray-200 hover:bg-gray-50 transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-900 font-medium",
                                            children: [
                                                "#",
                                                order.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 69,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: order.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 70,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: order.email
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 71,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: order.phone
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 72,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700 max-w-xs truncate",
                                            title: order.address,
                                            children: order.address
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 73,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "max-w-xs",
                                                children: order.items?.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-sm",
                                                        children: [
                                                            item.name,
                                                            " - ₹",
                                                            item.price,
                                                            " x ",
                                                            item.quantity
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/pages/Orders.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Orders.tsx",
                                                lineNumber: 75,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 74,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: [
                                                "₹",
                                                order.subtotal
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: [
                                                "₹",
                                                order.tax
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 84,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-green-600 font-semibold",
                                            children: [
                                                "₹",
                                                order.totalAmount
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 85,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: new Date(order.created_at || Date.now()).toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`,
                                                children: order.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Orders.tsx",
                                                lineNumber: 88,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-gray-700",
                                            children: order.createdAt
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 92,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        canManageOrders && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 whitespace-nowrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: order.status,
                                                    onChange: (e)=>handleStatusUpdate(order.id, e.target.value),
                                                    className: "text-sm border border-gray-300 rounded px-2 py-1 mr-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "pending",
                                                            children: "Pending"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/Orders.tsx",
                                                            lineNumber: 100,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "in-progress",
                                                            children: "In Progress"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/Orders.tsx",
                                                            lineNumber: 101,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "completed",
                                                            children: "Completed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/Orders.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "cancelled",
                                                            children: "Cancelled"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/Orders.tsx",
                                                            lineNumber: 103,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteItem('quotes', order.id),
                                                    className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-all",
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 94,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, order.id, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 68,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    colSpan: canManageOrders ? 11 : 10,
                                    className: "p-6 text-center text-gray-500",
                                    children: "No quotes found for the selected filter."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 117,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Orders.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Orders.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Orders.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Orders.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "md:hidden space-y-3",
                children: filteredOrders.length > 0 ? filteredOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-gray-200 p-4 rounded-xl shadow-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: [
                                                "Order #",
                                                order.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 133,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`,
                                            children: order.status
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 134,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 132,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Customer: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 139,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-900",
                                            children: order.customerName
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 140,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 138,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Item: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 143,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-900",
                                            children: order.itemName
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 144,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 142,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-semibold",
                                                    children: "Type: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-800 capitalize",
                                                    children: order.type
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 147,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-semibold",
                                                    children: "Qty: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-800",
                                                    children: order.quantity || 1
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 151,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Total: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 157,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-green-600 font-bold",
                                            children: [
                                                "₹",
                                                order.totalPrice || order.itemPrice
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 158,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 156,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-700 font-semibold",
                                            children: "Date: "
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 161,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: order.createdAt
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 160,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                canManageOrders && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                            value: order.status,
                                            onChange: (e)=>handleStatusUpdate(order.id, e.target.value),
                                            className: "flex-1 text-sm border border-gray-300 rounded px-2 py-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "pending",
                                                    children: "Pending"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "in-progress",
                                                    children: "In Progress"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "completed",
                                                    children: "Completed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 173,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: "cancelled",
                                                    children: "Cancelled"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Orders.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 166,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>deleteItem('quotes', order.id),
                                            className: "bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-all",
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Orders.tsx",
                                            lineNumber: 176,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Orders.tsx",
                                    lineNumber: 165,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Orders.tsx",
                            lineNumber: 131,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, order.id, false, {
                        fileName: "[project]/src/pages/Orders.tsx",
                        lineNumber: 130,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white border border-gray-200 p-6 rounded-xl text-center text-gray-500",
                    children: "No quotes found for the selected filter."
                }, void 0, false, {
                    fileName: "[project]/src/pages/Orders.tsx",
                    lineNumber: 188,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Orders.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Orders.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Orders;
}),
"[project]/src/pages/Tickets.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const Tickets = ()=>{
    const { data, addItem, updateItem, deleteItem, currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingTicket, setEditingTicket] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
        assignedTo: '',
        customerId: ''
    });
    const handleSubmit = (e)=>{
        e.preventDefault();
        const ticketData = {
            ...formData,
            createdBy: currentUser?.id,
            createdAt: new Date().toISOString()
        };
        if (editingTicket) {
            updateItem('tickets', editingTicket.id, ticketData);
        } else {
            addItem('tickets', ticketData);
        }
        resetForm();
    };
    const resetForm = ()=>{
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            status: 'open',
            assignedTo: '',
            customerId: ''
        });
        setShowForm(false);
        setEditingTicket(null);
    };
    const handleEdit = (ticket)=>{
        setFormData(ticket);
        setEditingTicket(ticket);
        setShowForm(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-2 sm:p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-gray-900",
                        children: "Support Tickets"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Tickets.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowForm(true),
                        className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base",
                        children: "Create Ticket"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Tickets.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Tickets.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-lg border border-gray-200 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: [
                            editingTicket ? 'Edit' : 'Add',
                            " Item"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Tickets.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Ticket Title",
                                value: formData.title,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        title: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: formData.priority,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        priority: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "low",
                                        children: "Low"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "medium",
                                        children: "Medium"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "high",
                                        children: "High"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "urgent",
                                        children: "Urgent"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: formData.customerId,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        customerId: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select Customer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    data.customers?.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: customer.id,
                                            children: customer.name
                                        }, customer.id, false, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 95,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: formData.status,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        status: e.target.value
                                    }),
                                className: "p-3 border border-gray-300 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "open",
                                        children: "Open"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "in-progress",
                                        children: "In Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "resolved",
                                        children: "Resolved"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "closed",
                                        children: "Closed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "Description",
                                value: formData.description,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        description: e.target.value
                                    }),
                                className: "md:col-span-2 p-3 border border-gray-300 rounded-lg",
                                rows: 4,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 108,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg",
                                        children: [
                                            editingTicket ? 'Edit' : 'Add',
                                            " Item Ticket"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: resetForm,
                                        className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Tickets.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Tickets.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "block sm:hidden space-y-3",
                children: data.tickets?.map((ticket)=>{
                    const customer = data.customers?.find((c)=>c.id == ticket.customerId);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-lg border border-gray-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900 text-sm",
                                        children: ticket.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 135,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleEdit(ticket),
                                                className: "bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs",
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Tickets.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>deleteItem('tickets', ticket.id),
                                                className: "bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs",
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Tickets.tsx",
                                                lineNumber: 143,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mb-2",
                                children: customer?.name || 'N/A'
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 151,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: `px-2 py-1 rounded text-xs ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' : ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' : ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`,
                                        children: ticket.priority
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: `px-2 py-1 rounded text-xs ${ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`,
                                        children: ticket.status
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 161,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 152,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: new Date(ticket.createdAt).toLocaleDateString()
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, ticket.id, true, {
                        fileName: "[project]/src/pages/Tickets.tsx",
                        lineNumber: 133,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/Tickets.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Title"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Customer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Priority"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 183,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Created"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "p-3 text-left text-sm font-medium",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Tickets.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Tickets.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Tickets.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            children: data.tickets?.map((ticket)=>{
                                const customer = data.customers?.find((c)=>c.id == ticket.customerId);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "border-t",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: ticket.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 194,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: customer?.name || 'N/A'
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 195,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded text-xs ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' : ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' : ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`,
                                                children: ticket.priority
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Tickets.tsx",
                                                lineNumber: 197,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 196,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded text-xs ${ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`,
                                                children: ticket.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/Tickets.tsx",
                                                lineNumber: 207,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 206,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3 text-sm",
                                            children: new Date(ticket.createdAt).toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 216,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEdit(ticket),
                                                    className: "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm",
                                                    children: "Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Tickets.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteItem('tickets', ticket.id),
                                                    className: "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm",
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/Tickets.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/Tickets.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, ticket.id, true, {
                                    fileName: "[project]/src/pages/Tickets.tsx",
                                    lineNumber: 193,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/pages/Tickets.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Tickets.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/Tickets.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Tickets.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Tickets;
}),
"[project]/src/pages/Reports.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const Reports = ()=>{
    const { data, currentUser, addItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [showBonusForm, setShowBonusForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [bonusData, setBonusData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        userId: '',
        amount: '',
        reason: ''
    });
    const canManageBonuses = [
        'admin',
        'manager'
    ].includes(currentUser?.role);
    const calculateCommissions = ()=>{
        const commissions = {};
        data.tickets.filter((t)=>t.status === 'completed').forEach((ticket)=>{
            const item = (ticket.type === 'product' ? data.products : data.services).find((i)=>i.id == ticket.itemId);
            if (item) {
                const customer = data.customers.find((c)=>c.id == ticket.customerId);
                const partner = customer ? data.users.find((u)=>u.id == customer.assignedTo && u.role === 'partner') : null;
                const technician = data.users.find((u)=>u.id == ticket.assignedTo);
                if (partner) {
                    if (!commissions[partner.id]) {
                        commissions[partner.id] = {
                            user: partner,
                            total: 0,
                            items: []
                        };
                    }
                    const commission = item.price * item.partnerCommissionPercent / 100;
                    commissions[partner.id].total += commission;
                    commissions[partner.id].items.push({
                        item: item.name,
                        commission
                    });
                }
                if (technician) {
                    if (!commissions[technician.id]) {
                        commissions[technician.id] = {
                            user: technician,
                            total: 0,
                            items: []
                        };
                    }
                    const commission = item.price * item.technicianCommissionPercent / 100;
                    commissions[technician.id].total += commission;
                    commissions[technician.id].items.push({
                        item: item.name,
                        commission
                    });
                }
            }
        });
        return commissions;
    };
    const getBonuses = ()=>{
        return data.bonuses || [];
    };
    const handleBonusSubmit = (e)=>{
        e.preventDefault();
        addItem('bonuses', {
            ...bonusData,
            amount: parseFloat(bonusData.amount),
            addedBy: currentUser.id,
            addedAt: new Date().toISOString()
        });
        setBonusData({
            userId: '',
            amount: '',
            reason: ''
        });
        setShowBonusForm(false);
    };
    const commissions = calculateCommissions();
    const bonuses = getBonuses();
    const getMyData = ()=>{
        if (currentUser?.role === 'partner') {
            const myCustomers = data.customers.filter((c)=>c.assignedTo == currentUser.id);
            const myTickets = data.tickets.filter((t)=>myCustomers.some((c)=>c.id == t.customerId));
            const myCommission = commissions[currentUser.id]?.total || 0;
            const myBonuses = bonuses.filter((b)=>b.userId == currentUser.id);
            const totalBonuses = myBonuses.reduce((sum, b)=>sum + b.amount, 0);
            return {
                customers: myCustomers.length,
                tickets: myTickets.length,
                commission: myCommission,
                bonuses: totalBonuses,
                totalEarnings: myCommission + totalBonuses
            };
        }
        if (currentUser?.role === 'technician') {
            const myTickets = data.tickets.filter((t)=>t.assignedTo == currentUser.id);
            const completedTickets = myTickets.filter((t)=>t.status === 'completed');
            const myCommission = commissions[currentUser.id]?.total || 0;
            const myBonuses = bonuses.filter((b)=>b.userId == currentUser.id);
            const totalBonuses = myBonuses.reduce((sum, b)=>sum + b.amount, 0);
            return {
                assignedTickets: myTickets.length,
                completedTickets: completedTickets.length,
                commission: myCommission,
                bonuses: totalBonuses,
                totalEarnings: myCommission + totalBonuses
            };
        }
        return null;
    };
    const myData = getMyData();
    if (currentUser?.role === 'partner' || currentUser?.role === 'technician') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-xl sm:text-2xl font-bold text-green-400 mb-6",
                    children: "My Reports"
                }, void 0, false, {
                    fileName: "[project]/src/pages/Reports.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6",
                    children: [
                        currentUser.role === 'partner' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-green-400 text-sm lg:text-lg font-semibold",
                                            children: "My Customers"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 118,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                            children: myData?.customers
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-green-400 text-sm lg:text-lg font-semibold",
                                            children: "Tickets Raised"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                            children: myData?.tickets
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true),
                        currentUser.role === 'technician' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-green-400 text-sm lg:text-lg font-semibold",
                                            children: "Assigned Tickets"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 131,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                            children: myData?.assignedTickets
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-green-400 text-sm lg:text-lg font-semibold",
                                            children: "Completed Tickets"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 135,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                            children: myData?.completedTickets
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-green-400 text-sm lg:text-lg font-semibold",
                                    children: "Commission"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                    children: [
                                        "₹",
                                        myData?.commission.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Reports.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-green-400 text-sm lg:text-lg font-semibold",
                                    children: "Bonuses"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                    children: [
                                        "₹",
                                        myData?.bonuses.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Reports.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-green-400 text-sm lg:text-lg font-semibold",
                                    children: "Total Earnings"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2",
                                    children: [
                                        "₹",
                                        myData?.totalEarnings.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/Reports.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/Reports.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/Reports.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/Reports.tsx",
            lineNumber: 111,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-green-400",
                        children: "Reports & Analytics"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    canManageBonuses && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowBonusForm(true),
                        className: "bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full sm:w-auto whitespace-nowrap",
                        children: "Add Bonus"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Reports.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showBonusForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-gray-800 p-4 sm:p-6 rounded-lg mb-6 border border-green-600 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-green-400 mb-4",
                        children: "Add Bonus"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleBonusSubmit,
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: bonusData.userId,
                                onChange: (e)=>setBonusData({
                                        ...bonusData,
                                        userId: e.target.value
                                    }),
                                className: "p-3 bg-gray-700 text-green-100 rounded border border-green-600",
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select User"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Reports.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    data.users.filter((u)=>[
                                            'partner',
                                            'technician'
                                        ].includes(u.role)).map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: user.id,
                                            children: [
                                                user.name,
                                                " (",
                                                user.role,
                                                ")"
                                            ]
                                        }, user.id, true, {
                                            fileName: "[project]/src/pages/Reports.tsx",
                                            lineNumber: 184,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                placeholder: "Bonus Amount",
                                value: bonusData.amount,
                                onChange: (e)=>setBonusData({
                                        ...bonusData,
                                        amount: e.target.value
                                    }),
                                className: "p-3 bg-gray-700 text-green-100 rounded border border-green-600",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Reason",
                                value: bonusData.reason,
                                onChange: (e)=>setBonusData({
                                        ...bonusData,
                                        reason: e.target.value
                                    }),
                                className: "p-3 bg-gray-700 text-green-100 rounded border border-green-600",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "sm:col-span-3 flex flex-col sm:flex-row gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white",
                                        children: "Add Bonus"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Reports.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowBonusForm(false),
                                        className: "bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/Reports.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Reports.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-gray-600 text-sm lg:text-lg font-semibold",
                                children: "Total Customers"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xl lg:text-3xl font-bold text-black mt-1 lg:mt-2",
                                children: data.customers.length
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-gray-600 text-sm lg:text-lg font-semibold",
                                children: "Total Tickets"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xl lg:text-3xl font-bold text-black mt-1 lg:mt-2",
                                children: data.tickets.length
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-gray-600 text-sm lg:text-lg font-semibold",
                                children: "Completed Tickets"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xl lg:text-3xl font-bold text-black mt-1 lg:mt-2",
                                children: data.tickets.filter((t)=>t.status === 'completed').length
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-gray-600 text-sm lg:text-lg font-semibold",
                                children: "Total Commissions"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xl lg:text-3xl font-bold text-black mt-1 lg:mt-2",
                                children: [
                                    "₹",
                                    Object.values(commissions).reduce((sum, c)=>sum + c.total, 0).toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Reports.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg border border-gray-200 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-base lg:text-lg font-semibold text-black p-4 border-b border-gray-200",
                                children: "Commission Summary"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "p-4",
                                children: Object.values(commissions).map(({ user, total })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-black text-sm lg:text-base",
                                                children: [
                                                    user.name,
                                                    " (",
                                                    user.role,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/Reports.tsx",
                                                lineNumber: 247,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-orange-500 font-semibold text-sm lg:text-base",
                                                children: [
                                                    "₹",
                                                    total.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/Reports.tsx",
                                                lineNumber: 248,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, user.id, true, {
                                        fileName: "[project]/src/pages/Reports.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg border border-gray-200 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-base lg:text-lg font-semibold text-black p-4 border-b border-gray-200",
                                children: "Recent Bonuses"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "p-4",
                                children: bonuses.slice(-10).map((bonus)=>{
                                    const user = data.users.find((u)=>u.id == bonus.userId);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-black text-sm lg:text-base",
                                                        children: user?.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/Reports.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs lg:text-sm text-gray-600",
                                                        children: bonus.reason
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/Reports.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/Reports.tsx",
                                                lineNumber: 263,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-orange-500 font-semibold text-sm lg:text-base",
                                                children: [
                                                    "₹",
                                                    bonus.amount
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/Reports.tsx",
                                                lineNumber: 267,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, bonus.id, true, {
                                        fileName: "[project]/src/pages/Reports.tsx",
                                        lineNumber: 262,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/pages/Reports.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/Reports.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/Reports.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/Reports.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Reports;
}),
"[project]/src/pages/users/AddTechnician.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const AddTechnician = ()=>{
    const { addItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        specialization: ''
    });
    const handleSubmit = (e)=>{
        e.preventDefault();
        addItem('users', {
            ...formData,
            role: 'technician'
        });
        setFormData({
            name: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            specialization: ''
        });
        alert('Technician added successfully!');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "w-full p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.history.back(),
                        className: "btn-secondary px-3 py-2 rounded flex items-center gap-2",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-green-400",
                        children: "Add New Technician"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "glass-form p-4 sm:p-6 rounded-lg space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.name,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                name: e.target.value
                                            }),
                                        className: "w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        value: formData.email,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                email: e.target.value
                                            }),
                                        className: "w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        value: formData.phone,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                phone: e.target.value
                                            }),
                                        className: "w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Username"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.username,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                username: e.target.value
                                            }),
                                        className: "w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        value: formData.password,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                password: e.target.value
                                            }),
                                        className: "w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Specialization"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.specialization,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                specialization: e.target.value
                                            }),
                                        className: "w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none",
                                        placeholder: "e.g., Electrical, Plumbing"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "w-full btn-primary font-bold py-2 sm:py-3 px-4 rounded",
                        children: "Add Technician"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/users/AddTechnician.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/users/AddTechnician.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/users/AddTechnician.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AddTechnician;
}),
"[project]/src/pages/users/AddPartner.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
;
;
;
const AddPartner = ()=>{
    const { addItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        company: '',
        territory: ''
    });
    const handleSubmit = (e)=>{
        e.preventDefault();
        addItem('users', {
            ...formData,
            role: 'partner'
        });
        setFormData({
            name: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            company: '',
            territory: ''
        });
        alert('Partner added successfully!');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "w-full p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.history.back(),
                        className: "btn-secondary px-3 py-2 rounded flex items-center gap-2",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-xl sm:text-2xl font-bold text-green-400",
                        children: "Add New Partner"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/users/AddPartner.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "glass-form p-4 sm:p-6 rounded-lg space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.name,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                name: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 39,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        value: formData.email,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                email: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        value: formData.phone,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                phone: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 61,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Username"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.username,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                username: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        value: formData.password,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                password: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Company"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.company,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                company: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        placeholder: "Partner company name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "sm:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "block text-green-300 text-sm font-medium mb-2",
                                        children: "Territory"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.territory,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                territory: e.target.value
                                            }),
                                        className: "glass-input w-full px-3 py-2 rounded placeholder-green-300/50",
                                        placeholder: "Assigned territory or region"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/users/AddPartner.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "w-full btn-primary font-bold py-2 sm:py-3 px-4 rounded",
                        children: "Add Partner"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/users/AddPartner.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/users/AddPartner.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/users/AddPartner.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AddPartner;
}),
"[project]/src/widgets/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import { useState } from 'react';
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Customers$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Customers.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Products$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Products.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Services$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Services.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Orders$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Orders.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Tickets$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Tickets.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Reports$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/Reports.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$users$2f$AddTechnician$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/users/AddTechnician.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$users$2f$AddPartner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/users/AddPartner.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const Dashboard = ()=>{
    const { currentUser, data, currentPage, setCurrentPage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    // const getMenuItems = () => {
    //   const baseItems = [
    //     { key: 'dashboard', label: 'Dashboard', roles: ['admin', 'manager', 'partner', 'technician'] }
    //   ];
    //   const roleItems = {
    //     admin: [
    //       { key: 'products', label: 'Products' },
    //       { key: 'services', label: 'Services' },
    //       { key: 'tickets', label: 'Tickets' },
    //       { key: 'reports', label: 'Reports' }
    //     ],
    //     manager: [
    //       { key: 'products', label: 'Products' },
    //       { key: 'services', label: 'Services' },
    //       { key: 'tickets', label: 'Tickets' },
    //       { key: 'reports', label: 'Reports' }
    //     ],
    //     partner: [
    //       { key: 'customers', label: 'Customers' },
    //       { key: 'tickets', label: 'Tickets' }
    //     ],
    //     technician: [
    //       { key: 'tickets', label: 'My Tickets' },
    //       { key: 'reports', label: 'My Reports' }
    //     ],
    //     customer: [
    //       { key: 'products', label: 'Solar Products' },
    //       { key: 'services', label: 'Solar Services' },
    //       { key: 'tickets', label: 'My Tickets' }
    //     ]
    //   };
    //   return [...baseItems, ...(roleItems[((currentUser as any)?.role] || [])];
    // };
    const renderContent = ()=>{
        switch(currentPage){
            case 'customers':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Customers$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 54,
                    columnNumber: 32
                }, ("TURBOPACK compile-time value", void 0));
            case 'products':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Products$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 55,
                    columnNumber: 31
                }, ("TURBOPACK compile-time value", void 0));
            case 'services':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Services$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 56,
                    columnNumber: 31
                }, ("TURBOPACK compile-time value", void 0));
            case 'quotes':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Orders$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 57,
                    columnNumber: 29
                }, ("TURBOPACK compile-time value", void 0));
            case 'orders':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Orders$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 58,
                    columnNumber: 29
                }, ("TURBOPACK compile-time value", void 0));
            case 'tickets':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Tickets$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 59,
                    columnNumber: 30
                }, ("TURBOPACK compile-time value", void 0));
            case 'reports':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$Reports$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 60,
                    columnNumber: 30
                }, ("TURBOPACK compile-time value", void 0));
            case 'add technician':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$users$2f$AddTechnician$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 61,
                    columnNumber: 37
                }, ("TURBOPACK compile-time value", void 0));
            case 'add partner':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$users$2f$AddPartner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 62,
                    columnNumber: 34
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-gray-900 mb-2 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "mr-2",
                                            children: "☀️"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/index.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " Welcome back, ",
                                        currentUser?.name,
                                        "!"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600",
                                    children: [
                                        "Solar Energy Management - ",
                                        currentUser?.role,
                                        " dashboard"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/index.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "text-gray-600 text-sm font-medium",
                                                        children: "Solar Customers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-gray-900 mt-2",
                                                        children: data.customers.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 77,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-3xl text-orange-500",
                                                children: "👥"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 81,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/index.tsx",
                                        lineNumber: 76,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "text-gray-600 text-sm font-medium",
                                                        children: "Solar Products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-gray-900 mt-2",
                                                        children: data.products.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 88,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-3xl text-orange-500",
                                                children: "🔋"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 90,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/index.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "text-gray-600 text-sm font-medium",
                                                        children: "Services"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-gray-900 mt-2",
                                                        children: data.services.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 95,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-3xl text-orange-500",
                                                children: "⚡"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 99,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/index.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "text-gray-600 text-sm font-medium",
                                                        children: "Quotes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-gray-900 mt-2",
                                                        children: (data.quotes || []).length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 106,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 104,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-3xl text-orange-500",
                                                children: "📋"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/index.tsx",
                                                lineNumber: 108,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/index.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/index.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-gray-900 text-lg font-semibold mb-4 flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "mr-2",
                                                    children: "🎫"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/index.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Recent Support Tickets"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/index.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                Array.isArray(data.tickets) ? data.tickets.slice(0, 3).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-900 text-sm font-medium",
                                                                children: [
                                                                    "Ticket #",
                                                                    index + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/widgets/index.tsx",
                                                                lineNumber: 122,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-600 text-xs font-semibold bg-orange-100 px-2 py-1 rounded",
                                                                children: "Open"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/index.tsx",
                                                                lineNumber: 123,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/src/widgets/index.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))) : null,
                                                (!Array.isArray(data.tickets) || data.tickets.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-500 text-sm",
                                                    children: "No tickets yet"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/index.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/index.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-gray-900 text-lg font-semibold mb-4 flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "mr-2",
                                                    children: "⚡"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/index.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Quick Actions"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/index.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                (currentUser?.role === 'admin' || currentUser?.role === 'partner') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setCurrentPage('customers'),
                                                    className: "w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg",
                                                    children: "+ Add Solar Customer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/index.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                currentUser?.role === 'admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setCurrentPage('add partner'),
                                                            className: "w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg",
                                                            children: "+ Add Partner"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/index.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setCurrentPage('add technician'),
                                                            className: "w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg",
                                                            children: "+ Add Technician"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/index.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setCurrentPage('tickets'),
                                                    className: "w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg",
                                                    children: "+ Create Support Ticket"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/index.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setCurrentPage('reports'),
                                                    className: "w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg",
                                                    children: "📊 View Reports"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/index.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/index.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/index.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/index.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/widgets/index.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: renderContent()
    }, void 0, false, {
        fileName: "[project]/src/widgets/index.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Dashboard;
}),
"[project]/src/lib/simpleCache.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simple in-memory cache with TTL
__turbopack_context__.s([
    "clearAllCache",
    ()=>clearAllCache,
    "clearCached",
    ()=>clearCached,
    "getCached",
    ()=>getCached,
    "makeKey",
    ()=>makeKey,
    "setCached",
    ()=>setCached
]);
const __cache = new Map();
function getCached(key) {
    const entry = __cache.get(key);
    if (entry && entry.expiry > Date.now()) return entry.data;
    if (entry) __cache.delete(key);
    return null;
}
function setCached(key, data, ttlMs) {
    const ttl = typeof ttlMs === "number" ? ttlMs : 5 * 60 * 1000;
    __cache.set(key, {
        data,
        expiry: Date.now() + ttl
    });
}
function makeKey(namespace, obj) {
    try {
        return `${namespace}:${JSON.stringify(obj)}`;
    } catch  {
        return `${namespace}:${String(obj)}`;
    }
}
function clearCached(key) {
    __cache.delete(key);
}
function clearAllCache() {
    __cache.clear();
}
}),
"[project]/src/api/authEvents.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "can",
    ()=>can,
    "clearClientSession",
    ()=>clearClientSession,
    "getClientSessionToken",
    ()=>getClientSessionToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "hasAccess",
    ()=>hasAccess,
    "setClientSession",
    ()=>setClientSession,
    "userLogin",
    ()=>userLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/Api.ts [ssr] (ecmascript)");
;
async function userLogin(body) {
    const loginResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth-users-clients", {
        body: {
            email: body.email,
            password: body.password
        },
        fields: "id,name,email,role,client"
    });
    return loginResult ?? null;
}
function setClientSession(session) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function clearClientSession() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function checkSessionValidity() {
    if ("TURBOPACK compile-time truthy", 1) return true;
    //TURBOPACK unreachable
    ;
}
function getClientSessionToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function getCurrentUser() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function hasAccess(route) {
    try {
        const user = getCurrentUser();
        if (!user) return false;
        const mods = String(user.access_modules || "").split(",").map((s)=>s.trim()).filter(Boolean);
        if (mods.includes("*")) return true;
        return mods.some((m)=>route === m || route.startsWith(`${m}/`));
    } catch  {
        return false;
    }
}
function can(action) {
    try {
        const user = getCurrentUser();
        if (!user) return false;
        const acts = String(user.allowed_actions || "").split(",").map((s)=>s.trim().toLowerCase()).filter(Boolean);
        return acts.includes("*") || acts.includes(action.toLowerCase());
    } catch  {
        return false;
    }
}
}),
"[project]/src/api/fqlClient.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericFQL",
    ()=>GenericFQL,
    "createFQL",
    ()=>createFQL,
    "fql",
    ()=>fql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/Api.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/simpleCache.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$authEvents$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/authEvents.ts [ssr] (ecmascript)");
;
;
;
const DEFAULT_TTL_MS = 5 * 60 * 1000;
class GenericFQL {
    resource;
    constructor(resource){
        this.resource = resource;
    }
    async findLast(options = {}) {
        const { sort = "-created_at", search = "", fields = "*", filter = "", useCache = false, useSession = false, cacheTtlMs = DEFAULT_TTL_MS } = options;
        const params = {
            page: `1,1`,
            sort,
            search,
            fields,
            filter,
            ...this.getSessionParam(useSession)
        };
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["makeKey"])(`${this.resource}:last`, {
            sort,
            search,
            fields,
            filter,
            useSession
        });
        if (useCache) {
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCached"])(cacheKey);
            if (cached) return cached;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.resource}`, params);
        const first = Array.isArray(response?.result) ? response.result[0] : response?.result;
        const normalized = {
            ...response,
            result: first
        };
        if (useCache && !response?.err) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setCached"])(cacheKey, normalized, cacheTtlMs);
        return normalized;
    }
    getSessionParam(useSession) {
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$authEvents$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getClientSessionToken"])();
        return useSession && session ? {
            session
        } : {};
    }
    ensureValidIds(ids, method) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error(`${method}: ids[] must not be empty`);
        }
    }
    async findAll(options = {}) {
        return this.findMany(options);
    }
    async findMany(options = {}) {
        const { page = "", sort = "created_at", limit = "", joins = "", search = "", fields = "*", filter = "", nearby = "", useCache = false, useSession = false, cacheTtlMs = DEFAULT_TTL_MS } = options;
        const params = {
            page: `${page},${limit}`,
            sort,
            search,
            fields,
            filter,
            ...joins ? {
                joins
            } : {},
            ...nearby ? {
                nearby
            } : {},
            ...this.getSessionParam(useSession)
        };
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["makeKey"])(`${this.resource}:list`, {
            page,
            limit,
            sort,
            fields,
            filter,
            useSession
        });
        if (useCache) {
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCached"])(cacheKey);
            if (cached) return cached;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.resource}`, params);
        if (useCache && !response?.err) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setCached"])(cacheKey, response, cacheTtlMs);
        return response;
    }
    async findOne(id, options = {}) {
        const { fields = "*", useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS, joins = "" } = options;
        const params = {
            fields,
            ...joins ? {
                joins
            } : {},
            ...this.getSessionParam(useSession)
        };
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["makeKey"])(`${this.resource}:byId`, {
            id,
            fields,
            useSession
        });
        if (useCache) {
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCached"])(cacheKey);
            if (cached) return cached;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.resource}/${id}`, params);
        if (Array.isArray(response?.result)) {
            response.result = response.result[0];
        }
        if (useCache && !response?.err) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setCached"])(cacheKey, response, cacheTtlMs);
        return response;
    }
    async findManyIds(ids, options = {}) {
        const { fields = "*", useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS, joins = "" } = options;
        const params = {
            fields,
            ...joins ? {
                joins
            } : {},
            ...this.getSessionParam(useSession)
        };
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["makeKey"])(`${this.resource}:byIds`, {
            ids,
            fields,
            useSession
        });
        if (useCache) {
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCached"])(cacheKey);
            if (cached) return cached;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].get(`/${this.resource}/${ids.join(",")}`, params);
        response.result = response?.result || [];
        if (useCache && !response?.err) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setCached"])(cacheKey, response, cacheTtlMs);
        return response;
    }
    async createOne(data, options = {}) {
        const { useSession = false, fields = "*" } = options;
        let body = {
            ...data
        };
        if (useSession) {
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$authEvents$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            const clientId = user?.client?.id ?? user?.client;
            if (clientId && body.client == null) {
                body.client = clientId;
            }
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post(`/${this.resource}`, {
            body,
            ...this.getSessionParam(useSession),
            fields
        });
        return response;
    }
    async createMany(data, options = {}) {
        const { useSession = false, fields = "*" } = options;
        let body = data.map((item)=>({
                ...item
            }));
        if (useSession) {
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$authEvents$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            const clientId = user?.client?.id ?? user?.client;
            if (clientId) {
                body = body.map((item)=>item.client == null ? {
                        ...item,
                        client: clientId
                    } : item);
            }
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].post(`/${this.resource}`, {
            body,
            ...this.getSessionParam(useSession),
            fields
        });
        return response;
    }
    async updateOne(id, data, options = {}) {
        const { useSession = false, fields = "*" } = options;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].put(`/${this.resource}/${id}`, {
            body: data,
            ...this.getSessionParam(useSession),
            fields
        });
        return response;
    }
    async updateMany(updates, options = {}) {
        const { useSession = false, fields = "*" } = options;
        const body = updates.map(({ id, data })=>({
                id,
                ...data
            }));
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].put(`/${this.resource}`, {
            body,
            ...this.getSessionParam(useSession),
            fields
        });
        return response;
    }
    //usage not encouraged, prefer softDeleteOne
    async deleteOne(id, options = {}) {
        const { useSession = false } = options;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/${this.resource}/${id}`, this.getSessionParam(useSession));
        return response;
    }
    /** Hard delete many IDs */ async deleteMany(ids, options = {}) {
        this.ensureValidIds(ids, "deleteMany");
        const { useSession = false } = options;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/${this.resource}/${ids.join(",")}`, this.getSessionParam(useSession));
        return response;
    }
    async softDeleteOne(id, options = {}) {
        return this.updateOne(id, {
            is_deleted: 1
        }, options);
    }
    /** Soft delete many IDs */ async softDeleteMany(ids, options = {}) {
        this.ensureValidIds(ids, "softDeleteMany");
        const updates = ids.map((id)=>({
                id,
                data: {
                    is_deleted: 1
                }
            }));
        return this.updateMany(updates, options);
    }
    async restoreOne(id, options = {}) {
        return this.updateOne(id, {
            is_deleted: 0
        }, options);
    }
    /** Restore many IDs */ async restoreMany(ids, options = {}) {
        this.ensureValidIds(ids, "restoreMany");
        const updates = ids.map((id)=>({
                id,
                data: {
                    is_deleted: 0
                }
            }));
        return this.updateMany(updates, options);
    }
    async rawSql(queryName, sql, params = [], options = {}) {
        const { useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS } = options;
        const endpoint = queryName ? queryName.trim().replace(/\s+/g, "-").toLowerCase() : "rawSql";
        const cacheKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["makeKey"])(endpoint, {
            sql,
            params: JSON.stringify(params),
            useSession
        });
        if (useCache) {
            const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCached"])(cacheKey);
            if (cached) return cached;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$Api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["default"].sql(`/${endpoint}`, {
            body: {
                sql,
                params
            },
            ...this.getSessionParam(useSession)
        });
        if (useCache && !response?.err) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$simpleCache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setCached"])(cacheKey, response, cacheTtlMs);
        return response;
    }
}
function createFQL(resource) {
    return new GenericFQL(resource);
}
const fql = {
    users: createFQL("users"),
    orders: createFQL("orders"),
    tickets: createFQL("tickets"),
    products: createFQL("products"),
    services: createFQL("services"),
    customers: createFQL("customers"),
    quotes: createFQL("quotes")
};
}),
"[project]/src/widgets/bottom-sheet/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$images$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/images.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/fqlClient.ts [ssr] (ecmascript)");
;
;
;
;
;
// import logo from '../../assets/images/Logo.png';
const CustomerPortal = ()=>{
    const { currentUser, logout, data, addItem, login } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    // const refreshData = () => {
    //   localStorage.removeItem('mjpower-data');
    //   window.location.reload();
    // };
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('home');
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showProfileMenu, setShowProfileMenu] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [orderForm, setOrderForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        type: 'product',
        itemId: '',
        quantity: 1,
        description: '',
        preferredDate: ''
    });
    const [quoteForm, setQuoteForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        phone: '',
        email: '',
        address: '',
        propertyType: 'residential',
        roofArea: '',
        monthlyBill: '',
        requirements: ''
    });
    const [ticketForm, setTicketForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        type: 'product',
        itemId: '',
        issue: '',
        notes: ''
    });
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [quotes, setQuotes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showLoginPrompt, setShowLoginPrompt] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [loginAction, setLoginAction] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // const [, setSearchQuery] = useState('');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!currentUser && (activeTab === 'my-orders' || activeTab === 'my-tickets')) {
            setActiveTab('home');
        }
    }, [
        currentUser,
        activeTab
    ]);
    const handleRaiseTicket = (e)=>{
        e.preventDefault();
        if (!currentUser) {
            setLoginAction('ticket');
            setShowLoginPrompt(true);
            return;
        }
        const newTicket = {
            ...ticketForm,
            customerId: currentUser.id,
            customerName: currentUser.name,
            status: 'open',
            assignedTo: '',
            createdBy: currentUser.id,
            createdAt: new Date().toISOString()
        };
        addItem('tickets', newTicket);
        setTicketForm({
            type: 'product',
            itemId: '',
            issue: '',
            notes: ''
        });
        alert('Ticket raised successfully!');
    };
    const myOrders = currentUser ? data.orders?.filter((order)=>order.customerId === currentUser.id) || [] : [];
    const myTickets = currentUser ? data.tickets?.filter((ticket)=>ticket.customerId === currentUser.id) || [] : [];
    // Fetch quotes when user logs in or tab changes to my-quotes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (currentUser && activeTab === 'my-quotes') {
            fetchQuotes();
        }
    }, [
        currentUser,
        activeTab
    ]);
    const fetchQuotes = async ()=>{
        if (!currentUser) return;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].quotes.findMany({
                filter: `customerId=${currentUser.id}`,
                sort: '-created_at'
            });
            if (!response.err && response.result) {
                setQuotes(response.result);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    };
    const menuItems = [
        {
            id: 'home',
            label: 'Home',
            icon: '🏠'
        },
        {
            id: 'products',
            label: 'Products',
            icon: '🛒'
        },
        {
            id: 'services',
            label: 'Services',
            icon: '🔧'
        },
        {
            id: 'raise-ticket',
            label: 'Support',
            icon: '🎫'
        },
        ...currentUser ? [
            {
                id: 'my-orders',
                label: 'My Orders',
                icon: '📦'
            },
            {
                id: 'my-tickets',
                label: 'My Tickets',
                icon: '🎟️'
            }
        ] : []
    ];
    const categories = [
        {
            name: 'Solar Panels',
            icon: '☀️',
            color: 'bg-yellow-400'
        },
        {
            name: 'Inverters',
            icon: '⚡',
            color: 'bg-yellow-400'
        },
        {
            name: 'Batteries',
            icon: '🔋',
            color: 'bg-yellow-400'
        },
        {
            name: 'Installation',
            icon: '🔧',
            color: 'bg-yellow-400'
        },
        {
            name: 'Maintenance',
            icon: '⚙️',
            color: 'bg-yellow-400'
        },
        {
            name: 'Monitoring',
            icon: '📊',
            color: 'bg-yellow-400'
        },
        {
            name: 'Support',
            icon: '🛠️',
            color: 'bg-yellow-400'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-900 text-slate-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                className: "sticky top-0 z-40 border-b border-gray-700/60 bg-slate-900/80 backdrop-blur",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center ring-1 ring-white/10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-white font-bold text-lg",
                                        children: "MJ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "leading-tight hidden sm:block",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "font-semibold tracking-wide",
                                            children: "MJ Power"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 129,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-400",
                                            children: "Products • Services • Support"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex w-full max-w-xl items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "search",
                                            placeholder: "Search products (Inverters, Batteries, Panels...)",
                                            className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400",
                                            children: "⌕"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 141,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                    onClick: ()=>setActiveTab('get-quote'),
                                    className: "rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 cursor-pointer whitespace-nowrap",
                                    children: "Get Quote"
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                menuItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (!currentUser && (item.id === 'my-orders' || item.id === 'my-tickets')) {
                                                setLoginAction('login');
                                                setShowLoginPrompt(true);
                                                return;
                                            }
                                            setActiveTab(item.id);
                                        },
                                        className: "hidden lg:inline rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5",
                                        children: item.label
                                    }, item.id, false, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('cart'),
                                    className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10",
                                    type: "button",
                                    children: [
                                        "🛒 ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "ml-1 text-slate-300",
                                            children: [
                                                "(",
                                                cart.length,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 171,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-gray-700/60 lg:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-5 gap-1 px-2 py-2",
                    children: [
                        menuItems.slice(0, 4).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (!currentUser && (item.id === 'my-orders' || item.id === 'my-tickets')) {
                                        setLoginAction('login');
                                        setShowLoginPrompt(true);
                                        return;
                                    }
                                    setActiveTab(item.id);
                                },
                                className: `flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-colors ${activeTab === item.id ? 'text-green-500 bg-white/10' : 'text-slate-400'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-lg mb-1",
                                        children: item.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('get-quote'),
                            className: `flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-colors ${activeTab === 'get-quote' ? 'text-green-500 bg-white/10' : 'text-slate-400'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-lg mb-1",
                                    children: "💰"
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: "Quote"
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "pb-20 lg:pb-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                    className: "mx-auto max-w-7xl px-4 py-6 lg:py-10",
                    children: [
                        activeTab === 'home' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-br from-green-500/15 via-transparent to-white/5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "h-2 w-2 rounded-full bg-green-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 223,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                "Power solutions for homes, businesses & industry"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                            className: "mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl",
                                                            children: [
                                                                "Reliable ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-500",
                                                                    children: "Electrical"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 228,
                                                                    columnNumber: 32
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Products",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {
                                                                    className: "hidden sm:block"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 229,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                "+ Expert Services"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "mt-4 max-w-xl text-slate-300",
                                                            children: "Buy authentic power products (inverters, batteries, solar, wiring) and book installation, maintenance, AMC, and audits — all in one place."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "mt-6 flex flex-wrap gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveTab('products'),
                                                                    className: "rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-black hover:brightness-110",
                                                                    children: "Shop Products"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 239,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveTab('services'),
                                                                    className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10",
                                                                    children: "Explore Services"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 245,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveTab('get-quote'),
                                                                    className: "rounded-2xl border border-green-500/40 bg-black/20 px-5 py-3 text-sm font-semibold text-green-500 hover:border-green-500/70",
                                                                    children: "Request a Quote"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-semibold",
                                                                            children: "Warranty-backed"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 text-xs text-slate-400",
                                                                            children: "Genuine products only"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 262,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-semibold",
                                                                            children: "Fast Support"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 265,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 text-xs text-slate-400",
                                                                            children: "Phone + onsite"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 266,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 264,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-semibold",
                                                                            children: "Professional Install"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 269,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 text-xs text-slate-400",
                                                                            children: "Certified team"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 270,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 268,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 259,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl shadow-black/40",
                                                        children: (()=>{
                                                            let maxDiscountProduct = data.products?.reduce((max, product)=>{
                                                                const discount = product.originalPrice ? (product.originalPrice - product.price) / product.originalPrice * 100 : 0;
                                                                const maxDiscount = max?.originalPrice ? (max.originalPrice - max.price) / max.originalPrice * 100 : 0;
                                                                return discount > maxDiscount ? product : max;
                                                            }, null);
                                                            // Fallback to first product if no discounted products
                                                            if (!maxDiscountProduct || !maxDiscountProduct.originalPrice) {
                                                                maxDiscountProduct = data.products?.[0];
                                                            }
                                                            if (!maxDiscountProduct) return null;
                                                            const discountPercent = maxDiscountProduct.originalPrice ? Math.round((maxDiscountProduct.originalPrice - maxDiscountProduct.price) / maxDiscountProduct.originalPrice * 100) : 15;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "text-sm font-semibold text-slate-100",
                                                                                        children: "Today's Deal"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                        lineNumber: 299,
                                                                                        columnNumber: 33
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-1 text-xs text-slate-400",
                                                                                        children: "Limited stock • Best price"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                        lineNumber: 300,
                                                                                        columnNumber: 33
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 298,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-500",
                                                                                children: [
                                                                                    "-",
                                                                                    discountPercent,
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 302,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 297,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "mt-6 space-y-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-2xl border border-white/10 bg-black/20 p-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-start justify-between gap-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "text-sm font-semibold",
                                                                                                        children: maxDiscountProduct.name
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                        lineNumber: 309,
                                                                                                        columnNumber: 37
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "mt-1 text-xs text-slate-400",
                                                                                                        children: [
                                                                                                            maxDiscountProduct.category,
                                                                                                            " • ",
                                                                                                            maxDiscountProduct.description
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                        lineNumber: 310,
                                                                                                        columnNumber: 37
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "mt-3 flex items-center gap-2",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-lg font-semibold text-green-500",
                                                                                                                children: [
                                                                                                                    "₹",
                                                                                                                    maxDiscountProduct.price?.toLocaleString()
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                                lineNumber: 312,
                                                                                                                columnNumber: 39
                                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                                            maxDiscountProduct.originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-sm text-slate-500 line-through",
                                                                                                                children: [
                                                                                                                    "₹",
                                                                                                                    maxDiscountProduct.originalPrice?.toLocaleString()
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                                lineNumber: 314,
                                                                                                                columnNumber: 41
                                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                        lineNumber: 311,
                                                                                                        columnNumber: 37
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 308,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "h-14 w-14 rounded-2xl bg-green-500/15 ring-1 ring-green-500/20 grid place-items-center",
                                                                                                children: "⚡"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 318,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                        lineNumber: 307,
                                                                                        columnNumber: 33
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "mt-4 flex gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>{
                                                                                                    const existingItem = cart.find((cartItem)=>cartItem.id === maxDiscountProduct.id);
                                                                                                    if (!existingItem) {
                                                                                                        setCart([
                                                                                                            ...cart,
                                                                                                            {
                                                                                                                ...maxDiscountProduct,
                                                                                                                quantity: 1
                                                                                                            }
                                                                                                        ]);
                                                                                                    }
                                                                                                },
                                                                                                className: "w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                                                                                type: "button",
                                                                                                children: "Add to Cart"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 323,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/10",
                                                                                                children: "Install +"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 335,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                        lineNumber: 322,
                                                                                        columnNumber: 33
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 306,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "grid grid-cols-2 gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "rounded-2xl border border-white/10 bg-black/20 p-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "text-xs text-slate-400",
                                                                                                children: "Avg dispatch"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 343,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "mt-1 text-lg font-semibold",
                                                                                                children: "24–48 hrs"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 344,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                        lineNumber: 342,
                                                                                        columnNumber: 33
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "rounded-2xl border border-white/10 bg-black/20 p-4",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "text-xs text-slate-400",
                                                                                                children: "Service coverage"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 347,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "mt-1 text-lg font-semibold",
                                                                                                children: "Onsite"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                                lineNumber: 348,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                        lineNumber: 346,
                                                                                        columnNumber: 33
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 341,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 305,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true);
                                                        })()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 220,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-end justify-between gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                            className: "text-2xl font-semibold",
                                                            children: "Shop by Category"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 364,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-sm text-slate-400",
                                                            children: "Quickly find what you need."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 365,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 363,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setActiveTab('products'),
                                                    className: "text-sm font-semibold text-green-500 hover:underline",
                                                    children: "View all →"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 362,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                                            children: categories.slice(0, 4).map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setActiveTab('products'),
                                                    className: "group rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm font-semibold",
                                                                    children: category.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 378,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl bg-green-500/15 px-3 py-2 text-green-500 ring-1 ring-green-500/20",
                                                                    children: category.icon
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "mt-3 text-sm text-slate-400",
                                                            children: [
                                                                "Professional ",
                                                                category.name.toLowerCase(),
                                                                " solutions"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "mt-4 text-xs text-slate-500 group-hover:text-slate-300",
                                                            children: "Explore →"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, category.name, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 370,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                            className: "text-2xl font-semibold",
                                                            children: "Featured Products"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-sm text-slate-400",
                                                            children: "Add to cart or request installation."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                            type: "button",
                                                            children: "All"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 398,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                            type: "button",
                                                            children: "Inverters"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                            type: "button",
                                                            children: "Batteries"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                            type: "button",
                                                            children: "Solar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 401,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 392,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                                            children: data.products?.slice(0, 3).map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                                    className: "rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                            className: "text-base font-semibold",
                                                                            children: product.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 410,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-sm text-slate-400",
                                                                            children: product.category
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 411,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "mt-3 flex items-center gap-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-lg font-semibold text-green-500",
                                                                                children: [
                                                                                    "₹",
                                                                                    product.price?.toLocaleString()
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 413,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 412,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "mt-2 text-xs text-slate-500",
                                                                            children: "⭐ 4.5 • Reviews"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 415,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 409,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 ring-1 ring-green-500/20",
                                                                    children: "⚡"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 417,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "mt-4 flex gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        const existingItem = cart.find((cartItem)=>cartItem.id === product.id);
                                                                        if (!existingItem) {
                                                                            setCart([
                                                                                ...cart,
                                                                                {
                                                                                    ...product,
                                                                                    quantity: 1
                                                                                }
                                                                            ]);
                                                                        }
                                                                    },
                                                                    className: "w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                                                    type: "button",
                                                                    children: "Add to Cart"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 422,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/10",
                                                                    children: "Install +"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 434,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, product.id, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 391,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl p-8 lg:p-12 text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-center mb-12",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold mb-4 text-white",
                                                    children: "Why Choose MJPOWER Solar?"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-lg text-gray-300",
                                                    children: "Leading the way in sustainable energy solutions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 445,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-3 gap-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "🏆"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 452,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 451,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                            className: "text-lg font-semibold mb-2 text-white",
                                                            children: "Expert Installation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 454,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300",
                                                            children: "Professional installation by certified technicians"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "⚡"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                            className: "text-lg font-semibold mb-2 text-white",
                                                            children: "Premium Quality"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300",
                                                            children: "High-efficiency solar panels and components"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 457,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "🛠️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 465,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                            className: "text-lg font-semibold mb-2 text-white",
                                                            children: "24/7 Support"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 468,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300",
                                                            children: "Round-the-clock maintenance and support"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 469,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 464,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 444,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 216,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'services' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-end justify-between gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-semibold",
                                                    children: "Services"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-slate-400",
                                                    children: "Book onsite work, AMC, and audits."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 479,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            className: "text-sm font-semibold text-green-500 hover:underline",
                                            children: "Request service →"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 483,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 478,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                                    children: data.services?.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                            className: "rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-semibold",
                                                            children: service.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 489,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "rounded-2xl bg-green-500/15 px-3 py-2 text-green-500 ring-1 ring-green-500/20",
                                                            children: "🔧"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 490,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 488,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "mt-3 text-sm text-slate-400",
                                                    children: service.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 flex items-center gap-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-lg font-semibold text-green-500",
                                                        children: [
                                                            "₹",
                                                            service.price?.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 493,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        const existingItem = cart.find((cartItem)=>cartItem.id === service.id);
                                                        if (!existingItem) {
                                                            setCart([
                                                                ...cart,
                                                                {
                                                                    ...service,
                                                                    quantity: 1
                                                                }
                                                            ]);
                                                        }
                                                    },
                                                    className: "mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                                    children: "Book Service"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, service.id, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 487,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 485,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 477,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'products' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-semibold",
                                                    children: "Featured Products"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 517,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-slate-400",
                                                    children: "Add to cart or request installation."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 516,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                    type: "button",
                                                    children: "All"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                    type: "button",
                                                    children: "Inverters"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                    type: "button",
                                                    children: "Batteries"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10",
                                                    type: "button",
                                                    children: "Solar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 520,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 515,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                                    children: data.products?.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                            className: "rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: "text-base font-semibold",
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 533,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-sm text-slate-400",
                                                                    children: item.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 534,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 flex items-center gap-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg font-semibold text-green-500",
                                                                        children: [
                                                                            "₹",
                                                                            item.price?.toLocaleString()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 536,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "mt-2 text-xs text-slate-500",
                                                                    children: "⭐ 4.5 • Reviews"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 538,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 532,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 ring-1 ring-green-500/20",
                                                            children: "⚡"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                const existingItem = cart.find((cartItem)=>cartItem.id === item.id);
                                                                if (existingItem) {
                                                                    setActiveTab('cart');
                                                                } else {
                                                                    const quantity = orderForm.quantity || 1;
                                                                    setCart([
                                                                        ...cart,
                                                                        {
                                                                            ...item,
                                                                            quantity
                                                                        }
                                                                    ]);
                                                                }
                                                            },
                                                            className: "w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                                            children: cart.find((cartItem)=>cartItem.id === item.id) ? '✓ In Cart' : 'Add to Cart'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 545,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/10",
                                                            children: "Install +"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 530,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 528,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 514,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'get-quote' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-end justify-between gap-4 mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-semibold",
                                                children: "Get Solar Quote"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 573,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-slate-400",
                                                children: "Get a personalized solar solution estimate"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 574,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 572,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 571,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 lg:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "rounded-3xl border border-white/10 bg-white/5 p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-semibold mb-4",
                                                    children: "Request Quote"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                                    onSubmit: async (e)=>{
                                                        e.preventDefault();
                                                        const newQuote = {
                                                            ...quoteForm,
                                                            customerId: currentUser?.id,
                                                            customerName: currentUser?.name || quoteForm.name,
                                                            status: 'pending',
                                                            estimatedCost: Math.round((parseInt(quoteForm.monthlyBill) || 0) * 12 * 8),
                                                            estimatedSavings: Math.round((parseInt(quoteForm.monthlyBill) || 0) * 12 * 0.8),
                                                            type: cart.length > 0 ? 'cart-quote' : 'form-quote',
                                                            ...cart.length > 0 && {
                                                                items: cart.map((item)=>({
                                                                        id: item.id,
                                                                        name: item.name,
                                                                        price: item.price,
                                                                        quantity: item.quantity,
                                                                        total: item.price * item.quantity
                                                                    })),
                                                                subtotal: cart.reduce((total, item)=>total + (item.price || 0) * item.quantity, 0),
                                                                tax: Math.round(cart.reduce((total, item)=>total + (item.price || 0) * item.quantity, 0) * 0.18),
                                                                totalAmount: Math.round(cart.reduce((total, item)=>total + (item.price || 0) * item.quantity, 0) * 1.18)
                                                            }
                                                        };
                                                        try {
                                                            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$fqlClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fql"].quotes.createOne(newQuote);
                                                            if (response.err) {
                                                                alert('Error submitting quote: ' + response.message);
                                                            } else {
                                                                alert('Quote request submitted successfully! We will contact you soon.');
                                                                setQuoteForm({
                                                                    name: '',
                                                                    phone: '',
                                                                    email: '',
                                                                    address: '',
                                                                    propertyType: 'residential',
                                                                    roofArea: '',
                                                                    monthlyBill: '',
                                                                    requirements: ''
                                                                });
                                                                setCart([]);
                                                                setActiveTab('my-quotes');
                                                            }
                                                        } catch (error) {
                                                            console.error('Error submitting quote:', error);
                                                            if (error.message.includes('Network error')) {
                                                                alert('Connection failed. Please check if the server is running and try again.');
                                                            } else {
                                                                alert('Error submitting quote: ' + error.message);
                                                            }
                                                        }
                                                    },
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "grid gap-3 sm:grid-cols-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    placeholder: "Full Name",
                                                                    value: quoteForm.name,
                                                                    onChange: (e)=>setQuoteForm({
                                                                            ...quoteForm,
                                                                            name: e.target.value
                                                                        }),
                                                                    className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                                    required: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 625,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "tel",
                                                                    placeholder: "Phone Number",
                                                                    value: quoteForm.phone,
                                                                    onChange: (e)=>setQuoteForm({
                                                                            ...quoteForm,
                                                                            phone: e.target.value
                                                                        }),
                                                                    className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                                    required: true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 633,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 624,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            placeholder: "Email Address",
                                                            value: quoteForm.email,
                                                            onChange: (e)=>setQuoteForm({
                                                                    ...quoteForm,
                                                                    email: e.target.value
                                                                }),
                                                            className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 642,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                            placeholder: "Installation Address",
                                                            value: quoteForm.address,
                                                            onChange: (e)=>setQuoteForm({
                                                                    ...quoteForm,
                                                                    address: e.target.value
                                                                }),
                                                            className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                            rows: 2,
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 650,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "grid gap-3 sm:grid-cols-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: quoteForm.propertyType,
                                                                    onChange: (e)=>setQuoteForm({
                                                                            ...quoteForm,
                                                                            propertyType: e.target.value
                                                                        }),
                                                                    className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "residential",
                                                                            children: "Residential"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 664,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "commercial",
                                                                            children: "Commercial"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 665,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "industrial",
                                                                            children: "Industrial"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 666,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 659,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    placeholder: "Roof Area (sq ft)",
                                                                    value: quoteForm.roofArea,
                                                                    onChange: (e)=>setQuoteForm({
                                                                            ...quoteForm,
                                                                            roofArea: e.target.value
                                                                        }),
                                                                    className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 668,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 658,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            placeholder: "Monthly Electricity Bill (₹)",
                                                            value: quoteForm.monthlyBill,
                                                            onChange: (e)=>setQuoteForm({
                                                                    ...quoteForm,
                                                                    monthlyBill: e.target.value
                                                                }),
                                                            className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 676,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                            placeholder: "Special Requirements or Questions",
                                                            value: quoteForm.requirements,
                                                            onChange: (e)=>setQuoteForm({
                                                                    ...quoteForm,
                                                                    requirements: e.target.value
                                                                }),
                                                            className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                            rows: 2
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        cart.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "rounded-2xl border border-green-500/20 bg-green-500/5 p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-semibold text-green-500 mb-3",
                                                                    children: "Selected Items"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 694,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: cart.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex justify-between text-sm",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        item.name,
                                                                                        " x",
                                                                                        item.quantity
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 698,
                                                                                    columnNumber: 31
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "₹",
                                                                                        (item.price * item.quantity).toLocaleString()
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 699,
                                                                                    columnNumber: 31
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, item.id, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 697,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 695,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "border-t border-green-500/20 mt-3 pt-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between text-sm font-semibold text-green-500",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Total (incl. tax):"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 705,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: [
                                                                                    "₹",
                                                                                    Math.round(cart.reduce((total, item)=>total + (item.price || 0) * item.quantity, 0) * 1.18).toLocaleString()
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                lineNumber: 706,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 704,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 703,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 693,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            className: "w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                                            children: cart.length > 0 ? 'Submit Quote Request' : 'Get Free Quote'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 712,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "rounded-3xl border border-white/10 bg-white/5 p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-semibold mb-3",
                                                            children: "Why Choose Solar?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 723,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs",
                                                                            children: "💰"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 726,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-sm font-semibold",
                                                                                    children: "Save Money"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 730,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-slate-400",
                                                                                    children: "Reduce electricity bills by 80%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 731,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 729,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 725,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs",
                                                                            children: "🌱"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 735,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-sm font-semibold",
                                                                                    children: "Go Green"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 739,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-slate-400",
                                                                                    children: "Reduce carbon footprint"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 740,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 738,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 734,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs",
                                                                            children: "📈"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 744,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-sm font-semibold",
                                                                                    children: "Increase Value"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 748,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-slate-400",
                                                                                    children: "Boost property value"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 749,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 747,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 743,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 722,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "rounded-3xl border border-white/10 bg-white/5 p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-semibold mb-3",
                                                            children: "Quick Estimate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        quoteForm.monthlyBill && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: "Annual Bill:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 760,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "₹",
                                                                                (parseInt(quoteForm.monthlyBill) * 12).toLocaleString()
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 761,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 759,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: "Estimated System Cost:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 764,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "₹",
                                                                                (parseInt(quoteForm.monthlyBill) * 12 * 8).toLocaleString()
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 765,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 763,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs text-green-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: "Annual Savings:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 768,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "₹",
                                                                                (parseInt(quoteForm.monthlyBill) * 12 * 0.8).toLocaleString()
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 769,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 767,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 758,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        !quoteForm.monthlyBill && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-slate-400",
                                                            children: "Enter your monthly bill to see estimate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 774,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 721,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 578,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 570,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'cart' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-end justify-between gap-4 mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-semibold",
                                                children: "Shopping Cart"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 786,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-slate-400",
                                                children: "Review your selected items"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 787,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 785,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 784,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                cart.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-4xl mb-3",
                                            children: "🛒"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 793,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-2",
                                            children: "Your cart is empty"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 794,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-slate-400 mb-4",
                                            children: "Add some solar products to get started!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 795,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveTab('products'),
                                            className: "rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                            children: "Browse Products"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 796,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 792,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                                    children: cart.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                            className: "rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: "text-base font-semibold",
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 809,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-sm text-slate-400",
                                                                    children: item.category
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 810,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 flex items-center gap-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg font-semibold text-green-500",
                                                                        children: [
                                                                            "₹",
                                                                            item.price?.toLocaleString()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 812,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 811,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 808,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 ring-1 ring-green-500/20",
                                                            children: item.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$images$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getImageUrl"])(item.image),
                                                                alt: item.name,
                                                                className: "w-full h-full object-cover rounded-2xl"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 817,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "⚡"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 819,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 815,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 807,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setCart(cart.map((cartItem)=>cartItem.id === item.id && cartItem.quantity > 1 ? {
                                                                                ...cartItem,
                                                                                quantity: cartItem.quantity - 1
                                                                            } : cartItem));
                                                                    },
                                                                    className: "w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold hover:bg-white/10 transition-all",
                                                                    children: "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 825,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "w-8 text-center text-sm font-semibold",
                                                                    children: item.quantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 837,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setCart(cart.map((cartItem)=>cartItem.id === item.id ? {
                                                                                ...cartItem,
                                                                                quantity: cartItem.quantity + 1
                                                                            } : cartItem));
                                                                    },
                                                                    className: "w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold hover:bg-white/10 transition-all",
                                                                    children: "+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 838,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 824,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setCart(cart.filter((cartItem)=>cartItem.id !== item.id));
                                                            },
                                                            className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10",
                                                            children: "Remove"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 851,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 823,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 806,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 804,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                cart.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-6 rounded-3xl border border-white/10 bg-white/5 p-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-sm font-semibold",
                                                            children: "Order Summary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 869,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 text-xs text-slate-400",
                                                            children: [
                                                                cart.length,
                                                                " items • Tax included"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 870,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 868,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-right",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-lg font-semibold text-green-500",
                                                            children: [
                                                                "₹",
                                                                Math.round(cart.reduce((total, item)=>total + (item.price || 0) * item.quantity, 0) * 1.18).toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 873,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-slate-400",
                                                            children: "Total with 18% tax"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 874,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                    lineNumber: 872,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 867,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                // Autofill quote form with user data if logged in
                                                if (currentUser) {
                                                    setQuoteForm({
                                                        ...quoteForm,
                                                        name: currentUser.name || '',
                                                        email: currentUser.email || '',
                                                        phone: currentUser.phone || '',
                                                        address: currentUser.address || ''
                                                    });
                                                }
                                                setActiveTab('get-quote');
                                            },
                                            className: "mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                            children: "💰 Generate Quote"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 877,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 866,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 783,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'raise-ticket' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "max-w-2xl mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-semibold",
                                            children: "Support Center"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 903,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-slate-400",
                                            children: "Get help with your solar solutions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 904,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 902,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl border border-white/10 bg-white/5 p-6",
                                    children: !currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-4xl mb-4",
                                                children: "🔒"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 910,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold mb-2",
                                                children: "Login Required"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 911,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-sm mb-6 text-slate-400",
                                                children: "Please login to raise a support ticket"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 912,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setLoginAction('ticket');
                                                    setShowLoginPrompt(true);
                                                },
                                                className: "rounded-2xl bg-green-500 px-6 py-2.5 text-sm font-semibold text-black hover:brightness-110",
                                                children: "Login to Continue"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 913,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 909,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold mb-4",
                                                children: "Create Support Ticket"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 925,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                                onSubmit: handleRaiseTicket,
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium mb-2",
                                                                children: "Category"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 928,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: ticketForm.type,
                                                                onChange: (e)=>setTicketForm({
                                                                        ...ticketForm,
                                                                        type: e.target.value,
                                                                        itemId: ''
                                                                    }),
                                                                className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "product",
                                                                        children: "Solar Product"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 934,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "service",
                                                                        children: "Solar Service"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 935,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 929,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 927,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium mb-2",
                                                                children: "Select Item"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 940,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: ticketForm.itemId,
                                                                onChange: (e)=>setTicketForm({
                                                                        ...ticketForm,
                                                                        itemId: e.target.value
                                                                    }),
                                                                className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                                required: true,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: [
                                                                            "Select ",
                                                                            ticketForm.type
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                        lineNumber: 947,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    (ticketForm.type === 'product' ? data.products : data.services)?.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: item.id,
                                                                            children: item.name
                                                                        }, item.id, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 949,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 941,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 939,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium mb-2",
                                                                children: "Issue Description"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 955,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                                placeholder: "Describe your issue in detail...",
                                                                value: ticketForm.issue,
                                                                onChange: (e)=>setTicketForm({
                                                                        ...ticketForm,
                                                                        issue: e.target.value
                                                                    }),
                                                                className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20",
                                                                rows: 4,
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                lineNumber: 956,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 954,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: "w-full rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-black hover:brightness-110",
                                                        children: "Submit Support Ticket"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 966,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 926,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 924,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 907,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 901,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'my-orders' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: `text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                            children: "My Orders"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 982,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: `text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                            children: "Track your solar product orders"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 983,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 981,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: `rounded-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `p-6 border-b ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: `text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                children: "Order History"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 988,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 987,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "p-6",
                                            children: !currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-center py-12",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-6xl mb-6",
                                                        children: "🔒"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 993,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: `text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "Login Required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 994,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: `text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "Please login to view your orders"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 995,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setLoginAction('login');
                                                            setShowLoginPrompt(true);
                                                        },
                                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105",
                                                        children: "Login to Continue"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 996,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 992,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)) : myOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-center py-12",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-6xl mb-6",
                                                        children: "📦"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1008,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: `text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "No Orders Yet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1009,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: `text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "Start shopping for solar products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1010,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setActiveTab('products'),
                                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105",
                                                        children: "Browse Products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1011,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: myOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: `p-6 rounded-2xl border transition-all hover:shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                            className: `text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                            children: order.itemName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1026,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center space-x-4 mb-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: `text-sm px-3 py-1 rounded-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                                    children: order.type
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1028,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                order.type === 'product' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: `text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                                    children: [
                                                                                        "Qty: ",
                                                                                        order.quantity
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1032,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1027,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "text-xl font-bold text-teal-600 mb-2",
                                                                            children: [
                                                                                "₹",
                                                                                (order.totalPrice || order.itemPrice)?.toLocaleString()
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1035,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        order.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: `text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                            children: order.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1036,
                                                                            columnNumber: 53
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center space-x-4 text-sm text-gray-500",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "Preferred: ",
                                                                                        order.preferredDate
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1038,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "Ordered: ",
                                                                                        order.createdAt
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1039,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1037,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 1025,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `px-4 py-2 rounded-full text-sm font-medium text-white ${order.status === 'completed' ? 'bg-green-500' : order.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'}`,
                                                                    children: order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 1042,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 1024,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, order.id, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1021,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1019,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 990,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 986,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 980,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        activeTab === 'my-tickets' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: `text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                            children: "Support Tickets"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 1062,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: `text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                            children: "Track your support requests"
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 1063,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 1061,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: `rounded-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `p-6 border-b ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: `text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                children: "Ticket History"
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1068,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 1067,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "p-6",
                                            children: !currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-center py-12",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-6xl mb-6",
                                                        children: "🔒"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1073,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: `text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "Login Required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1074,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: `text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "Please login to view your support tickets"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1075,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setLoginAction('login');
                                                            setShowLoginPrompt(true);
                                                        },
                                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105",
                                                        children: "Login to Continue"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1076,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1072,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)) : myTickets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-center py-12",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-6xl mb-6",
                                                        children: "🎟️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1088,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: `text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "No Support Tickets"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1089,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: `text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                        children: "Need help? Create a support ticket"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1090,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setActiveTab('raise-ticket'),
                                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105",
                                                        children: "Create Ticket"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1091,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1087,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: myTickets.map((ticket)=>{
                                                    const item = (ticket.type === 'product' ? data.products : data.services)?.find((i)=>i.id == ticket.itemId);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: `p-6 rounded-2xl border transition-all hover:shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center space-x-3 mb-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                                    className: `text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                                    children: [
                                                                                        "Ticket #",
                                                                                        ticket.id
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1110,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: `text-sm px-3 py-1 rounded-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                                    children: ticket.type
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1111,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1109,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: `text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                            children: [
                                                                                "Related to: ",
                                                                                item?.name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1115,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: `mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                            children: ticket.issue
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1118,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        ticket.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: `text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium",
                                                                                    children: "Notes:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                                    lineNumber: 1121,
                                                                                    columnNumber: 37
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                " ",
                                                                                ticket.notes
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1120,
                                                                            columnNumber: 35
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-500",
                                                                            children: [
                                                                                "Created: ",
                                                                                new Date(ticket.createdAt).toLocaleDateString()
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                            lineNumber: 1124,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 1108,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `px-4 py-2 rounded-full text-sm font-medium text-white ${ticket.status === 'closed' ? 'bg-gray-500' : ticket.status === 'completed' ? 'bg-green-500' : ticket.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'}`,
                                                                    children: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                                    lineNumber: 1128,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                            lineNumber: 1107,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, ticket.id, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1104,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1099,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                    lineNumber: 1066,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 1060,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        showLoginPrompt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800 rounded-lg p-6 max-w-md w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-white mb-4",
                                        children: "Customer Login"
                                    }, void 0, false, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 1151,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                        onSubmit: (e)=>{
                                            e.preventDefault();
                                            const formData = new FormData(e.target);
                                            const email = formData.get('email');
                                            const password = formData.get('password');
                                            const customer = data.customers?.find((c)=>c.email === email && c.password === password);
                                            if (customer) {
                                                const customerUser = {
                                                    ...customer,
                                                    role: 'customer'
                                                };
                                                login(email, password, customerUser);
                                                setShowLoginPrompt(false);
                                            } else {
                                                alert('Invalid credentials');
                                            }
                                        },
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                        children: "Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1167,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        name: "email",
                                                        type: "email",
                                                        required: true,
                                                        className: "w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none",
                                                        placeholder: "Enter your email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1168,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1166,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-300 mb-2",
                                                        children: "Password"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1177,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        name: "password",
                                                        type: "password",
                                                        required: true,
                                                        className: "w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none",
                                                        placeholder: "Enter your password"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1178,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1176,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-3 pt-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowLoginPrompt(false),
                                                        className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors",
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1187,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: "flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors",
                                                        children: "Login"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                        lineNumber: 1194,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                                lineNumber: 1186,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                        lineNumber: 1152,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                                lineNumber: 1150,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                            lineNumber: 1149,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/widgets/bottom-sheet/index.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CustomerPortal;
}),
"[project]/src/App.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$App$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/widgets/App.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$AppStore$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/widgets/AppStore.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/widgets/index.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$bottom$2d$sheet$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/widgets/bottom-sheet/index.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
function AppContent() {
    const { currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showStaffLogin, setShowStaffLogin] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-white flex items-center justify-center",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 18,
            columnNumber: 12
        }, this);
    }
    // Show staff login when requested
    if (showStaffLogin && !currentUser) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$App$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            onBackToCustomer: ()=>setShowStaffLogin(false)
        }, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 23,
            columnNumber: 12
        }, this);
    }
    // Show customer portal for customers or guest users
    if (!currentUser || currentUser.role === 'customer') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$bottom$2d$sheet$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 28,
            columnNumber: 12
        }, this);
    }
    // Show admin/staff dashboard for other users
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$AppStore$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["AppProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AppContent, {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = App;
}),
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$App$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/App.tsx [ssr] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$App$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/pages/index.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__43b1c39b._.js.map