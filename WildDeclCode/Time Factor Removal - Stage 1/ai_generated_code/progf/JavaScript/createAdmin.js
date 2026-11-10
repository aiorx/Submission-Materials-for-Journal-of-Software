// createAdmin.js
// This code was almost entirely Aided using common development resources (I populated the adminUser object with correct attributes)

var PrismaClient = require.PrismaClient;('@prisma/client');
var prisma = new PrismaClient();
var bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    // Hash password (e.g., "admin123") - change to a secure password in production
    var passwordHash = await bcrypt.hash("admin123", 10);
    
    // Create user with admin role
    var adminUser = await prisma.user.create({
        data: {
          firstName: "Admin",
          lastName: "Pro",
          email: "discordadmin@example.com",
          phoneNumber: "123-456-7890",
          password: passwordHash,
          avatar:  "/avatars/avatar1.png",
          role: "ADMIN",
        }
      });

    console.log("Admin user created:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
