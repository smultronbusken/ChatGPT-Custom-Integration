import { Hono } from '@hono/hono';
import ProductService from '../services/productService.ts';
import { Env } from '../types.ts';

function productRoute(): Hono<Env> {
  const app = new Hono<Env>();

  app.get('/', async (c) => {
    const productService = new ProductService(c);
    const res = await productService.list();
    return c.json(res);
  });

  app.get('/:id', async (c) => {
    const productService = new ProductService(c);
    const res = await productService.getById(c.req.param('id'));
    return c.json(res);
  });

  app.post('/', async (c) => {
    const productService = new ProductService(c);
    const data = await c.req.json();

    // Validate required fields
    if (!data.name || !data.category || data.price === undefined) {
      return c.json({ error: 'Name, category, and price are required.' }, 400);
    }

    try {
      const res = await productService.create(data);
      return c.json(res, 201);
    } catch (error) {
      console.error('Error creating product:', error);
      return c.json({ error: 'Failed to create product.' }, 500);
    }
  });

  return app;
}

export default productRoute;
