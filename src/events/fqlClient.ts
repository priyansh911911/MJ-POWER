import Api from '../services/Api';

interface QueryOptions {
  filter?: string;
  search?: string;
  sort?: string;
  limit?: number;
  fields?: string;
  joins?: string;
  useSession?: boolean;
}

interface CreateOptions {
  useSession?: boolean;
}

interface FQLResponse<T> {
  result: T;
  err?: Error;
}

class FQLCollection {
  constructor(private collection: string) {}

  async findMany<T>(options: QueryOptions = {}): Promise<FQLResponse<T[]>> {
    try {
      const result = await Api.get(`/${this.collection}`, {
        filter: options.filter,
        search: options.search,
        sort: options.sort,
        fields: options.fields,
        joins: options.joins,
        session: options.useSession ? 'true' : undefined,
        page: options.limit ? `1,${options.limit}` : undefined
      });
      return { result };
    } catch (err) {
      return { result: [], err: err as Error };
    }
  }

  async findById<T>(id: number, options: Omit<QueryOptions, 'filter' | 'search' | 'sort' | 'limit'> = {}): Promise<FQLResponse<T>> {
    try {
      const result = await Api.get(`/${this.collection}/${id}`, {
        fields: options.fields,
        joins: options.joins,
        session: options.useSession ? 'true' : undefined
      });
      return { result };
    } catch (err) {
      return { result: null as T, err: err as Error };
    }
  }

  async findLast<T>(options: QueryOptions = {}): Promise<FQLResponse<T>> {
    try {
      const result = await Api.get(`/${this.collection}/last`, {
        filter: options.filter,
        search: options.search,
        sort: options.sort,
        fields: options.fields,
        joins: options.joins,
        session: options.useSession ? 'true' : undefined
      });
      return { result };
    } catch (err) {
      return { result: null as T, err: err as Error };
    }
  }

  async createOne<T>(data: Record<string, any>, options: CreateOptions = {}): Promise<FQLResponse<{ id: number }>> {
    try {
      const result = await Api.post(`/${this.collection}`, {
        body: data,
        session: options.useSession ? 'true' : undefined
      });
      return { result };
    } catch (err) {
      return { result: { id: 0 }, err: err as Error };
    }
  }

  async createMany<T>(data: Record<string, any>[], options: CreateOptions = {}): Promise<FQLResponse<{ ids: number[] }>> {
    try {
      const result = await Api.post(`/${this.collection}/batch`, {
        body: data,
        session: options.useSession ? 'true' : undefined
      });
      return { result };
    } catch (err) {
      return { result: { ids: [] }, err: err as Error };
    }
  }

  async updateById(id: number, data: Record<string, any>, options: CreateOptions = {}): Promise<FQLResponse<boolean>> {
    try {
      await Api.put(`/${this.collection}/${id}`, {
        body: data,
        session: options.useSession ? 'true' : undefined
      });
      return { result: true };
    } catch (err) {
      return { result: false, err: err as Error };
    }
  }

  async updateMany(records: Array<{ id: number; [key: string]: any }>, options: CreateOptions = {}): Promise<FQLResponse<boolean>> {
    try {
      await Api.put(`/${this.collection}/batch`, {
        body: records,
        session: options.useSession ? 'true' : undefined
      });
      return { result: true };
    } catch (err) {
      return { result: false, err: err as Error };
    }
  }

  async softDeleteById(id: number, options: CreateOptions = {}): Promise<FQLResponse<boolean>> {
    try {
      await Api.put(`/${this.collection}/${id}`, {
        body: { is_deleted: 1 },
        session: options.useSession ? 'true' : undefined
      });
      return { result: true };
    } catch (err) {
      return { result: false, err: err as Error };
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

  async sql<T>(query: string, params: any[] = [], options: CreateOptions = {}): Promise<FQLResponse<T[]>> {
    try {
      const result = await Api.sql('query', {
        body: { sql: query, params },
        session: options.useSession ? 'true' : undefined
      });
      return { result };
    } catch (err) {
      return { result: [], err: err as Error };
    }
  }
}

export const fql = new FQLClient();