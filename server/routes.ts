import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import { insertUserSchema, insertPolicySchema, insertSignatureSchema, insertAdminUserSchema, insertNoticeSchema, insertResourceSchema, insertWebContentSchema } from "@shared/schema";
import { z } from "zod";
import { initializeWebContent } from "./initializeWebContent";
import { initializeSurvey } from "./initializeSurvey";

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    adminId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration with PostgreSQL store
  const PgStore = connectPgSimple(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'jinan-campaign-secret-key',
    resave: false, // Don't force session save
    saveUninitialized: false, // Don't save uninitialized sessions
    store: new PgStore({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: false, // Allow JS access for debugging
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Standard setting
      domain: undefined // Let browser handle domain
    }
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Admin authentication middleware
  const requireAdminAuth = (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/login", async (req, res) => {
    try {
      console.log('Login attempt:', req.body);
      const { name, phone, district } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      let user = await storage.getUserByPhone(phone);
      
      if (!user) {
        // Create new user
        console.log('Creating new user:', { name, phone, district });
        user = await storage.createUser({ name, phone, district });
        console.log('Created user:', user);
      } else {
        // Update user info if different
        if (user.name !== name || user.district !== district) {
          console.log(`User info update for ${phone}: name ${user.name} -> ${name}, district ${user.district} -> ${district}`);
        }
      }
      
      // Set user ID in existing session (no regeneration to avoid cookie issues)
      req.session.userId = user.id;
      console.log('Session set with userId:', user.id);
      console.log('Session ID:', req.sessionID);
      console.log('Session contents:', req.session);
      
      // Force save session and wait for completion
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: "Session save failed" });
        } else {
          console.log('Session saved successfully');
          console.log('Final session state:', req.session);
          
          // Clear any existing cookies and set new one
          res.clearCookie('connect.sid');
          res.cookie('connect.sid', `s:${req.sessionID}`, {
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
          });
          
          console.log(`Setting fresh cookie: s:${req.sessionID}`);
          
          res.json({ 
            user: { id: user.id, name: user.name, phone: user.phone, district: user.district },
            sessionId: req.sessionID // Debug info
          });
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", async (req, res) => {
    console.log('GET /api/me - Session ID:', req.sessionID);
    console.log('GET /api/me - Session contents:', req.session);
    console.log('GET /api/me - Session userId:', req.session.userId);
    console.log('GET /api/me - Request headers:', {
      cookie: req.headers.cookie,
      userAgent: req.headers['user-agent'],
      origin: req.headers.origin,
      referer: req.headers.referer
    });
    
    // If session exists but has no userId, destroy it and create fresh session
    if (!req.session.userId) {
      req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
        // Clear the cookie to force browser to get new session
        res.clearCookie('connect.sid');
        return res.status(401).json({ message: "Not authenticated" });
      });
      return;
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user: { id: user.id, name: user.name, phone: user.phone, district: user.district } });
  });

  // Signature routes
  app.post("/api/signatures", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Check if user already signed
      const existingSignature = await storage.getSignatureByUserId(userId);
      if (existingSignature) {
        return res.status(400).json({ message: "Already signed" });
      }
      
      const signature = await storage.createSignature({ userId });
      res.json({ signature });
    } catch (error) {
      res.status(500).json({ message: "Failed to create signature" });
    }
  });

  app.get("/api/signatures/check", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const signature = await storage.getSignatureByUserId(userId);
      res.json({ hasSigned: !!signature });
    } catch (error) {
      res.status(500).json({ message: "Failed to check signature status" });
    }
  });

  // Policy routes
  app.get("/api/policies", async (req, res) => {
    try {
      const category = req.query.category as string;
      const policies = await storage.getPolicies(category);
      res.json({ policies });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  app.get("/api/policies/all", async (req, res) => {
    try {
      const policies = await storage.getPolicies();
      res.json({ policies });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  app.post("/api/policies", requireAuth, async (req, res) => {
    try {
      const authorId = req.session.userId!;
      const policyData = { ...req.body, authorId };
      
      const validatedData = insertPolicySchema.parse(policyData);
      const policy = await storage.createPolicy(validatedData);
      res.json({ policy });
    } catch (error) {
      console.error("Policy creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid policy data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create policy" });
    }
  });

  app.post("/api/policies/:id/support", requireAuth, async (req, res) => {
    try {
      const policyId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      if (isNaN(policyId)) {
        return res.status(400).json({ message: "Invalid policy ID" });
      }
      
      const success = await storage.supportPolicy(policyId, userId);
      if (!success) {
        return res.status(400).json({ message: "Already supported this policy" });
      }
      
      res.json({ message: "Policy supported successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to support policy" });
    }
  });

  app.get("/api/policies/:id/support-status", requireAuth, async (req, res) => {
    try {
      const policyId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      if (isNaN(policyId)) {
        return res.status(400).json({ message: "Invalid policy ID" });
      }
      
      const support = await storage.getUserPolicySupport(policyId, userId);
      res.json({ hasSupported: !!support });
    } catch (error) {
      res.status(500).json({ message: "Failed to check support status" });
    }
  });

  // Notice routes
  app.get("/api/notices", async (req, res) => {
    try {
      const notices = await storage.getNotices();
      res.json({ notices });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notices" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json({ resources });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.adminId = admin.id;
      await storage.updateAdminLastLogin(admin.id);
      
      res.json({ admin: { id: admin.id, username: admin.username, role: admin.role } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.adminId = undefined;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/admin/me", requireAdminAuth, async (req, res) => {
    try {
      const admin = await storage.getAdminByUsername("");
      res.json({ admin: { id: req.session.adminId } });
    } catch (error) {
      res.status(500).json({ message: "Failed to get admin info" });
    }
  });

  // Admin CRUD Routes for Notices
  app.post("/api/admin/notices", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertNoticeSchema.parse(req.body);
      const notice = await storage.createNotice(validatedData);
      res.json({ notice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create notice" });
    }
  });

  app.put("/api/admin/notices/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notice ID" });
      }
      
      const validatedData = insertNoticeSchema.partial().parse(req.body);
      const notice = await storage.updateNotice(id, validatedData);
      res.json({ notice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update notice" });
    }
  });

  app.delete("/api/admin/notices/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notice ID" });
      }
      
      await storage.deleteNotice(id);
      res.json({ message: "Notice deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete notice" });
    }
  });

  // Admin CRUD Routes for Resources
  app.post("/api/admin/resources", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.json({ resource });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  app.put("/api/admin/resources/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const validatedData = insertResourceSchema.partial().parse(req.body);
      const resource = await storage.updateResource(id, validatedData);
      res.json({ resource });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  app.delete("/api/admin/resources/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      await storage.deleteResource(id);
      res.json({ message: "Resource deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  // Admin CRUD Routes for Policies
  app.put("/api/admin/policies/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid policy ID" });
      }
      
      const validatedData = insertPolicySchema.partial().parse(req.body);
      const policy = await storage.updatePolicy(id, validatedData);
      res.json({ policy });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid policy data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update policy" });
    }
  });

  app.delete("/api/admin/policies/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid policy ID" });
      }
      
      await storage.deletePolicy(id);
      res.json({ message: "Policy deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete policy" });
    }
  });

  // Web Content Management Routes
  app.get("/api/web-content", async (req, res) => {
    try {
      const section = req.query.section as string;
      const content = await storage.getWebContent(section);
      res.json({ content });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch web content" });
    }
  });

  app.get("/api/web-content/:section/:key", async (req, res) => {
    try {
      const { section, key } = req.params;
      const content = await storage.getWebContentByKey(section, key);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json({ content });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch web content" });
    }
  });

  app.post("/api/admin/web-content", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertWebContentSchema.parse(req.body);
      const content = await storage.createWebContent(validatedData);
      res.json({ content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create web content" });
    }
  });

  app.put("/api/admin/web-content/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const validatedData = insertWebContentSchema.partial().parse(req.body);
      const content = await storage.updateWebContent(id, validatedData);
      res.json({ content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update web content" });
    }
  });

  app.delete("/api/admin/web-content/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      await storage.deleteWebContent(id);
      res.json({ message: "Web content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete web content" });
    }
  });

  // Web Content Initialization (Admin only)
  app.post("/api/admin/initialize-content", requireAdminAuth, async (req, res) => {
    try {
      await initializeWebContent();
      res.json({ message: "Web content initialized successfully" });
    } catch (error) {
      console.error("Failed to initialize web content:", error);
      res.status(500).json({ message: "Failed to initialize web content" });
    }
  });

  // Survey Content Initialization (Admin only)
  app.post("/api/admin/initialize-survey-content", requireAdminAuth, async (req, res) => {
    try {
      console.log("여론조사 문구 초기화 시작...");
      
      const surveyContent = [
        // Error states
        { section: "survey", key: "no_survey_title", title: "진행 중인 여론조사 없음", content: "현재 진행 중인 여론조사가 없습니다" },
        { section: "survey", key: "no_survey_description", title: "알림 메시지", content: "새로운 여론조사가 시작되면 알려드리겠습니다." },
        
        // Results view
        { section: "survey", key: "results_title", title: "결과 페이지 제목", content: "여론조사 결과" },
        { section: "survey", key: "total_responses_label", title: "통계 라벨", content: "총 응답수" },
        { section: "survey", key: "participation_rate_label", title: "통계 라벨", content: "참여율" },
        { section: "survey", key: "average_time_label", title: "통계 라벨", content: "평균 소요시간" },
        { section: "survey", key: "back_to_survey_button", title: "버튼 텍스트", content: "여론조사 참여하기" },
        
        // Completion state
        { section: "survey", key: "completion_title", title: "완료 메시지", content: "여론조사 응답이 완료되었습니다!" },
        { section: "survey", key: "completion_description", title: "감사 메시지", content: "소중한 의견을 주셔서 감사합니다. 여러분의 참여가 진안군의 미래를 만들어갑니다." },
        { section: "survey", key: "view_results_button", title: "버튼 텍스트", content: "결과 보기" },
        { section: "survey", key: "participate_again_button", title: "버튼 텍스트", content: "다시 참여하기" },
        
        // Survey form
        { section: "survey", key: "previous_button", title: "버튼 텍스트", content: "이전" },
        { section: "survey", key: "next_button", title: "버튼 텍스트", content: "다음" },
        { section: "survey", key: "submit_button", title: "버튼 텍스트", content: "제출하기" },
        { section: "survey", key: "required_field_error", title: "오류 메시지", content: "필수 문항입니다. 답변을 선택해주세요." },
        
        // Authentication prompts
        { section: "survey", key: "login_required_title", title: "로그인 필요", content: "로그인이 필요합니다" },
        { section: "survey", key: "login_required_description", title: "로그인 안내", content: "여론조사에 참여하려면 로그인이 필요합니다." },
        { section: "survey", key: "login_button", title: "버튼 텍스트", content: "로그인하기" }
      ];

      for (const content of surveyContent) {
        const existing = await storage.getWebContentByKey(content.section, content.key);
        if (!existing) {
          await storage.createWebContent(content);
          console.log(`생성함: ${content.section}/${content.key}`);
        } else {
          console.log(`이미 존재함: ${content.section}/${content.key}`);
        }
      }

      console.log("여론조사 문구 초기화 완료!");
      res.json({ message: "Survey content initialized successfully" });
    } catch (error) {
      console.error("Survey content initialization error:", error);
      res.status(500).json({ message: "Failed to initialize survey content" });
    }
  });

  // Survey Routes
  app.get("/api/surveys/active", async (req, res) => {
    try {
      const survey = await storage.getActiveSurvey();
      if (!survey) {
        return res.status(404).json({ message: "No active survey found" });
      }
      res.json(survey);
    } catch (error) {
      console.error("Error fetching active survey:", error);
      res.status(500).json({ message: "Failed to fetch active survey" });
    }
  });

  app.get("/api/surveys/results", async (req, res) => {
    try {
      const survey = await storage.getActiveSurvey();
      if (!survey) {
        return res.status(404).json({ message: "No active survey found" });
      }
      
      const results = await storage.getSurveyResults(survey.id);
      res.json(results);
    } catch (error) {
      console.error("Error fetching survey results:", error);
      res.status(500).json({ message: "Failed to fetch survey results" });
    }
  });

  // Check if user has already submitted survey response
  app.get("/api/surveys/:surveyId/check", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const surveyId = parseInt(req.params.surveyId);
      const hasSubmitted = await storage.checkUserSurveyResponse(surveyId, req.session.userId);
      res.json({ hasSubmitted });
    } catch (error) {
      console.error("Error checking survey response:", error);
      res.status(500).json({ message: "Failed to check survey response" });
    }
  });

  app.post("/api/surveys/responses", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { surveyId, answers } = req.body;

      if (!surveyId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Invalid request data" });
      }

      // Delete existing response if user has already submitted
      await storage.deleteUserSurveyResponse(parseInt(surveyId), userId);

      // Get user's IP and user agent for analytics
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      // Get user's district
      const user = await storage.getUser(userId);
      const district = user?.district;

      // Create response record
      const response = await storage.createSurveyResponse({
        surveyId: parseInt(surveyId),
        userId,
        ipAddress: ipAddress || '',
        userAgent: userAgent || '',
        district: district || ''
      });

      // Create answer records
      for (const answer of answers) {
        await storage.createSurveyAnswer({
          responseId: response.id,
          questionId: answer.questionId,
          answerValue: answer.answerValue,
          selectedOptions: answer.selectedOptions
        });
      }

      res.json({ message: "Survey response submitted successfully", responseId: response.id });
    } catch (error) {
      console.error("Error submitting survey response:", error);
      res.status(500).json({ message: "Failed to submit survey response" });
    }
  });

  // Admin Survey Management Routes
  app.get("/api/admin/surveys", requireAdminAuth, async (req, res) => {
    try {
      const surveys = await storage.getSurveys();
      res.json({ surveys });
    } catch (error) {
      console.error("Error fetching surveys:", error);
      res.status(500).json({ message: "Failed to fetch surveys" });
    }
  });

  app.post("/api/admin/surveys", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = z.object({
        title: z.string(),
        description: z.string().optional(),
        isActive: z.boolean().default(false),
        startDate: z.string().optional(),
        endDate: z.string().optional()
      }).parse(req.body);

      const survey = await storage.createSurvey({
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined
      } as any);

      res.json({ survey });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid survey data", errors: error.errors });
      }
      console.error("Error creating survey:", error);
      res.status(500).json({ message: "Failed to create survey" });
    }
  });

  // Survey Initialization (Admin only)
  app.post("/api/admin/initialize-survey", requireAdminAuth, async (req, res) => {
    try {
      await initializeSurvey();
      res.json({ message: "Survey initialized successfully" });
    } catch (error) {
      console.error("Failed to initialize survey:", error);
      res.status(500).json({ message: "Failed to initialize survey" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
