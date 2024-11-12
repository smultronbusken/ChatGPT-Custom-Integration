import PocketBase from 'pocketbase'
import { Env } from "../types.ts";
import { Context } from "@hono/hono";

class CassieService {
    pbClient: PocketBase

    constructor(c: Context<Env>) {
        this.pbClient = c.get("pbClient")
    }

    public async list() {
        const records = await this.pbClient.collection('cassie').getFullList({
            sort: '-created',
        })
        return records
    }

    public async create(data: Record<string, any>) {
        const record = await this.pbClient.collection('cassie').create(data);
        return record;
    }

    public async delete(id: string) {
        const res = await this.pbClient.collection('cassie').delete(id);
        return res;
    }
}

export default CassieService
