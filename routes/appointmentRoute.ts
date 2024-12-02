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
    let data = await c.req.json();

    data = setDefaultValues(data)

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


function setDefaultValues(data: any) {
  if (!data.id) data.id = "appt00000000099"
  if (!data.roomId) data.roomId = "room00000000001"
  if (!data.organizerId) data.organizerId = "organizer_1"
  if (!data.attendees) data.attendees = ["employee_1", "emplotee_2"]
  if (!data.purpose) data.purpose = "Purpose"
  if (!data.date) data.date = "2023-12-02"
  if (!data.startTime) data.startTime = "2024-12-02T10:00:00Z"
  if (!data.endTime) data.endTime = "2024-12-02T12:00:00Z"
  return data;
}


export default appointmentRoute;
