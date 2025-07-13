import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Jin-an County administrative districts
export const jinanDistricts = [
  '진안읍',
  '마령면',
  '부귀면',
  '정천면',
  '용담면',
  '백운면',
  '주천면',
  '동향면',
  '안천면',
  '성수면',
  '상전면'
] as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  district: text("district").notNull().default('진안읍'), // Jin-an County administrative district
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").notNull().default('admin'), // admin, super_admin
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Signatures table
export const signatures = pgTable("signatures", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Policy categories enum
export const policyCategories = [
  'welfare', 'economy', 'agriculture', 'infrastructure', 
  'tourism', 'population', 'administration', 'ai', 
  'committee', 'allowance'
] as const;

// Policies table
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  supportCount: integer("support_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Policy supports table (for tracking who supported what)
export const policySupports = pgTable("policy_supports", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").notNull().references(() => policies.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notices table
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default('general'), // urgent, general, success
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // document, news, video
  url: text("url"),
  description: text("description"),
  metadata: jsonb("metadata"), // For storing additional info like file size, source, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Website content management table
export const webContent = pgTable("web_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // hero, motivation, footer, etc.
  key: text("key").notNull(), // specific content identifier
  title: text("title"),
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // additional properties like styling, order, etc.
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  signatures: many(signatures),
  policies: many(policies),
  policySupports: many(policySupports),
}));

export const signaturesRelations = relations(signatures, ({ one }) => ({
  user: one(users, {
    fields: [signatures.userId],
    references: [users.id],
  }),
}));

export const policiesRelations = relations(policies, ({ one, many }) => ({
  author: one(users, {
    fields: [policies.authorId],
    references: [users.id],
  }),
  supports: many(policySupports),
}));

export const policySupportsRelations = relations(policySupports, ({ one }) => ({
  policy: one(policies, {
    fields: [policySupports.policyId],
    references: [policies.id],
  }),
  user: one(users, {
    fields: [policySupports.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSignatureSchema = createInsertSchema(signatures).omit({ id: true, createdAt: true });
export const insertPolicySchema = createInsertSchema(policies).omit({ id: true, createdAt: true, supportCount: true });
export const insertPolicySupportSchema = createInsertSchema(policySupports).omit({ id: true, createdAt: true });
export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true, createdAt: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true, lastLogin: true });
export const insertWebContentSchema = createInsertSchema(webContent).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Signature = typeof signatures.$inferSelect;
export type InsertSignature = z.infer<typeof insertSignatureSchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type PolicySupport = typeof policySupports.$inferSelect;
export type InsertPolicySupport = z.infer<typeof insertPolicySupportSchema>;
export type Notice = typeof notices.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type WebContent = typeof webContent.$inferSelect;
export type InsertWebContent = z.infer<typeof insertWebContentSchema>;
