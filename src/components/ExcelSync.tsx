'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Transaction, MonthlyResolution } from '@/types/account';
import { Download, Upload } from 'lucide-react';

interface ExcelSyncProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
  resolutions?: MonthlyResolution[];
  onImportResolutions?: (resolutions: MonthlyResolution[]) => void;
}

export default function ExcelSync({
  transactions,
  onImport,
  resolutions = [],
  onImportResolutions,
}: ExcelSyncProps) {
  // Export to Excel
  const handleExport = () => {
    // Sheet 1: Transactions
    const exportTxs = transactions.map((t) => ({
      날짜: t.date,
      유형: t.type === 'expense' ? '지출' : t.type === 'savings' ? '저축' : '수입',
      카테고리: t.category,
      소분류: t.subCategory || '',
      금액: t.amount,
      내용: t.description,
      결제수단: t.paymentMethod,
      약속여부: t.isAppointment ? 'Y' : 'N',
      약속메모: t.memo || t.appointmentMemo || '',
    }));

    // Sheet 2: Monthly Budgets & Resolutions
    const exportBudgets = resolutions.map((r) => ({
      월: r.month,
      목표예산: r.targetBudget,
      다짐내용: r.resolution,
    }));

    const workbook = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(exportTxs);
    XLSX.utils.book_append_sheet(workbook, ws1, '가계부내역');

    if (exportBudgets.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(exportBudgets);
      XLSX.utils.book_append_sheet(workbook, ws2, '월별예산및다짐');
    }

    XLSX.writeFile(workbook, `스케치북가계부_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Import from Excel
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });

        // Parse Sheet 1: Transactions
        const txSheetName = workbook.SheetNames[0];
        const txSheet = workbook.Sheets[txSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(txSheet);

        const parsedTxs: Transaction[] = rawJson.map((row, idx) => ({
          id: `excel-${Date.now()}-${idx}`,
          date: row['날짜'] || new Date().toISOString().slice(0, 10),
          type: row['유형'] === '수입' ? 'income' : row['유형'] === '저축' ? 'savings' : 'expense',
          category: row['카테고리'] || '생활비',
          subCategory: row['소분류'] || '',
          amount: Number(row['금액']) || 0,
          description: row['내용'] || '가계부 항목',
          paymentMethod: row['결제수단'] || '카드',
          isAppointment: row['약속여부'] === 'Y',
          memo: row['약속메모'] || undefined,
        }));

        if (parsedTxs.length > 0) {
          onImport(parsedTxs);
        }

        // Parse Sheet 2: Monthly Budgets
        if (workbook.SheetNames.length > 1 && onImportResolutions) {
          const budgetSheet = workbook.Sheets[workbook.SheetNames[1]];
          const budgetJson: any[] = XLSX.utils.sheet_to_json(budgetSheet);
          const parsedBudgets: MonthlyResolution[] = budgetJson.map((r) => ({
            month: String(r['월'] || ''),
            targetBudget: Number(r['목표예산']) || 2000000,
            resolution: String(r['다짐내용'] || ''),
          }));
          if (parsedBudgets.length > 0) {
            onImportResolutions(parsedBudgets);
          }
        }

        alert('성공적으로 엑셀 파일의 데이터를 불러왔습니다! 🎨');
      } catch (err) {
        console.error(err);
        alert('엑셀 파일을 읽는 도중 오류가 발생했습니다.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2 font-crayon">
      <button
        type="button"
        onClick={handleExport}
        className="px-3.5 py-2 bg-emerald-100 text-emerald-950 border-2 border-emerald-500 rounded-xl hover:bg-emerald-200 flex items-center gap-1.5 shadow-sm text-base font-bold transition-all cursor-pointer"
        title="엑셀 파일로 내보내기"
      >
        <Download size={18} className="text-emerald-800" />
        <span>엑셀 내보내기</span>
      </button>

      <label className="px-3.5 py-2 bg-blue-100 text-blue-950 border-2 border-blue-500 rounded-xl hover:bg-blue-200 flex items-center gap-1.5 shadow-sm text-base font-bold cursor-pointer transition-all">
        <Upload size={18} className="text-blue-800" />
        <span>엑셀 불러오기</span>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
