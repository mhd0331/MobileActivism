import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AuthModal from "@/components/auth-modal";



interface SurveyQuestion {
  id: number;
  questionText: string;
  questionType: string;
  options?: string[];
  conditions?: any;
  orderIndex: number;
  isRequired: boolean;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  questions: SurveyQuestion[];
}

interface SurveyResults {
  totalResponses: number;
  participationRate: number;
  averageTime: number;
  questionResults: Array<{
    questionId: number;
    questionText: string;
    responses: Array<{ value: string; count: number; percentage: number }>;
  }>;
}

export default function SurveySection() {
  const { data: auth, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);

  // Fetch survey content from database
  const { data: surveyContent } = useQuery({
    queryKey: ["/api/web-content", "survey"],
    queryFn: async () => {
      const response = await fetch("/api/web-content?section=survey");
      if (!response.ok) return null;
      return response.json();
    },
    staleTime: 300000, // 5 minutes cache
  });

  // Helper function to get content by key
  const getContent = (key: string, fallback: string = "") => {
    const item = surveyContent?.content?.find((c: any) => c.key === key);
    return item?.content || fallback;
  };



  // Fetch active survey
  const { data: survey, isLoading: surveyLoading, error: surveyError } = useQuery({
    queryKey: ["/api/surveys/active"],
    retry: false,
  });

  // Fetch survey results
  const { data: results, isLoading: resultsLoading } = useQuery<SurveyResults>({
    queryKey: ["/api/surveys/results"],
    enabled: showResults,
    retry: false,
  });

  // Check if user has already submitted response
  const { data: submissionCheck } = useQuery({
    queryKey: ["/api/surveys", survey?.id, "check"],
    queryFn: async () => {
      if (!survey?.id) return null;
      const response = await fetch(`/api/surveys/${survey.id}/check`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!survey?.id && !!auth,
    staleTime: 0,
  });

  const existingResponse = submissionCheck?.hasSubmitted;

  // Submit survey response
  const submitSurveyMutation = useMutation({
    mutationFn: async (responseData: any) => {
      const response = await apiRequest("POST", "/api/surveys/responses", responseData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "성공",
        description: submissionCheck?.hasSubmitted 
          ? "이전 응답이 업데이트되었습니다." 
          : "여론조사 응답이 제출되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
    },
    onError: (error: any) => {
      console.error("Survey submission error:", error);
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        // Re-check auth state before showing modal
        queryClient.invalidateQueries({ queryKey: ["/api/me"] });
        setTimeout(() => {
          if (!auth) {
            setShowAuthModal(true);
          }
        }, 100);
        return;
      }
      toast({
        title: "제출 실패",
        description: "여론조사 제출 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const currentQuestion = survey?.questions?.[currentQuestionIndex];
  const progress = survey?.questions ? ((currentQuestionIndex + 1) / survey.questions.length) * 100 : 0;

  // Check if current question should be shown based on conditions
  const shouldShowQuestion = (question: SurveyQuestion) => {
    if (!question.conditions?.showIf) return true;
    
    const { questionId, answer } = question.conditions.showIf;
    const previousAnswer = answers[questionId];
    
    return previousAnswer === answer;
  };

  // Get next valid question index
  const getNextQuestionIndex = (currentIndex: number) => {
    if (!survey?.questions) return currentIndex;
    
    for (let i = currentIndex + 1; i < survey.questions.length; i++) {
      if (shouldShowQuestion(survey.questions[i])) {
        return i;
      }
    }
    return survey.questions.length; // End of survey
  };

  // Get previous valid question index
  const getPreviousQuestionIndex = (currentIndex: number) => {
    if (!survey?.questions) return currentIndex;
    
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (shouldShowQuestion(survey.questions[i])) {
        return i;
      }
    }
    return 0; // Beginning of survey
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const nextIndex = getNextQuestionIndex(currentQuestionIndex);
    if (nextIndex >= survey.questions.length) {
      // End of survey - show submission
      handleSubmit();
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    const prevIndex = getPreviousQuestionIndex(currentQuestionIndex);
    setCurrentQuestionIndex(prevIndex);
  };

  const handleSubmit = async () => {
    if (!survey) return;

    // Wait for auth loading to complete
    if (authLoading) {
      console.log("Auth is loading, waiting...");
      return;
    }

    // Check if user is logged in first (using auth from useAuth hook)
    if (!auth) {
      console.log("User not authenticated, showing login modal");
      setShowAuthModal(true);
      return;
    }

    console.log("User authenticated, proceeding with submission");
    // Prepare answers for submission
    const submissionAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId: parseInt(questionId),
      answerValue: typeof value === 'string' ? value : null,
      selectedOptions: Array.isArray(value) ? value : null
    }));

    submitSurveyMutation.mutate({
      surveyId: survey.id,
      answers: submissionAnswers
    });
  };

  // Handle successful login - exactly same as signature section
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Invalidate auth queries to refresh user state
    queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    
    // Attempt submission after successful login with delay (same as signature)
    setTimeout(() => {
      console.log("Retrying submission after login success");
      // Re-check auth state before attempting submission
      if (!survey) {
        console.log("No survey available");
        return;
      }
      
      // Force call handleSubmit again to go through proper auth check
      handleSubmit();
    }, 1500); // Increased delay to allow auth state to update
  };

  const isCurrentAnswered = currentQuestion ? 
    (currentQuestion.isRequired ? !!answers[currentQuestion.id] : true) : false;

  // Show loading state
  if (surveyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (surveyError || !survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {getContent("no_survey_title", "현재 진행 중인 여론조사가 없습니다")}
                </h3>
                <p className="text-gray-500">
                  {getContent("no_survey_description", "새로운 여론조사가 시작되면 알려드리겠습니다.")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show results view
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {getContent("results_title", "여론조사 결과")}
              </h1>
              <p className="text-xl text-gray-600">
                {survey.title}
              </p>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {results.totalResponses.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{getContent("total_responses_label", "총 응답수")}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {results.participationRate}%
                  </div>
                  <p className="text-sm text-gray-500">{getContent("participation_rate_label", "참여율")}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {results.averageTime}분
                  </div>
                  <p className="text-sm text-gray-500">{getContent("average_time_label", "평균 소요시간")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Question Results */}
            <div className="space-y-6">
              {results.questionResults.map((questionResult) => (
                <Card key={questionResult.questionId}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {questionResult.questionText}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questionResult.responses.map((response) => (
                        <div key={response.value} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{response.value}</span>
                              <span className="text-sm text-gray-500">
                                {response.count}명 ({response.percentage}%)
                              </span>
                            </div>
                            <Progress 
                              value={response.percentage} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={() => setShowResults(false)}
                variant="outline"
                size="lg"
              >
                {getContent("back_to_survey_button", "여론조사 참여하기")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show completion state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {getContent("completion_title", "여론조사 응답이 완료되었습니다!")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getContent("completion_description", "소중한 의견을 주셔서 감사합니다. 여러분의 참여가 진안군의 미래를 만들어갑니다.")}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setShowResults(true)}
                    variant="outline"
                  >
                    {getContent("view_results_button", "결과 보기")}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                    }}
                  >
                    {getContent("participate_again_button", "다시 참여하기")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show survey form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {survey.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {survey.description}
            </p>
            
            {submissionCheck?.hasSubmitted && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-left">
                    <p className="font-medium text-blue-800">{getContent("already_participated_title", "이미 참여하셨습니다")}</p>
                    <p className="text-blue-700 mt-1">
                      {getContent("already_participated_description", "이전에 제출한 응답이 있습니다. 다시 참여하시면 이전 응답이 새로운 응답으로 교체됩니다.")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-4 mb-8">
              <Button
                onClick={() => setShowResults(true)}
                variant="outline"
              >
                {getContent("results_preview_button", "결과 먼저 보기")}
              </Button>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{getContent("progress_label", "진행률")}</span>
                <span className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} / {survey.questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Current Question */}
          {currentQuestion && shouldShowQuestion(currentQuestion) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {getContent("question_label", "질문")} {currentQuestionIndex + 1}
                  </Badge>
                  {currentQuestion.isRequired && (
                    <Badge variant="destructive">{getContent("required_badge", "필수")}</Badge>
                  )}
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Single Choice */}
                {currentQuestion.questionType === "single" && currentQuestion.options && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    {currentQuestion.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="flex-1 cursor-pointer py-2">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* Multiple Choice */}
                {currentQuestion.questionType === "multiple" && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={answers[currentQuestion.id]?.includes(option) || false}
                          onCheckedChange={(checked) => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            if (checked) {
                              handleAnswerChange(currentQuestion.id, [...currentAnswers, option]);
                            } else {
                              handleAnswerChange(currentQuestion.id, 
                                currentAnswers.filter((a: string) => a !== option)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={option} className="flex-1 cursor-pointer py-2">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Input */}
                {currentQuestion.questionType === "text" && (
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder={getContent("text_input_placeholder", "의견을 자유롭게 작성해주세요...")}
                    rows={4}
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    disabled={currentQuestionIndex === 0}
                  >
                    {getContent("previous_button", "이전")}
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion.isRequired && !isCurrentAnswered}
                    className="min-w-[100px]"
                  >
                    {currentQuestionIndex === survey.questions.length - 1 ? getContent("submit_button", "제출하기") : getContent("next_button", "다음")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}