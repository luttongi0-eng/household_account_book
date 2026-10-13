'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Edit3, Check, X } from 'lucide-react';
import { MonthlyResolution } from '@/types/account';

interface MonthlyStickyNoteProps {
  currentMonthStr: string; // YYYY-MM
  resolution: MonthlyResolution;
  onSaveResolution: (newRes: MonthlyResolution) => void;
}

export default function MonthlyStickyNote({
  currentMonthStr,
  resolution,
  onSaveResolution,
}: MonthlyStickyNoteProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [text, setText] = useState(resolution.resolution || '');
  const [budget, setBudget] = useState(resolution.targetBudget ? resolution.targetBudget.toString() : '2000000');

  const handleSave = () => {
    const numBudget = parseInt(budget.replace(/,/g, ''), 10) || 0;
    onSaveResolution({
      month: currentMonthStr,
      resolution: text.trim() || '이번 달도 알뜰살뜰 아껴서 목표 달성하기!',
      targetBudget: numBudget,
    });
    setIsOpenModal(false);
  };

  const monthNum = currentMonthStr.split('-')[1];

  return (
    <>
      {/* 달력 제목 옆에 아담하게 위치하는 포스트잇 버튼 위젯 */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setText(resolution.resolution || '');
          setBudget((resolution.targetBudget || 2000000).toString());
          setIsOpenModal(true);
        }}
        className="relative bg-[#FFF9A6] px-3 py-1.5 rounded-lg border-2 border-stone-800 shadow-handdrawn text-stone-800 font-crayon flex items-center gap-1.5 cursor-pointer -rotate-1 hover:rotate-0 transition-transform"
        title="클릭하여 이번 달 다짐 포스트잇 작성/수정"
      >
        {/* 마스킹 테이프 장식 */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-[#FFB7B2]/80 border border-stone-700/30 -rotate-2 pointer-events-none" />
        <Pin size={14} className="text-red-500 fill-red-500 -rotate-45" />
        <span className="font-bold text-xs text-stone-900 truncate max-w-[140px] sm:max-w-[180px]">
          📌 {monthNum}월 다짐: "{resolution.resolution || '목표 달성하기!'}"
        </span>
        <span className="text-[10px] bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded border border-amber-400 font-bold">
          수정
        </span>
      </motion.button>

      {/* 다짐 포스트잇 확대 및 편집 모달 */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.8, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-sm bg-[#FFF9A6] p-6 rounded-2xl border-3 border-stone-800 shadow-handdrawn-xl text-stone-900 font-crayon"
              style={{
                backgroundImage: 'radial-gradient(#E8D976 0.75px, transparent 0.75px)',
                backgroundSize: '12px 12px',
              }}
            >
              {/* 상단 마스킹 테이프 */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-[#FFB7B2]/90 border border-stone-700/50 -rotate-1 shadow-xs pointer-events-none" />

              <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-600/40">
                <div className="flex items-center gap-1.5 font-bold text-xl text-stone-900">
                  <Pin size={20} className="text-red-500 fill-red-500 -rotate-45" />
                  <span>{monthNum}월의 다짐 포스트잇</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="p-1 hover:text-red-500 text-stone-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-bold text-stone-800 block mb-1">
                    ✏️ 이번 달 정성적 다짐
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="예: 외식 주 1회로 줄이고 저축 45만원 지키기!"
                    rows={3}
                    className="w-full p-2.5 bg-white/95 border-2 border-stone-600 rounded-xl text-base font-bold text-stone-900 resize-none outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-stone-800 block mb-1">
                    💰 이번 달 목표 생활비 예산 (원)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-white/95 border-2 border-stone-600 rounded-xl text-lg font-bold text-stone-900 outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-stone-500/40">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl font-bold text-sm hover:bg-stone-300"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#FF9F45] text-white rounded-xl font-bold text-base border-2 border-stone-800 shadow-handdrawn hover:bg-orange-500 flex items-center gap-1.5"
                >
                  <Check size={18} /> 다짐 붙이기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
