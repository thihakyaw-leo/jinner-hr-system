import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './types';
import { jwtAuth } from './middleware/jwtAuth';
import authRoutes from './routes/auth';
import attendanceRoutes from './routes/attendance';
import branchRoutes from './routes/branches';
import employeeRoutes from './routes/employee';
import leaveRoutes from './routes/leave';
import liabilityRoutes from './routes/liability';
import notificationRoutes from './routes/notifications';
import payrollRoutes from './routes/payroll';
import profileRoutes from './routes/profile';
import { getAllowedOrigins } from './utils';

const app = new Hono<AppEnv>();
const protectedApi = new Hono<AppEnv>();

app.use('/api/*', async (c, next) => {
  const middleware = cors({
    origin: getAllowedOrigins(c.env),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    credentials: true
  });

  return middleware(c, next);
});

app.get('/health', (c) => c.json({ ok: true, service: 'jinner-hr-system-api' }));

app.route('/api/auth', authRoutes);

protectedApi.use('*', jwtAuth);
protectedApi.route('/attendance', attendanceRoutes);
protectedApi.route('/branches', branchRoutes);
protectedApi.route('/employees', employeeRoutes);
protectedApi.route('/leave', leaveRoutes);
protectedApi.route('/liabilities', liabilityRoutes);
protectedApi.route('/notifications', notificationRoutes);
protectedApi.route('/payroll', payrollRoutes);
protectedApi.route('/profile', profileRoutes);

app.route('/api', protectedApi);

export default app;
