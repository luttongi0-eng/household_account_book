<!DOCTYPE html><html lang="ko" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>10월 크레파스 스케치북 가계부</title>
<!-- Tailwind CSS CDN with forms and container queries -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Google Fonts: Gaegu (손글씨 느낌) & Gowun Dodum -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&amp;family=Gowun+Dodum&amp;display=swap" rel="stylesheet">
<script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            crayon: ['Gaegu', 'cursive', 'sans-serif'],
            body: ['"Gowun Dodum"', 'sans-serif'],
          },
          colors: {
            crayonYellow: '#FFF4BD',
            crayonRed: '#FF6B6B',
            crayonBlue: '#4D96FF',
            crayonGreen: '#6BCB77',
            crayonOrange: '#FF9F45',
            crayonPurple: '#9D4EDD',
            crayonPink: '#FFB7B2',
            sketchBg: '#FDFBF7',
            paperBorder: '#3F3B36',
          },
          boxShadow: {
            'handdrawn': '3px 4px 0px 0px #3F3B36',
            'handdrawn-lg': '5px 6px 0px 0px #3F3B36',
            'stamp': '0 0 0 2px #FF6B6B, 2px 2px 0 2px #FF6B6B',
          }
        }
      }
    }
  </script>
<style data-purpose="custom-textures">
    /* 도화지 미세 질감 및 크레파스 테두리 커스텀 */
    body {
      background-color: #EFE8DA;
      background-image: radial-gradient(#d3cbbd 0.75px, transparent 0.75px);
      background-size: 16px 16px;
    }

    .sketch-board {
      background-color: #FDFBF7;
      box-shadow: 8px 12px 25px rgba(63, 59, 54, 0.15);
      border-radius: 20px;
    }

    /* 손으로 삐뚤빼뚤 그린 듯한 보더 효과 */
    .crayon-border {
      border: 2.5px solid #3F3B36;
      border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
    }

    .crayon-border-round {
      border: 2.5px solid #3F3B36;
      border-radius: 18px 24px 20px 22px;
    }

    /* 크레파스 밑줄 하이라이트 효과 */
    .crayon-highlight-yellow {
      background: linear-gradient(104deg, rgba(255,244,189,0) 0.9%, rgba(255,230,109,0.7) 2.4%, rgba(255,244,189,0.5) 98%);
      border-radius: 4px;
      padding: 0 4px;
    }
    .crayon-highlight-red {
      background: linear-gradient(104deg, rgba(255,107,107,0) 0.9%, rgba(255,107,107,0.3) 2.4%, rgba(255,150,150,0.2) 98%);
      border-radius: 4px;
      padding: 0 4px;
    }

    /* 스프링 링 디테일 */
    .spiral-ring {
      width: 14px;
      height: 38px;
      background: linear-gradient(135deg, #71717A 0%, #E4E4E7 50%, #52525B 100%);
      border-radius: 12px;
      border: 1.5px solid #27272A;
      box-shadow: 2px 3px 2px rgba(0,0,0,0.25);
    }
  </style>
</head>
<body class="font-body text-[#333333] p-4 md:p-8 min-h-screen flex justify-center items-start">
<!-- BEGIN: MainSketchbookContainer -->
<!-- 스케치북 전체를 감싸는 본체 래퍼 -->
<main class="w-full max-w-6xl sketch-board relative pt-10 pb-12 px-6 md:px-12 crayon-border-round border-3" data-purpose="sketchbook-notebook">
<!-- BEGIN: SpiralBinder -->
<!-- 상단 스케치북 스프링 바인더 구멍과 링 모티브 -->
<div aria-hidden="true" class="absolute -top-5 left-0 right-0 flex justify-around px-8 pointer-events-none" data-purpose="spring-binder-rings">
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
<div class="flex flex-col items-center"><div class="spiral-ring"></div><div class="w-3.5 h-3.5 bg-neutral-800 rounded-full mt-1 border border-neutral-600"></div></div>
</div>
<!-- END: SpiralBinder -->
<!-- BEGIN: HeaderSection -->
<!-- 스케치북 상단 제목: 10월 가계부 및 돼지저금통 저금 현황 -->
<header class="flex flex-col md:flex-row items-center justify-between border-b-4 border-dashed border-[#B8AEA3] pb-6 mb-8 mt-2" data-purpose="sketch-header">
<div class="flex items-center gap-3">
<span class="text-4xl">🖍️</span>
<h1 class="font-crayon text-4xl md:text-5xl font-bold tracking-tight text-[#2B2B2B]">
          10월 가계부 <span class="text-crayonOrange text-3xl font-normal">~가을의 알뜰살뜰 기록~</span>
</h1>
</div>
<!-- 돼지 저금통 위젯 (와이어프레임 상단의 '돼지 저금통' 반영) -->
<div class="mt-4 md:mt-0 flex items-center bg-[#FFE8E8] px-5 py-3 rounded-3xl crayon-border shadow-handdrawn hover:rotate-1 transition-transform cursor-pointer" data-purpose="piggy-bank-status">
<div class="relative mr-3 text-3xl">
          🐷
          <span class="absolute -top-1 -right-1 text-xs bg-crayonRed text-white rounded-full px-1.5 font-crayon font-bold animate-bounce">UP!</span>
</div>
<div>
<div class="font-crayon text-sm font-bold text-neutral-600">돼지 저금통 차곡차곡</div>
<div class="font-crayon text-2xl font-bold text-[#E63946] leading-none">₩450,000 모음</div>
</div>
</div>
</header>
<!-- END: HeaderSection -->
<!-- BEGIN: CalendarSection -->
<!-- '그 달 달력' 영역: 10월 날짜 그리드와 지출/무지출 스탬프 표시 -->
<section class="mb-10" data-purpose="monthly-calendar-section">
<div class="flex flex-wrap items-center justify-between mb-4">
<h2 class="font-crayon text-3xl font-bold flex items-center gap-2">
          📅 그 달 달력 <span class="text-lg font-normal text-stone-500">(2024년 10월)</span>
</h2>
<!-- 저축 진행률 게이지 -->
<div class="flex items-center gap-3 bg-amber-50 px-4 py-1.5 crayon-border rounded-xl">
<span class="font-crayon text-base font-bold text-amber-900">저축 목표 (₩600,000) 달성률</span>
<div class="w-32 bg-stone-200 h-4 rounded-full overflow-hidden border border-stone-400">
<div class="bg-crayonGreen h-full w-3/4 rounded-full relative" title="75%">
<div class="absolute inset-0 bg-white opacity-20 transform -skew-x-12"></div>
</div>
</div>
<span class="font-crayon font-bold text-base text-stone-700">75%</span>
</div>
</div>
<!-- 달력 테이블 형태의 손그림 박스 -->
<div class="bg-white p-4 crayon-border-round shadow-handdrawn overflow-x-auto"><div class="min-w-[650px]"><div class="grid grid-cols-7 gap-2 text-center font-crayon text-lg font-bold mb-3 pb-2 border-b-2 border-stone-300"><div class="text-red-500">일</div><div class="text-stone-700">월</div><div class="text-stone-700">화</div><div class="text-stone-700">수</div><div class="text-stone-700">목</div><div class="text-stone-700">금</div><div class="text-blue-600">토</div></div><div class="grid grid-cols-7 gap-2 font-crayon"><div class="h-20 p-1 bg-stone-50/50 rounded-lg opacity-40 text-left border border-dashed border-stone-200"><span class="text-xs text-stone-400">9/29</span></div><div class="h-20 p-1 bg-stone-50/50 rounded-lg opacity-40 text-left border border-dashed border-stone-200"><span class="text-xs text-stone-400">9/30</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between hover:border-crayonOrange transition-all"><span class="text-sm font-bold text-stone-700">1</span><div class="bg-orange-100 text-orange-800 text-xs px-1 py-0.5 rounded border border-orange-300 truncate">-₩14,000 점심</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">2</span><div class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded border border-blue-300 truncate">-₩3,500 커피</div></div><div class="h-20 p-1.5 bg-green-50/60 rounded-lg border-2 border-dashed border-crayonGreen flex flex-col justify-between relative overflow-hidden"><div class="flex justify-between items-center"><span class="text-sm font-bold text-red-500">3 🇰🇷</span><span class="text-[10px] text-red-500 font-bold">개천절</span></div><div class="self-center transform -rotate-12 bg-white px-2 py-0.5 border-2 border-crayonRed rounded-full shadow-sm text-crayonRed font-bold text-xs">★ 무지출!</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">4</span><div class="bg-purple-100 text-purple-800 text-xs px-1 py-0.5 rounded border border-purple-300 truncate">-₩42,000 장보기</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-blue-600">5</span><div class="bg-red-100 text-red-800 text-xs px-1 py-0.5 rounded border border-red-300 truncate">-₩28,000 외식</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-red-500">6</span><div class="bg-stone-100 text-stone-700 text-xs px-1 py-0.5 rounded border border-stone-300 truncate">-₩6,000 편의점</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">7</span><div class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded border border-blue-300 truncate">-₩1,500 버스</div></div><div class="h-20 p-1.5 bg-green-50/60 rounded-lg border-2 border-dashed border-crayonGreen flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">8</span><div class="self-center transform -rotate-6 bg-white px-2 py-0.5 border-2 border-crayonGreen rounded-full shadow-sm text-crayonGreen font-bold text-xs">🌿 참았어요!</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><div class="flex justify-between items-center"><span class="text-sm font-bold text-red-500">9 🌸</span><span class="text-[10px] text-red-500 font-bold">한글날</span></div><div class="bg-amber-100 text-amber-900 text-xs px-1 py-0.5 rounded border border-amber-300 truncate">-₩15,000 책구매</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">10</span><div class="bg-orange-100 text-orange-900 text-xs px-1 py-0.5 rounded border border-orange-300 truncate">-₩8,500 구내식당</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">11</span><div class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded border border-blue-300 truncate">-₩4,800 카페</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-blue-600">12</span><div class="bg-red-100 text-red-800 text-xs px-1 py-0.5 rounded border border-red-300 truncate">-₩31,000 마트</div></div><div class="h-20 p-1.5 bg-green-50/60 rounded-lg border-2 border-dashed border-crayonGreen flex flex-col justify-between"><span class="text-sm font-bold text-red-500">13</span><div class="self-center transform rotate-6 bg-white px-2 py-0.5 border-2 border-crayonGreen rounded-full shadow-sm text-crayonGreen font-bold text-xs">✨ 집밥 성공!</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">14</span><div class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded border border-blue-300 truncate">-₩1,500 지하철</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">15</span><div class="bg-amber-100 text-amber-900 text-xs px-1 py-0.5 rounded border border-amber-300 truncate">-₩9,000 점심</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">16</span><div class="bg-purple-100 text-purple-800 text-xs px-1 py-0.5 rounded border border-purple-300 truncate">-₩50,000 주유</div></div><div class="h-20 p-1.5 bg-green-50/60 rounded-lg border-2 border-dashed border-crayonGreen flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">17</span><div class="self-center transform -rotate-6 bg-white px-2 py-0.5 border-2 border-crayonRed rounded-full shadow-sm text-crayonRed font-bold text-xs">★ 0원 데이</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">18</span><div class="bg-orange-100 text-orange-800 text-xs px-1 py-0.5 rounded border border-orange-300 truncate">-₩12,000 서점</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-blue-600">19</span><div class="bg-red-100 text-red-800 text-xs px-1 py-0.5 rounded border border-red-300 truncate">-₩23,000 친구모임</div></div><div class="h-20 p-1.5 bg-yellow-50 rounded-lg border-2 border-crayonOrange flex flex-col justify-between shadow-inner ring-2 ring-yellow-400/50"><div class="flex justify-between items-center"><span class="text-sm font-bold text-red-500">20 📌</span><span class="text-[10px] bg-crayonOrange text-white px-1 rounded">오늘</span></div><div class="bg-white text-orange-900 text-xs px-1 py-0.5 rounded border border-orange-300 font-bold truncate">-₩5,500 간식</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">21</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">22</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">23</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">24</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">25</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-blue-400">26</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-red-400">27</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">28</span><div class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded border border-blue-300 truncate">-₩2,500 편의점</div></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">29</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-dashed border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-500">30</span><span class="text-xs text-stone-400 text-center mt-2">지출 예정</span></div><div class="h-20 p-1.5 bg-[#FFFDF7] rounded-lg border-2 border-stone-200 flex flex-col justify-between"><span class="text-sm font-bold text-stone-700">31</span><div class="bg-green-100 text-green-800 text-[10px] px-1 py-0.5 rounded border border-green-300 font-bold truncate">월말 정산 🎯</div></div><div class="h-20 p-1 bg-stone-50/50 rounded-lg opacity-40 text-left border border-dashed border-stone-200"><span class="text-xs text-stone-400">11/1</span></div><div class="h-20 p-1 bg-stone-50/50 rounded-lg opacity-40 text-left border border-dashed border-stone-200"><span class="text-xs text-blue-400">11/2</span></div></div></div></div>
</section>
<!-- END: CalendarSection -->
<!-- BEGIN: SummarySection -->
<!-- '한달 요약': 수입/지출/잔액 3대 카드 및 카테고리별 도넛 소비비율 -->
<section class="mb-10" data-purpose="monthly-summary-section">
<h2 class="font-crayon text-3xl font-bold mb-4 flex items-center gap-2">
        ✏️ 한달 요약 <span class="text-sm text-stone-600 font-body">(현재까지 정산)</span>
</h2>
<!-- 수입/지출/잔액 3색 크레파스 카드 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
<!-- 총 수입 카드 -->
<div class="bg-[#EBF4FF] p-5 rounded-2xl crayon-border shadow-handdrawn transform -rotate-1 hover:rotate-0 transition-transform">
<div class="flex items-center justify-between font-crayon">
<span class="text-xl font-bold text-blue-700">💰 10월 총 수입</span>
<span class="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">월급+부수입</span>
</div>
<div class="font-crayon text-3xl font-bold text-blue-900 mt-3">₩3,500,000</div>
<div class="font-crayon text-sm text-blue-600 mt-1">목표 대비 달성률 100% ✨</div>
</div>
<!-- 총 지출 카드 -->
<div class="bg-[#FFF1F1] p-5 rounded-2xl crayon-border shadow-handdrawn transform rotate-1 hover:rotate-0 transition-transform">
<div class="flex items-center justify-between font-crayon">
<span class="text-xl font-bold text-red-600">💸 10월 총 지출</span>
<span class="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">예산의 52%</span>
</div>
<div class="font-crayon text-3xl font-bold text-red-700 mt-3">₩1,820,000</div>
<div class="font-crayon text-sm text-red-500 mt-1">전월 동기 대비 -3.2% 절약 중!</div>
</div>
<!-- 남은 예산 카드 -->
<div class="bg-[#EDF7ED] p-5 rounded-2xl crayon-border shadow-handdrawn transform -rotate-1 hover:rotate-0 transition-transform">
<div class="flex items-center justify-between font-crayon">
<span class="text-xl font-bold text-green-700">🌱 남은 한 달 예산</span>
<span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">D-21</span>
</div>
<div class="font-crayon text-3xl font-bold text-green-900 mt-3">₩1,230,000</div>
<div class="font-crayon text-sm text-green-600 mt-1">저축 목표 45만원 안전 확보! 👍</div>
</div>
</div>
<!-- 카테고리별 지출 비율 바차트 및 손그림 통계 -->
<div class="bg-[#FFFDF9] p-6 rounded-2xl crayon-border shadow-handdrawn">
<h3 class="font-crayon text-2xl font-bold text-stone-800 mb-4 flex items-center justify-between">
<span class="">🎨 카테고리별 지출 크레파스 차트</span>
<span class="text-xs font-normal text-stone-500 font-body">총 1,820,000원 기준</span>
</h3>
<!-- 알록달록 스택형 크레파스 바 -->
<div class="w-full h-8 rounded-xl flex overflow-hidden border-2 border-stone-800 mb-4 p-0.5 bg-stone-100">
<div class="bg-[#FF6B6B] h-full flex items-center justify-center text-white font-crayon text-xs font-bold" style="width: 42%" title="식비 42%">식비 42%</div>
<div class="bg-[#FF9F45] h-full flex items-center justify-center text-white font-crayon text-xs font-bold" style="width: 25%" title="쇼핑 25%">쇼핑 25%</div>
<div class="bg-[#9D4EDD] h-full flex items-center justify-center text-white font-crayon text-xs font-bold" style="width: 18%" title="문화 18%">문화 18%</div>
<div class="bg-[#4D96FF] h-full flex items-center justify-center text-white font-crayon text-xs font-bold" style="width: 15%" title="교통 15%">교통 15%</div>
</div>
<!-- 각 카테고리 세부 카드 4종 -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-3 font-crayon">
<div class="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
<span class="text-2xl">🍔</span>
<div>
<div class="text-sm text-stone-600 font-bold">식비 (42%)</div>
<div class="text-base text-red-600 font-bold">₩764,400</div>
</div>
</div>
<div class="flex items-center gap-2 p-2 rounded-lg bg-orange-50 border border-orange-200">
<span class="text-2xl">🛍️</span>
<div>
<div class="text-sm text-stone-600 font-bold">쇼핑 (25%)</div>
<div class="text-base text-orange-600 font-bold">₩455,000</div>
</div>
</div>
<div class="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-200">
<span class="text-2xl">🎬</span>
<div>
<div class="text-sm text-stone-600 font-bold">문화/여가 (18%)</div>
<div class="text-base text-purple-600 font-bold">₩327,600</div>
</div>
</div>
<div class="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
<span class="text-2xl">🚌</span>
<div>
<div class="text-sm text-stone-600 font-bold">교통/통신 (15%)</div>
<div class="text-base text-blue-600 font-bold">₩273,000</div>
</div>
</div>
</div>
</div>
</section>
<!-- END: SummarySection -->
<!-- BEGIN: AiPlanAndReduceSection -->
<!-- '남은 한달 계획 - ai 계산' 및 '줄여야할 소비 부분'을 담은 2분할 섹션 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
<!-- AI 스마트 소비 플래너 영역 (와이어프레임 '남은 한달 계획-ai 계산') -->
<section class="bg-[#FFFBEA] p-6 rounded-2xl crayon-border shadow-handdrawn flex flex-col justify-between" data-purpose="ai-daily-plan">
<div>
<div class="flex items-center justify-between mb-3 border-b-2 border-amber-300 pb-2">
<h2 class="font-crayon text-2xl md:text-3xl font-bold text-amber-950 flex items-center gap-2">
              🤖 남은 한달 계획 <span class="text-sm font-normal text-amber-800 font-body">[AI 맞춤 계산]</span>
</h2>
<span class="bg-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">남은 21일</span>
</div>
<!-- 일일 권장 소비액 가이드 말풍선 -->
<div class="bg-white p-4 rounded-xl border-2 border-stone-800 shadow-sm mb-4 relative">
<div class="font-crayon text-xl font-bold text-stone-800 mb-1 flex items-center gap-2">
<span class="">💡 하루 권장 지출 금액:</span>
<span class="text-2xl text-crayonOrange font-black crayon-highlight-yellow">₩41,000 원</span>
</div>
<p class="text-sm text-stone-600 leading-relaxed font-body">
              "앞으로 남은 21일간 하루 41,000원 선을 지키면 이번 달 <strong>저축 목표 45만원</strong>을 100% 지켜낼 수 있어요!"
            </p>
</div>
<!-- 크레파스 체크리스트 -->
<div class="space-y-2.5 font-crayon text-lg">
<label class="flex items-center gap-3 p-2 bg-amber-100/60 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
<input checked="" class="w-5 h-5 text-crayonOrange rounded border-2 border-stone-700 focus:ring-0" type="checkbox">
<span class="line-through text-stone-500">평일 점심 1회 도시락 챙기기 (달성 완료 🍱)</span>
</label>
<label class="flex items-center gap-3 p-2 bg-amber-100/60 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
<input class="w-5 h-5 text-crayonOrange rounded border-2 border-stone-700 focus:ring-0" type="checkbox">
<span class="text-stone-800">금요일 퇴근길 택시 대신 대중교통 이용하기 🚇</span>
</label>
<label class="flex items-center gap-3 p-2 bg-amber-100/60 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
<input class="w-5 h-5 text-crayonOrange rounded border-2 border-stone-700 focus:ring-0" type="checkbox">
<span class="text-stone-800">주말 배달 음식 1회로 한정하고 장봐서 먹기 🍲</span>
</label>
</div>
</div>
<div class="mt-4 pt-3 border-t border-amber-300 text-right font-crayon text-amber-800 text-sm">
          * 매일 자정 소비 지출에 맞춰 실시간으로 재계산됩니다.
        </div>
</section>
<!-- 줄여야 할 소비 부분 (와이어프레임 '줄여야할 소비 부분' 반영) -->
<section class="bg-[#FFF5F5] p-6 rounded-2xl crayon-border shadow-handdrawn flex flex-col justify-between" data-purpose="reduce-spending-advice">
<div>
<div class="flex items-center justify-between mb-3 border-b-2 border-red-200 pb-2">
<h2 class="font-crayon text-2xl md:text-3xl font-bold text-red-900 flex items-center gap-2">
              🚨 줄여야 할 소비 부분 <span class="text-sm font-normal text-red-700 font-body">[낭비 탐지기]</span>
</h2>
<span class="bg-red-200 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold">주의 3건</span>
</div>
<p class="font-body text-sm text-stone-600 mb-4">
            AI 소비 패턴 분석 결과, 아래 세 가지 항목에서 예상보다 많은 누수가 일어나고 있어요.
          </p>
<!-- 빨간 크레파스 테두리 경고 카드 목록 -->
<div class="space-y-3 font-crayon">
<!-- 항목 1: 심야 배달비/야식 -->
<div class="bg-white p-3.5 rounded-xl border-2 border-red-400 relative overflow-hidden flex items-start gap-3">
<div class="text-2xl mt-0.5">🛵</div>
<div class="flex-1">
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-red-800">심야 배달비 &amp; 야식비</span>
<span class="text-base text-red-600 font-bold crayon-highlight-red">-₩68,000 지출</span>
</div>
<p class="text-xs text-stone-600 font-body mt-0.5">
                  지난주 밤 10시 이후 주문 3회 감지. 배달 팁만 12,000원 들었어요!
                </p>
</div>
</div>
<!-- 항목 2: 미사용 중복 OTT 구독 -->
<div class="bg-white p-3.5 rounded-xl border-2 border-red-400 relative overflow-hidden flex items-start gap-3">
<div class="text-2xl mt-0.5">📺</div>
<div class="flex-1">
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-red-800">잘 안 보는 OTT 구독 (2개)</span>
<span class="text-base text-red-600 font-bold crayon-highlight-red">-₩29,800 결제</span>
</div>
<p class="text-xs text-stone-600 font-body mt-0.5">
                  최근 30일간 접속 기록 없는 동영상 서비스 1건 해지 추천!
                </p>
</div>
</div>
<!-- 항목 3: 습관성 테이크아웃 카페 지출 -->
<div class="bg-white p-3.5 rounded-xl border-2 border-red-400 relative overflow-hidden flex items-start gap-3">
<div class="text-2xl mt-0.5">☕</div>
<div class="flex-1">
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-red-800">오후 습관성 카페 음료</span>
<span class="text-base text-red-600 font-bold crayon-highlight-red">-₩31,500 누적</span>
</div>
<p class="text-xs text-stone-600 font-body mt-0.5">
                  텀블러 사용 할인 혜택 및 회사 탕비실 티백을 애용해보세요 ☕
                </p>
</div>
</div>
</div>
</div>
<!-- 절약 예측 기대치 뱃지 -->
<div class="mt-4 p-2.5 bg-red-100 rounded-xl border border-red-300 text-center font-crayon text-base text-red-900 font-bold">
          🎉 위 3가지만 줄여도 이번 달 <span class="text-crayonRed text-lg underline">₩129,300원</span>을 더 아낄 수 있어요!
        </div>
</section>
</div>
<!-- END: AiPlanAndReduceSection -->
<!-- BEGIN: QuickActionButton -->
<!-- 하단 간편 소비 입력 손그림 플로팅/고정 바 -->
<footer class="mt-10 pt-6 border-t-2 border-dashed border-[#B8AEA3] flex flex-col sm:flex-row items-center justify-between gap-4 font-crayon" data-purpose="footer-controls">
<div class="text-stone-600 text-lg flex items-center gap-2">
<span class="">✏️ "작은 동전들이 모여 커다란 꿈이 됩니다."</span>
</div>
<div class="flex gap-3">
<button class="px-5 py-2.5 bg-white text-stone-800 font-bold text-xl rounded-xl crayon-border shadow-handdrawn hover:bg-stone-50 active:translate-x-0.5 active:translate-y-0.5 transition-all" type="button">
          📋 지난달 가계부 보기
        </button>
<button class="px-6 py-2.5 bg-crayonOrange text-white font-bold text-xl rounded-xl crayon-border shadow-handdrawn hover:bg-orange-500 active:translate-x-0.5 active:translate-y-0.5 transition-all" type="button">
          ➕ 오늘 쓴 돈 크레파스로 적기
        </button>
</div>
</footer>
<!-- END: QuickActionButton -->
</main>
<!-- END: MainSketchbookContainer -->


</body></html>