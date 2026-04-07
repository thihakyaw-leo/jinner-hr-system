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

export default liabilityRoutes;
