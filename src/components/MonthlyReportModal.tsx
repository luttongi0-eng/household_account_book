'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prevMonthStr: string; // e.g. 2026-09
  targetBudget: number;
  totalExpense: number;
  totalIncome: number;
  hobbyBudget: number;
  hobbyExpense: number;
}

export default function MonthlyReportModal({
  isOpen,
  onClose,
  prevMonthStr,
  targetBudget,
  totalExpense,
  totalIncome,
  hobbyBudget,
  hobbyExpense,
}: MonthlyReportModalProps) {
  const isBudgetAchieved = totalExpense <= (targetBudget || 2000000);
  const isHobbyAchieved = hobbyExpense <= (hobbyBudget || 1);
  const isPerfect = isBudgetAchieved && isHobbyAchieved;

  useEffect(() => {
    if (isOpen && isPerfect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    }
  }, [isOpen, isPerfect]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        {/* 팝업북 형태 모달 컨테이너 */}
        <motion.div
          initial={{ scale: 0.7, rotateX: 30, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-lg bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl crayon-border-modal shadow-handdrawn-xl text-stone-800"
          style={{
            backgroundImage: 'radial-gradient(#d3cbbd 0.75px, transparent 0.75px)',
            backgroundSize: '16px 16px',
          }}
        >
          {/* 상단 닫기 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-red-500 p-1.5 transition-colors font-bold"
          >
            <X size={24} />
          </button>

          {/* 팝업북 헤더 */}
          <div className="text-center pb-4 mb-4 border-b-2 border-dashed border-stone-300">
            <span className="text-4xl">📖✨</span>
            <h2 className="font-crayon text-3xl font-bold text-stone-900 mt-1">
              {prevMonthStr.split('-')[1]}월 결산 팝업북 리포트
            </h2>
            <p className="font-body text-xs text-stone-600 mt-1">
              새로운 달을 맞아 지난달의 알뜰살뜰 성취도를 돌아보아요!
            </p>
          </div>

          {/* 완벽 달성 시 '참 잘했어요' 도장 애니메이션 */}
          {isPerfect && (
            <motion.div
              initial={{ scale: 2.5, opacity: 0, rotate: -35 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 350, damping: 15 }}
              className="absolute -top-6 -left-4 pointer-events-none z-20"
            >
              <div className="w-28 h-28 rounded-full border-4 border-red-500 bg-white/95 text-red-500 flex flex-col items-center justify-center shadow-lg font-crayon">
                <span className="text-2xl">💮</span>
                <span className="text-lg font-black leading-tight">참 잘했어요!</span>
                <span className="text-[10px] font-bold">100% 달성</span>
              </div>
            </motion.div>
          )}

          {/* 결산 내역 카드 */}
          <div className="space-y-3 font-crayon text-base mb-6">
            {/* 1. 목표 예산 달성 여부 */}
            <div
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between shadow-xs ${
                isBudgetAchieved ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-400'
              }`}
            >
              <div>
                <div className="font-bold text-lg flex items-center gap-1.5">
                  {isBudgetAchieved ? (
                    <CheckCircle2 className="text-emerald-600" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                  <span>목표 생활비 예산 방어전</span>
                </div>
                <div className="text-xs text-stone-600 font-body mt-0.5">
                  목표 ₩{targetBudget.toLocaleString()}원 vs 실제 ₩{totalExpense.toLocaleString()}원
                </div>
              </div>
              <span
                className={`font-bold px-2.5 py-1 rounded-full text-sm ${
                  isBudgetAchieved ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {isBudgetAchieved ? '성공! 🎉' : '초과 💦'}
              </span>
            </div>

            {/* 2. 취미 예산 10% 룰 방어전 */}
            <div
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between shadow-xs ${
                isHobbyAchieved ? 'bg-purple-50 border-purple-400' : 'bg-amber-50 border-amber-400'
              }`}
            >
              <div>
                <div className="font-bold text-lg flex items-center gap-1.5">
                  <span className="text-xl">🎮</span>
                  <span>취미 예산 10% 룰 방어전</span>
                </div>
                <div className="text-xs text-stone-600 font-body mt-0.5">
                  한도 ₩{hobbyBudget.toLocaleString()}원 vs 지출 ₩{hobbyExpense.toLocaleString()}원
                </div>
              </div>
              <span
                className={`font-bold px-2.5 py-1 rounded-full text-sm ${
                  isHobbyAchieved ? 'bg-purple-200 text-purple-800' : 'bg-amber-200 text-amber-800'
                }`}
              >
                {isHobbyAchieved ? '방어 성공! 🛡️' : '초과 지출 ⚠️'}
              </span>
            </div>
          </div>

          {/* 닫기 및 다짐 시작 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-crayonOrange text-white font-crayon text-xl font-bold rounded-2xl crayon-border shadow-handdrawn hover:bg-orange-500 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>✨ 새 달도 힘차게 시작하기!</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
