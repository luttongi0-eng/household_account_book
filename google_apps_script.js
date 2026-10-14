/**
 * 🎨 스케치북 감성 AI 가계부 - Google Apps Script (GAS) API
 * 
 * 구글 시트 ID: 1wlVlzcgvWOc2kBOKumFn8QcPTcKc2b1HTE2usWRfqcI
 * 
 * 기능:
 * 1. Transactions 시트 CRUD (가계부 거래 기록)
 * 2. Settings 시트 CRUD (목표 및 환경 설정)
 * 3. Monthly_Summary 시트 CRUD (월별 요약 및 결산 기록)
 * 4. 시트 자동 초기화 (필요한 시트와 헤더가 없으면 자동 생성)
 */

const SPREADSHEET_ID = '1wlVlzcgvWOc2kBOKumFn8QcPTcKc2b1HTE2usWRfqcI';

function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * 시트가 없으면 생성하고 표준 헤더를 세팅하는 함수
 */
function setupSheets() {
  const ss = getSpreadsheet();
  
  // 1. Transactions 시트
  let txSheet = ss.getSheetByName('Transactions');
  if (!txSheet) {
    txSheet = ss.insertSheet('Transactions');
    txSheet.appendRow(['id', 'date', 'type', 'category', 'sub_category', 'description', 'amount', 'payment_method', 'memo']);
    txSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#FFF4BD');
  }

  // 2. Settings 시트
  let setSheet = ss.getSheetByName('Settings');
  if (!setSheet) {
    setSheet = ss.insertSheet('Settings');
    setSheet.appendRow(['setting_item', 'value', 'unit', 'note']);
    setSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#EBF4FF');
    // 기본값 등록
    setSheet.appendRow(['연간저축목표', 600000, '원', '돼지저금통 연간 목표']);
    setSheet.appendRow(['취미한도비율', 10, '%', '총 수입 대비 취미 예산 한도']);
    setSheet.appendRow(['현재저축누적', 450000, '원', '현재까지 모은 저축액']);
  }

  // 3. Monthly_Summary 시트
  let summarySheet = ss.getSheetByName('Monthly_Summary');
  if (!summarySheet) {
    summarySheet = ss.insertSheet('Monthly_Summary');
    summarySheet.appendRow(['month', 'resolution', 'target_budget', 'actual_expense', 'is_goal_achieved', 'is_hobby_exceeded']);
    summarySheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#EDF7ED');
  }
}

/**
 * 웹 앱 응답 JSON 헬퍼
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET 요청 처리 (데이터 조회 Read)
 * 예: 
 * ?sheet=transactions
 * ?sheet=settings
 * ?sheet=monthly_summary
 */
