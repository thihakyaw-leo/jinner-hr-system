PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO branches (id, name, address)
VALUES
  ('branch-yangon', 'Yangon HQ', 'No. 12, Merchant Road, Yangon'),
  ('branch-mandalay', 'Mandalay Office', '73rd Street, Chan Aye Tharzan, Mandalay');

INSERT OR IGNORE INTO employees (
  id,
  employee_code,
  branch_id,
  name,
  password_hash,
  role,
  status,
  is_first_login,
  created_at,
  updated_at
)
VALUES
  (
    'emp-admin-001',
    'JNR-001',
    'branch-yangon',
    'Admin User',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'owner',
    'active',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'emp-manager-001',
    'JNR-002',
    'branch-yangon',
    'Manager User',
    '866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5',
    'manager',
    'active',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'emp-staff-001',
    'EMP-001',
    'branch-mandalay',
    'Staff User',
    '10176e7b7b24d317acfcf8d2064cfd2f24e154f7b5a96603077d5ef813d6a6b6',
    'sales',
    'active',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

INSERT OR IGNORE INTO liabilities (
  id,
  employee_id,
  total_amount,
  remaining_balance,
  reason_type,
  description,
  status,
  created_at
)
VALUES
  (
    'liability-001',
    'emp-staff-001',
    50000,
    20000,
    'loan',
    'Emergency salary advance',
    'active',
    CURRENT_TIMESTAMP
  );

INSERT OR IGNORE INTO payroll (
  id,
  employee_id,
  month,
  year,
  basic_salary,
  total_deductions,
  net_pay,
  status,
  created_at
)
VALUES
  (
    'payroll-001',
    'emp-staff-001',
    4,
    2026,
    450000,
    50000,
    400000,
    'processed',
    CURRENT_TIMESTAMP
  );
