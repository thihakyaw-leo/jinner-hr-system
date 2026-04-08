import { Hono } from 'hono';
import type { AppEnv } from '../types';

const liabilityRoutes = new Hono<AppEnv>();

liabilityRoutes.get('/mine', async (c) => {
  const payload = c.get('jwtPayload');

  const result = await c.env.DB.prepare(
    `SELECT id, total_amount, remaining_balance, reason_type, description, status, created_at
     FROM liabilities
     WHERE employee_id = ?
     ORDER BY created_at DESC`
  )
    .bind(payload.id)
    .all<{
      id: string;
      total_amount: number;
      remaining_balance: number;
      reason_type: string;
      description: string | null;
      status: string;
      created_at: string;
    }>();

  const items = result.results ?? [];
  const outstanding = items.reduce((sum, item) => sum + item.remaining_balance, 0);

  return c.json({ items, outstanding });
});

liabilityRoutes.post('/create', async (c) => {
  const body = await c.req.json<{
    employee_id?: string;
    amount?: number;
    reason_type?: string;
    description?: string;
  }>();

  const employeeId = body.employee_id?.trim();
  const amount = Number(body.amount);
  const reasonType = body.reason_type?.trim();
  const description = body.description?.trim() || null;

  if (!employeeId || !reasonType || Number.isNaN(amount) || amount <= 0) {
    return c.json({ error: 'employee_id, amount, and reason_type are required.' }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO liabilities (
      id,
      employee_id,
      total_amount,
      remaining_balance,
      reason_type,
      description,
      status,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)`
  )
    .bind(crypto.randomUUID(), employeeId, amount, amount, reasonType, description)
    .run();

  return c.json({ success: result.success }, 201);
});

liabilityRoutes.put('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner' && actor.role !== 'manager') {
    return c.json({ error: 'Only owners and managers can edit liabilities.' }, 403);
  }

  const body = await c.req.json<{
    total_amount?: number;
    remaining_balance?: number;
    status?: 'active' | 'cleared';
    description?: string;
  }>();

  const updates: string[] = [];
  const params: any[] = [];

  if (body.total_amount !== undefined) {
    updates.push('total_amount = ?');
    params.push(body.total_amount);
  }
  if (body.remaining_balance !== undefined) {
    updates.push('remaining_balance = ?');
    params.push(body.remaining_balance);
  }
  if (body.status) {
    updates.push('status = ?');
    params.push(body.status);
  }
  if (body.description) {
    updates.push('description = ?');
    params.push(body.description);
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields provided for update.' }, 400);
  }

  params.push(id);
  const query = `UPDATE liabilities SET ${updates.join(', ')} WHERE id = ?`;
  const result = await c.env.DB.prepare(query).bind(...params).run();

  if (!result.success) {
    return c.json({ error: 'Unable to update liability.' }, 500);
  }

  return c.json({ success: true, message: 'Liability updated successfully.' });
});

liabilityRoutes.delete('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner') {
    return c.json({ error: 'Only owners can delete liabilities.' }, 403);
  }

  const result = await c.env.DB.prepare('DELETE FROM liabilities WHERE id = ?').bind(id).run();

  if (!result.success) {
    return c.json({ error: 'Unable to delete liability.' }, 500);
  }

  return c.json({ success: true, message: 'Liability deleted successfully.' });
});

export default liabilityRoutes;
