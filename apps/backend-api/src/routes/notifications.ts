import { Hono } from 'hono';
import type { AppEnv } from '../types';

const notificationRoutes = new Hono<AppEnv>();

// Get notifications for logged-in user
notificationRoutes.get('/mine', async (c) => {
  const payload = c.get('jwtPayload');

  const result = await c.env.DB.prepare(
    `SELECT id, title, body, type, is_read, created_at
     FROM notifications
     WHERE employee_id = ?
     ORDER BY created_at DESC
     LIMIT 50`
  )
    .bind(payload.id)
    .all<{
      id: string;
      title: string;
      body: string;
      type: string;
      is_read: number;
      created_at: string;
    }>();

  const items = (result.results ?? []).map((n) => ({
    ...n,
    is_read: Boolean(n.is_read)
  }));

  const unread_count = items.filter((n) => !n.is_read).length;

  return c.json({ items, unread_count });
});

// Mark single notification as read
notificationRoutes.put('/:id/read', async (c) => {
  const payload = c.get('jwtPayload');
  const notifId = c.req.param('id');

  await c.env.DB.prepare(
    `UPDATE notifications SET is_read = 1 WHERE id = ? AND employee_id = ?`
  )
    .bind(notifId, payload.id)
    .run();

  return c.json({ success: true });
});

// Mark all notifications as read
notificationRoutes.put('/read-all', async (c) => {
  const payload = c.get('jwtPayload');

  await c.env.DB.prepare(
    `UPDATE notifications SET is_read = 1 WHERE employee_id = ? AND is_read = 0`
  )
    .bind(payload.id)
    .run();

  return c.json({ success: true });
});

export default notificationRoutes;
