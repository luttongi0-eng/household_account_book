'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/account';
import { X, Trash2, Calendar, Sparkles } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const EXPENSE_CATEGORIES = [
  { cat: '생활비', sub: '식비' },
  { cat: '생활비', sub: '교통/통신' },
  { cat: '생활비', sub: '쇼핑' },
  { cat: '생활비', sub: '주거' },
  { cat: '생활비', sub: '보험금' },
  { cat: '취미', sub: '게임/구독' },
  { cat: '취미', sub: '도서/공연' },
  { cat: '취미', sub: '기타' },
  { cat: '경조사', sub: '축의금/모임' },
  { cat: '기타', sub: '기타' },
];

const INCOME_CATEGORIES = [
  { cat: '급여', sub: '월급' },
  { cat: '급여', sub: '주급' },
  { cat: '급여', sub: '상여금' },
  { cat: '부수입', sub: '용돈' },
  { cat: '부수입', sub: '투자/기타' },
];

const PAYMENT_METHODS = ['카드', '현금', '계좌이체', '네이버/카카오페이'];

export default function CalendarModal({
  isOpen,
  onClose,
  year,
  month,
  selectedDate,
  onSelectDate,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onPrevMonth,
  onNextMonth,
}: CalendarModalProps) {
  const [type, setType] = useState<'expense' | 'income' | 'savings'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryItem, setCategoryItem] = useState<{ cat: string; sub: string }>(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('카드');
  const [isAppointment, setIsAppointment] = useState<boolean>(false);
  const [memo, setMemo] = useState<string>('');

  if (!isOpen) return null;

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const selectedDateTxs = transactions.filter((t) => t.date === selectedDate);
  const selectedExpenseTotal = selectedDateTxs
    .filter((t) => t.type === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0);
  const selectedIncomeTotal = selectedDateTxs
    .filter((t) => t.type === 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = amount.replace(/,/g, '').trim();
    const numAmount = rawAmount === '' ? 0 : parseInt(rawAmount, 10);

    // 약속/이벤트가 아닌 일반 거래일 때만 금액 필수 입력 검증
    if (!isAppointment && (isNaN(numAmount) || numAmount <= 0)) {
      alert('올바른 금액을 입력해주세요!');
      return;
    }

    const finalDescription = description.trim() || (isAppointment ? (memo.trim() || '약속 일정') : '');
    if (!finalDescription) {
      alert('내용이나 약속 메모를 입력해주세요!');
      return;
    }

    onAddTransaction({
      date: selectedDate,
      type,
      amount: isNaN(numAmount) ? 0 : numAmount,
      category: isAppointment ? '약속/이벤트' : categoryItem.cat,
      subCategory: isAppointment ? '약속/이벤트' : categoryItem.sub,
      description: finalDescription,
      paymentMethod,
      isAppointment,
      memo: isAppointment ? (memo.trim() || finalDescription) : memo.trim(),
    });

    setAmount('');
    setDescription('');
    setMemo('');
    setIsAppointment(false);
  };

  const handleQuickStamp = (stampText: string) => {
    onAddTransaction({
      date: selectedDate,
      type: 'expense',
      amount: 0,
      category: '생활비',
      subCategory: '식비',
      description: stampText,
      paymentMethod: '현금',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#FDFBF7] p-5 sm:p-8 rounded-3xl crayon-border-modal shadow-handdrawn-xl text-stone-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-stone-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔍📅</span>
            <div>
              <h2 className="font-crayon text-3xl sm:text-4xl font-bold text-stone-900">
                달력 크게 보기 &amp; 상세 기록장
              </h2>
              <p className="text-sm text-stone-600 font-body">
                날짜를 선택하여 구글 시트에 실시간 저장하고 관리해보세요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-red-500 rounded-full hover:bg-stone-200 transition-colors font-bold text-xl"
            title="닫기"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Enlarged Calendar (Col 7) */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl crayon-border shadow-handdrawn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrevMonth}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-400 font-crayon font-bold text-sm"
                >
                  &lt; 이전달
                </button>
                <h3 className="font-crayon text-2xl font-bold text-stone-800">
                  {year}년 {month}월 달력
                </h3>
                <button
                  type="button"
                  onClick={onNextMonth}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-400 font-crayon font-bold text-sm"
                >
                  다음달 &gt;
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-crayon">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> 지출
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> 수입
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 약속
                </span>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center font-crayon text-base font-bold mb-2 pb-1 border-b border-stone-300">
              <div className="text-red-500">일</div>
              <div className="text-stone-700">월</div>
              <div className="text-stone-700">화</div>
              <div className="text-stone-700">수</div>
              <div className="text-stone-700">목</div>
              <div className="text-stone-700">금</div>
              <div className="text-blue-600">토</div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 font-crayon">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[80px] bg-stone-50/40 rounded-lg border border-dashed border-stone-200 opacity-30" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;

                const dayTxs = transactions.filter((t) => t.date === dateStr);
                const dayExpense = dayTxs
                  .filter((t) => t.type === 'expense')
                  .reduce((acc, cur) => acc + cur.amount, 0);
                const dayIncome = dayTxs
                  .filter((t) => t.type === 'income')
                  .reduce((acc, cur) => acc + cur.amount, 0);
                const hasAppointment = dayTxs.some((t) => t.isAppointment || Boolean(t.memo));
                const zeroExpenseStamp = dayTxs.find((t) => t.amount === 0 && (t.description.includes('무지출') || t.description.includes('0원')));

                const dayOfWeek = (firstDayOfWeek + i) % 7;
                const isSun = dayOfWeek === 0;
                const isSat = dayOfWeek === 6;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => onSelectDate(dateStr)}
                    className={`min-h-[72px] sm:min-h-[82px] p-1 rounded-xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer relative ${
                      isSelected
                        ? 'border-crayonOrange bg-orange-50/80 shadow-md scale-102 ring-2 ring-orange-300'
                        : 'border-stone-200 bg-[#FFFDF7] hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isSun ? 'text-red-500' : isSat ? 'text-blue-600' : 'text-stone-700'
                        }`}
                      >
                        {day}
                      </span>
                      {hasAppointment && (
                        <span className="text-xs" title="약속 있음">
                          📌
                        </span>
                      )}
                    </div>

                    <div className="w-full space-y-0.5 my-auto">
                      {zeroExpenseStamp ? (
                        <div className="text-[10px] sm:text-xs text-center bg-green-100 text-green-800 rounded px-0.5 border border-green-300 font-bold truncate">
                          ★ 무지출
                        </div>
                      ) : (
                        <>
                          {dayIncome > 0 && (
                            <div className="text-[9px] sm:text-[11px] bg-blue-100 text-blue-900 rounded px-1 py-0.5 text-center font-black truncate border border-blue-200">
                              +₩{dayIncome.toLocaleString()}
                            </div>
                          )}
                          {dayExpense > 0 && (
                            <div className="text-[9px] sm:text-[11px] bg-red-100 text-red-900 rounded px-1 py-0.5 text-center font-black truncate border border-red-200">
                              -₩{dayExpense.toLocaleString()}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {dayTxs.length > 0 && (
                      <div className="text-[9px] text-stone-400 text-right">
                        {dayTxs.length}건
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Date Detail & Entry Form (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#FFFDF9] p-4 sm:p-5 rounded-2xl crayon-border shadow-handdrawn">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-dashed border-stone-300">
                <div className="font-crayon text-2xl font-bold text-stone-800 flex items-center gap-2">
                  <Calendar size={22} className="text-crayonOrange" />
                  <span>{selectedDate} 기록</span>
                </div>
                <div className="text-xs font-crayon flex gap-2">
                  <span className="text-blue-600 font-bold">
                    수입 +{selectedIncomeTotal.toLocaleString()}원
                  </span>
                  <span className="text-red-500 font-bold">
                    지출 -{selectedExpenseTotal.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Transactions List */}
              <div className="max-h-[170px] overflow-y-auto space-y-2 pr-1 mb-3">
                {selectedDateTxs.length === 0 ? (
                  <div className="text-center py-6 text-stone-400 font-crayon text-base">
                    아직 등록된 기록이 없어요! 🍃
                    <div className="mt-2 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickStamp('★ 무지출!')}
                        className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-300 rounded-full hover:bg-green-100 font-bold"
                      >
                        ★ 무지출 스탬프 쾅!
                      </button>
                    </div>
                  </div>
                ) : (
                  selectedDateTxs.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-xl border border-stone-300 flex items-center justify-between shadow-xs font-crayon text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                            item.isAppointment || item.category === '약속/이벤트' || item.subCategory === '약속/이벤트'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : item.type === 'income'
                              ? 'bg-blue-100 text-blue-700'
                              : item.category === '취미'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {item.isAppointment ? '약속/이벤트' : (item.subCategory || item.category)}
                        </span>
                        <div>
                          <div className="font-bold text-stone-800 flex items-center gap-1">
                            {item.description}
                            {(item.isAppointment || item.memo) && <span title="약속">📌</span>}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            {item.paymentMethod} {item.memo && `• ${item.memo}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-base ${
                            item.type === 'income' ? 'text-blue-600' : 'text-red-600'
                          }`}
                        >
                          {item.type === 'income' ? '+' : '-'}₩
                          {item.amount.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(item.id)}
                          className="text-stone-400 hover:text-red-500 p-1"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-[#FFF8E7] p-4 sm:p-5 rounded-2xl crayon-border shadow-handdrawn flex-1 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-crayon text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-crayonOrange" />
                  <span>크레파스로 새로 적기</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 mb-3 font-crayon">
                  <button
                    type="button"
                    onClick={() => {
                      setType('expense');
                      setCategoryItem(EXPENSE_CATEGORIES[0]);
                    }}
                    className={`py-1.5 rounded-xl border-2 font-bold text-base transition-all ${
                      type === 'expense'
                        ? 'bg-red-500 text-white border-stone-800 shadow-sm'
                        : 'bg-white text-stone-600 border-stone-300'
                    }`}
                  >
                    💸 지출 기록
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType('income');
                      setCategoryItem(INCOME_CATEGORIES[0]);
                    }}
                    className={`py-1.5 rounded-xl border-2 font-bold text-base transition-all ${
                      type === 'income'
                        ? 'bg-blue-600 text-white border-stone-800 shadow-sm'
                        : 'bg-white text-stone-600 border-stone-300'
                    }`}
                  >
                    💰 수입 기록
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2 font-crayon">
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">
                      금액 (원) {isAppointment && <span className="text-amber-700">(선택 입력)</span>}
                    </label>
                    <input
                      type="number"
                      placeholder={isAppointment ? '예상 금액 (비워도 됨)' : '예: 15000'}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-400 text-stone-800 text-base font-bold bg-white focus:border-crayonOrange outline-none"
                      required={!isAppointment}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">카테고리(대분류/소분류)</label>
                    <select
                      value={`${categoryItem.cat}-${categoryItem.sub}`}
                      onChange={(e) => {
                        const [c, s] = e.target.value.split('-');
                        setCategoryItem({ cat: c, sub: s });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-400 text-stone-800 text-sm font-bold bg-white focus:border-crayonOrange outline-none"
                    >
                      {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((item) => (
                        <option key={`${item.cat}-${item.sub}`} value={`${item.cat}-${item.sub}`}>
                          [{item.cat}] {item.sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2 font-crayon">
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">
                      내용 / 이유 {isAppointment && <span className="text-amber-700">(선택 입력)</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={isAppointment ? '예: 친구 모임 (비워도 됨)' : '예: 친구와 점심, 책 구매'}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-400 text-stone-800 text-sm font-bold bg-white focus:border-crayonOrange outline-none"
                      required={!isAppointment}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-600 block mb-1">결제 / 수입 방식</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-400 text-stone-800 text-sm font-bold bg-white focus:border-crayonOrange outline-none"
                    >
                      {PAYMENT_METHODS.map((pm) => (
                        <option key={pm} value={pm}>
                          {pm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-2 bg-amber-100/70 rounded-xl border border-amber-300 mb-3 font-crayon">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-amber-900">
                    <input
                      type="checkbox"
                      checked={isAppointment}
                      onChange={(e) => setIsAppointment(e.target.checked)}
                      className="w-4 h-4 text-crayonOrange rounded border-stone-600"
                    />
                    <span>📌 약속/이벤트 날짜로 지정</span>
                  </label>
                  {isAppointment && (
                    <input
                      type="text"
                      placeholder="약속 상세 메모 (예: 친구 생일파티, 청첩장 모임)"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="w-full mt-1.5 px-2 py-1 rounded bg-white text-xs border border-amber-400 outline-none"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF9F45] text-stone-900 font-crayon text-xl font-black rounded-xl crayon-border shadow-handdrawn hover:bg-orange-400 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🖍️ 크레파스로 적기</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
