# 가계부

## 1단계: 서비스 디자인 요소 설계

- 구글 프레젠테이션으로 디자인 초안 잡기
- `디자인초안.png` 파일 참고

---

## 2단계: 스티치 바이브 디자인

- https://stitch.withgoogle.com 접속
- 스티치 프롬프트 창에서 **웹**을 선택하고 `디자인초안.png` 파일 첨부

**프롬프트**

```
Prompt
- 스케치북과 크레파스 감성의 가계부 대시보드 시안 3가지 요구
- 상단 한달짜리 달력, 중간 한달 요약, 하단 남은 한달 계획과 줄여야할 소비 부분
```
- 스티치에서 최종 선택하고 수정한 디자인에 대한 `screen.png`, `DESIGN.md` 파일 참고

## 3단계: 빈 폴더 만들기

- 영문 소문자로 빈 폴더 생성
- 반드시 소문자이어야 함
- 본 과정에서는 `household_account_book`로 정하였음

---

## 4단계: 사전 설정 사항

**프롬프트**

- Antigravity 실행
- 채팅창의 **[New Conversation]-[New Project]** 를 통해 `household_account_book` 폴더 접근
- 안티그래비티의 에이전트 창에 아래 내용을 입력

```Prompt
- 한글로 출력
```

---

## 5단계: 기본 코드베이스 생성

- `npx create-next-app@latest .` 입력
- 명령어 실행 후 기본 선택 사항을 실행

---

## 6단계: AI 툴킷 설치

- `npm install ai @ai-sdk/react @ai-sdk/google zod` 입력

---

## 7단계: Gemini Api Key 발급받기

