import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
