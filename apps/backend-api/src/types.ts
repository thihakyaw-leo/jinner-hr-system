import type { EmployeeRole } from '@thihakyaw-leo/shared-types';

export type JwtPayload = {
  id: string;
  employee_code: string;
  role: EmployeeRole;
  branch_id: string;
  exp: number;
};

export type EmployeeRecord = {
  id: string;
  employee_code: string;
  branch_id: string;
  name: string;
  password_hash: string;
  role: EmployeeRole;
  status: 'active' | 'inactive';
  is_first_login: number;
};

export type AppEnv = {
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
