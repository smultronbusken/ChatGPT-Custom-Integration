import PocketBase from 'pocketbase';
import { Env } from '../types.ts';
import { Context } from '@hono/hono';

class OrderService {
  pbClient: PocketBase;

  constructor(c: Context<Env>) {
    this.pbClient = c.get('pbClient');
  }

  public async list() {
    const records = await this.pbClient.collection('orders').getFullList({
      sort: '-created',
    });
    return records;
  }

  public async getById(id: string) {
    const record = await this.pbClient.collection('orders').getOne(id);
    return record;
  }

  public async create(data: Record<string, any>) {
    const record = await this.pbClient.collection('orders').create(data);
    return record;
  }

  // Implement update and delete methods...
}

export default OrderService;
