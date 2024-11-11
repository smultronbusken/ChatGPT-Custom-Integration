// authors.ts
import { Hono } from '@hono/hono';
import CassieService from "../services/cassie_service.ts";
import { Env } from "../types.ts";

function cassieRoute(): Hono<Env> {
    const app = new Hono<Env>()

    app.get('/', async (c) => {
        const cassieService = new CassieService(c)
        const res = await cassieService.list()
        return c.json(res)
    })

    return app;
}

export default cassieRoute