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

export default branchRoutes;
