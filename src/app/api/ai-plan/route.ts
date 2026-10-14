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
  daily_goal: z.string().describe('기존 목표 유지 가능 여부 판단 후 그대로 반환하거나 수정한 목표 1문장, 없으면 하루 권장 소비액 포함 새 목표 1문장'),
  specific_warning: z.string().describe('취약 카테고리 지출 내역을 참고하여 구체적으로 어떤 소비를 주의하고 줄여야 하는지 1문장 경고'),
  hobby_cheer: z.string().describe('남은 취미 예산과 저축 달성률을 연관 지어 스트레스 없는 소비 또는 저축 동기부여를 위한 따뜻하고 재치 있는 조언 1문장'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      remaining_budget = 0,
      remaining_days = 1,
      event_count = 0,
      vulnerable_category = '식비',
      remaining_hobby_budget = 0,
      savings_progress_percent = 0,
      existing_goal = '없음',
    } = body;

    const prompt = `
당신은 똑똑하고 따뜻한 가계부 AI 코치입니다. 사용자의 재정 상태를 바탕으로 빠르게 핵심 조언을 생성해주세요.

[입력 데이터]
- 이번 달 남은 예산: ${Number(remaining_budget).toLocaleString()}원
- 이번 달 남은 일수: ${remaining_days}일
- 남은 이벤트/약속 횟수: ${event_count}회
- 과거 지출 내역 기반 취약 카테고리: ${vulnerable_category}
- 이번 달 남은 취미 예산 (10% 한도): ${Number(remaining_hobby_budget).toLocaleString()}원
- 연간 저축(돼지저금통) 달성률: ${savings_progress_percent}%
- 사용자가 이미 설정해 둔 이번 달 목표: ${existing_goal || '없음'}

[요구사항]
1. event_advice:
   - 남은 이벤트/약속 횟수는 ${event_count}회입니다 (이미 지나간 과거 약속은 제외된 앞으로의 남은 약속 횟수입니다).
   - 남은 ${Number(remaining_budget).toLocaleString()}원과 남은 ${remaining_days}일을 고려할 때, 앞으로 남은 ${event_count}번의 약속에서 1회당 얼마씩 쓰는 것이 좋은지 정확히 ${event_count}번의 약속을 기준으로 1문장으로 제안해주세요. (만약 0회라면 앞으로 남은 약속이 없으므로 일상 지출 관리에 대한 팁을 1문장으로 제안)
2. daily_goal: 
   - 만약 "${existing_goal}"이 "null"이나 "없음"이 아니라면, 현재 남은 예산(${Number(remaining_budget).toLocaleString()}원)으로 그 목표를 유지할 수 있는지 판단해. 유지가 가능하면 기존 목표를 그대로 반환하고, 수정이 불가피하면 상황에 맞춰 수정한 목표를 1문장으로 제시.
   - 만약 "없음"이라면, 남은 일수(${remaining_days}일)와 예산(${Number(remaining_budget).toLocaleString()}원)을 바탕으로 하루 권장 소비액을 포함한 새로운 목표를 1문장으로 제시.
3. specific_warning: ${vulnerable_category} 지출 내역을 참고하여 구체적으로 어떤 소비를 주의하고 줄여야 하는지 1문장으로 경고.
4. hobby_cheer: ${Number(remaining_hobby_budget).toLocaleString()}원의 남은 취미 예산과 ${savings_progress_percent}%의 저축 달성률을 연관 지어, 스트레스 없는 소비 또는 저축 동기부여를 위한 따뜻하고 재치 있는 조언 1문장 작성.

[출력 형식 (반드시 유효한 JSON)]
{
  "event_advice": "",
  "daily_goal": "",
  "specific_warning": "",
  "hobby_cheer": ""
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
