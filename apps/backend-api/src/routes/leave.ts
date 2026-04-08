import { Hono } from 'hono';
import type { AppEnv } from '../types';

const leaveRoutes = new Hono<AppEnv>();

// Employee submits a leave request
leaveRoutes.post('/', async (c) => {
  const payload = c.get('jwtPayload');
  const body = await c.req.json<{
    leave_type?: string;
    start_date?: string;
    end_date?: string;
    reason?: string;
  }>();

  const leaveType = body.leave_type?.trim();
  const startDate = body.start_date?.trim();
  const endDate = body.end_date?.trim();
  const reason = body.reason?.trim() || null;

  if (!leaveType || !startDate || !endDate) {
    return c.json({ error: 'leave_type, start_date, and end_date are required.' }, 400);
  }

  const validTypes = ['annual', 'sick', 'personal', 'unpaid'];
  if (!validTypes.includes(leaveType)) {
    return c.json({ error: `leave_type must be one of: ${validTypes.join(', ')}` }, 400);
  }

  if (startDate > endDate) {
    return c.json({ error: 'start_date must be before or equal to end_date.' }, 400);
  }

  const id = crypto.randomUUID();

  const result = await c.env.DB.prepare(
    `INSERT INTO leave_requests (id, employee_id, leave_type, start_date, end_date, reason)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(id, payload.id, leaveType, startDate, endDate, reason)
    .run();

  if (!result.success) {
    return c.json({ error: 'Unable to submit leave request.' }, 500);
  }

  return c.json({ success: true, id }, 201);
});

// Employee gets own leave history
leaveRoutes.get('/mine', async (c) => {
  const payload = c.get('jwtPayload');

  const result = await c.env.DB.prepare(
    `SELECT id, leave_type, start_date, end_date, reason, status, reviewed_by, reviewed_at, created_at
     FROM leave_requests
     WHERE employee_id = ?
     ORDER BY created_at DESC
     LIMIT 50`
  )
    .bind(payload.id)
    .all<{
      id: string;
      leave_type: string;
      start_date: string;
      end_date: string;
      reason: string | null;
      status: string;
      reviewed_by: string | null;
      reviewed_at: string | null;
      created_at: string;
    }>();

  return c.json({ items: result.results ?? [] });
});

// Admin/Manager lists all pending leave requests
leaveRoutes.get('/', async (c) => {
  const actor = c.get('jwtPayload');

  if (actor.role !== 'owner' && actor.role !== 'manager') {
    return c.json({ error: 'Only owners and managers can view all leave requests.' }, 403);
  }

  const statusFilter = c.req.query('status') ?? 'pending';

  const result = await c.env.DB.prepare(
    `SELECT lr.id, lr.employee_id, lr.leave_type, lr.start_date, lr.end_date, lr.reason,
            lr.status, lr.created_at, e.name AS employee_name, e.employee_code
     FROM leave_requests lr
     JOIN employees e ON e.id = lr.employee_id
     WHERE lr.status = ?
     ORDER BY lr.created_at DESC
     LIMIT 100`
  )
    .bind(statusFilter)
    .all();

  return c.json({ items: result.results ?? [] });
});

// Admin/Manager approves or rejects a leave request
leaveRoutes.put('/:id/review', async (c) => {
  const actor = c.get('jwtPayload');

  if (actor.role !== 'owner' && actor.role !== 'manager') {
    return c.json({ error: 'Only owners and managers can review leave requests.' }, 403);
  }

  const leaveId = c.req.param('id');
  const body = await c.req.json<{ status?: string }>();
  const newStatus = body.status?.trim();

  if (!newStatus || !['approved', 'rejected'].includes(newStatus)) {
    return c.json({ error: 'status must be "approved" or "rejected".' }, 400);
  }

  const existing = await c.env.DB.prepare(
    'SELECT id, employee_id, status FROM leave_requests WHERE id = ? LIMIT 1'
  )
    .bind(leaveId)
    .first<{ id: string; employee_id: string; status: string }>();

  if (!existing) {
    return c.json({ error: 'Leave request not found.' }, 404);
  }

  if (existing.status !== 'pending') {
    return c.json({ error: 'This leave request has already been reviewed.' }, 409);
  }

  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `UPDATE leave_requests SET status = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?`
  )
    .bind(newStatus, actor.id, now, leaveId)
    .run();

  // Create notification for the employee
  const notifTitle = newStatus === 'approved' ? 'Leave Approved' : 'Leave Rejected';
  const notifBody = newStatus === 'approved'
    ? 'Your leave request has been approved.'
    : 'Your leave request has been rejected.';
  const notifType = newStatus === 'approved' ? 'success' : 'warning';

  await c.env.DB.prepare(
    `INSERT INTO notifications (id, employee_id, title, body, type) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(crypto.randomUUID(), existing.employee_id, notifTitle, notifBody, notifType)
    .run();

  return c.json({ success: true, status: newStatus });
});

leaveRoutes.delete('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner') {
    return c.json({ error: 'Only owners can delete leave requests.' }, 403);
  }

  const result = await c.env.DB.prepare('DELETE FROM leave_requests WHERE id = ?').bind(id).run();

  if (!result.success) {
    return c.json({ error: 'Unable to delete leave request.' }, 500);
  }

  return c.json({ success: true, message: 'Leave request deleted successfully.' });
});

export default leaveRoutes;
