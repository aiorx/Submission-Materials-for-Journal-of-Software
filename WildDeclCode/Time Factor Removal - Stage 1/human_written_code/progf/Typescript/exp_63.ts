var Role = require('@prisma/client').Role;
var PrismaUser = require('@prisma/client').User;
require('next-auth');

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: Role | null
    }
  }

  interface User extends PrismaUser {
  }
}