import { NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

import fs from 'fs';
import path from 'path';

function getLiveApiKey(): string {
  // 1. .env.local 파일에서 직접 실시간 파싱 (GOOGLE_GENERATIVE_AI_API_KEY 우선)
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const googleMatch = content.match(/GOOGLE_GENERATIVE_AI_API_KEY\s*=\s*(.+)/);
      if (googleMatch && googleMatch[1]) {
        return googleMatch[1].trim().replace(/^["']|["']$/g, '');
      }
      const geminiMatch = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
      if (geminiMatch && geminiMatch[1]) {
        return geminiMatch[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    console.error('Failed to read .env.local directly:', e);
  }
  // 2. process.env fallback
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
}

const planSchema = z.object({
  dailyRecommendedAmount: z.number().describe('앞으로 남은 날짜 동안 하루에 권장되는 지출 금액(원)'),
  encouragementMessage: z.string().describe('사용자에게 전하는 따뜻하고 응원하는 멘트 (저축 목표 지키기 다짐 등)'),
  checklists: z.array(
    z.object({
      text: z.string().describe('실천 가능한 절약 행동 수칙 (예: 금요일 퇴근길 대중교통 이용하기)'),
      completed: z.boolean().default(false),
    })
  ).describe('실천할 수 있는 3가지 절약 체크리스트'),
  spendingCautions: z.array(
    z.object({
      icon: z.string().describe('이모지 아이콘 (예: 🛵, 📺, ☕)'),
      title: z.string().describe('주의해야 할 소비 항목 이름 (예: 심야 배달비 & 야식비)'),
      amount: z.number().describe('예상 누수 또는 주의 금액'),
      description: z.string().describe('구체적인 원인 분석 및 줄이기 팁'),
    })
  ).describe('낭비가 의심되거나 주의해야 할 소비 누수 3건'),
  totalSavingsPotential: z.number().describe('주의 항목들을 아꼈을 때 절약할 수 있는 총 금액'),
  appointmentsSummary: z.string().describe('달력에 등록된 약속/일정을 확인하고 지출 계획에 어떻게 반영했는지 설명'),
  appointmentLimits: z.array(
    z.object({
      date: z.string().describe('약속 날짜 (YYYY-MM-DD)'),
      title: z.string().describe('약속 내용/이름'),
      maxLimit: z.number().describe('이 약속에서 최대 얼마까지만 사용해야 하는지 추천하는 최대 지출 한도 금액(원)'),
      advice: z.string().describe('해당 약속에서 한도를 지키기 위한 현실적인 꿀팁 (예: 1차 식사만 참석, 2차는 카페 가기 등)'),
    })
  ).describe('달력에 등록된 각 약속/이벤트별 AI 추천 최대 지출 한도 및 조언 리스트'),
  hobbyAdvice: z.string().describe('취미 10% 예산에 대한 조언'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      year,
      month,
      remainingDays,
      totalIncome,
      totalExpense,
      remainingBudget,
      savingsTarget,
      currentSaved,
      hobbyBudget,
      hobbyExpense,
      appointments,
      transactions,
    } = body;

    const prompt = `
당신은 아기자기한 감성의 스케치북 가계부의 든든한 "AI 똑똑이 재정 코치"입니다.
사용자의 현재 재정 상태와 달력에 등록된 앞으로의 약속/일정을 꼼꼼히 확인하고, 남은 ${remainingDays}일 동안의 지출 계획과 각 약속별 최대 지출 한도를 정해주세요.

[현재 가계부 현황]
- 기준 연월: ${year}년 ${month}월
- 이번 달 남은 일수: ${remainingDays}일
- 총 수입: ${totalIncome.toLocaleString()}원
- 총 지출: ${totalExpense.toLocaleString()}원
- 남은 한 달 생활비 예산: ${remainingBudget.toLocaleString()}원
- 저축 목표 금액: ${savingsTarget.toLocaleString()}원 (현재 저금통 모은 금액: ${currentSaved.toLocaleString()}원)
- 취미 예산 한도(수입의 10%): ${hobbyBudget.toLocaleString()}원 (현재 취미 지출: ${hobbyExpense.toLocaleString()}원)

[달력에 등록된 약속 및 일정]
${appointments && appointments.length > 0 ? JSON.stringify(appointments, null, 2) : '등록된 특별한 약속이 없습니다.'}

[최근 소비 및 수입 내역]
${transactions && transactions.length > 0 ? JSON.stringify(transactions, null, 2) : '등록된 지출 내역이 전혀 없습니다.'}

[🚨 절대 원칙 - 가상 데이터 생성 엄격 금지]
1. ⚠️ **[남은 한 달 예산 필수 엄수]**:
   - 현재 화면에 표시된 [남은 한 달 생활비 예산]은 정확히 **${remainingBudget.toLocaleString()}원**입니다.
   - 코멘트나 설명(encouragementMessage, appointmentsSummary 등)에서 **절대로 350,000원 등 임의의 가상 금액을 말하지 마시고, 반드시 실제 남은 예산인 ${remainingBudget.toLocaleString()}원을 그대로 인용**하세요!
2. ⚠️ **[달력 약속 및 일정 필수 확인]**:
   - 달력에 등록된 약속 목록:
${appointments && appointments.length > 0 ? JSON.stringify(appointments, null, 2) : '등록된 약속 없음'}
   - 위 목록에 약속이 단 1건이라도 있다면, 절대로 "등록된 특별한 일정이나 약속이 없어"라고 거짓말하지 마세요! 해당 약속들의 날짜와 내용을 반드시 직접 언급하고, 각 약속별 최대 지출 한도(maxLimit)를 책정하세요.
3. ⚠️ **[가상 소비 항목 날조 금지]**:
   - 사용자가 실제로 입력하지 않은 소비 항목(카페, 배달비, 편의점, OTT 구독 등)을 절대로 임의로 지어내지 마세요.
   - [줄여야 할 소비 부분 (spendingCautions)]은 오직 [최근 소비 및 수입 내역]에 실제로 존재하는 거래 내역만 분석하세요. 없으면 빈 배열([])로 반환하세요.
4. ⭐ 각 약속마다:
   - 실제 남은 예산(${remainingBudget.toLocaleString()}원)과 약속 성격을 고려하여, "이 약속에서는 최대 얼마까지만 사용해야 하는지(maxLimit)" 현실적인 최대 한도 금액을 정확히 책정해주세요.
   - 한도를 넘기지 않고 아끼며 즐길 수 있는 팁(advice)도 1문장으로 함께 제공해주세요.
5. 약속 날의 최대 지출 한도들을 모두 감안하여, 남은 기간(${remainingDays}일) 동안의 평상시 하루 권장 지출액(dailyRecommendedAmount)을 계산하세요.
6. 취미 예산 10% 룰에 대한 피드백도 함께 담아주세요.
7. 말투는 따뜻하고 친절하며 격려하는 손글씨 다이어리 말투(~해요, ~해볼까요?)로 작성해주세요.
`;

    const liveKey = getLiveApiKey();
    if (!liveKey) {
      return NextResponse.json(
        {
          success: false,
          error: '.env.local 파일에 GEMINI_API_KEY가 설정되지 않았습니다.',
        },
        { status: 500 }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: liveKey,
    });

    // gemini-3.8-flash 및 지원되는 최신 모델들 (종료된 2.5 제외)
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
    ];

    let lastError: any = null;
    let resultObj: any = null;

    for (const modelName of candidateModels) {
      try {
        const result = await generateObject({
          model: google(modelName),
          schema: planSchema,
          prompt,
        });
        resultObj = result.object;
        break; // 성공 시 루프 탈출
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Plan] ${modelName} 호출 실패:`, err.message || err);
      }
    }

    if (!resultObj) {
      const errMsg = lastError?.message || '';
      if (errMsg.includes('Quota exceeded') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('구글 Gemini 무료 사용량(분당 또는 일일 쿼터)이 일시 초과되었습니다. 잠시 후 다시 시도하시거나 새 API 키로 교체해주세요.');
      }
      throw lastError || new Error('모든 AI 모델이 현재 일시적으로 혼잡합니다.');
    }

    return NextResponse.json({
      success: true,
      data: {
        ...resultObj,
        remainingDays,
      },
    });
  } catch (error: any) {
    console.error('AI plan generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI 계획 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 }
    );
  }
}
