'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, AlertTriangle } from 'lucide-react';

interface HobbyBudgetCardProps {
  hobbyBudget: number; // 10% of total income
  hobbyExpense: number; // actual spend on hobby
}

export default function HobbyBudgetCard({
  hobbyBudget,
  hobbyExpense,
}: HobbyBudgetCardProps) {
  const percent = hobbyBudget > 0 ? Math.round((hobbyExpense / hobbyBudget) * 100) : 0;
  const isOver = hobbyExpense > hobbyBudget;
  const isNear = percent >= 80 && !isOver;

  // Gauge bar color
  const gaugeColor = isOver
    ? 'bg-red-500'
    : isNear
    ? 'bg-yellow-400'
    : 'bg-emerald-400';

  return (
    <motion.div
      initial={false}
      animate={
        isOver
          ? {
              rotate: [0, -2, 2, -2, 2, 0],
              x: [0, -3, 3, -3, 3, 0],
            }
          : { rotate: 0, x: 0 }
      }
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
        repeat: 0, // 단 1회만 실행되고 완전히 멈춤
      }}
      className={`p-5 rounded-2xl crayon-border shadow-handdrawn transition-colors relative overflow-hidden ${
        isOver
          ? 'bg-red-50 border-red-500'
          : isNear
          ? 'bg-amber-50 border-amber-500'
          : 'bg-[#F3E8FF] border-purple-400'
      }`}
    >
      {/* Title */}
      <div className="flex items-center justify-between font-crayon mb-2">
        <div className="flex items-center gap-2">
          <Gamepad2 size={24} className="text-purple-700" />
          <h3 className="text-xl font-bold text-purple-900">
            🎮 취미 예산 관리 <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-normal">10% 룰</span>
          </h3>
        </div>
        <span className="font-crayon text-sm font-bold text-stone-600">
          수입의 10% 자동 책정
        </span>
      </div>

      {/* Figures */}
      <div className="flex items-baseline justify-between font-crayon my-2">
        <div>
          <span className="text-xs text-stone-500">현재 취미 지출: </span>
          <span className={`text-2xl font-bold ${isOver ? 'text-red-600 underline' : 'text-purple-950'}`}>
            ₩{hobbyExpense.toLocaleString()}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-stone-500">한도 (10%): </span>
          <span className="text-lg font-bold text-stone-700">
            ₩{hobbyBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Paint Gauge Bar */}
      <div className="w-full bg-stone-200 h-4 rounded-full overflow-hidden border-2 border-stone-600 relative p-0.5 my-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${gaugeColor}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      {/* Warning Sticky Note or Status Text */}
      <div className="flex items-center justify-between font-crayon text-xs mt-2">
        {isOver ? (
          <div className="flex items-center gap-1.5 text-red-600 font-bold bg-white/80 px-2 py-1 rounded-md border border-red-300 w-full">
            <AlertTriangle size={16} />
            <span>🚨 앗! 취미 예산 한도를 초과했어요! 이번 달은 자제해볼까요?</span>
          </div>
        ) : isNear ? (
          <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-white/80 px-2 py-1 rounded-md border border-amber-300 w-full">
            <AlertTriangle size={16} />
            <span>⚠️ 취미 예산 80% 도달! 남은 날을 위해 아껴 써보세요.</span>
          </div>
        ) : (
          <div className="text-stone-600">
            🌱 한도 내에서 안전하게 즐기는 중이에요! (사용률 {percent}%)
          </div>
        )}
      </div>
    </motion.div>
  );
}
