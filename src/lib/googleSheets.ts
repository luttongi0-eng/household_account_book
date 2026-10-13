import { Transaction, MonthlyResolution } from '@/types/account';

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

/**
 * Transactions 가져오기 (GET)
 */
export async function fetchTransactionsFromSheet(): Promise<Transaction[]> {
  if (!SCRIPT_URL) return [];
  try {
    const res = await fetch(`${SCRIPT_URL}?sheet=transactions`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id: item.id || `tx-${Date.now()}-${Math.random()}`,
        date: item.date || new Date().toISOString().slice(0, 10),
        type: item.type === '수입' ? 'income' : item.type === '저축' ? 'savings' : 'expense',
        category: item.category || '생활비',
        subCategory: item.sub_category || item.category || '',
        description: item.description || '',
        amount: Number(item.amount) || 0,
        paymentMethod: item.payment_method || '카드',
        isAppointment: Boolean((item.memo && item.memo.trim() !== '') || item.category === '약속/이벤트' || item.sub_category === '약속/이벤트'),
        memo: item.memo || '',
      }));
    }
  } catch (error) {
    console.error('Failed to fetch transactions from Google Sheet:', error);
  }
  return [];
}

/**
 * Transaction 생성 (POST)
 */
export async function addTransactionToSheet(tx: Transaction): Promise<boolean> {
  if (!SCRIPT_URL) return false;
  try {
    const typeKorean = tx.type === 'income' ? '수입' : tx.type === 'savings' ? '저축' : '지출';
    const payload = {
      sheet: 'transactions',
      action: 'create',
      data: {
        id: tx.id,
        date: tx.date,
        type: typeKorean,
        category: tx.category,
        sub_category: tx.subCategory || tx.category,
        description: tx.description,
        amount: tx.amount,
        payment_method: tx.paymentMethod,
        memo: tx.memo || '',
      },
    };

    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('Failed to add transaction to Google Sheet:', error);
    return false;
  }
}

/**
 * Transaction 삭제 (POST)
 */
export async function deleteTransactionFromSheet(id: string): Promise<boolean> {
  if (!SCRIPT_URL) return false;
  try {
    const payload = {
      sheet: 'transactions',
      action: 'delete',
      data: { id },
    };
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('Failed to delete transaction from Google Sheet:', error);
    return false;
  }
}

/**
 * Settings 저장 (POST)
 */
export async function saveSettingToSheet(settingItem: string, value: number, unit = '원', note = ''): Promise<boolean> {
  if (!SCRIPT_URL) return false;
  try {
    const payload = {
      sheet: 'settings',
      action: 'set',
      data: { setting_item: settingItem, value, unit, note },
    };
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('Failed to save setting to Google Sheet:', error);
    return false;
  }
}

/**
 * Settings 조회 (GET) - 저축 목표, 누적 저축액 등 가져오기
 */
export async function fetchSettingsFromSheet(): Promise<{ [key: string]: number }> {
  if (!SCRIPT_URL) return {};
  try {
    const res = await fetch(`${SCRIPT_URL}?sheet=settings`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const map: { [key: string]: number } = {};
      json.data.forEach((item: any) => {
        if (item.setting_item && item.value !== undefined) {
          map[item.setting_item] = Number(item.value);
        }
      });
      return map;
    }
  } catch (error) {
    console.error('Failed to fetch settings from Google Sheet:', error);
  }
  return {};
}

/**
 * Monthly Summary 저장 (POST)
 */
export async function saveMonthlySummaryToSheet(summary: MonthlyResolution): Promise<boolean> {
  if (!SCRIPT_URL) return false;
  try {
    const payload = {
      sheet: 'monthly_summary',
      action: 'set',
      data: {
        month: summary.month,
        resolution: summary.resolution,
        target_budget: summary.targetBudget,
        actual_expense: summary.actualExpense || 0,
        is_goal_achieved: summary.isGoalAchieved || 'N',
        is_hobby_exceeded: summary.isHobbyExceeded || 'N',
      },
    };
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('Failed to save monthly summary to Google Sheet:', error);
    return false;
  }
}

/**
 * Monthly Summary 조회 (GET)
 */
export async function fetchMonthlySummaries(): Promise<MonthlyResolution[]> {
  if (!SCRIPT_URL) return [];
  try {
    const res = await fetch(`${SCRIPT_URL}?sheet=monthly_summary`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        month: item.month,
        resolution: item.resolution,
        targetBudget: Number(item.target_budget) || 0,
        actualExpense: Number(item.actual_expense) || 0,
        isGoalAchieved: item.is_goal_achieved,
        isHobbyExceeded: item.is_hobby_exceeded,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch monthly summaries:', error);
  }
  return [];
}
