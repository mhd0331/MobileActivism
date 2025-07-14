import { storage } from "./storage";

// 현재 웹페이지의 모든 텍스트 콘텐츠를 데이터베이스에 초기화
export async function initializeWebContent() {
  const contentData = [
    // Hero Section
    {
      section: "hero",
      key: "main_title",
      title: "메인 제목",
      content: "진안군 목조전망대 건설 반대",
      metadata: JSON.stringify({ location: "hero-title" })
    },
    {
      section: "hero",
      key: "subtitle",
      title: "부제목",
      content: "자연을 지키고 미래를 생각하는 선택",
      metadata: JSON.stringify({ location: "hero-subtitle" })
    },
    {
      section: "hero",
      key: "description",
      title: "설명",
      content: "지방자치법 위반 우려로 추진되는 130억원 규모의 목조전망대 건설을 반대합니다.",
      metadata: JSON.stringify({ location: "hero-description" })
    },

    // Motivation Section
    {
      section: "motivation",
      key: "section_title",
      title: "섹션 제목",
      content: "왜 서명해야 할까요?",
      metadata: JSON.stringify({ location: "motivation-title" })
    },
    {
      section: "motivation",
      key: "section_subtitle",
      title: "섹션 부제목",
      content: "민주주의와 군민의 권익을 지키기 위한 세 가지 핵심 이유",
      metadata: JSON.stringify({ location: "motivation-subtitle" })
    },

    // 민주주의 위기 카드
    {
      section: "motivation",
      key: "democracy_crisis_title",
      title: "민주주의 위기 제목",
      content: "민주주의 위기",
      metadata: JSON.stringify({ location: "card1-title" })
    },
    {
      section: "motivation",
      key: "democracy_crisis_subtitle",
      title: "민주주의 위기 부제목",
      content: "🛑 이것은 민주주의입니까, 독재입니까?",
      metadata: JSON.stringify({ location: "card1-subtitle" })
    },
    {
      section: "motivation",
      key: "democracy_point1_title",
      title: "의회 반대 제목",
      content: "의회, 사업에 강한 반대 의견 표명",
      metadata: JSON.stringify({ location: "card1-point1-title" })
    },
    {
      section: "motivation",
      key: "democracy_point1_content",
      title: "의회 반대 내용",
      content: "295회 군의회에서 용역비 집행을 사업추진의 기본적인 타당성 확보 이후로 조건부 부결",
      metadata: JSON.stringify({ location: "card1-point1-content" })
    },
    {
      section: "motivation",
      key: "democracy_point2_title",
      title: "군수 독단 제목",
      content: "군수, 독단 강행",
      metadata: JSON.stringify({ location: "card1-point2-title" })
    },
    {
      section: "motivation",
      key: "democracy_point2_content",
      title: "군수 독단 내용",
      content: "의회의 반대 의견을 무릅쓰고 집행부 pool 예산을 사용하여 사업 강행\n지방자치법 제 55조를 위반하여 안건을 군의회에 사전 제출하지 않음",
      metadata: JSON.stringify({ location: "card1-point2-content" })
    },
    {
      section: "motivation",
      key: "democracy_point3_title",
      title: "군민 대표권 훼손 제목",
      content: "군민 대표권 훼손",
      metadata: JSON.stringify({ location: "card1-point3-title" })
    },
    {
      section: "motivation",
      key: "democracy_point3_content",
      title: "군민 대표권 훼손 내용",
      content: "형식적인 설문조사, 공청회 진행을 통한 민주적 절차 무시 및 의회 권한 침해.\n지방자치법 제 55조를 위반에 대한 군민과 군의회에 사과하지 않고 오히려 정당성 주장\n향후 이런 독재적 행정이 반복될 수 있음.",
      metadata: JSON.stringify({ location: "card1-point3-content" })
    },

    // 예산 낭비 카드
    {
      section: "motivation",
      key: "budget_waste_title",
      title: "예산 낭비 제목",
      content: "예산 낭비",
      metadata: JSON.stringify({ location: "card2-title" })
    },
    {
      section: "motivation",
      key: "budget_waste_subtitle",
      title: "예산 낭비 부제목",
      content: "💰 130억원의 무책임한 낭비",
      metadata: JSON.stringify({ location: "card2-subtitle" })
    },

    // 예산 낭비 카드 세부 내용
    {
      section: "motivation",
      key: "budget_waste_subtitle",
      title: "예산 낭비 부제목",
      content: "💰 130억원의 무책임한 낭비",
      metadata: JSON.stringify({ location: "card2-subtitle" })
    },
    {
      section: "motivation",
      key: "budget_person_amount",
      title: "1인당 부담액",
      content: "178만원",
      metadata: JSON.stringify({ location: "card2-person-amount" })
    },
    {
      section: "motivation",
      key: "budget_person_label",
      title: "1인당 부담 라벨",
      content: "군민 1인당 부담액",
      metadata: JSON.stringify({ location: "card2-person-label" })
    },
    {
      section: "motivation",
      key: "budget_family_amount",
      title: "4인 가족 부담액",
      content: "712만원",
      metadata: JSON.stringify({ location: "card2-family-amount" })
    },
    {
      section: "motivation",
      key: "budget_family_label",
      title: "4인 가족 부담 라벨",
      content: "4인 가족 기준 부담",
      metadata: JSON.stringify({ location: "card2-family-label" })
    },
    {
      section: "motivation",
      key: "budget_population",
      title: "인구 기준",
      content: "진안군 인구 25,000명 기준",
      metadata: JSON.stringify({ location: "card2-population" })
    },

    // 환경 파괴 카드
    {
      section: "motivation",
      key: "environment_title",
      title: "환경 파괴 제목",
      content: "또 실패하면?",
      metadata: JSON.stringify({ location: "card3-title" })
    },
    {
      section: "motivation",
      key: "environment_subtitle", 
      title: "환경 파괴 부제목",
      content: "🌲 소중한 자연 생태계 훼손",
      metadata: JSON.stringify({ location: "card3-subtitle" })
    },
    {
      section: "motivation",
      key: "failure_past_title",
      title: "과거 실패 제목",
      content: "과거: 마이산 케이블카",
      metadata: JSON.stringify({ location: "card3-past-title" })
    },
    {
      section: "motivation",
      key: "failure_past_content",
      title: "과거 실패 내용",
      content: "29억원 손실 사업",
      metadata: JSON.stringify({ location: "card3-past-content" })
    },
    {
      section: "motivation",
      key: "failure_present_title",
      title: "현재 위험 제목",
      content: "현재: 전망대 강행",
      metadata: JSON.stringify({ location: "card3-present-title" })
    },
    {
      section: "motivation",
      key: "failure_present_content",
      title: "현재 위험 내용",
      content: "445억원 위험 투자",
      metadata: JSON.stringify({ location: "card3-present-content" })
    },
    {
      section: "motivation",
      key: "failure_future_title",
      title: "미래 우려 제목",
      content: "미래: 더 큰 부담?",
      metadata: JSON.stringify({ location: "card3-future-title" })
    },
    {
      section: "motivation",
      key: "failure_future_content",
      title: "미래 우려 내용",
      content: "지속적인 적자 운영 우려",
      metadata: JSON.stringify({ location: "card3-future-content" })
    },

    // Header Section
    {
      section: "header",
      key: "site_title",
      title: "사이트 제목",
      content: "진안군 목조전망대 반대 캠페인",
      metadata: JSON.stringify({ location: "header-title" })
    },
    {
      section: "header",
      key: "login_button",
      title: "로그인 버튼",
      content: "로그인",
      metadata: JSON.stringify({ location: "header-login" })
    },
    {
      section: "header",
      key: "logout_button",
      title: "로그아웃 버튼",
      content: "로그아웃",
      metadata: JSON.stringify({ location: "header-logout" })
    },

    // Footer Section
    {
      section: "footer",
      key: "site_description",
      title: "사이트 설명",
      content: "군민의 소중한 세금을 지키고\n민주적 절차를 존중하는\n건전한 지방자치를 만들어갑니다.",
      metadata: JSON.stringify({ location: "footer-description" })
    },
    {
      section: "footer",
      key: "contact_title",
      title: "연락처 제목",
      content: "연락처",
      metadata: JSON.stringify({ location: "footer-contact-title" })
    },
    {
      section: "footer",
      key: "contact_email",
      title: "이메일",
      content: "campaign@jinan.org",
      metadata: JSON.stringify({ location: "footer-email" })
    },
    {
      section: "footer",
      key: "contact_phone",
      title: "전화번호",
      content: "063-000-0000",
      metadata: JSON.stringify({ location: "footer-phone" })
    },
    {
      section: "footer",
      key: "contact_address",
      title: "주소",
      content: "전북 진안군 진안읍",
      metadata: JSON.stringify({ location: "footer-address" })
    },
    {
      section: "footer",
      key: "info_title",
      title: "정보 제목",
      content: "정보",
      metadata: JSON.stringify({ location: "footer-info-title" })
    },
    {
      section: "footer",
      key: "privacy_info",
      title: "개인정보 보호",
      content: "• 수집된 정보는 캠페인 목적으로만 사용\n• SSL 암호화로 안전하게 보관\n• 제3자 제공 금지\n• 캠페인 종료 후 즉시 삭제",
      metadata: JSON.stringify({ location: "footer-privacy" })
    },
    {
      section: "footer",
      key: "admin_login",
      title: "관리자 로그인",
      content: "관리자 로그인",
      metadata: JSON.stringify({ location: "footer-admin" })
    },
    {
      section: "footer",
      key: "copyright",
      title: "저작권",
      content: "© 2024 진안군 목조전망대 반대 캠페인. 모든 권리 보유.",
      metadata: JSON.stringify({ location: "footer-copyright" })
    },
    {
      section: "footer",
      key: "purpose",
      title: "앱 목적",
      content: "이 앱은 민주적 참여를 위한 비영리 목적으로 제작되었습니다.",
      metadata: JSON.stringify({ location: "footer-purpose" })
    },

    // Navigation
    {
      section: "navigation",
      key: "notices_tab",
      title: "공지사항 탭",
      content: "공지사항",
      metadata: JSON.stringify({ location: "nav-notices" })
    },
    {
      section: "navigation",
      key: "signature_tab",
      title: "서명 탭",
      content: "서명하기",
      metadata: JSON.stringify({ location: "nav-signature" })
    },
    {
      section: "navigation",
      key: "policies_tab",
      title: "정책 탭",
      content: "정책제안",
      metadata: JSON.stringify({ location: "nav-policies" })
    },
    {
      section: "navigation",
      key: "resources_tab",
      title: "자료 탭",
      content: "자료실",
      metadata: JSON.stringify({ location: "nav-resources" })
    },
    {
      section: "navigation",
      key: "dashboard_tab",
      title: "현황 탭",
      content: "현황",
      metadata: JSON.stringify({ location: "nav-dashboard" })
    }
  ];

  console.log("웹 콘텐츠 초기화 시작...");

  for (const item of contentData) {
    try {
      // 기존 콘텐츠가 있는지 확인
      const existing = await storage.getWebContentByKey(item.section, item.key);
      if (!existing) {
        await storage.createWebContent(item);
        console.log(`생성됨: ${item.section}/${item.key}`);
      } else {
        console.log(`이미 존재함: ${item.section}/${item.key}`);
      }
    } catch (error) {
      console.error(`오류 발생: ${item.section}/${item.key}`, error);
    }
  }

  console.log("웹 콘텐츠 초기화 완료!");
}