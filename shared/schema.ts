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

// 여론조사 관련 테이블들
export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const surveyQuestions = pgTable("survey_questions", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // 'single', 'multiple', 'text', 'conditional'
  options: jsonb("options"), // 선택지 배열
  conditions: jsonb("conditions"), // 조건부 질문 설정
  orderIndex: integer("order_index").notNull(),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveys.id),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  district: text("district"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveyAnswers = pgTable("survey_answers", {
  id: serial("id").primaryKey(),
  responseId: integer("response_id").references(() => surveyResponses.id),
  questionId: integer("question_id").references(() => surveyQuestions.id),
  answerValue: text("answer_value"), // 단일 답변 또는 텍스트 답변
  selectedOptions: jsonb("selected_options"), // 복수 선택 답변
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

// 여론조사 Relations
export const surveysRelations = relations(surveys, ({ many }) => ({
  questions: many(surveyQuestions),
  responses: many(surveyResponses),
}));

export const surveyQuestionsRelations = relations(surveyQuestions, ({ one, many }) => ({
  survey: one(surveys, {
    fields: [surveyQuestions.surveyId],
    references: [surveys.id],
  }),
  answers: many(surveyAnswers),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({ one, many }) => ({
  survey: one(surveys, {
    fields: [surveyResponses.surveyId],
    references: [surveys.id],
  }),
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
  }),
  answers: many(surveyAnswers),
}));

export const surveyAnswersRelations = relations(surveyAnswers, ({ one }) => ({
  response: one(surveyResponses, {
    fields: [surveyAnswers.responseId],
    references: [surveyResponses.id],
  }),
  question: one(surveyQuestions, {
    fields: [surveyAnswers.questionId],
    references: [surveyQuestions.id],
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

// 여론조사 Insert schemas
export const insertSurveySchema = createInsertSchema(surveys).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSurveyQuestionSchema = createInsertSchema(surveyQuestions).omit({ id: true, createdAt: true });
export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({ id: true, createdAt: true });
export const insertSurveyAnswerSchema = createInsertSchema(surveyAnswers).omit({ id: true, createdAt: true });

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

// 여론조사 types
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type SurveyQuestion = typeof surveyQuestions.$inferSelect;
export type InsertSurveyQuestion = z.infer<typeof insertSurveyQuestionSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyAnswer = typeof surveyAnswers.$inferSelect;
export type InsertSurveyAnswer = z.infer<typeof insertSurveyAnswerSchema>;
