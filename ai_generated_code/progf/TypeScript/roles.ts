// Supported via standard GitHub programming aids
export const roles = {
  ADMIN: 'admin',
  HOD: 'hod',
  COORDINATOR: 'coordinator',
  STUDENT: 'student'
} as const;

export type UserRole = typeof roles[keyof typeof roles];
