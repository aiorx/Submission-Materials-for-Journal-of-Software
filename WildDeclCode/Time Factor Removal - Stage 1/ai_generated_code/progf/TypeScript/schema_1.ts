import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  json,
  unique,
  numeric,
} from "drizzle-orm/pg-core";

var AdapterAccount = require('next-auth/adapters').AdapterAccount;
var relations = require('drizzle-orm').relations;
var sql = require('drizzle-orm').sql;

const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);

const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(function () { return crypto.randomUUID(); }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  bio: text("bio").notNull().default(""),
  createdAt: timestamp("createdAt", { mode: "date" })
    .default(sql"NOW()")
    .notNull(),
  customFile: boolean("customImage").default(false),
  userImage: json("customUserImage"),
});

const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(function () { return users.id; }, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  function (account) { return ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }); });

const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  function (verificationToken) { return ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }); });

const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(function () { return users.id; }, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  function (authenticator) { return ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }); });

const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(function () { return users.id; }, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

const organizations = pgTable("organizations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(function () { return crypto.randomUUID(); }),
  name: text("name").notNull(),
  thumbnail: json("thumbnail"),
  createdAt: timestamp("createdOn", { mode: "date" })
    .notNull()
    .default(sql"NOW()"),
  creator: text("creatorId")
    .notNull()
    .references(function () { return users.id; }, { onDelete: "cascade" }),
  images: json("images"),
  email: text("email"),
  address: text("address"),
  phoneNumber: text("phoneNumber"),
  bio: text("bio"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
});

const skills = pgTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(function () { return crypto.randomUUID(); }),
  name: text("name").notNull(),
  iconUrl: text("iconUrl").notNull(),
});

const listings = pgTable("listings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(function () { return crypto.randomUUID(); }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  organizationId: text("organization")
    .notNull()
    .references(function () { return organizations.id; }, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .default(sql"NOW()")
    .notNull(),
  address: text("address"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
});

const conversationsToUsers = pgTable(
  "conversations_to_users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(function () { return crypto.randomUUID(); }),
    conversationId: text("conversationId").references(function () { return conversations.id; }, {
      onDelete: "cascade",
    }),
    userId: text("userId").references(function () { return users.id; }, {
      onDelete: "cascade",
    }),
    organizationId: text("organizationId").references(function () { return organizations.id; }, {
      onDelete: "cascade",
    }),
  },
  function (t) { return ({
    unq: unique().on(t.conversationId, t.userId),
    unq2: unique().on(t.conversationId, t.organizationId),
  }); });

const conversations = pgTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(function () { return crypto.randomUUID(); }),
  subject: text("subject"),
});

//Assisted with basic coding tools, prompt: How would I create a messenger that allows users to send pictures back and forth? Is there a way I can store messages inside of a postgres table using drizzle to allow text or pictures or is there another way I can do this? Should I store html inside of my table?

const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(function () { return crypto.randomUUID(); }),
  content: json("content"), // Text content of the message (nullable if sending an image)
  messageType: integer("messageType").notNull(), // 0 for text, 1 for images
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .default(sql"NOW()"), // Timestamp
  conversationId: text("conversation_id").references(function () { return conversations.id; }, {
    onDelete: "cascade",
  }),
  senderId: text("sender_user_id").references(function () { return users.id; }),
  senderOrganizationId: text("sender_organization_id").references(
    function () { return organizations.id; }),
});

const skillsToListings = pgTable(
  "listings_skills",
  {
    skillId: text("skill_id")
      .notNull()
      .references(function () { return skills.id; }, { onDelete: "cascade" }),
    listingId: text("listingId")
      .notNull()
      .references(function () { return listings.id; }, { onDelete: "cascade" }),
  },
  function (table) { return ({
    pk: primaryKey({ columns: [table.listingId, table.skillId] }),
  }); });

const skillsToUsers = pgTable(
  "volunteer_skills",
  {
    skillId: text("skill_id")
      .notNull()
      .references(function () { return skills.id; }, { onDelete: "cascade" }),
    volunteerId: text("userId")
      .notNull()
      .references(function () { return users.id; }, { onDelete: "cascade" }),
  },
  function (table) { return ({
    pk: primaryKey({ columns: [table.volunteerId, table.skillId] }),
  }); });

const listingsToUsers = pgTable(
  "listing_volunteers",
  {
    listingId: text("listing_id")
      .notNull()
      .references(function () { return listings.id; }, { onDelete: "cascade" }),
    volunteerId: text("userId")
      .notNull()
      .references(function () { return users.id; }, { onDelete: "cascade" }),
    dateSignedUp: timestamp("dateSignedUp", { mode: "date" })
      .notNull()
      .default(sql"NOW()"),
  },
  function (table) { return ({
    pk: primaryKey({ columns: [table.volunteerId, table.listingId] }),
  }); });

const conversationsRelations = relations(
  conversations,
  function ({ one, many }) { return ({
    conversations: many(conversationsToUsers),
    messages: many(messages),
  }); });

const conversationsToUsersRelations = relations(
  conversationsToUsers,
  function ({ one, many }) { return ({
    user: one(users, {
      fields: [conversationsToUsers.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [conversationsToUsers.organizationId],
      references: [organizations.id],
    }),
    conversation: one(conversations, {
      fields: [conversationsToUsers.conversationId],
      references: [conversations.id],
    }),
  }); });

const listingsToUsersRelations = relations(
  listingsToUsers,
  function ({ one }) { return ({
    volunteers: one(users, {
      fields: [listingsToUsers.volunteerId],
      references: [users.id],
    }),
    listings: one(listings, {
      fields: [listingsToUsers.listingId],
      references: [listings.id],
    }),
  }); });

const organizationsRelations = relations(
  organizations,
  function ({ many, one }) { return ({
    listings: many(listings),
    users: one(users, {
      fields: [organizations.creator],
      references: [users.id],
    }),
    conversationsToUsers: many(conversationsToUsers),
    messages: many(messages),
  }); });

const skillsRelations = relations(skills, function ({ many }) { return ({
  listings: many(skillsToListings),
  volunteers: many(skillsToUsers),
}); });

const volunteerRelations = relations(users, function ({ many }) { return ({
  skills: many(skillsToUsers),
  user_to_user_senderMessages: many(conversationsToUsers),
  organizations: many(organizations),
  listings: many(listingsToUsers),
  messages: many(messages),
  conversationsToUsers: many(conversationsToUsers),
}); });

const listingsRelations = relations(listings, function ({ many, one }) { return ({
  skills: many(skillsToListings),
  organizations: one(organizations, {
    fields: [listings.organizationId],
    references: [organizations.id],
  }),
  volunteers: many(listingsToUsers),
}); });

const messagesRelations = relations(messages, function ({ one, many }) { return ({
  senderUser: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  senderOrganization: one(organizations, {
    fields: [messages.senderOrganizationId],
    references: [organizations.id],
  }),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}); });

const skillsToListingsRelations = relations(
  skillsToListings,
  function ({ one }) { return ({
    skills: one(skills, {
      fields: [skillsToListings.skillId],
      references: [skills.id],
    }),
    listings: one(listings, {
      fields: [skillsToListings.listingId],
      references: [listings.id],
    }),
  }); });

const skillsToVolunteersRelations = relations(
  skillsToUsers,
  function ({ one }) { return ({
    skills: one(skills, {
      fields: [skillsToUsers.skillId],
      references: [skills.id],
    }),
    volunteers: one(users, {
      fields: [skillsToUsers.volunteerId],
      references: [users.id],
    }),
  }); });

export type User = typeof users.$inferSelect;
export type Organizations = typeof organizations.$inferSelect;
