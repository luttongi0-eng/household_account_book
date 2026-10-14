export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'expense' | 'income' | 'savings'; // 지출, 수입, 저축
  category: string; // 생활비, 취미, 급여, 저축 등
  subCategory?: string; // 식비, 게임, 대중교통 등
  description: string;
  amount: number;
  paymentMethod: string; // 카드, 현금, 계좌이체 등
  isAppointment?: boolean; // 약속/이벤트 여부
  memo?: string; // 약속 및 이벤트 관련 메모
  appointmentMemo?: string; // 약속 메모 호환용
}

export interface MonthlyResolution {
  month: string; // YYYY-MM
  resolution: string; // 이번 달 다짐 포스트잇 내용
  targetBudget: number; // 이번 달 목표 예산
  actualExpense?: number;
  isGoalAchieved?: string; // 'Y' | 'N'
  isHobbyExceeded?: string; // 'Y' | 'N'
}

export interface AiPlanResult {
  // 새 사용자 요구사항 스키마 (초고속 단문 핵심 필드)
  event_advice: string;
  daily_goal: string;
  specific_warning: string;
  hobby_cheer?: string;

  // 기존 확장 호환용 필드
  dailyRecommendedAmount?: number;
  remainingDays?: number;
  encouragementMessage?: string;
  checklists: { text: string; completed: boolean }[];
  spendingCautions?: {
    icon: string;
    title: string;
    amount: number;
    description: string;
  }[];
  totalSavingsPotential?: number;
  appointmentsSummary?: string;
  appointmentLimits?: {
    date: string;
    title: string;
    maxLimit: number;
    advice: string;
  }[];
  hobbyAdvice?: string;
}
