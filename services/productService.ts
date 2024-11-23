import PocketBase from 'pocketbase';
import { Env } from '../types.ts';
import { Context } from '@hono/hono';

class ProductService {
  pbClient: PocketBase;

  constructor(c: Context<Env>) {
    this.pbClient = c.get('pbClient');
  }

  public async list() {
    const records = await this.pbClient.collection('products').getFullList({
      sort: '-created',
    });
    return records;
  }

  public async getById(id: string) {
    const record = await this.pbClient.collection('products').getOne(id);
    return record;
  }

  public async create(data: Record<string, any>) {
    const record = await this.pbClient.collection('products').create(data);
    return record;
  }

  // Implement update and delete methods...
}

export default ProductService;