- Google AI Studio 접속 (https://aistudio.google.com)
- `Get API Key` 에서 키 발급
- `household_account_book` 폴더 오픈
- .env.local 파일에 저장
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GEMINI_API_KEY

---

## 8단계: 기본 기능 구현

- `screen.png`, `DESIGN.md` 파일을 `diary_ai_sentiments_analyzer26_2` 폴더 안으로 이동
- 프롬프트 창에 `screen.png` 파일 추가

**프롬프트**

```Prompt
- 전반적인 디자인은 `screen.png`, `DESIGN.md` 파일을 참고
- 가계부 기능을 하는 웹사이트
- 달력 부분을 누르면 달력이 확대되며 날짜를 선택할 수 있고 날짜를 선택하여 지출 금액, 지출 이유, 지출 방식 또는 수입 금액, 수입 방식 등을 작성할 수 있어야 함.
- 달력에 작성한 내역들이 하단의 한달 요약과 카테코리별 지출 크레파스 차트에 반영됨.
- 사용자의 남은 생활비 한도를 계산하고 자동으로 남은 한달 계획 부분에 gemini-3.8-flash에 접속하여 한달 계획 세움. 이때 약속이 언제있는지 확인후 반영하여 작성.
-추가적인 기능은 첨부하는 `ai.md`를 모두 반영하여 제작
```

---

## 9단계: 코드베이스 실행 및 확인

- `npm run dev` 입력
- `http://localhost:3001` 를 클릭
- 서비스가 실행되면 각 기능을 테스트해 봄

---

## 10단계: 반응형 모바일 웹 확인

- 웹 서비스를 크롬 브라우저에서 띄우고, 오른쪽 상단의 점 세개 버튼(설정 버튼)을 선택
- **[도구 더보기]-[개발자 도구]**를 선택
- `Toggle device toolbar (Ctrl+Shift+M)` 실행
- 모바일 화면에서도 구성 요소가 안정적으로 배치되어 있는지 확인
- 달력이 너무 커서 달력 크기 조정, 버튼 위치 조정
---

## 11단계: 구글 시트 설정

- 구글 드라이브에서 구글 시트 만들기
- 시트 제목: `가계부 시트`
- 필요 필드 만들기
1. Transactions 시트 (가계부 거래 기록)
사용자가 달력에 입력하는 모든 결제/수입/저축 내역이 누적되는 시트.
A열 [date]: 거래 날짜 (날짜 타입, 예: 2026-10-13)
B열 [type]: 거래 유형 (문자 타입, 수입/지출/저축)
C열 [category]: 대분류 (문자 타입, 생활비/취미/급여 등)
D열 [sub_category]: 소분류 (문자 타입, 식비/게임/경조사 등)
E열 [description]: 구체적인 사용 내역 (문자 타입)
F열 [amount]: 거래 금액 (숫자 타입)
G열 [payment_method]: 결제 수단 (문자 타입, 카드/계좌이체/현금 등)
H열 [memo]: 약속 및 이벤트 관련 메모 (문자 타입)

2. Settings 시트 (목표 및 환경 설정)
돼지저금통 연간 목표, 취미 예산 비율 등 사용자의 기준값을 저장하는 시트.
A열 [setting_item]: 설정 항목 이름 (문자 타입, 연간저축목표/취미한도비율 등)
B열 [value]: 설정값 (숫자 타입)
C열 [unit]: 단위 (문자 타입, 원/% 등)
D열 [note]: 비고 및 설명 (문자 타입)

3. Monthly_Summary 시트 (월별 요약 및 결산 기록)
매월 초 작성하는 다짐과, 월말 결산 리포트의 결과를 저장하는 시트.
A열 [month]: 결산 월 (문자/날짜 타입, 예: 2026-10)
B열 [resolution]: 이번 달 다짐 포스트잇 내용 (문자 타입)
C열 [target_budget]: 이번 달 목표 예산 (숫자 타입)
D열 [actual_expense]: 실제 총지출액 (숫자 타입)
E열 [is_goal_achieved]: 목표 달성 여부 (문자/불리언 타입, Y/N)
F열 [is_hobby_exceeded]: 취미 예산 10% 룰 초과 여부 (문자/불리언 타입, Y/N)

- 해당 구글 시트에서 **[파일]-[공유]-[다른 사용자와 공유]-[링크가 있는 모든 사용자]** 설정
- **[링크 복사]** 클릭
- 구글 시트 공유 링크 붙여넣기
https://docs.google.com/spreadsheets/d/1wlVlzcgvWOc2kBOKumFn8QcPTcKc2b1HTE2usWRfqcI/edit?usp=sharing

---

## 12단계: 구글 시트 CRUD 기능 및 스크립트 생성

```Prompt
- 구글 시트 공유 링크
https://docs.google.com/spreadsheets/d/1wlVlzcgvWOc2kBOKumFn8QcPTcKc2b1HTE2usWRfqcI/edit?usp=sharing
- 해당 구글 시트
1. Transactions 시트 (가계부 거래 기록)
사용자가 달력에 입력하는 모든 결제/수입/저축 내역이 누적되는 시트.
A열 [date]: 거래 날짜 (날짜 타입, 예: 2026-10-13)
B열 [type]: 거래 유형 (문자 타입, 수입/지출/저축)
C열 [category]: 대분류 (문자 타입, 생활비/취미/급여 등)
D열 [sub_category]: 소분류 (문자 타입, 식비/게임/경조사 등)
E열 [description]: 구체적인 사용 내역 (문자 타입)
F열 [amount]: 거래 금액 (숫자 타입)
G열 [payment_method]: 결제 수단 (문자 타입, 카드/계좌이체/현금 등)
H열 [memo]: 약속 및 이벤트 관련 메모 (문자 타입)

2. Settings 시트 (목표 및 환경 설정)
돼지저금통 연간 목표, 취미 예산 비율 등 사용자의 기준값을 저장하는 시트.
A열 [setting_item]: 설정 항목 이름 (문자 타입, 연간저축목표/취미한도비율 등)
B열 [value]: 설정값 (숫자 타입)
C열 [unit]: 단위 (문자 타입, 원/% 등)
D열 [note]: 비고 및 설명 (문자 타입)

3. Monthly_Summary 시트 (월별 요약 및 결산 기록)
매월 초 작성하는 다짐과, 월말 결산 리포트의 결과를 저장하는 시트.
A열 [month]: 결산 월 (문자/날짜 타입, 예: 2026-10)
B열 [resolution]: 이번 달 다짐 포스트잇 내용 (문자 타입)
C열 [target_budget]: 이번 달 목표 예산 (숫자 타입)
D열 [actual_expense]: 실제 총지출액 (숫자 타입)
E열 [is_goal_achieved]: 목표 달성 여부 (문자/불리언 타입, Y/N)
F열 [is_hobby_exceeded]: 취미 예산 10% 룰 초과 여부 (문자/불리언 타입, Y/N)
에 대해 CRUD하는 구글 앱스 스크립트 생성
```
---

## 13단계: 구글 시트 연동 설정

- 구글 시트에 있는 **[확장프로그램]-[Apps Script]**를 클릭
- 제목: `가계부`
- 안티그래비티에서 생성된 구글 앱스 스크립트 코드를 복사한 후 [Apps Script]에 붙여넣기. 이때 기존 코드를 모두 대체해야 함. 그리고 **[저장]** 버튼을 클릭
- **[배포]-[새 배포]** 클릭
- **[유형 선택]-[웹 앱]** 클릭
- 새 설명: diary
- 다음 사용자 인증 정보로 실행: 나
- 액세스 권한이 있는 사용자: 모든 사용자
- [배포] 클릭
- [액세스 승인] 클릭
- 팝업 창이 나타나면 왼쪽 하단에 있는 `Advanced` 링크 클릭
- `Go to 카드 게임 저장 시트 (unsafe)` 링크 클릭
- 인증 후 나타나는 `웹 앱 URL` 복사
https://script.google.com/macros/s/AKfycbwo4z2iAxSHqIFQwZnoje7FoFyAPXrIygrWzDiUpJ7mKRFINCqngKQ3BWkoI5slfCvb/exec

---

## 14단계: 웹 앱 URL 등록

- .env.local 파일에 `웹 앱 URL`을 아래와 같이 편집
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwo4z2iAxSHqIFQwZnoje7FoFyAPXrIygrWzDiUpJ7mKRFINCqngKQ3BWkoI5slfCvb/exec

## 15단계: 구글 시트 연동 기능 구현

**프롬프트**

```Prompt
1. 프로젝트 개요

목표: 딱딱하고 복잡한 기존 가계부에서 벗어나, 손글씨와 다이어리 꾸미기(다꾸) 감성을 담은 친근하고 스마트한 웹 가계부 개발.

핵심 타겟: 실용적인 예산 관리와 더불어 시각적인 재미, 동기부여를 원하는 사용자.

주요 특징: 스케치북 UI, AI 맞춤형 소비/절약 추천, 10% 취미 한도 룰, 돼지저금통(저축 목표 관리), 월간 회고 및 보상 시스템.

2. 핵심 UI/UX 디자인 (스케치북 테마)

핸드 드로잉 스타일: 모든 버튼, 입력 폼, 테두리를 손으로 그린 듯한 삐뚤빼뚤한 선화(Hand-drawn) 스타일로 구현 (CSS border-radius 불규칙 적용, SVG 활용).

다이어리 감성 요소: 디지털 마스킹 테이프, 구겨진 포스트잇, 형광펜 효과, 스탬프 등을 활용.

타이포그래피: 가독성이 좋으면서도 아날로그 감성이 묻어나는 손글씨 폰트(나눔손글씨 펜 등) 사용.

3. 주요 기능 상세

3.1. 달력 기반 대시보드

통합 뷰: 메인 화면은 달력 형태로 제공되며, 각 날짜 칸 상단에 해당 일의 총수입(파란색)과 총지출(빨간색)을 요약 표시.

상세 내역 전개: 특정 날짜 클릭 시 달력 하단(또는 측면 패널)에 해당 날짜의 상세 지출 내역과 메모가 펼쳐짐.

3.2. 🎮 취미 예산 자동 관리 (10% 룰)

독립된 예산 책정: 게임, 구독료, 개인 여가 등은 '생활비'와 분리.

10% 자동 한도: 그 달 수입 입력 시 자동으로 수입의 10%가 취미 예산 한도로 설정됨.

시각적 초과 경고: 한도 초과 시 내역에 빨간색 색연필 밑줄 또는 흔들리는 포스트잇 팝업 제공.

3.3. 🐷 돼지저금통 (연간 저축 목표 관리)

숨겨진 목표 확인 공간: 화면 우측 하단 돼지저금통 버튼 클릭 시 모달 창 오픈.

진척도 시각화: 저금통 안에 물감이 차오르는 효과.

페이스메이커 기능: "올해 남은 기간 동안 매월 평균 OOO원을 저축해야 목표 달성 가능!" 자동 산출.

3.4. 🗓️ 월간 흐름 및 회고 시스템 (자동 전환)

자동 달력 렌더링: JavaScript Date 객체를 활용, 접속 시 현재 월의 빈 스케치북 페이지를 자동 렌더링. [ < ] 10월 [ > ] 버튼으로 월 이동.

월간 목표 설정 (다짐 포스트잇): 매달 1일, 달력 구석에 포스트잇 UI 생성. 이번 달의 정성적 다짐과 정량적 목표 예산 입력.

지난달 성취도 회고 (팝업북 리포트): 달이 바뀌어 접속 시 전체 화면에 결산 리포트 팝업. 목표 달성률(%) 및 취미 10% 방어전 결과 표시. 완벽 달성 시 거대한 '참 잘했어요' 도장 애니메이션.

4. 데이터베이스 및 구글 시트 연동 스키마

웹 앱과 구글 시트를 연동하여 데이터를 저장합니다. 구글 시트는 다음 3개의 시트(Sheet)로 구성됩니다.

4.1. Transactions (거래 기록)

date (날짜, 예: 2026-10-13)

type (유형: 수입/지출/저축)

category (대분류: 생활비/취미 등)

sub_category (소분류: 식비/게임 등)

description (사용 내역)

amount (금액)

payment_method (결제 수단)

memo (메모)

4.2. Settings (목표 및 설정)

setting_item (설정 항목: 연간저축목표 등)

value (설정값)

unit (단위)

note (비고)

4.3. Monthly_Summary (월별 요약)

month (결산 월: 2026-10)

resolution (이번 달 다짐)

target_budget (목표 예산)

actual_expense (실제 지출)

is_goal_achieved (목표 달성 여부)

is_hobby_exceeded (취미 초과 여부)

5. 💻 [AI 코딩 어시스턴트용] 개발 및 연동 구현 프롬프트

※ 개발자 및 AI 코딩 도구(Cursor, Copilot 등)는 아래 지침에 따라 코드를 생성할 것.

5.1. 구글 시트(Google Sheets) API 연동 구현 지침

Tech Stack: Next.js (App Router), React, Tailwind CSS.

라이브러리: google-spreadsheet 또는 googleapis 패키지를 사용하여 Google Sheets API v4와 연동하라.

인증 방식: Google Cloud Console에서 발급받은 '서비스 계정(Service Account)'의 JSON 키를 환경 변수(.env.local)에 저장하여, 사용자 로그인 없이 백엔드(Next.js API Route / Server Action)에서 구글 시트에 직접 데이터를 읽고 쓰도록(Read/Write) 구현하라.

CRUD 로직:

GET: 화면 로드 시 Transactions 시트에서 현재 월의 데이터를 필터링하여 가져오고 달력에 매핑하라.

POST: 사용자가 폼에 내역을 입력하고 저장하면, API Route를 통해 Transactions 시트의 가장 아래 행(Row)에 데이터를 append 하라.

5.2. 상태 관리 및 UI 구현 지침

달력 렌더링: date-fns 또는 dayjs 라이브러리를 활용하여 현재 시스템 날짜 기준의 달력 그리드를 생성하고, 이전/다음 달 이동 상태를 관리하라.

월말 결산 로직: 로컬 스토리지(Local Storage) 또는 구글 시트의 Monthly_Summary 데이터를 대조하여, 유저가 '새로운 달'에 처음 접속했는지 판단하라. 처음 접속했다면 이전 달의 데이터를 집계(총수입, 총지출, 취미 예산 초과 여부)하여 팝업 컴포넌트를 띄워라.

애니메이션: 돼지저금통 물감 차오르는 효과와 스탬프 효과는 framer-motion 패키지를 사용하여 부드러운 애니메이션으로 구현하라.

- .env.local 파일에 있는 NEXT_PUBLIC_GOOGLE_SCRIPT_URL 키 값을 이용하여 달력 작성 날짜시간과 내용에 대해 CRUD를 수행하는 기능 구현
- [오늘 쓴 돈 크레파스로 적기] 버튼을 누르면 달력 및 내용 저장
- 남은 한달 계획에 직접 추가할 수 있는 기능도 마련
```
제미나이를 이용하여 프롬프트 생성
---

## 16단계: 디자인 수정 및 기능 추가

```Prompt
- 메인 페이지 제목: 월간 파레트
-  Footer 영역을 세련되게 제작
- 하루에 쓴 금액이 얼마인지 그 합산 금액 한눈에 보이도록 달력에 표시
```
ai가 계속 에러날때는 
- .env.local 파일에 GOOGLE_GENERATIVE_AI_API_KEY 다시 불러들여서 적용
이렇게

---

## 17단계: 깃허브 사이트에 저장소 생성

- 깃허브 사이트에 접속하여 본 서비스를 업로드할 저장소 생성
- 본 과정에서는 `household_account_book` 으로 설정함
- 저장소 주소 복사 및 붙여넣기
https://github.com/luttongi0-eng/household_account_book

---

## 18단계: 깃허브 연결 확인

**프롬프트**

```Prompt
- git config --global user.email "luttongi0@gmail.com"
- git config --global user.name "luttongi0-eng"
- Personal access tokens (classic)=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
- 해당 저장소에 대해 깃허브 연결을 확인
```

---

## 19단계: 깃허브에 코드베이스 업로드

**프롬프트**

```Prompt
- https://github.com/luttongi0-eng/household_account_book
- 코드베이스를 깃허브에 업로드
```

---

## 20단계: 버셀을 통해 서비스 배포

- 버셀(Vercel)에 접속하여 깃허브의 `household_account_book` 저장소를 연결하여 배포
- 서비스를 제작할 때 구글 시트와 같이 외부 서비스를 연동했을 경우, `.env.local` 파일에 저장해둔 연동 키(API Key)도 **배포시 반드시 등록해주어야 함**
- 연동 키(API Key)는 직접 입력하여 등록할 수도 있지만  `.env.local` 파일을 지정하여 한번에 등록할 수 있음
