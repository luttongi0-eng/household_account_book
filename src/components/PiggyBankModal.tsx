'use client';

import React, { useState } from 'react';
import { X, Sparkles, Target, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PiggyBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSaved: number;
  savingsTarget: number;
  onUpdateTarget: (newTarget: number, newSaved: number) => void;
  currentMonth: number;
}

export default function PiggyBankModal({
  isOpen,
  onClose,
  currentSaved,
  savingsTarget,
  onUpdateTarget,
  currentMonth,
}: PiggyBankModalProps) {
  const [targetInput, setTargetInput] = useState(savingsTarget.toString());
  const [depositInput, setDepositInput] = useState('');

  if (!isOpen) return null;

  // Percentage
  const progressPercent = Math.min(100, Math.round((currentSaved / (savingsTarget || 1)) * 100));

  // Pacemaker: Remaining months in current year
  // If currentMonth is 10, remaining months including this month or rest of year
  const remainingMonths = Math.max(1, 12 - currentMonth + 1);
  const neededAmount = Math.max(0, savingsTarget - currentSaved);
  const monthlyNeeded = Math.round(neededAmount / remainingMonths);

  const handleDeposit = () => {
    const add = parseInt(depositInput.replace(/,/g, ''), 10);
    if (isNaN(add) || add <= 0) return;

    const updated = currentSaved + add;
    onUpdateTarget(savingsTarget, updated);
    setDepositInput('');

    // Trigger celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleSaveTarget = () => {
    const newT = parseInt(targetInput.replace(/,/g, ''), 10);
    if (isNaN(newT) || newT <= 0) return;
    onUpdateTarget(newT, currentSaved);
    alert('목표 금액이 변경되었습니다!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl crayon-border-modal shadow-handdrawn-xl text-stone-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-500 hover:text-stone-800 p-1 font-bold"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img
              src="/piggy.png"
              alt="돼지저금통"
              className="w-24 h-24 object-contain animate-bounce drop-shadow-md"
            />
          </div>
          <h2 className="font-crayon text-3xl font-bold text-stone-900">
            돼지 저금통 (연간 저축 목표)
          </h2>
          <p className="text-sm text-stone-600 font-body mt-1">
            차곡차곡 모아 커다란 꿈을 이루어보아요!
          </p>
        </div>

        {/* Paint Water Gauge Animation */}
        <div className="bg-[#FFF4BD]/40 p-5 rounded-2xl crayon-border mb-6">
          <div className="flex justify-between items-center font-crayon mb-2">
            <span className="font-bold text-lg text-amber-950 flex items-center gap-1">
              <Coins size={20} className="text-crayonOrange" /> 현재 모은 금액:
            </span>
            <span className="text-2xl font-black text-red-600">
              ₩{currentSaved.toLocaleString()}
            </span>
          </div>

          {/* Progress Bar (Liquid ink fill) */}
          <div className="w-full bg-stone-200 h-6 rounded-full overflow-hidden border-2 border-stone-700 relative p-0.5">
            <div
              className="bg-gradient-to-r from-crayonGreen to-emerald-400 h-full rounded-full transition-all duration-700 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12"></div>
            </div>
            <span className="absolute inset-0 flex items-center justify-center font-crayon text-xs font-bold text-stone-800 drop-shadow-xs">
              {progressPercent}% 달성
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-crayon text-stone-500 mt-2">
            <span>시작 0원</span>
            <span>목표 ₩{savingsTarget.toLocaleString()}</span>
          </div>
        </div>

        {/* ★ Pacemaker Card (ai.md 핵심 요구사항) */}
        <div className="bg-[#FFF1F1] p-4 rounded-xl border-2 border-dashed border-red-300 mb-6 font-crayon">
          <div className="flex items-center gap-2 text-red-800 text-lg font-bold mb-1">
            <Target size={20} className="text-red-500" />
            <span>★ 페이스메이커 알림 (필요 저축 페이스)</span>
          </div>
          <p className="text-base text-stone-800 font-bold leading-relaxed">
            "올해 남은 {remainingMonths}개월 동안 매월 평균{' '}
            <span className="text-red-600 text-xl font-black underline decoration-wavy">
              ₩{monthlyNeeded.toLocaleString()}원
            </span>
            을 저축해야 목표를 달성할 수 있어요! 🏃‍♂️💨"
          </p>
        </div>

        {/* Deposit Coins Quick Action */}
        <div className="space-y-4 font-crayon">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex items-center gap-2">
            <input
              type="number"
              placeholder="저금할 금액 입력 (예: 50000)"
              value={depositInput}
              onChange={(e) => setDepositInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-stone-400 rounded-lg text-stone-800 font-bold outline-none"
            />
            <button
              type="button"
              onClick={handleDeposit}
              className="px-4 py-2 bg-[#3F3B36] text-[#FFF4BD] hover:bg-stone-800 font-bold rounded-lg crayon-border shadow-xs transition-all cursor-pointer flex items-center gap-1.5 text-base"
            >
              <span>🪙 동전 넣기</span>
            </button>
          </div>

          {/* Goal Adjustment */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-300 text-sm">
            <span className="text-stone-600">목표 금액 변경:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-28 px-2 py-1 bg-white border border-stone-300 rounded text-stone-800 font-bold text-xs"
              />
              <button
                type="button"
                onClick={handleSaveTarget}
                className="px-2.5 py-1 bg-stone-200 text-stone-800 rounded font-bold hover:bg-stone-300 text-xs"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
