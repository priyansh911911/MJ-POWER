import Api from "../services/Api";
import { getCached, setCached, makeKey} from "../lib/simpleCache";
import { getClientSessionToken, getCurrentUser } from "./authEvents";
import {
  Role,
  BaseRecord,
  AreaRecord,
  ItemRecord,
  SaleRecord,
  UnitRecord,
  ClientRecord,
  VendorRecord,
  ReceiptRecord,
  PaymentRecord,
  CustomerRecord,
  PurchaseRecord,
  AdminUserRecord,
  ClientUserRecord,
  PurchaseEntryRecord,
  PurchaseVariableRecord,
} from "./fqlSchema";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export interface FQLResponse<T = any> {
  result?: T;
  count?: number;
  message?: string;
  responses?: any[];
  err?: boolean | string;
}

export interface FQLFindManyOptions {
  page?: number;
  sort?: string;
  limit?: number;
  joins?: string;
  search?: string;
  fields?: string;
  filter?: string;
  hidden?: string;
  nearby?: string;
  useCache?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}

export interface FQLFindByIdOptions {
  joins?: string;
  filter?: string;
  fields?: string;
  useCache?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}

export interface FQLCreateOptions {
  fields?: string;
  useSession?: boolean;
}

export interface FQLUpdateOptions extends FQLCreateOptions { }
export interface FQLDeleteOptions {
  useSession?: boolean;
}
export interface FQLCountOptions {
  filter?: string;
  useCache?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}
export interface FQLQueryOptions {
  useCache?: boolean;
  cacheTtlMs?: number;
  useSession?: boolean;
}

export interface FQLBulkResponse<T = any> extends FQLResponse<T[]> {
  responses: FQLResponse<T>[];
}

export class GenericFQL<TRecord extends BaseRecord = BaseRecord> {
  readonly resource: string;
  constructor(resource: string) {
    this.resource = resource;
  }

