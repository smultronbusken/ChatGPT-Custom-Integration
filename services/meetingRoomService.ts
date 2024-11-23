import PocketBase from 'pocketbase';
import { Env } from '../types.ts';
import { Context } from '@hono/hono';

class MeetingRoomService {
  pbClient: PocketBase;

  constructor(c: Context<Env>) {
    this.pbClient = c.get('pbClient');
  }

  public async list() {
    const records = await this.pbClient.collection('meeting_rooms').getFullList({
      sort: 'name',
    });
    return records;
  }

  public async getById(id: string) {
    const record = await this.pbClient.collection('meeting_rooms').getOne(id);
    return record;
  }

  // Implement create, update, delete methods if needed
}

export default MeetingRoomService;
