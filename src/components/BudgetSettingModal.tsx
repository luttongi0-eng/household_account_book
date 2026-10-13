'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calculator } from 'lucide-react';

interface BudgetSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: number;
  currentBudget: number;
  onSaveBudget: (newBudget: number) => void;
}

export default function BudgetSettingModal({
  isOpen,
  onClose,
  currentMonth,
  currentBudget,
  onSaveBudget,
}: BudgetSettingModalProps) {
  const [budgetInput, setBudgetInput] = useState(currentBudget.toString());

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(budgetInput.replace(/,/g, ''), 10);
    if (isNaN(val) || val <= 0) {
      alert('올바른 예산 금액을 입력해주세요!');
      return;
    }
    onSaveBudget(val);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="relative w-full max-w-sm bg-[#FFFDF7] p-6 rounded-3xl crayon-border-modal shadow-handdrawn-xl text-stone-900 font-crayon"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-dashed border-stone-300">
            <div className="flex items-center gap-2 text-2xl font-bold text-stone-900">
              <Calculator className="text-[#FF9F45]" size={26} />
              <span>{currentMonth}월 생활비 예산 설정</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-stone-500 hover:text-red-500"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-stone-700 block mb-1">
                한 달 목표 생활비 예산 (원)
              </label>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="예: 2000000"
                className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-500 rounded-xl text-xl font-black text-stone-900 outline-none focus:border-crayonOrange"
                required
              />
              <p className="text-xs text-stone-500 mt-1.5 font-body leading-relaxed">
                * 설정하신 예산은 브라우저를 나갔다 들어와도 유지되며, 엑셀/구글 시트와도 실시간 연동됩니다.
              </p>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2">
              {[1500000, 2000000, 2500000].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setBudgetInput(quick.toString())}
                  className="flex-1 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-400 rounded-lg text-xs font-bold text-stone-700"
                >
                  {quick / 10000}만원
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl font-bold text-sm hover:bg-stone-300"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#FF9F45] text-stone-900 rounded-xl font-black text-base border-2 border-stone-800 shadow-handdrawn hover:bg-orange-400 flex items-center gap-1 cursor-pointer"
              >
                <Check size={18} /> 예산 저장하기
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
