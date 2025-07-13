import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Video, Newspaper } from "lucide-react";

export default function ResourcesSection() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const documents = resources?.resources?.filter((r: any) => r.type === 'document') || [];
  const news = resources?.resources?.filter((r: any) => r.type === 'news') || [];
  const videos = resources?.resources?.filter((r: any) => r.type === 'video') || [];

  return (
    <section>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">자료실</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 공식 문서 */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                공식 문서
              </h4>
              
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc: any) => (
                    <Button
                      key={doc.id}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto bg-gray-50 hover:bg-gray-100"
                      asChild
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-sm text-gray-500">{doc.description}</div>
                        </div>
                      </a>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    등록된 문서가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 언론 보도 */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Newspaper className="h-5 w-5 text-primary mr-2" />
                언론 보도
              </h4>
              
              <div className="space-y-3">
                {news.length > 0 ? (
                  news.map((article: any) => (
                    <Button
                      key={article.id}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto bg-gray-50 hover:bg-gray-100"
                      asChild
                    >
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-gray-500">{article.description}</div>
                        </div>
                      </a>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    등록된 기사가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 동영상 자료 */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Video className="h-5 w-5 text-primary mr-2" />
              동영상 자료
            </h4>
            
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video: any) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      {video.url && video.url.includes('youtube') ? (
                        <iframe
                          src={video.url.replace('watch?v=', 'embed/')}
                          title={video.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <div className="text-center">
                          <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <Button variant="outline" asChild>
                            <a href={video.url} target="_blank" rel="noopener noreferrer">
                              동영상 재생
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h5 className="font-medium text-gray-900 mb-2">{video.title}</h5>
                      <p className="text-sm text-gray-600">{video.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                등록된 동영상이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