  async findLast(options: Partial<FQLFindManyOptions> = {}): Promise<FQLResponse<TRecord>> {
    const {
      sort = "-created_at",
      search = "",
      fields = "*",
      filter = "",
      useCache = false,
      useSession = false,
      cacheTtlMs = DEFAULT_TTL_MS,
    } = options;

    const params: Record<string, any> = {
      page: `1,1`,
      sort,
      search,
      fields,
      filter,
      ...this.getSessionParam(useSession),
    };

    const cacheKey = makeKey(`${this.resource}:last`, { sort, search, fields, filter, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}`, params);
    const first = Array.isArray((response as any)?.result) ? (response as any).result[0] : (response as any)?.result;
    const normalized: FQLResponse<TRecord> = { ...response, result: first } as any;
    if (useCache && !response?.err) setCached(cacheKey, normalized, cacheTtlMs);
    return normalized;
  }

  private getSessionParam(useSession?: boolean) {
    const session = getClientSessionToken();
    return useSession && session ? { session } : {};
  }

  private ensureValidIds(ids: number[], method: string) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error(`${method}: ids[] must not be empty`);
    }
  }

  async findAll(options: FQLFindManyOptions = {}): Promise<FQLResponse<TRecord[]>> {
    return this.findMany(options);
  }


  async findMany(options: FQLFindManyOptions = {}): Promise<FQLResponse<TRecord[]>> {
    const {
      page = "",
      sort = "created_at",
      limit = "",
      joins = "",
      search = "",
      fields = "*",
      filter = "",
      nearby = "",
      useCache = false,
      useSession = false,
      cacheTtlMs = DEFAULT_TTL_MS,
    } = options;

    const params: Record<string, any> = {
      page: `${page},${limit}`,
      sort,
      search,
      fields,
      filter,
      ...(joins ? { joins } : {}),
      ...(nearby ? { nearby } : {}),
      ...this.getSessionParam(useSession),
    };

    const cacheKey = makeKey(`${this.resource}:list`, { page, limit, sort, fields, filter, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}`, params);
    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);
    return response;
  }

  async findOne(id: number, options: FQLFindByIdOptions = {}): Promise<FQLResponse<TRecord>> {
    const { fields = "*", useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS, joins = "" } = options;
    const params = { fields, ...(joins ? { joins } : {}), ...this.getSessionParam(useSession) };

    const cacheKey = makeKey(`${this.resource}:byId`, { id, fields, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}/${id}`, params);
    if (Array.isArray((response as any)?.result)) {
      (response as any).result = (response as any).result[0];
    }
    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);
    return response;
  }

  async findManyIds(
    ids: number[],
    options: FQLFindByIdOptions = {}
  ): Promise<FQLResponse<TRecord[]>> {
    const { fields = "*", useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS, joins = "" } = options;
    const params = { fields, ...(joins ? { joins } : {}), ...this.getSessionParam(useSession) };

    const cacheKey = makeKey(`${this.resource}:byIds`, { ids, fields, useSession });
    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.get(`/${this.resource}/${ids.join(",")}`, params);

    (response as any).result = (response as any)?.result || [];

    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);
    return response;
  }


  async createOne(data: Partial<TRecord>, options: FQLCreateOptions = {}): Promise<FQLResponse<TRecord>> {
    const { useSession = false, fields = "*" } = options;
    let body: any = { ...data };
    if (useSession) {
      const user: any = getCurrentUser();
      const clientId = user?.client?.id ?? user?.client;
      if (clientId && body.client == null) {
        body.client = clientId;
      }
    }
    const response = await Api.post(`/${this.resource}`, {
      body,
      ...this.getSessionParam(useSession),
      fields,
    });
    return response;
  }

  async createMany(data: Partial<TRecord>[], options: FQLCreateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    const { useSession = false, fields = "*" } = options;
    let body: any[] = data.map(item => ({ ...item }));
    if (useSession) {
      const user: any = getCurrentUser();
      const clientId = user?.client?.id ?? user?.client;
      if (clientId) {
        body = body.map(item => item.client == null ? { ...item, client: clientId } : item);
      }
    }
    const response = await Api.post(`/${this.resource}`, {
      body,
      ...this.getSessionParam(useSession),
      fields,
    });
    return response;
  }

  async updateOne(id: number, data: Partial<TRecord>, options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord>> {
    const { useSession = false, fields = "*" } = options;
    const response = await Api.put(`/${this.resource}/${id}`, {
      body: data,
      ...this.getSessionParam(useSession),
      fields,
    });
    return response;
  }

  async updateMany(updates: Array<{ id: number; data: Partial<TRecord> }>, options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    const { useSession = false, fields = "*" } = options;
    const body = updates.map(({ id, data }) => ({ id, ...data }));
    const response = await Api.put(`/${this.resource}`, {
      body,
      ...this.getSessionParam(useSession),
      fields,
    });
    return response;
  }

  //usage not encouraged, prefer softDeleteOne
  async deleteOne(id: number, options: FQLDeleteOptions = {}): Promise<FQLResponse<void>> {
    const { useSession = false } = options;
    const response = await Api.delete(`/${this.resource}/${id}`, this.getSessionParam(useSession));
    return response;
  }

  /** Hard delete many IDs */
  async deleteMany(ids: number[], options: FQLDeleteOptions = {}): Promise<FQLResponse<void>> {
    this.ensureValidIds(ids, "deleteMany");
    const { useSession = false } = options;

    const response = await Api.delete(
      `/${this.resource}/${ids.join(",")}`,
      this.getSessionParam(useSession)
    );

    return response;
  }

  async softDeleteOne(id: number, options: FQLUpdateOptions = {}) {
    return this.updateOne(id, { is_deleted: 1 } as any, options);
  }

  /** Soft delete many IDs */
  async softDeleteMany(ids: number[], options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    this.ensureValidIds(ids, "softDeleteMany");

    const updates = ids.map(id => ({
      id,
      data: { is_deleted: 1 } as any,
    }));

    return this.updateMany(updates, options);
  }


  async restoreOne(id: number, options: FQLUpdateOptions = {}) {
    return this.updateOne(id, { is_deleted: 0 } as any, options);
  }

  /** Restore many IDs */
  async restoreMany(ids: number[], options: FQLUpdateOptions = {}): Promise<FQLResponse<TRecord[]>> {
    this.ensureValidIds(ids, "restoreMany");

    const updates = ids.map(id => ({
      id,
      data: { is_deleted: 0 } as any,
    }));

    return this.updateMany(updates, options);
  }

  async rawSql(
    queryName: string,
    sql: string,
    params: any[] = [],
    options: FQLQueryOptions = {}
  ): Promise<FQLResponse<any>> {
    const { useSession = false, useCache = false, cacheTtlMs = DEFAULT_TTL_MS } = options;

    const endpoint = queryName
      ? queryName.trim().replace(/\s+/g, "-").toLowerCase()
      : "rawSql";

    const cacheKey = makeKey(endpoint, {
      sql,
      params: JSON.stringify(params),
      useSession,
    });

    if (useCache) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    const response = await Api.sql(`/${endpoint}`, {
      body: { sql, params },
      ...this.getSessionParam(useSession),
    });

    if (useCache && !response?.err) setCached(cacheKey, response, cacheTtlMs);

    return response;
  }
}

/** Factory */
export function createFQL<TRecord extends BaseRecord = BaseRecord>(resource: string): GenericFQL<TRecord> {
  return new GenericFQL<TRecord>(resource);
}

/** Pre-configured FQL instances */
export const fql = {
  customers: createFQL<CustomersRecord>("customers"),
  products: createFQL<ProductsRecord>("products"),
  orders: createFQL<OrdersRecord>("orders"),
  users: createFQL<UsersRecord>("users"),
  tickets: createFQL<TicketsRecord>("tickets"),
  services: createFQL<ServicesRecord>("services"),
};
