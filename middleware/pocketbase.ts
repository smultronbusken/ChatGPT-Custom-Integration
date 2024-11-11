import { MiddlewareHandler, } from '@hono/hono'
import { createMiddleware } from '@hono/hono/factory'
import PocketBase from 'pocketbase'
import { Env } from "../types.ts";

export const pocketbaseMiddleware = (pbClient: PocketBase): MiddlewareHandler => {
    return createMiddleware<Env>(async (c, next) => {
        c.set('pbClient', pbClient)
        await next()
    })
}
