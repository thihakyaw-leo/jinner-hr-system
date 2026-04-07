import type { EmployeeRole } from '@thihakyaw-leo/shared-types';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';

type JwtPayload = {
  id: string;
  employee_code: string;
  role: EmployeeRole;
  branch_id: string;
  exp: number;
};

type EmployeeRecord = {
  id: string;
  employee_code: string;
  branch_id: string;
  name: string;
  password_hash: string;
  role: EmployeeRole;
  status: 'active' | 'inactive';
  is_first_login: number;
};

type AppEnv = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
    ADMIN_DESKTOP_ORIGIN?: string;
    EMPLOYEE_PWA_ORIGIN?: string;
  };
  Variables: {
    jwtPayload: JwtPayload;
  };
};

const app = new Hono<AppEnv>();

const getAllowedOrigins = (env: AppEnv['Bindings']) => {
  const origins = new Set([
    'http://localhost:1420',
    'http://127.0.0.1:1420',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'tauri://localhost'
  ]);

  if (env.ADMIN_DESKTOP_ORIGIN) {
    origins.add(env.ADMIN_DESKTOP_ORIGIN);
  }

  if (env.EMPLOYEE_PWA_ORIGIN) {
    origins.add(env.EMPLOYEE_PWA_ORIGIN);
  }

  return [...origins];
};

const hashPassword = async (password: string) => {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buffer), (value) => value.toString(16).padStart(2, '0')).join('');
};

app.use('/api/*', async (c, next) => {
  const middleware = cors({
    origin: getAllowedOrigins(c.env),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  });

  return middleware(c, next);
});

app.get('/health', (c) => c.json({ ok: true, service: 'jinner-hr-system-api' }));

app.post('/api/auth/login', async (c) => {
  const body = await c.req.json<{ employee_code?: string; password?: string }>();
  const employeeCode = body.employee_code?.trim();
  const password = body.password ?? '';

  if (!employeeCode || !password) {
    return c.json({ error: 'employee_code and password are required.' }, 400);
  }

  const employee = await c.env.DB.prepare(
    `SELECT id, employee_code, branch_id, name, password_hash, role, status, is_first_login
     FROM employees
     WHERE employee_code = ?
     LIMIT 1`
  )
    .bind(employeeCode)
    .first<EmployeeRecord>();

  if (!employee || employee.status !== 'active') {
    return c.json({ error: 'Invalid credentials.' }, 401);
  }

  const incomingPasswordHash = await hashPassword(password);

  if (incomingPasswordHash !== employee.password_hash) {
    return c.json({ error: 'Invalid credentials.' }, 401);
  }

  const token = await sign(
    {
      id: employee.id,
      employee_code: employee.employee_code,
      role: employee.role,
      branch_id: employee.branch_id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
    },
    c.env.JWT_SECRET
  );

  return c.json({
    token,
    user: {
      id: employee.id,
      employee_code: employee.employee_code,
      name: employee.name,
      role: employee.role,
      branch_id: employee.branch_id,
      is_first_login: Boolean(employee.is_first_login)
    }
  });
});

const protectedApi = new Hono<AppEnv>();

protectedApi.use('*', async (c, next) => {
  const middleware = jwt({ secret: c.env.JWT_SECRET, alg: 'HS256' });
  return middleware(c, next);
});

protectedApi.post('/liabilities/create', async (c) => {
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

protectedApi.post('/attendance/check-in', async (c) => {
  const payload = c.get('jwtPayload');
  const now = new Date();
  const timestamp = now.toISOString();
  const workDate = timestamp.slice(0, 10);

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

  return c.json({ success: result.success, checked_in_at: timestamp }, 201);
});

app.route('/api', protectedApi);

export default app;
