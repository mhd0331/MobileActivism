import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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

// Hook to get survey content from database
function useSurveyContent(key: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/web-content/survey/${key}`],
    retry: false,
    staleTime: 0, // Always fetch fresh data
  });
  
  // Debug logging
  if (error) {
    console.error(`Failed to load survey content for key: ${key}`, error);
  }
  
  console.log(`Survey content for ${key}:`, data?.content?.content);
  
  // Return content from the nested structure
  return data?.content?.content || "";
}

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
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);

  // Get survey content from database
  const noSurveyTitle = useSurveyContent("no_survey_title") || "현재 진행 중인 여론조사가 없습니다";
  const noSurveyDescription = useSurveyContent("no_survey_description") || "새로운 여론조사가 시작되면 알려드리겠습니다.";
  const resultsTitle = useSurveyContent("results_title") || "여론조사 결과";
  const totalResponsesLabel = useSurveyContent("total_responses_label") || "총 응답수";
  const participationRateLabel = useSurveyContent("participation_rate_label") || "참여율";
  const averageTimeLabel = useSurveyContent("average_time_label") || "평균 소요시간";
  const backToSurveyButton = useSurveyContent("back_to_survey_button") || "여론조사 참여하기";
  const completionTitle = useSurveyContent("completion_title") || "여론조사 응답이 완료되었습니다!";
  const completionDescription = useSurveyContent("completion_description") || "소중한 의견을 주셔서 감사합니다. 여러분의 참여가 진안군의 미래를 만들어갑니다.";
  const viewResultsButton = useSurveyContent("view_results_button") || "결과 보기";
  const participateAgainButton = useSurveyContent("participate_again_button") || "다시 참여하기";
  const previousButton = useSurveyContent("previous_button") || "이전";
  const nextButton = useSurveyContent("next_button") || "다음";
  const submitButton = useSurveyContent("submit_button") || "제출하기";

  // Debug logging for buttons specifically
  useEffect(() => {
    console.log("Button text values:", { 
      previousButton, 
      nextButton, 
      submitButton,
      rawPrevious: useSurveyContent("previous_button"),
      rawNext: useSurveyContent("next_button"),
      rawSubmit: useSurveyContent("submit_button")
    });
  }, [previousButton, nextButton, submitButton]);
  const requiredFieldError = useSurveyContent("required_field_error") || "필수 문항입니다. 답변을 선택해주세요.";



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

  // Check if user is logged in
  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: 0, // Always fetch fresh data for auth state
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
    enabled: !!survey?.id && !!currentUser?.user,
    staleTime: 0,
  });

  // Submit survey response
  const submitSurveyMutation = useMutation({
    mutationFn: async (responseData: any) => {
      return await apiRequest("/api/surveys/responses", {
        method: "POST",
        body: JSON.stringify(responseData),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setPendingSubmission(false);
      toast({
        title: "성공",
        description: submissionCheck?.hasSubmitted 
          ? "이전 응답이 업데이트되었습니다." 
          : "여론조사 응답이 제출되었습니다.",
      });
    },
    onError: (error: any) => {
      if (error.message.includes("401")) {
        // Show login modal instead of error toast
        setPendingSubmission(true);
        setShowAuthModal(true);
      } else {
        setPendingSubmission(false);
        toast({
          title: "오류",
          description: error.message || "응답 제출에 실패했습니다.",
          variant: "destructive",
        });
      }
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

    // Check if user is logged in first
    if (!currentUser || !currentUser.user) {
      setPendingSubmission(true);
      setShowAuthModal(true);
      return;
    }

    // Prepare answers for submission
    const submissionAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId: parseInt(questionId),
      answerValue: typeof value === 'string' ? value : null,
      selectedOptions: Array.isArray(value) ? value : null
    }));

    try {
      await submitSurveyMutation.mutateAsync({
        surveyId: survey.id,
        answers: submissionAnswers
      });
    } catch (error) {
      console.error('Survey submission error:', error);
    }
  };

  // Handle successful login - submit pending survey if needed
  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    
    if (pendingSubmission) {
      setPendingSubmission(false);
      
      toast({
        title: "로그인 완료",
        description: "여론조사를 제출하는 중입니다...",
      });
      
      // Wait a moment and then submit directly without checking user state again
      setTimeout(async () => {
        if (!survey) return;
        
        try {
          // Prepare answers for submission
          const submissionAnswers = Object.entries(answers).map(([questionId, value]) => ({
            questionId: parseInt(questionId),
            answerValue: typeof value === 'string' ? value : null,
            selectedOptions: Array.isArray(value) ? value : null
          }));

          await submitSurveyMutation.mutateAsync({
            surveyId: survey.id,
            answers: submissionAnswers
          });
        } catch (error) {
          console.error('Submit error after login:', error);
          toast({
            title: "제출 실패",
            description: "여론조사 제출에 실패했습니다. 제출 버튼을 다시 눌러주세요.",
            variant: "destructive",
          });
        }
      }, 1000);
    } else {
      toast({
        title: "로그인 완료",
        description: "성공적으로 로그인되었습니다.",
      });
    }
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
                  {noSurveyTitle}
                </h3>
                <p className="text-gray-500">
                  {noSurveyDescription}
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
                {resultsTitle}
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
                  <p className="text-sm text-gray-500">{totalResponsesLabel}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {results.participationRate}%
                  </div>
                  <p className="text-sm text-gray-500">{participationRateLabel}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {results.averageTime}분
                  </div>
                  <p className="text-sm text-gray-500">{averageTimeLabel}</p>
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
                {backToSurveyButton}
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
                  {completionTitle}
                </h3>
                <p className="text-gray-600 mb-6">
                  {completionDescription}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setShowResults(true)}
                    variant="outline"
                  >
                    {viewResultsButton}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                    }}
                  >
                    {participateAgainButton}
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
                    <p className="font-medium text-blue-800">이미 참여하셨습니다</p>
                    <p className="text-blue-700 mt-1">
                      이전에 제출한 응답이 있습니다. 다시 참여하시면 이전 응답이 새로운 응답으로 교체됩니다.
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
                결과 먼저 보기
              </Button>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">진행률</span>
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
                    질문 {currentQuestionIndex + 1}
                  </Badge>
                  {currentQuestion.isRequired && (
                    <Badge variant="destructive">필수</Badge>
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
                    placeholder="의견을 자유롭게 작성해주세요..."
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
                    {previousButton}
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion.isRequired && !isCurrentAnswered}
                    className="min-w-[100px]"
                  >
                    {currentQuestionIndex === survey.questions.length - 1 ? submitButton : nextButton}
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