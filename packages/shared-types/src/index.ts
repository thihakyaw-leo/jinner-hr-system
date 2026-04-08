export type EmployeeRole = 'owner' | 'manager' | 'cashier' | 'sales';
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
  basic_salary: number;
  is_first_login: boolean;
  created_at: string;
};

export type EmployeeProfile = {
  id: string;
  employee_code: string;
  name: string;
  role: EmployeeRole;
  branch_id: string;
  phone: string | null;
  address: string | null;
  email: string | null;
  basic_salary: number;
  status: EmployeeStatus;
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
  basic_salary: number;
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

export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  // Joined fields (optional)
  employee_name?: string;
  employee_code?: string;
};

export type AttendanceRecord = {
  id: string;
  check_in: string;
  check_out: string | null;
  work_date: string;
  status: string;
  created_at: string;
};

export type AttendanceSummary = {
  total: number;
  present: number;
  rate: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  is_read: boolean;
  created_at: string;
};
