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
}

export default CassieService