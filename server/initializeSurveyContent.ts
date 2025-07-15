import { storage } from "./storage";

export async function initializeSurveyContent() {
  console.log("Setting up survey web content...");
  
  const surveyContentData = [
    // Survey Page Header
    {
      section: "survey",
      key: "page_title",
      title: "여론조사 페이지 제목",
      content: "지방자치단체 대규모 프로젝트 여론조사",
      metadata: JSON.stringify({ location: "survey-header" })
    },
    {
      section: "survey",
      key: "page_description",
      title: "여론조사 설명",
      content: "존경하는 군민 여러분, 우리 지방자치단체는 대규모 프로젝트 추진에 앞서 군민 여러분의 소중한 의견을 듣고자 합니다.",
      metadata: JSON.stringify({ location: "survey-description" })
    },
    
    // Survey Navigation
    {
      section: "survey",
      key: "start_button",
      title: "시작 버튼",
      content: "설문 시작하기",
      metadata: JSON.stringify({ location: "survey-start-button" })
    },
    {
      section: "survey",
      key: "previous_button",
      title: "이전 버튼",
      content: "이전",
      metadata: JSON.stringify({ location: "survey-nav" })
    },
    {
      section: "survey",
      key: "next_button",
      title: "다음 버튼",
      content: "다음",
      metadata: JSON.stringify({ location: "survey-nav" })
    },
    {
      section: "survey",
      key: "submit_button",
      title: "제출 버튼",
      content: "설문 제출하기",
      metadata: JSON.stringify({ location: "survey-submit" })
    },
    
    // Survey Status Messages
    {
      section: "survey",
      key: "progress_label",
      title: "진행률 라벨",
      content: "진행률",
      metadata: JSON.stringify({ location: "survey-progress" })
    },
    {
      section: "survey",
      key: "step_label",
      title: "단계 라벨",
      content: "단계",
      metadata: JSON.stringify({ location: "survey-progress" })
    },
    {
      section: "survey",
      key: "required_field_error",
      title: "필수 입력 오류",
      content: "이 질문은 필수입니다.",
      metadata: JSON.stringify({ location: "survey-validation" })
    },
    {
      section: "survey",
      key: "submission_success",
      title: "제출 성공 메시지",
      content: "설문이 성공적으로 제출되었습니다. 소중한 의견을 주셔서 감사합니다!",
      metadata: JSON.stringify({ location: "survey-completion" })
    },
    {
      section: "survey",
      key: "submission_error",
      title: "제출 오류 메시지",
      content: "설문 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
      metadata: JSON.stringify({ location: "survey-error" })
    },
    {
      section: "survey",
      key: "login_required",
      title: "로그인 필요 메시지",
      content: "설문 참여를 위해 로그인이 필요합니다.",
      metadata: JSON.stringify({ location: "survey-auth" })
    },
    {
      section: "survey",
      key: "already_participated",
      title: "이미 참여 메시지",
      content: "이미 이 설문에 참여하셨습니다.",
      metadata: JSON.stringify({ location: "survey-participation" })
    },
    
    // Multiple Choice Helper Text
    {
      section: "survey",
      key: "multiple_choice_helper",
      title: "복수선택 안내",
      content: "여러 개를 선택할 수 있습니다.",
      metadata: JSON.stringify({ location: "survey-helper" })
    },
    {
      section: "survey",
      key: "single_choice_helper",
      title: "단일선택 안내",
      content: "하나만 선택해 주세요.",
      metadata: JSON.stringify({ location: "survey-helper" })
    },
    
    // Survey Results
    {
      section: "survey",
      key: "results_title",
      title: "결과 제목",
      content: "여론조사 결과",
      metadata: JSON.stringify({ location: "survey-results" })
    },
    {
      section: "survey",
      key: "total_responses",
      title: "총 응답 수",
      content: "총 응답 수",
      metadata: JSON.stringify({ location: "survey-results" })
    },
    {
      section: "survey",
      key: "participation_rate",
      title: "참여율",
      content: "참여율",
      metadata: JSON.stringify({ location: "survey-results" })
    },
    {
      section: "survey",
      key: "view_results_button",
      title: "결과 보기 버튼",
      content: "결과 보기",
      metadata: JSON.stringify({ location: "survey-results" })
    }
  ];

  for (const contentItem of surveyContentData) {
    try {
      await storage.createWebContent(contentItem);
    } catch (error) {
      // If content already exists, update it
      try {
        const existing = await storage.getWebContentByKey(contentItem.section, contentItem.key);
        if (existing) {
          await storage.updateWebContent(existing.id, contentItem);
        }
      } catch (updateError) {
        console.error(`Failed to update content ${contentItem.key}:`, updateError);
      }
    }
  }

  console.log("Survey web content initialized successfully!");
}