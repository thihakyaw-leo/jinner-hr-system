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

export type EmployeeSummary = {
  id: string;
  employee_code: string;
  name: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  branch_id: string;
  is_first_login: boolean;
  created_at: string;
};

export type BranchSummary = {
  id: string;
  name: string;
  address: string;
};

export type CreateEmployeeInput = {
  employee_code: string;
  name: string;
  password: string;
  role: EmployeeRole;
  branch_id: string;
  status?: EmployeeStatus;
  is_first_login?: boolean;
};

export type LiabilitySummary = {
  id: string;
  total_amount: number;
  remaining_balance: number;
  reason_type: string;
  description: string | null;
  status: string;
  created_at: string;
};

export type PayrollSummary = {
  id: string;
  month: number;
  year: number;
  basic_salary: number;
  total_deductions: number;
  net_pay: number;
  status: string;
  created_at: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  tone: 'emerald' | 'sky' | 'amber' | 'rose';
};
