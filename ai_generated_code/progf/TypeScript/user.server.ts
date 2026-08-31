import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import availableUsernames from "./availableUsernames";

export type { User } from "@prisma/client";

// !! All jsdocs Supported via standard GitHub programming aids

// getUserById() returns a user with the given ID
// It is used to retrieve a user by ID
// The user ID is passed into the function as a parameter
// The user ID is of type User["id"]
export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

// getUserByEmail() returns a User object if the User exists in the database, and null otherwise.
export async function getUserByEmail(username: User["username"]): Promise<User | null> {
  return prisma.user.findUnique({ where: { username } });
}

// Creates a user, throws an error if the username is not available.
// If the username is available, creates a hash of the password and stores it in the database.
// Returns a User object.
export async function createUser(username: User["username"], password: string): Promise<User> {
  if(!availableUsernames.includes(username)) {
    throw new Error("Nanai cucas");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

// This function deletes a user from the database by their email address.
// The function is used by the deleteUser function in the user controller.
export async function deleteUserByEmail(username: User["username"]): Promise<User> {
  return prisma.user.delete({ where: { username } });
}

// This function is used to verify login credentials for the user.
// It takes the username and password as parameters and returns the user if the password is valid.
// It uses bcrypt to compare the password hash stored in the database with the password hash created from the password entered by the user.
// It does not return the password hash, but returns the user object without the password hash.
export async function verifyLogin(
  username: User["username"],
  password: Password["hash"]
): Promise<User | null> {
  const userWithPassword = await prisma.user.findUnique({
    where: { username },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