function doGet(e) {
  try {
    setupSheets();
    const params = e.parameter || {};
    const sheetName = (params.sheet || 'transactions').toLowerCase();
    const ss = getSpreadsheet();

    if (sheetName === 'transactions') {
      const sheet = ss.getSheetByName('Transactions');
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
      
      const transactions = rows.map((row, index) => {
        return {
          rowIndex: index + 2, // 1-based index (header is 1)
          id: String(row[0] || ''),
          date: row[1] instanceof Date ? Utilities.formatDate(row[1], 'Asia/Seoul', 'yyyy-MM-dd') : String(row[1] || ''),
          type: String(row[2] || ''),
          category: String(row[3] || ''),
          sub_category: String(row[4] || ''),
          description: String(row[5] || ''),
          amount: Number(row[6]) || 0,
          payment_method: String(row[7] || ''),
          memo: String(row[8] || '')
        };
      });

      return createJsonResponse({ success: true, data: transactions });
    }

    if (sheetName === 'settings') {
      const sheet = ss.getSheetByName('Settings');
      const data = sheet.getDataRange().getValues();
      const rows = data.slice(1);

      const settings = rows.map((row, index) => ({
        rowIndex: index + 2,
        setting_item: String(row[0] || ''),
        value: Number(row[1]) || 0,
        unit: String(row[2] || ''),
        note: String(row[3] || '')
      }));

      return createJsonResponse({ success: true, data: settings });
    }

    if (sheetName === 'monthly_summary') {
      const sheet = ss.getSheetByName('Monthly_Summary');
      const data = sheet.getDataRange().getValues();
      const rows = data.slice(1);

      const summaries = rows.map((row, index) => ({
        rowIndex: index + 2,
        month: row[0] instanceof Date ? Utilities.formatDate(row[0], 'Asia/Seoul', 'yyyy-MM') : String(row[0] || ''),
        resolution: String(row[1] || ''),
        target_budget: Number(row[2]) || 0,
        actual_expense: Number(row[3]) || 0,
        is_goal_achieved: String(row[4] || 'N'),
        is_hobby_exceeded: String(row[5] || 'N')
      }));

      return createJsonResponse({ success: true, data: summaries });
    }

    return createJsonResponse({ success: false, error: '유효하지 않은 sheet 파라미터입니다.' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * POST 요청 처리 (생성 Create, 수정 Update, 삭제 Delete)
 */
function doPost(e) {
  try {
    setupSheets();
    const contents = JSON.parse(e.postData.contents);
    const { action, sheet: targetSheetName, data } = contents;
    const ss = getSpreadsheet();

    const sheetName = (targetSheetName || 'transactions').toLowerCase();

    // ==========================================
    // 1. Transactions 시트 CRUD
    // ==========================================
    if (sheetName === 'transactions') {
      const sheet = ss.getSheetByName('Transactions');

      // (1) Create: 거래 추가
      if (action === 'create' || action === 'add') {
        const id = data.id || ('tx_' + new Date().getTime());
        const row = [
          id,
          data.date || Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd'),
          data.type || '지출',
          data.category || '생활비',
          data.sub_category || '식비',
          data.description || '',
          Number(data.amount) || 0,
          data.payment_method || '카드',
          data.memo || ''
        ];
        sheet.appendRow(row);
        return createJsonResponse({ success: true, message: '거래 기록 추가 성공', id: id });
      }

      // (2) Update: 특정 ID 거래 수정
      if (action === 'update') {
        const allData = sheet.getDataRange().getValues();
        let targetRowIndex = -1;
        for (let i = 1; i < allData.length; i++) {
          if (String(allData[i][0]) === String(data.id)) {
            targetRowIndex = i + 1;
            break;
          }
        }
        if (targetRowIndex === -1) {
          return createJsonResponse({ success: false, error: '해당 ID의 거래를 찾을 수 없습니다.' });
        }

        if (data.date !== undefined) sheet.getRange(targetRowIndex, 2).setValue(data.date);
        if (data.type !== undefined) sheet.getRange(targetRowIndex, 3).setValue(data.type);
        if (data.category !== undefined) sheet.getRange(targetRowIndex, 4).setValue(data.category);
        if (data.sub_category !== undefined) sheet.getRange(targetRowIndex, 5).setValue(data.sub_category);
        if (data.description !== undefined) sheet.getRange(targetRowIndex, 6).setValue(data.description);
        if (data.amount !== undefined) sheet.getRange(targetRowIndex, 7).setValue(Number(data.amount));
        if (data.payment_method !== undefined) sheet.getRange(targetRowIndex, 8).setValue(data.payment_method);
        if (data.memo !== undefined) sheet.getRange(targetRowIndex, 9).setValue(data.memo);

        return createJsonResponse({ success: true, message: '거래 기록 수정 성공' });
      }

      // (3) Delete: 특정 ID 거래 삭제
      if (action === 'delete') {
        const allData = sheet.getDataRange().getValues();
        let targetRowIndex = -1;
        for (let i = 1; i < allData.length; i++) {
          if (String(allData[i][0]) === String(data.id)) {
            targetRowIndex = i + 1;
            break;
          }
        }
        if (targetRowIndex === -1) {
          return createJsonResponse({ success: false, error: '해당 ID의 거래를 찾을 수 없습니다.' });
        }
        sheet.deleteRow(targetRowIndex);
        return createJsonResponse({ success: true, message: '거래 기록 삭제 성공' });
      }
    }

    // ==========================================
    // 2. Settings 시트 CRUD
    // ==========================================
    if (sheetName === 'settings') {
      const sheet = ss.getSheetByName('Settings');

      // Create / Upsert 설정값 저장 또는 수정
      if (action === 'set' || action === 'update' || action === 'create') {
        const allData = sheet.getDataRange().getValues();
        let targetRowIndex = -1;
        for (let i = 1; i < allData.length; i++) {
          if (String(allData[i][0]) === String(data.setting_item)) {
            targetRowIndex = i + 1;
            break;
          }
        }

        if (targetRowIndex !== -1) {
          // 기존 항목 수정
          if (data.value !== undefined) sheet.getRange(targetRowIndex, 2).setValue(Number(data.value));
          if (data.unit !== undefined) sheet.getRange(targetRowIndex, 3).setValue(data.unit);
          if (data.note !== undefined) sheet.getRange(targetRowIndex, 4).setValue(data.note);
          return createJsonResponse({ success: true, message: '설정 수정 성공' });
        } else {
          // 신규 추가
          sheet.appendRow([data.setting_item, Number(data.value) || 0, data.unit || '', data.note || '']);
          return createJsonResponse({ success: true, message: '설정 등록 성공' });
        }
      }

      // Delete 설정 항목 삭제
      if (action === 'delete') {
        const allData = sheet.getDataRange().getValues();
        let targetRowIndex = -1;
        for (let i = 1; i < allData.length; i++) {
          if (String(allData[i][0]) === String(data.setting_item)) {
            targetRowIndex = i + 1;
            break;
          }
        }
        if (targetRowIndex !== -1) {
          sheet.deleteRow(targetRowIndex);
          return createJsonResponse({ success: true, message: '설정 항목 삭제 성공' });
        }
        return createJsonResponse({ success: false, error: '설정 항목을 찾을 수 없습니다.' });
      }
    }

    // ==========================================
    // 3. Monthly_Summary 시트 CRUD
    // ==========================================
    if (sheetName === 'monthly_summary') {
      const sheet = ss.getSheetByName('Monthly_Summary');

      // Create / Upsert 월별 요약 저장
      if (action === 'set' || action === 'create' || action === 'update') {
        const allData = sheet.getDataRange().getValues();
        let targetRowIndex = -1;
        for (let i = 1; i < allData.length; i++) {
          const currentMonth = allData[i][0] instanceof Date 
            ? Utilities.formatDate(allData[i][0], 'Asia/Seoul', 'yyyy-MM') 
            : String(allData[i][0]);
          if (currentMonth === String(data.month)) {
            targetRowIndex = i + 1;
            break;
          }
        }

        if (targetRowIndex !== -1) {
          // 수정
          if (data.resolution !== undefined) sheet.getRange(targetRowIndex, 2).setValue(data.resolution);
          if (data.target_budget !== undefined) sheet.getRange(targetRowIndex, 3).setValue(Number(data.target_budget));
          if (data.actual_expense !== undefined) sheet.getRange(targetRowIndex, 4).setValue(Number(data.actual_expense));
          if (data.is_goal_achieved !== undefined) sheet.getRange(targetRowIndex, 5).setValue(data.is_goal_achieved);
          if (data.is_hobby_exceeded !== undefined) sheet.getRange(targetRowIndex, 6).setValue(data.is_hobby_exceeded);
          return createJsonResponse({ success: true, message: '월별 요약 수정 성공' });
        } else {
          // 신규 추가
          sheet.appendRow([
            data.month,
            data.resolution || '',
            Number(data.target_budget) || 0,
            Number(data.actual_expense) || 0,
            data.is_goal_achieved || 'N',
            data.is_hobby_exceeded || 'N'
          ]);
          return createJsonResponse({ success: true, message: '월별 요약 등록 성공' });
        }
      }

      // Delete 월별 결산 삭제
      if (action === 'delete') {
        const allData = sheet.getDataRange().getValues();
        let targetRowIndex = -1;
        for (let i = 1; i < allData.length; i++) {
          const currentMonth = allData[i][0] instanceof Date 
            ? Utilities.formatDate(allData[i][0], 'Asia/Seoul', 'yyyy-MM') 
            : String(allData[i][0]);
          if (currentMonth === String(data.month)) {
            targetRowIndex = i + 1;
            break;
          }
        }
        if (targetRowIndex !== -1) {
          sheet.deleteRow(targetRowIndex);
          return createJsonResponse({ success: true, message: '월별 요약 삭제 성공' });
        }
        return createJsonResponse({ success: false, error: '해당 월의 요약을 찾을 수 없습니다.' });
      }
    }

    return createJsonResponse({ success: false, error: '유효하지 않은 요청입니다.' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}
