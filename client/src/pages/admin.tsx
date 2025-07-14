import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, LogOut, Shield, FileText, Calendar, Users, Globe } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import AdminLoginModal from "@/components/admin-login-modal";
import { useWebContent, useCreateWebContent, useUpdateWebContent, useDeleteWebContent } from "@/hooks/useWebContent";

export default function AdminPage() {
  const { admin, isAuthenticated, logout } = useAdminAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  // Queries
  const { data: noticesData = { notices: [] } } = useQuery({
    queryKey: ['/api/notices'],
    enabled: isAuthenticated,
  });
  const notices = noticesData.notices || [];

  const { data: resourcesData = { resources: [] } } = useQuery({
    queryKey: ['/api/resources'],
    enabled: isAuthenticated,
  });
  const resources = resourcesData.resources || [];

  const { data: policiesData = { policies: [] } } = useQuery({
    queryKey: ['/api/policies'],
    enabled: isAuthenticated,
  });
  const policies = policiesData.policies || [];

  const { data: webContent = [] } = useWebContent();
  
  const createWebContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/web-content", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/web-content'] });
      setContentForm({ section: "", key: "", title: "", content: "", metadata: "{}" });
      toast({ title: "웹 콘텐츠가 추가되었습니다." });
    },
  });

  const updateWebContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/web-content/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/web-content'] });
      setEditingContent(null);
      toast({ title: "웹 콘텐츠가 수정되었습니다." });
    },
  });

  const deleteWebContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/web-content/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/web-content'] });
      toast({ title: "웹 콘텐츠가 삭제되었습니다." });
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    enabled: isAuthenticated,
  });

  // Notice Management
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "", type: "일반" });
  const [editingNotice, setEditingNotice] = useState<any>(null);

  const createNoticeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/notices", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notices'] });
      setNoticeForm({ title: "", content: "", type: "일반" });
      toast({ title: "공지사항이 등록되었습니다." });
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/notices/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notices'] });
      setEditingNotice(null);
      toast({ title: "공지사항이 수정되었습니다." });
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/notices/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notices'] });
      toast({ title: "공지사항이 삭제되었습니다." });
    },
  });

  // Resource Management
  const [resourceForm, setResourceForm] = useState({ 
    title: "", 
    description: "", 
    type: "문서", 
    url: "",
    fileSize: "",
    author: ""
  });
  const [editingResource, setEditingResource] = useState<any>(null);

  const createResourceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/resources", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setResourceForm({ title: "", description: "", type: "문서", url: "", fileSize: "", author: "" });
      toast({ title: "자료가 등록되었습니다." });
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/resources/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setEditingResource(null);
      toast({ title: "자료가 수정되었습니다." });
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/resources/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      toast({ title: "자료가 삭제되었습니다." });
    },
  });

  // Policy Management
  const deletePolicyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/policies/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/policies'] });
      toast({ title: "정책이 삭제되었습니다." });
    },
  });

  // Web Content Management
  const [contentForm, setContentForm] = useState({ 
    section: "", 
    key: "", 
    title: "", 
    content: "",
    metadata: "{}"
  });
  const [editingContent, setEditingContent] = useState<any>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-blue-600">
              <Shield className="h-6 w-6" />
              관리자 페이지
            </CardTitle>
            <CardDescription>
              관리자 권한이 필요합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setShowLoginModal(true)}>
              로그인
            </Button>
          </CardContent>
        </Card>
        
        <AdminLoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onSuccess={() => setShowLoginModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              관리자 대시보드
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                관리자: {admin?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">총 서명수 (읽기 전용)</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.stats?.signatureCount?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-blue-500 mt-1">자동 계산된 값입니다</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">정책 제안</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.stats?.policyCount || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">정책 지지</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.stats?.supportCount || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 회원수</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.stats?.userCount || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">웹 콘텐츠 관리</TabsTrigger>
            <TabsTrigger value="notices">공지사항 관리</TabsTrigger>
            <TabsTrigger value="resources">자료 관리</TabsTrigger>
            <TabsTrigger value="policies">정책 관리</TabsTrigger>
          </TabsList>

          {/* Web Content Management */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>웹 콘텐츠 관리</CardTitle>
                <CardDescription>
                  웹사이트의 텍스트 콘텐츠를 관리합니다. 서명 관련 통계는 자동 계산되므로 편집할 수 없습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Content Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>새 콘텐츠 추가</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>섹션</Label>
                        <Select 
                          value={contentForm.section} 
                          onValueChange={(value) => setContentForm({ ...contentForm, section: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="섹션 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hero">메인 히어로</SelectItem>
                            <SelectItem value="motivation">반대 이유</SelectItem>
                            <SelectItem value="footer">푸터</SelectItem>
                            <SelectItem value="policies">정책 섹션</SelectItem>
                            <SelectItem value="resources">자료 섹션</SelectItem>
                            <SelectItem value="notices">공지사항 섹션</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>키</Label>
                        <Input
                          placeholder="고유 식별자 (예: main_title)"
                          value={contentForm.key}
                          onChange={(e) => setContentForm({ ...contentForm, key: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>제목 (선택사항)</Label>
                      <Input
                        placeholder="콘텐츠 제목"
                        value={contentForm.title}
                        onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>내용</Label>
                      <Textarea
                        placeholder="콘텐츠 내용을 입력하세요"
                        value={contentForm.content}
                        onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        // 서명 관련 키워드 필터링
                        if (contentForm.key.includes('signature') || contentForm.key.includes('sign') || 
                            contentForm.content.includes('서명') || contentForm.section === 'signature') {
                          toast({ 
                            title: "오류", 
                            description: "서명 관련 콘텐츠는 편집할 수 없습니다. 서명 통계는 자동으로 계산됩니다.",
                            variant: "destructive"
                          });
                          return;
                        }
                        createWebContentMutation.mutate(contentForm);
                      }}
                      disabled={createWebContentMutation.isPending || !contentForm.section || !contentForm.key || !contentForm.content}
                      className="w-full"
                    >
                      {createWebContentMutation.isPending ? "추가 중..." : "콘텐츠 추가"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Content List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">등록된 콘텐츠</h3>
                  {webContent?.content?.filter((item: any) => item.section !== 'signature')?.map((item: any) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{item.section}</Badge>
                              <Badge variant="secondary">{item.key}</Badge>
                            </div>
                            {item.title && <h4 className="font-medium">{item.title}</h4>}
                            <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                            <p className="text-xs text-gray-400">
                              등록: {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingContent(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteWebContentMutation.mutate(item.id)}
                              disabled={deleteWebContentMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notices Management */}
          <TabsContent value="notices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  공지사항 등록
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        새 공지사항
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>새 공지사항 등록</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>제목</Label>
                          <Input
                            value={noticeForm.title}
                            onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                            placeholder="공지사항 제목"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>유형</Label>
                          <Select 
                            value={noticeForm.type} 
                            onValueChange={(value) => setNoticeForm({ ...noticeForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="일반">일반</SelectItem>
                              <SelectItem value="긴급">긴급</SelectItem>
                              <SelectItem value="중요">중요</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>내용</Label>
                          <Textarea
                            value={noticeForm.content}
                            onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                            placeholder="공지사항 내용"
                            rows={6}
                          />
                        </div>
                        <Button 
                          onClick={() => createNoticeMutation.mutate(noticeForm)}
                          disabled={createNoticeMutation.isPending}
                          className="w-full"
                        >
                          {createNoticeMutation.isPending ? "등록 중..." : "등록"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notices.map((notice: any) => (
                    <Card key={notice.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{notice.title}</h3>
                              <Badge variant={notice.type === "긴급" ? "destructive" : "secondary"}>
                                {notice.type}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{notice.content}</p>
                            <p className="text-sm text-gray-400">
                              {format(new Date(notice.createdAt), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingNotice(notice)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteNoticeMutation.mutate(notice.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Management */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  자료 관리
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        새 자료
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>새 자료 등록</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>제목</Label>
                          <Input
                            value={resourceForm.title}
                            onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                            placeholder="자료 제목"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>유형</Label>
                          <Select 
                            value={resourceForm.type} 
                            onValueChange={(value) => setResourceForm({ ...resourceForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="문서">문서</SelectItem>
                              <SelectItem value="뉴스">뉴스</SelectItem>
                              <SelectItem value="동영상">동영상</SelectItem>
                              <SelectItem value="이미지">이미지</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>설명</Label>
                          <Textarea
                            value={resourceForm.description}
                            onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                            placeholder="자료 설명"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>URL</Label>
                          <Input
                            value={resourceForm.url}
                            onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>파일 크기</Label>
                            <Input
                              value={resourceForm.fileSize}
                              onChange={(e) => setResourceForm({ ...resourceForm, fileSize: e.target.value })}
                              placeholder="예: 2.5MB"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>작성자</Label>
                            <Input
                              value={resourceForm.author}
                              onChange={(e) => setResourceForm({ ...resourceForm, author: e.target.value })}
                              placeholder="작성자명"
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={() => createResourceMutation.mutate(resourceForm)}
                          disabled={createResourceMutation.isPending}
                          className="w-full"
                        >
                          {createResourceMutation.isPending ? "등록 중..." : "등록"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.map((resource: any) => (
                    <Card key={resource.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{resource.title}</h3>
                              <Badge>{resource.type}</Badge>
                              {resource.fileSize && (
                                <span className="text-sm text-gray-500">({resource.fileSize})</span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{resource.description}</p>
                            {resource.author && (
                              <p className="text-sm text-gray-500 mb-2">작성자: {resource.author}</p>
                            )}
                            <p className="text-sm text-gray-400">
                              {format(new Date(resource.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingResource(resource)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteResourceMutation.mutate(resource.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Management */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>정책 제안 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map((policy: any) => (
                    <Card key={policy.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{policy.title}</h3>
                              <Badge variant="outline">{policy.category}</Badge>
                              <span className="text-sm text-blue-600 font-medium">
                                지지 {policy.supportCount}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{policy.description}</p>
                            <p className="text-sm text-gray-400">
                              {format(new Date(policy.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePolicyMutation.mutate(policy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Notice Modal */}
      {editingNotice && (
        <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>공지사항 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>유형</Label>
                <Select 
                  value={editingNotice.type} 
                  onValueChange={(value) => setEditingNotice({ ...editingNotice, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일반">일반</SelectItem>
                    <SelectItem value="긴급">긴급</SelectItem>
                    <SelectItem value="중요">중요</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>내용</Label>
                <Textarea
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  rows={6}
                />
              </div>
              <Button 
                onClick={() => updateNoticeMutation.mutate({ 
                  id: editingNotice.id, 
                  data: { title: editingNotice.title, content: editingNotice.content, type: editingNotice.type }
                })}
                disabled={updateNoticeMutation.isPending}
                className="w-full"
              >
                {updateNoticeMutation.isPending ? "수정 중..." : "수정"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>자료 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>유형</Label>
                <Select 
                  value={editingResource.type} 
                  onValueChange={(value) => setEditingResource({ ...editingResource, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="문서">문서</SelectItem>
                    <SelectItem value="뉴스">뉴스</SelectItem>
                    <SelectItem value="동영상">동영상</SelectItem>
                    <SelectItem value="이미지">이미지</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>설명</Label>
                <Textarea
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={editingResource.url}
                  onChange={(e) => setEditingResource({ ...editingResource, url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>파일 크기</Label>
                  <Input
                    value={editingResource.fileSize || ""}
                    onChange={(e) => setEditingResource({ ...editingResource, fileSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>작성자</Label>
                  <Input
                    value={editingResource.author || ""}
                    onChange={(e) => setEditingResource({ ...editingResource, author: e.target.value })}
                  />
                </div>
              </div>
              <Button 
                onClick={() => updateResourceMutation.mutate({ 
                  id: editingResource.id, 
                  data: editingResource
                })}
                disabled={updateResourceMutation.isPending}
                className="w-full"
              >
                {updateResourceMutation.isPending ? "수정 중..." : "수정"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Web Content Modal */}
      {editingContent && (
        <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>웹 콘텐츠 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>섹션</Label>
                  <Select 
                    value={editingContent.section} 
                    onValueChange={(value) => setEditingContent({ ...editingContent, section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">메인 히어로</SelectItem>
                      <SelectItem value="motivation">반대 이유</SelectItem>
                      <SelectItem value="footer">푸터</SelectItem>
                      <SelectItem value="policies">정책 섹션</SelectItem>
                      <SelectItem value="resources">자료 섹션</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>키</Label>
                  <Input
                    value={editingContent.key}
                    onChange={(e) => setEditingContent({ ...editingContent, key: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>제목 (선택사항)</Label>
                <Input
                  value={editingContent.title || ""}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>내용</Label>
                <Textarea
                  value={editingContent.content}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                  rows={6}
                />
              </div>
              <Button 
                onClick={() => updateWebContentMutation.mutate({ 
                  id: editingContent.id, 
                  data: { 
                    section: editingContent.section, 
                    key: editingContent.key, 
                    title: editingContent.title, 
                    content: editingContent.content 
                  }
                })}
                disabled={updateWebContentMutation.isPending}
                className="w-full"
              >
                {updateWebContentMutation.isPending ? "수정 중..." : "수정"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}