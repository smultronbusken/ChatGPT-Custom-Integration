
import "jsr:@std/dotenv/load";
import PocketBase from "pocketbase"
import { Hono } from "@hono/hono"
import { basicAuth } from "@hono/hono/basic-auth"
import { logger } from "@hono/hono/logger"
import productRoute from "./routes/product.ts";
import { pocketbaseMiddleware } from "./middleware/pocketbase.ts";
import { Env } from "./types.ts";

const pbClient = await setUpPocketbase()
const app = setUpHono()
setUpEndpoints(app)

Deno.serve({ port: 8080 }, app.fetch)

function setUpEndpoints(app: Hono<Env>) {
    app.route('/product', productRoute())
}

function setUpHono() {
    const app = new Hono<Env>()
    app.use(logger())

    app.use('*', pocketbaseMiddleware(pbClient))

    const username = Deno.env.get("ADMIN_USERNAME")
    const password = Deno.env.get("ADMIN_PASSWORD")
    if (!username || !password) throw "ADMIN_USERNAME and ADMIN_PASSWORD not found."

    app.use("*", basicAuth({
        username: username,
        password: password,
    }))
    return app
}

async function setUpPocketbase() {
    const url = Deno.env.get("POCKETBASE_URL")
    const client = new PocketBase(url)
    const pbUsername = Deno.env.get("POCKETBASE_USERNAME")
    const pbPassword = Deno.env.get("POCKETBASE_PASSWORD")
    if (!pbUsername || !pbPassword) throw "POCKETBASE_USERNAME and POCKETBASE_PASSWORD not found."
    await client.admins.authWithPassword(pbUsername, pbPassword)
    return client
}

