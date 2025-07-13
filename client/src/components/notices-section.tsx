import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function NoticesSection() {
  const { data: notices, isLoading } = useQuery({
    queryKey: ["/api/notices"],
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const urgentNotices = notices?.notices?.filter((notice: any) => notice.type === 'urgent') || [];
  const regularNotices = notices?.notices?.filter((notice: any) => notice.type !== 'urgent') || [];

  return (
    <section>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">최신 공지사항</h3>
        
        {/* Urgent notices */}
        {urgentNotices.map((notice: any) => (
          <Card key={notice.id} className="bg-red-50 border-l-4 border-red-500 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <Badge variant="destructive">긴급</Badge>
              </div>
              <h4 className="text-lg font-bold text-red-800 mb-2">{notice.title}</h4>
              <p className="text-red-700 mb-3 whitespace-pre-wrap">{notice.content}</p>
              <div className="text-xs text-red-600">
                {format(new Date(notice.createdAt), 'yyyy년 M월 d일 발표')}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Regular notices */}
        <div className="space-y-4">
          {regularNotices.map((notice: any) => (
            <Card key={notice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Badge 
                        variant={notice.type === 'success' ? 'default' : 'secondary'}
                        className={notice.type === 'success' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {notice.type === 'success' ? '성과' : '일반'}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">
                        {format(new Date(notice.createdAt), 'yyyy.MM.dd')}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-4">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {regularNotices.length === 0 && urgentNotices.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
