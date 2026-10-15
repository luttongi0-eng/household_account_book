'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { INITIAL_TRANSACTIONS } from '@/data/initialData';
import { Transaction, AiPlanResult, MonthlyResolution } from '@/types/account';
import CalendarModal from '@/components/CalendarModal';
import PiggyBankModal from '@/components/PiggyBankModal';
import ExcelSync from '@/components/ExcelSync';
import HobbyBudgetCard from '@/components/HobbyBudgetCard';
import MonthlyStickyNote from '@/components/MonthlyStickyNote';
import MonthlyReportModal from '@/components/MonthlyReportModal';
import BudgetSettingModal from '@/components/BudgetSettingModal';
import {
  fetchTransactionsFromSheet,
  addTransactionToSheet,
  updateTransactionInSheet,
  deleteTransactionFromSheet,
  saveSettingToSheet,
  fetchSettingsFromSheet,
  saveMonthlySummaryToSheet,
  fetchMonthlySummaries,
} from '@/lib/googleSheets';
import { Calendar as CalendarIcon, RefreshCw, Plus, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

export default function Home() {
  // Current view date (year & month navigation)
  const [currentDate, setCurrentDate] = useState(() => dayjs('2026-10-14'));
  const [todayStr, setTodayStr] = useState('2026-10-14');
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month() + 1; // 1-12
  const currentMonthStr = currentDate.format('YYYY-MM');

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isPiggyModalOpen, setIsPiggyModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Piggy bank state
  const [savingsTarget, setSavingsTarget] = useState(600000);
  const [currentSaved, setCurrentSaved] = useState(450000);

  // Monthly Resolution (다짐 포스트잇 및 예산)
  const [resolutions, setResolutions] = useState<MonthlyResolution[]>([
    {
      month: '2026-10',
      resolution: '외식 주 1회로 줄이고 남은 생활비로 저축 45만원 안전 확보하기! 🍱',
      targetBudget: 2000000,
    },
  ]);

  const currentResolution = resolutions.find((r) => r.month === currentMonthStr) || {
    month: currentMonthStr,
    resolution: '이번 달도 알뜰살뜰 아껴서 목표 달성하기!',
    targetBudget: 2000000,
  };

  // Monthly Retrospective Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [prevMonthStr, setPrevMonthStr] = useState(currentDate.subtract(1, 'month').format('YYYY-MM'));

  // Custom User Plan items (남은 한달 계획에 직접 추가하는 기능)
  const [customPlanInput, setCustomPlanInput] = useState('');

  // AI Plan state
  const [aiPlan, setAiPlan] = useState<AiPlanResult>({
    event_advice: '이번 달 약속과 일정을 고려한 맞춤 소비 계획을 AI로 계산해보세요!',
    daily_goal: '하루 권장 소비액을 지키며 이번 달 예산과 저축 목표를 달성해보세요!',
    specific_warning: '식비 및 취약 카테고리 지출 내역을 분석해 줄여야 할 낭비 항목을 찾아보세요!',
    checklists: [],
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. Initial Google Sheet Sync on mount & Retrospective check & LocalStorage budget restore
  useEffect(() => {
    async function initData() {
      // LocalStorage budgets and savings backup load
      try {
        const savedBudgets = localStorage.getItem('monthly_resolutions');
        if (savedBudgets) {
          const parsed = JSON.parse(savedBudgets);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResolutions(parsed);
          }
        }
        const cachedTarget = localStorage.getItem('savings_target');
        if (cachedTarget) setSavingsTarget(Number(cachedTarget));
        const cachedSaved = localStorage.getItem('current_saved');
        if (cachedSaved) setCurrentSaved(Number(cachedSaved));
      } catch (e) {
        console.error(e);
      }

      const sheetTxs = await fetchTransactionsFromSheet();
      if (sheetTxs && sheetTxs.length > 0) {
        setTransactions(sheetTxs);
      }

      // Load Settings from Google Sheet (연간저축목표, 현재저축누적)
      const settingsMap = await fetchSettingsFromSheet();
      if (settingsMap['연간저축목표']) {
        setSavingsTarget(settingsMap['연간저축목표']);
        localStorage.setItem('savings_target', settingsMap['연간저축목표'].toString());
      }
      if (settingsMap['현재저축누적']) {
        setCurrentSaved(settingsMap['현재저축누적']);
        localStorage.setItem('current_saved', settingsMap['현재저축누적'].toString());
      }

      // Check Monthly Resolution from sheet
      const summaries = await fetchMonthlySummaries();
      if (summaries && summaries.length > 0) {
        setResolutions(summaries);
        localStorage.setItem('monthly_resolutions', JSON.stringify(summaries));
      }

      // Check if user visited a new month (Local Storage check for retrospective popup)
      const nowFormatted = dayjs().format('YYYY-MM-DD');
      setTodayStr(nowFormatted);
      const lastVisitedMonth = localStorage.getItem('last_visited_month');
      const thisMonth = dayjs().format('YYYY-MM');
      if (lastVisitedMonth && lastVisitedMonth !== thisMonth) {
        setPrevMonthStr(lastVisitedMonth);
        setIsReportModalOpen(true);
      }
      localStorage.setItem('last_visited_month', thisMonth);
    }
    initData();
  }, [currentMonthStr]);

  // Current Month Filtered Transactions
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonthStr));

  // Calculations for current viewing month
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const targetBudget = currentResolution.targetBudget || 2000000;
  const remainingBudget = Math.max(0, targetBudget - totalExpense);

  // 현재 보고 있는 달의 남은 일수 정확한 계산 (오늘 날짜와 해당 달의 일수 비교)
  const today = dayjs(todayStr);
  const currentMonthStart = currentDate.startOf('month');
  const currentMonthEnd = currentDate.endOf('month');
  const daysInMonthCount = currentMonthEnd.date();

  let remainingDays = 1;
  if (today.isBefore(currentMonthStart, 'day')) {
    // 미래 달을 보고 있는 경우: 그 달 전체 일수
    remainingDays = daysInMonthCount;
  } else if (today.isAfter(currentMonthEnd, 'day')) {
    // 과거 달을 보고 있는 경우: 이미 지난 달이므로 0일
    remainingDays = 0;
  } else {
    // 이번 달을 보고 있는 경우: 오늘 날짜부터 말일까지 남은 일수 (오늘 포함)
    remainingDays = currentMonthEnd.date() - today.date() + 1;
  }

  // Hobby 10% rule
  const hobbyBudget = Math.round(totalIncome * 0.1);
  const hobbyExpense = monthTransactions
    .filter((t) => t.type === 'expense' && (t.category === '취미' || t.subCategory?.includes('취미') || t.subCategory?.includes('게임')))
    .reduce((acc, cur) => acc + cur.amount, 0);

  // Category breakdown for crayon bar chart
  const categoriesList = ['생활비', '취미', '경조사', '기타'];
  const categoryExpenses = categoriesList.map((cat) => {
    const sum = monthTransactions
      .filter((t) => t.type === 'expense' && (t.category === cat || (!categoriesList.includes(t.category) && cat === '생활비')))
      .reduce((acc, cur) => acc + cur.amount, 0);
    return { category: cat, sum };
  });

  const validExpenseSum = categoryExpenses.reduce((acc, cur) => acc + cur.sum, 0) || totalExpense || 1;

  // Month Navigation
  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, 'month'));
  };

  // Add transaction (Local + Google Sheet Sync)
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [...prev, created]);
    await addTransactionToSheet(created);
  };

  // Update transaction (Local + Google Sheet Sync)
  const handleUpdateTransaction = async (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
    await updateTransactionInSheet(updatedTx);
  };

  // Delete transaction (Local + Google Sheet Sync)
  const handleDeleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    await deleteTransactionFromSheet(id);
  };

  // Piggy bank update
  const handleUpdatePiggy = async (newTarget: number, newSaved: number) => {
    setSavingsTarget(newTarget);
    setCurrentSaved(newSaved);
    localStorage.setItem('savings_target', newTarget.toString());
    localStorage.setItem('current_saved', newSaved.toString());
    await saveSettingToSheet('연간저축목표', newTarget, '원', '돼지저금통 연간 목표');
    await saveSettingToSheet('현재저축누적', newSaved, '원', '현재까지 모은 저축액');
  };

  // Save Resolution / Budget (Local + Google Sheet Sync + LocalStorage)
  const handleSaveResolution = async (newRes: MonthlyResolution) => {
    const updated = resolutions.filter((r) => r.month !== newRes.month);
    const nextList = [...updated, newRes];
    setResolutions(nextList);
    localStorage.setItem('monthly_resolutions', JSON.stringify(nextList));

    await saveMonthlySummaryToSheet({
      ...newRes,
      actualExpense: totalExpense,
      isGoalAchieved: totalExpense <= newRes.targetBudget ? 'Y' : 'N',
      isHobbyExceeded: hobbyExpense > hobbyBudget ? 'Y' : 'N',
    });
  };

  const handleSaveBudgetOnly = async (newBudget: number) => {
    const newRes: MonthlyResolution = {
      ...currentResolution,
      targetBudget: newBudget,
    };
    await handleSaveResolution(newRes);
  };

  // Add custom plan checklist item
  const handleAddCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPlanInput.trim()) return;
    setAiPlan((prev) => ({
      ...prev,
      checklists: [...prev.checklists, { text: customPlanInput.trim(), completed: false }],
    }));
    setCustomPlanInput('');
  };

  // Fetch AI Plan from Gemini (초고속 4대 핵심 조언)
  const fetchAiPlan = async () => {
    setIsAiLoading(true);
    try {
      // 남은(오늘 포함 미래) 이벤트/약속 목록 (이미 지난 과거의 약속은 제외)
      const upcomingAppointments = monthTransactions
        .filter(
          (t) =>
            (t.isAppointment ||
              t.category === '약속/이벤트' ||
              t.subCategory === '약속/이벤트' ||
              Boolean(t.memo && t.memo.trim())) &&
            t.date >= todayStr
        )
        .map((t) => ({
          date: t.date,
          title: t.description || t.memo || '약속',
          memo: t.memo || '',
          estimatedAmount: t.amount > 0 ? t.amount : 0,
        }));

      const eventCount = upcomingAppointments.length;

      // 과거 변동 지출 내역 기반 취약 카테고리 (보험금, 주거 등 고정비 제외하고 실제 줄일 수 있는 식비, 쇼핑, 취미 등 변동비 대상)
      const fixedCategories = ['보험금', '주거', '통신', '교통/통신'];
      const expenseMap: { [cat: string]: number } = {};
      monthTransactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
          const key = t.subCategory || t.category;
          if (!fixedCategories.includes(key)) {
            expenseMap[key] = (expenseMap[key] || 0) + t.amount;
          }
        });

      let vulnerableCategory = '식비';
      let maxExpense = 0;
      Object.entries(expenseMap).forEach(([cat, sum]) => {
        if (sum > maxExpense) {
          maxExpense = sum;
          vulnerableCategory = cat;
        }
      });

      // 남은 취미 예산 (취미 예산 한도 - 현재 취미 지출)
      const remainingHobbyBudget = Math.max(0, hobbyBudget - hobbyExpense);

      // 연간 저축 달성률
      const savingsProgressPercent = piggyPercent;

      // 이미 설정된 목표 (포스트잇 다짐)
      const existingGoal = currentResolution.resolution?.trim() || '없음';

      // 실제 지출 내역 요약 (최근 15건)
      const recentExpenses = monthTransactions
        .filter((t) => t.type === 'expense' && t.amount > 0)
        .slice(-15)
        .map((t) => `${t.date}: [${t.subCategory || t.category}] ${t.description} (${t.amount.toLocaleString()}원)`);

      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remaining_budget: remainingBudget,
          remaining_days: Math.max(1, remainingDays),
          event_count: eventCount,
          upcoming_appointments: upcomingAppointments,
          vulnerable_category: vulnerableCategory,
          remaining_hobby_budget: remainingHobbyBudget,
          savings_progress_percent: savingsProgressPercent,
          existing_goal: existingGoal,
          recent_expenses: recentExpenses,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiPlan((prev) => ({
          ...prev,
          event_advice: json.data.event_advice || prev.event_advice,
          daily_goal: json.data.daily_goal || prev.daily_goal,
          specific_warning: json.data.specific_warning || prev.specific_warning,
        }));
      } else {
        alert(json.error || 'AI 계획 생성에 실패했습니다.');
      }
    } catch (err: any) {
      console.error(err);
      alert('AI 서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleToggleChecklist = (index: number) => {
    setAiPlan((prev) => {
      const updated = [...prev.checklists];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed,
      };
      return { ...prev, checklists: updated };
    });
  };

  // Piggy bank progress percentage
  const piggyPercent = Math.min(100, Math.round((currentSaved / (savingsTarget || 1)) * 100));

  // Calendar calculations for month
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  return (
    <main
      className="w-full max-w-6xl sketch-board relative pt-8 sm:pt-10 pb-10 sm:pb-12 px-2.5 sm:px-8 md:px-12 crayon-border-round border-2 sm:border-3 text-[#333333]"
      data-purpose="sketchbook-notebook"
    >
      {/* BEGIN: SpiralBinder */}
      <div
        aria-hidden="true"
        className="absolute -top-5 left-0 right-0 flex justify-around px-4 sm:px-8 pointer-events-none"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="spiral-ring"></div>
            <div className="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div>
          </div>
        ))}
      </div>
      {/* END: SpiralBinder */}

      {/* BEGIN: HeaderSection */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b-4 border-dashed border-[#B8AEA3] pb-4 sm:pb-6 mb-6 sm:mb-8 mt-2 gap-3">
        <div className="w-full sm:w-auto">
          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-3xl sm:text-4xl select-none shrink-0">🖍️</span>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-0.5 sm:p-1 hover:bg-stone-200 rounded-full text-stone-600 cursor-pointer shrink-0"
              title="이전달"
            >
              <ChevronLeft size={26} className="sm:w-7 sm:h-7" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0">
              <h1 className="font-crayon text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#2B2B2B] whitespace-nowrap leading-none drop-shadow-2xs">
                월간 팔레트
              </h1>
              <span className="text-lg sm:text-2xl font-bold bg-[#FFE8E8] text-[#E63946] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl sm:rounded-2xl border-2 border-[#3F3B36] shadow-xs whitespace-nowrap leading-none inline-flex items-center">
                {currentMonth}월
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-0.5 sm:p-1 hover:bg-stone-200 rounded-full text-stone-600 cursor-pointer shrink-0"
              title="다음달"
            >
              <ChevronRight size={26} className="sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>

      </header>
      {/* END: HeaderSection */}

      {/* BEGIN: CalendarSection & Resolution Sticky Note */}
      <section className="mb-10" data-purpose="monthly-calendar-section">
        <div className="w-full">
          {/* Calendar Header with Title on Left, Sticky Note and Piggy Gauge on Right */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            {/* 좌측: 이번 달 달력 타이틀 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="font-crayon text-2xl sm:text-3xl font-bold flex items-center gap-2 text-stone-900">
                📅 이번 달 달력{' '}
                <span className="text-base sm:text-lg font-normal text-stone-600">
                  ({currentYear}년 {currentMonth}월)
                </span>
              </h2>
            </div>

            {/* 우측 상단: 10월 다짐 포스트잇 & 저축 목표 달성률 */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 달력 오른쪽 상단에 위치한 다짐 포스트잇 */}
              <MonthlyStickyNote
                currentMonthStr={currentMonthStr}
                resolution={currentResolution}
                onSaveResolution={handleSaveResolution}
              />

              {/* 저축 진행률 게이지 */}
              <div
                onClick={() => setIsPiggyModalOpen(true)}
                className="flex items-center gap-3 bg-amber-50 px-4 py-1.5 crayon-border rounded-xl cursor-pointer hover:bg-amber-100 transition-colors"
              >
                <span className="font-crayon text-base font-bold text-stone-900">
                  저축 목표 (₩{savingsTarget.toLocaleString()}) 달성률
                </span>
                <div className="w-24 sm:w-32 bg-stone-200 h-4 rounded-full overflow-hidden border border-stone-400">
                  <div
                    className="bg-[#6BCB77] h-full rounded-full relative transition-all duration-500"
                    style={{ width: `${piggyPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12"></div>
                  </div>
                </div>
                <span className="font-crayon font-bold text-base text-stone-800">
                  {piggyPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* 달력 카드 (클릭 시 확대 모달) */}
          <div
            onClick={() => setIsCalendarModalOpen(true)}
            className="bg-white p-2.5 sm:p-4 crayon-border-round shadow-handdrawn cursor-pointer group hover:border-[#FF9F45] transition-colors relative"
            title="달력을 클릭하면 확대창이 열려 상세 내역을 입력할 수 있습니다!"
          >

            <div className="w-full">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-crayon text-sm sm:text-lg font-bold mb-2 pb-1.5 border-b-2 border-stone-300">
                <div className="text-red-500">일</div>
                <div className="text-stone-700">월</div>
                <div className="text-stone-700">화</div>
                <div className="text-stone-700">수</div>
                <div className="text-stone-700">목</div>
                <div className="text-stone-700">금</div>
                <div className="text-blue-600">토</div>
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 font-crayon">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="min-h-[52px] sm:min-h-[80px] p-0.5 sm:p-1 bg-stone-50/50 rounded-lg opacity-40 text-left border border-dashed border-stone-200"
                  />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayTxs = monthTransactions.filter((t) => t.date === dateStr);
                  const isToday = todayStr === dateStr;
                  const isSelected = selectedDate === dateStr;

                  const dayExpenseSum = dayTxs
                    .filter((t) => t.type === 'expense' && t.amount > 0)
                    .reduce((acc, cur) => acc + cur.amount, 0);

                  const dayIncomeSum = dayTxs
                    .filter((t) => t.type === 'income' && t.amount > 0)
                    .reduce((acc, cur) => acc + cur.amount, 0);

                  const firstExpense = dayTxs.find((t) => t.type === 'expense' && t.amount > 0);
                  const zeroStamp = dayTxs.find(
                    (t) => t.amount === 0 && (t.description.includes('무지출') || t.description.includes('0원'))
                  );
                  const hasAppt = dayTxs.some((t) => t.isAppointment || Boolean(t.memo));

                  const dayOfWeek = (firstDayOfWeek + i) % 7;
                  const isSun = dayOfWeek === 0;
                  const isSat = dayOfWeek === 6;

                  return (
                    <div
                      key={day}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(dateStr);
                        setIsCalendarModalOpen(true);
                      }}
                      className={`min-h-[58px] sm:min-h-[84px] p-1 sm:p-1.5 rounded-lg border sm:border-2 flex flex-col justify-between transition-all hover:scale-102 hover:shadow-xs overflow-hidden ${
                        isToday
                          ? 'bg-yellow-50 border-[#FF9F45] shadow-inner ring-1 sm:ring-2 ring-yellow-400/50'
                          : isSelected
                          ? 'bg-orange-50/60 border-orange-400'
                          : 'bg-[#FFFDF7] border-stone-200 hover:border-[#FF9F45]'
                      }`}
                    >
                      <div className="flex justify-between items-center leading-none">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isSun ? 'text-red-500' : isSat ? 'text-blue-600' : 'text-stone-700'
                          }`}
                        >
                          {day}
                          {hasAppt && ' 📌'}
                        </span>
                        {isToday && (
                          <span className="text-[8px] sm:text-[10px] bg-[#FF9F45] text-stone-900 font-black px-0.5 sm:px-1 rounded leading-tight">
                            오늘
                          </span>
                        )}
                      </div>

                      <div className="w-full my-auto space-y-0.5">
                        {zeroStamp ? (
                          <div className="self-center transform -rotate-3 sm:-rotate-6 bg-white px-0.5 sm:px-1.5 py-0.2 sm:py-0.5 border border-[#FF6B6B] sm:border-2 rounded-full shadow-xs text-red-600 font-black text-[8px] sm:text-[11px] text-center truncate">
                            <span className="hidden sm:inline">{zeroStamp.description}</span>
                            <span className="sm:hidden">★무지출</span>
                          </div>
                        ) : dayExpenseSum > 0 ? (
                          <div className="bg-red-50 text-red-700 border border-red-300 rounded px-1 py-0.5 text-center shadow-2xs">
                            <div className="text-[9px] sm:text-xs font-black truncate">
                              -₩{dayExpenseSum.toLocaleString()}
                            </div>
                            {firstExpense && (
                              <div className="text-[8px] sm:text-[10px] text-stone-500 truncate hidden sm:block">
                                {firstExpense.description} {dayTxs.filter(t => t.type === 'expense').length > 1 ? `외 ${dayTxs.filter(t => t.type === 'expense').length - 1}건` : ''}
                              </div>
                            )}
                          </div>
                        ) : dayIncomeSum > 0 ? (
                          <div className="bg-blue-50 text-blue-700 border border-blue-300 rounded px-1 py-0.5 text-center text-[9px] sm:text-xs font-black truncate shadow-2xs">
                            +₩{dayIncomeSum.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-300 text-center block">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 달력 오른쪽 하단: 오늘 쓴 돈 크레파스로 적기 버튼 */}
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(todayStr);
                setIsCalendarModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#FF9F45] text-stone-900 font-crayon font-black text-lg sm:text-xl rounded-xl crayon-border shadow-handdrawn hover:bg-orange-400 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>➕ 오늘 쓴 돈 크레파스로 적기</span>
            </button>
          </div>
        </div>
      </section>
      {/* END: CalendarSection */}

      {/* BEGIN: SummarySection */}
      <section className="mb-10" data-purpose="monthly-summary-section">
        <h2 className="font-crayon text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 text-stone-900">
          ✏️ 한달 요약{' '}
          <span className="text-sm text-stone-600 font-body">({currentMonth}월 실시간 정산)</span>
        </h2>

        {/* 3대 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-[#EBF4FF] p-5 rounded-2xl crayon-border shadow-handdrawn transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between font-crayon">
              <span className="text-xl font-bold text-blue-900">💰 {currentMonth}월 총 수입</span>
              <span className="text-xs bg-blue-200 text-blue-950 px-2 py-0.5 rounded-full font-bold">
                월급+부수입
              </span>
            </div>
            <div className="font-crayon text-3xl font-bold text-blue-950 mt-3">
              ₩{totalIncome.toLocaleString()}
            </div>
            <div className="font-crayon text-sm text-blue-800 font-bold mt-1">
              목표 대비 달성률 100% ✨
            </div>
          </div>

          <div className="bg-[#FFF1F1] p-5 rounded-2xl crayon-border shadow-handdrawn transform rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between font-crayon">
              <span className="text-xl font-bold text-red-800">💸 {currentMonth}월 총 지출</span>
              <span className="text-xs bg-red-200 text-red-950 px-2 py-0.5 rounded-full font-bold">
                예산의 {Math.round((totalExpense / targetBudget) * 100)}%
              </span>
            </div>
            <div className="font-crayon text-3xl font-bold text-red-900 mt-3">
              ₩{totalExpense.toLocaleString()}
            </div>
            <div className="font-crayon text-sm text-red-700 font-bold mt-1">
              목표 예산 대비 절약 관리 중!
            </div>
          </div>

          <div className="bg-[#EDF7ED] p-5 rounded-2xl crayon-border shadow-handdrawn transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between font-crayon">
              <span className="text-xl font-bold text-emerald-900">🌱 남은 한 달 예산</span>
              <button
                type="button"
                onClick={() => setIsBudgetModalOpen(true)}
                className="text-xs bg-emerald-200 hover:bg-emerald-300 text-emerald-950 px-2.5 py-1 rounded-full font-bold border border-emerald-400 flex items-center gap-1 cursor-pointer transition-all"
                title="예산 변경하기"
              >
                <Settings size={12} />
                <span>예산 설정: {Math.round(targetBudget / 10000)}만원</span>
              </button>
            </div>
            <div className="font-crayon text-3xl font-bold text-emerald-950 mt-3">
              ₩{remainingBudget.toLocaleString()}
            </div>
            <div className="font-crayon text-sm text-emerald-800 font-bold mt-1">
              저축 목표 {Math.round(savingsTarget / 10000)}만원 안전 확보! 👍
            </div>
          </div>
        </div>

        {/* 취미 예산 관리 10% 룰 */}
        <div className="mb-6">
          <HobbyBudgetCard hobbyBudget={hobbyBudget} hobbyExpense={hobbyExpense} />
        </div>

        {/* 카테고리별 지출 크레파스 차트 */}
        <div className="bg-[#FFFDF9] p-6 rounded-2xl crayon-border shadow-handdrawn">
          <h3 className="font-crayon text-2xl font-bold text-stone-900 mb-4 flex items-center justify-between">
            <span>🎨 카테고리별 지출 크레파스 차트</span>
            <span className="text-xs font-bold text-stone-600 font-body">
              총 {totalExpense.toLocaleString()}원 기준
            </span>
          </h3>

          <div className="w-full h-8 rounded-xl flex overflow-hidden border-2 border-stone-800 mb-4 p-0.5 bg-stone-100">
            {categoryExpenses.map((item, idx) => {
              const colors = ['bg-[#FF6B6B]', 'bg-[#FF9F45]', 'bg-[#9D4EDD]', 'bg-[#4D96FF]'];
              const pct = Math.max(5, Math.round((item.sum / validExpenseSum) * 100));
              return (
                <div
                  key={item.category}
                  className={`${colors[idx % colors.length]} h-full flex items-center justify-center text-white font-crayon text-xs font-black drop-shadow-xs transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${item.category} ${pct}%`}
                >
                  {item.category} {pct}%
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-crayon">
            {categoryExpenses.map((item, idx) => {
              const icons = ['🍔', '🎮', '💌', '📦'];
              const bgs = [
                'bg-red-50 border-red-300 text-red-700',
                'bg-purple-50 border-purple-300 text-purple-800',
                'bg-amber-50 border-amber-300 text-amber-900',
                'bg-blue-50 border-blue-300 text-blue-800',
              ];
              const pct = Math.round((item.sum / validExpenseSum) * 100);

              return (
                <div
                  key={item.category}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 ${bgs[idx % bgs.length]}`}
                >
                  <span className="text-2xl">{icons[idx]}</span>
                  <div>
                    <div className="text-sm font-black text-stone-800">
                      {item.category} ({pct}%)
                    </div>
                    <div className="text-base font-black">
                      ₩{item.sum.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* END: SummarySection */}

      {/* BEGIN: AiPlanAndReduceSection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* AI 남은 한달 계획 */}
        <section
          className="bg-[#FFFBEA] p-5 sm:p-6 rounded-2xl crayon-border shadow-handdrawn flex flex-col justify-between"
          data-purpose="ai-daily-plan"
        >
          <div>
            <div className="flex items-center justify-between mb-3 border-b-2 border-amber-300 pb-2">
              <h2 className="font-crayon text-2xl md:text-3xl font-bold text-stone-900 flex items-center gap-2">
                🤖 남은 한달 계획{' '}
                <span className="text-xs sm:text-sm font-normal text-stone-700 font-body">
                  [초고속 AI 코칭]
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-amber-200 text-stone-900 text-xs px-2.5 py-1 rounded-full font-black border border-amber-400">
                  남은 {remainingDays}일
                </span>
                <button
                  type="button"
                  onClick={fetchAiPlan}
                  disabled={isAiLoading}
                  className="p-1.5 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-400 text-stone-900 transition-all cursor-pointer flex items-center gap-1 font-crayon text-xs font-bold"
                  title="Gemini AI로 초고속 재계산"
                >
                  <RefreshCw size={14} className={isAiLoading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">AI 분석</span>
                </button>
              </div>
            </div>

            {/* 1. daily_goal: 남은 한달 목표 & 하루 권장 소비 상세 계획 */}
            <div className="bg-white p-4 sm:p-4.5 rounded-xl border-2 border-stone-800 shadow-xs mb-3.5 relative">
              <div className="font-crayon text-base sm:text-lg font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                <span>🎯</span>
                <span>남은 한달 지출 배분 &amp; 하루 소비 가이드</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-body font-bold whitespace-pre-line">
                {aiPlan.daily_goal}
              </p>
            </div>

            {/* 2. event_advice: 남은 약속별 1회당 권장 사용액 제안 */}
            <div className="bg-[#FFF9E6] p-3.5 rounded-xl border border-amber-300 shadow-xs mb-3.5">
              <div className="text-sm font-crayon font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <span>📅</span>
                <span>약속 및 이벤트 지출 조언 (1회당 권장액)</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 font-body leading-relaxed">
                {aiPlan.event_advice}
              </p>
            </div>

            {/* 크레파스 체크리스트 */}
            {aiPlan.checklists && aiPlan.checklists.length > 0 && (
              <div className="space-y-2 font-crayon text-base mb-3">
                {aiPlan.checklists.map((chk, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2.5 p-2 bg-amber-100/70 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors border border-amber-300"
                  >
                    <input
                      type="checkbox"
                      checked={chk.completed}
                      onChange={() => handleToggleChecklist(i)}
                      className="w-4 h-4 text-[#FF9F45] rounded border-2 border-stone-700 focus:ring-0"
                    />
                    <span
                      className={
                        chk.completed ? 'line-through text-stone-400 font-normal' : 'text-stone-900 font-bold'
                      }
                    >
                      {chk.text}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* 나만의 절약 계획 추가 입력창 (모바일 반응형 최적화) */}
            <form onSubmit={handleAddCustomPlan} className="flex flex-col sm:flex-row gap-2 font-crayon mb-2">
              <input
                type="text"
                placeholder="나만의 절약 계획 추가 (예: 배달 대신 집밥)"
                value={customPlanInput}
                onChange={(e) => setCustomPlanInput(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 bg-white border-2 border-stone-400 rounded-xl text-stone-900 font-bold text-sm outline-none focus:border-stone-800"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-[#FF9F45] hover:bg-orange-400 text-stone-900 border-2 border-stone-800 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:translate-y-0.5 transition-all"
              >
                <Plus size={16} /> 추가하기
              </button>
            </form>
          </div>

          <div className="mt-3 pt-2.5 border-t border-amber-300 flex items-center justify-between text-xs font-crayon text-stone-600 font-bold">
            <span>* 초고속 Gemini AI 맞춤 엔진</span>
            <span>* 지출 및 약속 변동 실시간 반영</span>
          </div>
        </section>

        {/* 3. specific_warning: 줄여야 할 소비 항목 정밀 분석 */}
        <section
          className="bg-[#FFF5F5] p-5 sm:p-6 rounded-2xl crayon-border shadow-handdrawn flex flex-col justify-between"
          data-purpose="reduce-spending-advice"
        >
          <div>
            <div className="flex items-center justify-between mb-3 border-b-2 border-red-200 pb-2">
              <h2 className="font-crayon text-2xl md:text-3xl font-bold text-red-950 flex items-center gap-2">
                🚨 줄여야 할 소비 분석{' '}
                <span className="text-xs sm:text-sm font-normal text-red-800 font-body">
                  [소비 누수 탐지기]
                </span>
              </h2>
              <span className="bg-red-200 text-red-950 text-xs px-2.5 py-1 rounded-full font-black border border-red-300">
                AI 정밀 진단
              </span>
            </div>

            {/* specific_warning: 취약 카테고리 소비 누수 정밀 분석 카드 */}
            <div className="bg-white p-4.5 rounded-xl border-2 border-red-400 shadow-xs mb-3.5 relative">
              <div className="flex items-center gap-2 text-red-900 font-crayon text-base sm:text-lg font-black mb-2">
                <span>⚠️</span>
                <span>주의해야 할 소비 누수 항목 분석</span>
              </div>
              <p className="text-sm sm:text-base text-stone-800 font-body font-bold leading-relaxed whitespace-pre-line">
                {aiPlan.specific_warning}
              </p>
            </div>

            {/* 실천 지침 알림 카드 */}
            <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-300 text-stone-700 font-body text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-amber-900 font-crayon text-sm block mb-1">💡 소비 통제 가이드</span>
              지출 패턴 분석을 토대로 불필요한 결제 항목을 줄이고, 정해진 하루 권장 소비액 내에서 지출을 계획해보세요.
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-red-100/80 rounded-xl border border-red-200 text-center font-crayon text-xs sm:text-sm text-red-900 font-black">
            🔍 "불필요한 지출 항목을 점검하고 통제하면 목표 예산을 지킬 수 있어요!"
          </div>
        </section>
      </div>
      {/* END: AiPlanAndReduceSection */}

      {/* BEGIN: QuickActionButton & Footer */}
      <footer
        className="mt-12 pt-8 border-t-2 border-dashed border-[#B8AEA3] flex flex-col sm:flex-row items-center justify-between gap-5 font-crayon"
        data-purpose="footer-controls"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF9A6] border-2 border-stone-800 flex items-center justify-center text-xl shadow-xs">
            🎨
          </div>
          <div>
            <div className="font-bold text-lg text-stone-900 leading-tight">
              월간 팔레트 (Monthly Palette)
            </div>
            <div className="text-xs text-stone-500 font-body">
              크레파스로 칠해가는 나만의 스마트한 지출 기록장
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ExcelSync
            transactions={transactions}
            onImport={(imported) => setTransactions(imported)}
            resolutions={resolutions}
            onImportResolutions={(importedRes) => {
              setResolutions(importedRes);
              localStorage.setItem('monthly_resolutions', JSON.stringify(importedRes));
            }}
          />
        </div>
      </footer>
      {/* END: QuickActionButton */}

      {/* Modals */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        year={currentYear}
        month={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
        transactions={monthTransactions}
        onAddTransaction={handleAddTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <PiggyBankModal
        isOpen={isPiggyModalOpen}
        onClose={() => setIsPiggyModalOpen(false)}
        currentSaved={currentSaved}
        savingsTarget={savingsTarget}
        onUpdateTarget={handleUpdatePiggy}
        currentMonth={currentMonth}
      />

      <MonthlyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        prevMonthStr={prevMonthStr}
        targetBudget={targetBudget}
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        hobbyBudget={hobbyBudget}
        hobbyExpense={hobbyExpense}
      />

      <BudgetSettingModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentMonth={currentMonth}
        currentBudget={targetBudget}
        onSaveBudget={handleSaveBudgetOnly}
      />
    </main>
  );
}
