import { Hono } from 'hono';
import type { AppEnv } from '../types';

const payrollRoutes = new Hono<AppEnv>();

payrollRoutes.get('/mine/latest', async (c) => {
  const payload = c.get('jwtPayload');

  const item = await c.env.DB.prepare(
    `SELECT id, month, year, basic_salary, total_deductions, net_pay, status, created_at
     FROM payroll
     WHERE employee_id = ?
     ORDER BY year DESC, month DESC
     LIMIT 1`
  )
    .bind(payload.id)
    .first<{
      id: string;
      month: number;
      year: number;
      basic_salary: number;
      total_deductions: number;
      net_pay: number;
      status: string;
      created_at: string;
    }>();

  return c.json({ item: item ?? null });
});

payrollRoutes.delete('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner') {
    return c.json({ error: 'Only owners can delete payroll records.' }, 403);
  }

  const result = await c.env.DB.prepare('DELETE FROM payroll WHERE id = ?').bind(id).run();

  if (!result.success) {
    return c.json({ error: 'Unable to delete payroll record.' }, 500);
  }

  return c.json({ success: true, message: 'Payroll record deleted successfully.' });
});

export default payrollRoutes;
