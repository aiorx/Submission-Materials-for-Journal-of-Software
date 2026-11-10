// Supported via standard GitHub programming aids
var roles = {
  ADMIN: 'admin',
  HOD: 'hod',
  COORDINATOR: 'coordinator',
  STUDENT: 'student'
};

export type UserRole = typeof roles[keyof typeof roles];
