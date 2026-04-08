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

attendanceRoutes.post('/check-out', async (c) => {
  const payload = c.get('jwtPayload');
  const now = new Date();
  const timestamp = now.toISOString();

  // Find the latest record for today that hasn't been checked out
  const latest = await c.env.DB.prepare(
    `SELECT id 
     FROM attendance 
     WHERE employee_id = ? AND check_out IS NULL 
     ORDER BY check_in DESC 
     LIMIT 1`
  )
    .bind(payload.id)
    .first<{ id: string }>();

  if (!latest) {
    return c.json({ error: 'No active session found to check out.' }, 404);
  }

  const result = await c.env.DB.prepare(
    `UPDATE attendance 
     SET check_out = ? 
     WHERE id = ?`
  )
    .bind(timestamp, latest.id)
    .run();

  return c.json({ success: result.success, checked_out_at: timestamp });
});

// Get attendance history for logged-in employee
attendanceRoutes.get('/mine', async (c) => {
  const payload = c.get('jwtPayload');
  const month = c.req.query('month');
  const year = c.req.query('year');

  let query: string;
  let bindings: (string | number)[];

  if (month && year) {
    // Filter by specific month/year
    const monthPadded = String(month).padStart(2, '0');
    const prefix = `${year}-${monthPadded}`;
    query = `SELECT id, check_in, check_out, work_date, status, created_at
             FROM attendance
             WHERE employee_id = ? AND work_date LIKE ?
             ORDER BY work_date DESC
             LIMIT 100`;
    bindings = [payload.id, `${prefix}%`];
  } else {
    // Default: last 30 days
    query = `SELECT id, check_in, check_out, work_date, status, created_at
             FROM attendance
             WHERE employee_id = ? AND work_date >= DATE('now', '-30 days')
             ORDER BY work_date DESC
             LIMIT 100`;
    bindings = [payload.id];
  }

  const result = await c.env.DB.prepare(query).bind(...bindings).all<{
    id: string;
    check_in: string;
    check_out: string | null;
    work_date: string;
    status: string;
    created_at: string;
  }>();

  const items = result.results ?? [];
  const presentCount = items.filter((r) => r.status === 'present').length;

  return c.json({
    items,
    summary: {
      total: items.length,
      present: presentCount,
      rate: items.length > 0 ? Math.round((presentCount / items.length) * 100) : 0
    }
  });
});

export default attendanceRoutes;
