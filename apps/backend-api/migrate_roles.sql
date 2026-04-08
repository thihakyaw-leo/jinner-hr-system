-- Migration to update existing roles to the new system
UPDATE employees SET role = 'owner' WHERE role = 'admin';
UPDATE employees SET role = 'sales' WHERE role = 'staff';
