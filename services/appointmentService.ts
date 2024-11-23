import PocketBase from 'pocketbase';
import { Env } from '../types.ts';
import { Context } from '@hono/hono';

class AppointmentService {
  pbClient: PocketBase;

  constructor(c: Context<Env>) {
    this.pbClient = c.get('pbClient');
  }

  public async list() {
    const records = await this.pbClient.collection('appointments').getFullList({
      sort: '-date',
    });
    return records;
  }

  public async getById(id: string) {
    const record = await this.pbClient.collection('appointments').getOne(id);
    return record;
  }

  public async create(data: Record<string, any>) {
    const record = await this.pbClient.collection('appointments').create(data);
    return record;
  }

  public async delete(id: string) {
    const res = await this.pbClient.collection('appointments').delete(id);
    return res;
  }

  public async checkAvailability(roomId: string, date: string, startTime: string, endTime: string) {
    const appointments = await this.pbClient.collection('appointments').getFullList({
      filter: `roomId="${roomId}" && date="${date}" && ((startTime <= "${endTime}" && endTime >= "${startTime}"))`,
    });
    return appointments.length > 0;
  }
}

export default AppointmentService;
