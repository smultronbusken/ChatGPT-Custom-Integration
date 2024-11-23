import { Hono } from '@hono/hono';
import AppointmentService from '../services/appointmentService.ts';
import { Env } from '../types.ts';

function appointmentRoute(): Hono<Env> {
  const app = new Hono<Env>();

  app.get('/', async (c) => {
    const appointmentService = new AppointmentService(c);
    const res = await appointmentService.list();
    return c.json(res);
  });

  app.get('/:id', async (c) => {
    const appointmentService = new AppointmentService(c);
    const res = await appointmentService.getById(c.req.param('id'));
    return c.json(res);
  });

  app.post('/', async (c) => {
    const appointmentService = new AppointmentService(c);
    const data = await c.req.json();

    // Validate required fields
    if (!data.roomId || !data.organizerId || !data.date || !data.startTime || !data.endTime) {
      return c.json({ error: 'Room ID, organizer ID, date, start time, and end time are required.' }, 400);
    }

    try {
      // Check for conflicts before creating
      const conflict = await appointmentService.checkAvailability(data.roomId, data.date, data.startTime, data.endTime);
      if (conflict) {
        return c.json({ error: 'The meeting room is not available at the requested time.' }, 409);
      }

      const res = await appointmentService.create(data);
      return c.json(res, 201);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return c.json({ error: 'Failed to create appointment.' }, 500);
    }
  });

  app.delete('/:id', async (c) => {
    const appointmentService = new AppointmentService(c);
    try {
      await appointmentService.delete(c.req.param('id'));
      return c.json({ message: 'Appointment cancelled successfully.' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return c.json({ error: 'Failed to cancel appointment.' }, 500);
    }
  });

  return app;
}

export default appointmentRoute;
