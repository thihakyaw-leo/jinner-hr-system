import { Hono } from 'hono';
import type { AppEnv } from '../types';

const branchRoutes = new Hono<AppEnv>();

branchRoutes.get('/', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT id, name, address
     FROM branches
     ORDER BY name ASC`
  ).all<{
    id: string;
    name: string;
    address: string;
  }>();

  return c.json({
    items: result.results ?? []
  });
});

branchRoutes.put('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner') {
    return c.json({ error: 'Only owners can edit branches.' }, 403);
  }

  const body = await c.req.json<{ name?: string; address?: string }>();

  if (!body.name && !body.address) {
    return c.json({ error: 'Provide name or address to update.' }, 400);
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (body.name) {
    updates.push('name = ?');
    params.push(body.name);
  }
  if (body.address) {
    updates.push('address = ?');
    params.push(body.address);
  }

  params.push(id);
  const result = await c.env.DB.prepare(`UPDATE branches SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run();

  if (!result.success) {
    return c.json({ error: 'Unable to update branch.' }, 500);
  }

  return c.json({ success: true, message: 'Branch updated successfully.' });
});

branchRoutes.delete('/:id', async (c) => {
  const actor = c.get('jwtPayload');
  const id = c.req.param('id');

  if (actor.role !== 'owner') {
    return c.json({ error: 'Only owners can delete branches.' }, 403);
  }

  const result = await c.env.DB.prepare('DELETE FROM branches WHERE id = ?').bind(id).run();

  if (!result.success) {
    return c.json({ error: 'Unable to delete branch.' }, 500);
  }

  return c.json({ success: true, message: 'Branch deleted successfully.' });
});

export default branchRoutes;
