import { 
  users, signatures, policies, policySupports, notices, resources, adminUsers, webContent,
  surveys, surveyQuestions, surveyResponses, surveyAnswers,
  type User, type InsertUser, type Signature, type InsertSignature,
  type Policy, type InsertPolicy, type PolicySupport, type InsertPolicySupport,
  type Notice, type InsertNotice, type Resource, type InsertResource,
  type AdminUser, type InsertAdminUser, type WebContent, type InsertWebContent,
  type Survey, type InsertSurvey, type SurveyQuestion, type InsertSurveyQuestion,
  type SurveyResponse, type InsertSurveyResponse, type SurveyAnswer, type InsertSurveyAnswer
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Signatures
  getSignatureByUserId(userId: number): Promise<Signature | undefined>;
  createSignature(signature: InsertSignature): Promise<Signature>;
  getSignatureCount(): Promise<number>;

  // Policies
  getPolicies(category?: string): Promise<Policy[]>;
  getPolicy(id: number): Promise<Policy | undefined>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  supportPolicy(policyId: number, userId: number): Promise<boolean>;
  getUserPolicySupport(policyId: number, userId: number): Promise<PolicySupport | undefined>;
  incrementPolicySupport(policyId: number): Promise<void>;

  // Notices
  getNotices(): Promise<Notice[]>;
  createNotice(notice: InsertNotice): Promise<Notice>;

  // Resources
  getResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Statistics
  getStats(): Promise<{
    signatureCount: number;
    policyCount: number;
    supportCount: number;
    userCount: number;
  }>;

  // Admin Operations
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(id: number): Promise<void>;
  
  // Admin CRUD for entities
  updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice>;
  deleteNotice(id: number): Promise<void>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource>;
  deleteResource(id: number): Promise<void>;
  updatePolicy(id: number, policy: Partial<InsertPolicy>): Promise<Policy>;
  deletePolicy(id: number): Promise<void>;

  // Web Content Management
  getWebContent(section?: string): Promise<WebContent[]>;
  getWebContentByKey(section: string, key: string): Promise<WebContent | undefined>;
  createWebContent(content: InsertWebContent): Promise<WebContent>;
  updateWebContent(id: number, content: Partial<InsertWebContent>): Promise<WebContent>;
  deleteWebContent(id: number): Promise<void>;

  // Survey Management
  getSurveys(): Promise<Survey[]>;
  getActiveSurvey(): Promise<Survey | undefined>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  updateSurvey(id: number, survey: Partial<InsertSurvey>): Promise<Survey>;
  deleteSurvey(id: number): Promise<void>;

  // Survey Questions
  getSurveyQuestions(surveyId: number): Promise<SurveyQuestion[]>;
  createSurveyQuestion(question: InsertSurveyQuestion): Promise<SurveyQuestion>;
  updateSurveyQuestion(id: number, question: Partial<InsertSurveyQuestion>): Promise<SurveyQuestion>;
  deleteSurveyQuestion(id: number): Promise<void>;

  // Survey Responses
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponses(surveyId: number): Promise<SurveyResponse[]>;
  createSurveyAnswer(answer: InsertSurveyAnswer): Promise<SurveyAnswer>;
  checkUserSurveyResponse(surveyId: number, userId: number): Promise<boolean>;
  deleteUserSurveyResponse(surveyId: number, userId: number): Promise<void>;
  
  // Survey Analytics
  getSurveyResults(surveyId: number): Promise<{
    totalResponses: number;
    participationRate: number;
    averageTime: number;
    questionResults: Array<{
      questionId: number;
      questionText: string;
      responses: Array<{ value: string; count: number; percentage: number }>;
    }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSignatureByUserId(userId: number): Promise<Signature | undefined> {
    const [signature] = await db.select().from(signatures).where(eq(signatures.userId, userId));
    return signature || undefined;
  }

  async createSignature(insertSignature: InsertSignature): Promise<Signature> {
    const [signature] = await db
      .insert(signatures)
      .values(insertSignature)
      .returning();
    return signature;
  }

  async getSignatureCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(signatures);
    return result[0].count;
  }

  async getPolicies(category?: string): Promise<Policy[]> {
    if (category && category !== 'all') {
      return await db.select().from(policies)
        .where(eq(policies.category, category))
        .orderBy(desc(policies.createdAt));
    }
    
    return await db.select().from(policies).orderBy(desc(policies.createdAt));
  }

  async getPolicy(id: number): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy || undefined;
  }

  async createPolicy(insertPolicy: InsertPolicy): Promise<Policy> {
    const [policy] = await db
      .insert(policies)
      .values(insertPolicy)
      .returning();
    return policy;
  }

  async supportPolicy(policyId: number, userId: number): Promise<boolean> {
    // Check if user already supported this policy
    const existingSupport = await this.getUserPolicySupport(policyId, userId);
    if (existingSupport) {
      return false; // Already supported
    }

    // Create support record
    await db.insert(policySupports).values({ policyId, userId });
    
    // Increment support count
    await this.incrementPolicySupport(policyId);
    
    return true;
  }

  async getUserPolicySupport(policyId: number, userId: number): Promise<PolicySupport | undefined> {
    const [support] = await db
      .select()
      .from(policySupports)
      .where(and(eq(policySupports.policyId, policyId), eq(policySupports.userId, userId)));
    return support || undefined;
  }

  async incrementPolicySupport(policyId: number): Promise<void> {
    await db
      .update(policies)
      .set({ supportCount: sql`${policies.supportCount} + 1` })
      .where(eq(policies.id, policyId));
  }

  async getNotices(): Promise<Notice[]> {
    return await db.select().from(notices).orderBy(desc(notices.createdAt));
  }

  async createNotice(insertNotice: InsertNotice): Promise<Notice> {
    const [notice] = await db
      .insert(notices)
      .values(insertNotice)
      .returning();
    return notice;
  }

  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(insertResource)
      .returning();
    return resource;
  }

  async getStats(): Promise<{
    signatureCount: number;
    policyCount: number;
    supportCount: number;
    userCount: number;
  }> {
    const [signatureCount] = await db.select({ count: count() }).from(signatures);
    const [policyCount] = await db.select({ count: count() }).from(policies);
    const [supportCount] = await db.select({ count: count() }).from(policySupports);
    const [userCount] = await db.select({ count: count() }).from(users);

    return {
      signatureCount: signatureCount.count,
      policyCount: policyCount.count,
      supportCount: supportCount.count,
      userCount: userCount.count,
    };
  }

  // Admin Operations
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values(insertAdmin).returning();
    return admin;
  }

  async updateAdminLastLogin(id: number): Promise<void> {
    await db.update(adminUsers).set({ lastLogin: new Date() }).where(eq(adminUsers.id, id));
  }

  // Admin CRUD operations
  async updateNotice(id: number, updateData: Partial<InsertNotice>): Promise<Notice> {
    const [notice] = await db.update(notices).set(updateData).where(eq(notices.id, id)).returning();
    return notice;
  }

  async deleteNotice(id: number): Promise<void> {
    await db.delete(notices).where(eq(notices.id, id));
  }

  async updateResource(id: number, updateData: Partial<InsertResource>): Promise<Resource> {
    const [resource] = await db.update(resources).set(updateData).where(eq(resources.id, id)).returning();
    return resource;
  }

  async deleteResource(id: number): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  async updatePolicy(id: number, updateData: Partial<InsertPolicy>): Promise<Policy> {
    const [policy] = await db.update(policies).set(updateData).where(eq(policies.id, id)).returning();
    return policy;
  }

  async deletePolicy(id: number): Promise<void> {
    await db.delete(policies).where(eq(policies.id, id));
    // Also delete related supports
    await db.delete(policySupports).where(eq(policySupports.policyId, id));
  }

  // Web Content Management
  async getWebContent(section?: string): Promise<WebContent[]> {
    if (section) {
      return await db
        .select()
        .from(webContent)
        .where(and(eq(webContent.isActive, true), eq(webContent.section, section)))
        .orderBy(webContent.createdAt);
    }
    return await db
      .select()
      .from(webContent)
      .where(eq(webContent.isActive, true))
      .orderBy(webContent.section, webContent.createdAt);
  }

  async getWebContentByKey(section: string, key: string): Promise<WebContent | undefined> {
    const [content] = await db
      .select()
      .from(webContent)
      .where(and(eq(webContent.section, section), eq(webContent.key, key), eq(webContent.isActive, true)));
    return content || undefined;
  }

  async createWebContent(insertContent: InsertWebContent): Promise<WebContent> {
    const [content] = await db.insert(webContent).values(insertContent).returning();
    return content;
  }

  async updateWebContent(id: number, updateData: Partial<InsertWebContent>): Promise<WebContent> {
    const [content] = await db
      .update(webContent)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(webContent.id, id))
      .returning();
    return content;
  }

  async deleteWebContent(id: number): Promise<void> {
    await db.update(webContent).set({ isActive: false }).where(eq(webContent.id, id));
  }

  // Survey Management Implementation
  async getSurveys(): Promise<Survey[]> {
    return await db.select().from(surveys).orderBy(desc(surveys.createdAt));
  }

  async getActiveSurvey(): Promise<Survey | undefined> {
    const [survey] = await db.select().from(surveys).where(eq(surveys.isActive, true));
    if (!survey) return undefined;

    const questions = await this.getSurveyQuestions(survey.id);
    return { ...survey, questions } as any;
  }

  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const [survey] = await db.insert(surveys).values(insertSurvey).returning();
    return survey;
  }

  async updateSurvey(id: number, updateData: Partial<InsertSurvey>): Promise<Survey> {
    const [survey] = await db
      .update(surveys)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(surveys.id, id))
      .returning();
    return survey;
  }

  async deleteSurvey(id: number): Promise<void> {
    await db.delete(surveys).where(eq(surveys.id, id));
  }

  // Survey Questions Implementation
  async getSurveyQuestions(surveyId: number): Promise<SurveyQuestion[]> {
    return await db
      .select()
      .from(surveyQuestions)
      .where(eq(surveyQuestions.surveyId, surveyId))
      .orderBy(surveyQuestions.orderIndex);
  }

  async createSurveyQuestion(insertQuestion: InsertSurveyQuestion): Promise<SurveyQuestion> {
    const [question] = await db.insert(surveyQuestions).values(insertQuestion).returning();
    return question;
  }

  async updateSurveyQuestion(id: number, updateData: Partial<InsertSurveyQuestion>): Promise<SurveyQuestion> {
    const [question] = await db
      .update(surveyQuestions)
      .set(updateData)
      .where(eq(surveyQuestions.id, id))
      .returning();
    return question;
  }

  async deleteSurveyQuestion(id: number): Promise<void> {
    await db.delete(surveyQuestions).where(eq(surveyQuestions.id, id));
  }

  // Survey Responses Implementation
  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const [response] = await db.insert(surveyResponses).values(insertResponse).returning();
    return response;
  }

  async getSurveyResponses(surveyId: number): Promise<SurveyResponse[]> {
    return await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.surveyId, surveyId))
      .orderBy(desc(surveyResponses.createdAt));
  }

  async createSurveyAnswer(insertAnswer: InsertSurveyAnswer): Promise<SurveyAnswer> {
    const [answer] = await db.insert(surveyAnswers).values(insertAnswer).returning();
    return answer;
  }

  async checkUserSurveyResponse(surveyId: number, userId: number): Promise<boolean> {
    const [response] = await db
      .select()
      .from(surveyResponses)
      .where(and(
        eq(surveyResponses.surveyId, surveyId),
        eq(surveyResponses.userId, userId)
      ))
      .limit(1);
    
    return !!response;
  }

  async deleteUserSurveyResponse(surveyId: number, userId: number): Promise<void> {
    // First get the response to get the response ID
    const existingResponse = await db
      .select()
      .from(surveyResponses)
      .where(and(
        eq(surveyResponses.surveyId, surveyId),
        eq(surveyResponses.userId, userId)
      ))
      .limit(1);

    if (existingResponse.length > 0) {
      const responseId = existingResponse[0].id;
      
      // Delete associated answers first
      await db
        .delete(surveyAnswers)
        .where(eq(surveyAnswers.responseId, responseId));
      
      // Then delete the response
      await db
        .delete(surveyResponses)
        .where(eq(surveyResponses.id, responseId));
    }
  }

  // Survey Analytics Implementation
  async getSurveyResults(surveyId: number): Promise<{
    totalResponses: number;
    participationRate: number;
    averageTime: number;
    questionResults: Array<{
      questionId: number;
      questionText: string;
      responses: Array<{ value: string; count: number; percentage: number }>;
    }>;
  }> {
    // Get total responses count
    const [{ totalResponses }] = await db
      .select({ totalResponses: count() })
      .from(surveyResponses)
      .where(eq(surveyResponses.surveyId, surveyId));

    // Get total user count for participation rate
    const [{ totalUsers }] = await db
      .select({ totalUsers: count() })
      .from(users);

    const participationRate = totalUsers > 0 ? Math.round((totalResponses / totalUsers) * 100) : 0;

    // For now, set average time to 7 minutes (this could be calculated from actual response times)
    const averageTime = 7;

    // Get question results
    const questions = await this.getSurveyQuestions(surveyId);
    const questionResults = [];

    for (const question of questions) {
      const answers = await db
        .select()
        .from(surveyAnswers)
        .innerJoin(surveyResponses, eq(surveyAnswers.responseId, surveyResponses.id))
        .where(and(
          eq(surveyAnswers.questionId, question.id),
          eq(surveyResponses.surveyId, surveyId)
        ));

      const responseCounts: Record<string, number> = {};
      
      answers.forEach(({ survey_answers: answer }) => {
        if (answer.answerValue) {
          responseCounts[answer.answerValue] = (responseCounts[answer.answerValue] || 0) + 1;
        }
        if (answer.selectedOptions && Array.isArray(answer.selectedOptions)) {
          (answer.selectedOptions as string[]).forEach(option => {
            responseCounts[option] = (responseCounts[option] || 0) + 1;
          });
        }
      });

      const responses = Object.entries(responseCounts).map(([value, count]) => ({
        value,
        count,
        percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
      }));

      questionResults.push({
        questionId: question.id,
        questionText: question.questionText,
        responses
      });
    }

    return {
      totalResponses,
      participationRate,
      averageTime,
      questionResults
    };
  }
}

export const storage = new DatabaseStorage();
