import { Hono } from '@hono/hono';
import OrderService from '../services/orderService.ts';
import { Env } from '../types.ts';

function orderRoute(): Hono<Env> {
  const app = new Hono<Env>();

  app.get('/', async (c) => {
    const orderService = new OrderService(c);
    const res = await orderService.list();
    return c.json(res);
  });

  app.get('/:id', async (c) => {
    const orderService = new OrderService(c);
    const res = await orderService.getById(c.req.param('id'));
    return c.json(res);
  });

  app.post('/', async (c) => {
    const orderService = new OrderService(c);
    let data = await c.req.json();

    data = setDefaultValues(data)

    // Validate required fields
    if (!data.customerId || !data.items || !Array.isArray(data.items)) {
      return c.json({ error: 'Customer ID and items are required.' }, 400);
    }

    try {
      const res = await orderService.create(data);
      return c.json(res, 201);
    } catch (error) {
      console.error('Error creating order:', error);
      return c.json({ error: 'Failed to create order.' }, 500);
    }
  });

  return app;
}

function setDefaultValues(data: any) {
  if (!data.customerId) data.customerId = "customer01"
  if (!data.orderDate) data.orderDate = "2024-12-03"
  if (!data.status) data.status = "processing"
  if (!data.items) data.items = ["product00000001"]
  if (!data.totalAmount) data.totalAmount = 149.98
  if (!data.deliveryDate) data.deliveryDate = "2024-12-07"
  return data;
}

export default orderRoute;
