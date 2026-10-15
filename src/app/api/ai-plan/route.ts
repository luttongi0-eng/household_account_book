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
  event_advice: z.string().describe('남은 예산과 일수를 고려할 때, 남은 약속 횟수에서 1회당 얼마씩 쓰는 것이 좋은지 1문장 제안'),
  daily_goal: z.string().describe('남은 기간 동안의 한달 지출 목표와 하루 권장 지출액을 상세하고 구체적인 계획으로 2~3문장 설명'),
  specific_warning: z.string().describe('실제 지출 내역에서 발견된 구체적인 소비 누수 항목(품목명, 잦은 지출 패턴 등)을 짚고, 이를 어떻게 줄여야 하는지 구체적이고 현실적인 행동 요령을 담아 2~3문장으로 상세히 분석 및 경고'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      remaining_budget = 0,
      remaining_days = 1,
      event_count = 0,
      upcoming_appointments = [],
      vulnerable_category = '식비',
      remaining_hobby_budget = 0,
      savings_progress_percent = 0,
      existing_goal = '없음',
      recent_expenses = [],
    } = body;

    const prompt = `
당신은 정확하고 현실적인 가계부 재정 분석 전문가입니다. 사용자의 재정 상태와 실제 소비 내역을 분석하여, 피상적인 조언 대신 **구체적인 품목과 수치를 들어 자세하고 실천 가능한 설명**을 제공해주세요. 감성적인 응원이나 칭찬은 배제합니다.

[입력 데이터]
- 이번 달 남은 생활비 예산: ${Number(remaining_budget).toLocaleString()}원
- 이번 달 남은 일수: ${remaining_days}일
- 남은 이벤트/약속 횟수: ${event_count}회
- 앞으로 남은 약속 목록:
${upcoming_appointments && upcoming_appointments.length > 0 ? upcoming_appointments.map((a: any) => `- ${a.date}: ${a.title} ${a.memo ? `(${a.memo})` : ''} ${a.estimatedAmount > 0 ? `[예상 ${a.estimatedAmount.toLocaleString()}원]` : ''}`).join('\n') : '남은 약속 없음'}
- 변동 지출 취약 카테고리: ${vulnerable_category}
- 이번 달 남은 취미 예산 (10% 한도): ${Number(remaining_hobby_budget).toLocaleString()}원
- 연간 저축(돼지저금통) 달성률: ${savings_progress_percent}%
- 사용자가 설정한 이번 달 목표: ${existing_goal || '없음'}
- 최근 실제 지출 내역:
${recent_expenses && recent_expenses.length > 0 ? recent_expenses.map((e: string) => `- ${e}`).join('\n') : '최근 지출 내역 없음'}

[상세 작성 가이드]
1. event_advice:
   - 남은 예산 ${Number(remaining_budget).toLocaleString()}원과 남은 ${remaining_days}일을 고려할 때, 앞으로 남은 ${event_count}번의 약속에서 1회당 얼마(총 약속 예산 = 1회당 권장액 × ${event_count}회)를 배정하는 것이 적절한지 구체적인 1회당 권장 금액을 명시하여 1문장으로 제안해주세요. (약속이 0회인 경우 일상 지출 관리에 대한 팁을 1문장으로 제안)

2. daily_goal (★매우 중요 - 약속 예산 차감 후 순수 일상 지출액 계산):
   - 1번(event_advice)에서 약속용으로 배정한 총 금액(예: 1회당 A원 × ${event_count}회 = 총 약속비 B원)을 전체 남은 예산(${Number(remaining_budget).toLocaleString()}원)에서 먼저 차감하세요.
   - 차감하고 남은 순수 일상 생활비(남은 예산 - 총 약속비)를 남은 ${remaining_days}일로 나눈 **"약속 비용을 제외한 하루 순수 권장 소비액"**을 정확한 숫자로 계산하여 제시하세요.
   - "약속 비용으로 총 B원을 떼어두면, 남은 ${remaining_days}일 동안 하루에 약 C원씩 쓸 수 있습니다"라는 계산 과정을 포함하여, 기존 목표("${existing_goal}")를 지키기 위한 구체적인 배분 가이드를 2~3문장으로 명확히 설명해주세요.

3. specific_warning (주의해야 할 소비 누수 항목 정밀 분석 및 행동 요령):
   - 보험금이나 공과금 같은 고정비는 임의로 줄일 수 없으므로 언급하지 마세요.
   - 최근 지출 내역(예: 다이소 소액 구매, 간식, 외식 등)과 ${vulnerable_category} 지출 패턴을 직접 인용하여, 어떤 지출들이 쌓여 누수가 발생하고 있는지 구체적으로 지적하세요.
   - 이를 효과적으로 차단하기 위해 실생활에서 바로 실천할 수 있는 구체적인 행동 수칙(예: 결제 전 장바구니 하루 보류, 편의점 방문 횟수 제한 등)을 포함하여 2~3문장으로 자세하고 친절하게 설명해주세요.

[출력 형식 (반드시 유효한 JSON)]
{
  "event_advice": "",
  "daily_goal": "",
  "specific_warning": ""
}
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

    // 현재 구글 API 키에서 가장 빠르고 성공률 높은 모델 순서로 배치
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
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
        remaining_days,
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
