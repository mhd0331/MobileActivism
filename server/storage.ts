import { 
  users, signatures, policies, policySupports, notices, resources, adminUsers,
  type User, type InsertUser, type Signature, type InsertSignature,
  type Policy, type InsertPolicy, type PolicySupport, type InsertPolicySupport,
  type Notice, type InsertNotice, type Resource, type InsertResource,
  type AdminUser, type InsertAdminUser
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
}

export const storage = new DatabaseStorage();
