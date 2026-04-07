export type EmployeeRole = 'admin' | 'manager' | 'staff';
export type EmployeeStatus = 'active' | 'inactive';

export type AuthUser = {
  id: string;
  employee_code: string;
  name: string;
  role: EmployeeRole;
  branch_id: string;
  is_first_login: boolean;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type DashboardMetric = {
  label: string;
  value: string;
  tone: 'emerald' | 'sky' | 'amber' | 'rose';
};
