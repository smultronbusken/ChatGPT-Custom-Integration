import { Hono } from '@hono/hono';
import ProductService from "../services/product_service.ts";
import { Env } from "../types.ts";

function productRoute(): Hono<Env> {
    const app = new Hono<Env>()

    app.get('/', async (c) => {
        const productService = new ProductService(c)
        const res = await productService.list()
        return c.json(res)
    }).post('/', async (c) => {
        const productService = new ProductService(c);

        const data = await c.req.json();
        if (!data.name) {
            return c.json({ error: 'Name field is required.' }, 400);
        }

        try {
            const res = await productService.create(data);
            return c.json(res, 201);
        } catch (error) {
            console.error('Error creating record:', error);
            return c.json({ error: 'Failed to create record.' }, 500);
        }
    }).delete('/', async (c) => {
        const productService = new ProductService(c);

        const data = await c.req.json();
        if (!data.id) {
            return c.json({ error: 'Id field is required.' }, 400);
        }

        try {
            const res = await productService.delete(data.id);
            return c.json(res);
        } catch (error) {
            console.error('Error creating record:', error);
            return c.json({ error: 'Failed to create record.' }, 500);
        }

    })

    return app;
}

export default productRoute