import { Hono } from '@hono/hono';
import MeetingRoomService from '../services/meetingRoomService.ts';
import { Env } from '../types.ts';

function meetingRoomRoute(): Hono<Env> {
  const app = new Hono<Env>();

  app.get('/', async (c) => {
    const meetingRoomService = new MeetingRoomService(c);
    const res = await meetingRoomService.list();
    return c.json(res);
  });

  app.get('/:id', async (c) => {
    const meetingRoomService = new MeetingRoomService(c);
    const res = await meetingRoomService.getById(c.req.param('id'));
    return c.json(res);
  });

  // Implement POST, PUT, DELETE if needed

  return app;
}

export default meetingRoomRoute;
