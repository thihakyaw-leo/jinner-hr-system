import { Hono } from 'hono';
import type { AppEnv } from '../types';

const attendanceRoutes = new Hono<AppEnv>();

attendanceRoutes.post('/check-in', async (c) => {
  const payload = c.get('jwtPayload');
  const now = new Date();
  const timestamp = now.toISOString();
  const workDate = timestamp.slice(0, 10);

  const existing = await c.env.DB.prepare(
    `SELECT id
     FROM attendance
     WHERE employee_id = ? AND work_date = ?
     LIMIT 1`
  )
    .bind(payload.id, workDate)
    .first<{ id: string }>();

  if (existing) {
    return c.json({ error: 'Employee already checked in for today.' }, 409);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO attendance (
      id,
      employee_id,
      check_in,
      work_date,
      status,
      created_at
    ) VALUES (?, ?, ?, ?, 'present', CURRENT_TIMESTAMP)`
  )
    .bind(crypto.randomUUID(), payload.id, timestamp, workDate)
    .run();

  return c.json({ success: result.success, checked_in_at: timestamp, work_date: workDate }, 201);
});

export default attendanceRoutes;
