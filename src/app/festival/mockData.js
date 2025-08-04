export const mockFestivals = [
  {
    id: 1,
    title: '제 5회 강릉 비치비어 페스티벌',
    location: '경포해변 중앙광장',
    startDate: '2025.06.27',
    endDate: '2025.06.29',
    startTime: '13:00',
    endTime: '22:00',
    status: '진행 예정',
    region: '강원',
    category: '관광형',
    likes: 243,
    visitedFriend: 3,
    reviews: [
      {
        id: 1,
        nickname: '튀김소보로',
        date: '2025.06.27',
        content:
          '너무 덥지 않을 때 가서 좋았다! 바닷바람을 바라보며 맥주 한 캔을 마시니 정말 여유로웠다 🍺 너무 덥지 않을 때 가서 좋았다! 바닷바람을 바라보며 맥주 한 캔을 마시니 정말 여유로웠다 🍺',
        images: [
          '/images/test/review1.png',
          '/images/test/review2.png',
          '/images/test/review3.png',
        ],
        likes: 0,
      },
      {
        id: 2,
        nickname: '튀김소보로2',
        date: '2025.06.27',
        content:
          '너무 덥지 않을 때 가서 좋았다! 바닷바람을 바라보며 맥주 한 캔을 마시니 정말 여유로웠다 🍺',
        images: [
          '/images/test/review1.png',
          '/images/test/review2.png',
          '/images/test/review3.png',
        ],
        likes: 3,
      },
    ],
    price: 0,
    thumbnail: '/images/test/festival1.jpg',
    host: '강릉시, 강릉비치비어페스티벌 추진위원회',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '강릉 속 하와이라는 컨셉으로 하와이 와이키키 해변을 모티브로 이국적인 분위기의 여름 축제로 컨설팅 되었다. 와이키키 해변 못지 않은 경포해변이 아름다운 비치와 활기찬 휴양지 분위기를 느낄 수 있도록 쉼(힐링)과 플레이(여가)를 테마에 맞춰 공간(zone)을 연출하였다. 비치요가, 트레킹, 플로깅, 로컬밴드공연, 아티스트 공연 및 버블DJ공연 등 다양한 해변 콘텐츠를 통해 남녀노소 누구나 즐길 수 있는 축제로 구현하였다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 푸드존 - 맥주판매, 푸드트럭, 플리마켓\n2. 공연존 - EDM 클럽뮤직 파티, 힙합댄스, 버스킹 공연\n3. 이벤트존 - GBFF 경포타임챌린지, 타임이벤트 등',
      },
    ],
  },
  {
    id: 2,
    title: '서울 불꽃놀이 축제',
    location: '한강 반포지구',
    startDate: '2025.10.05',
    endDate: '2025.10.05',
    startTime: '13:00',
    endTime: '22:00',
    status: '진행 중',
    region: '서울',
    category: '야간형',
    likes: 13,
    visitedFriend: 6,
    reviews: [],
    price: 0,
    thumbnail: '/images/test/festival2.jpg',
    host: '서울시, 한화그룹',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '서울의 밤을 수놓는 화려한 불꽃쇼와 함께 다채로운 문화 공연이 어우러진 대표 야간 축제입니다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 불꽃쇼 및 한강 야경 감상\n2. 야시장 운영\n3. 라이브 공연 및 관객 참여 이벤트',
      },
    ],
  },
  {
    id: 3,
    title: '제주 푸드트럭 페스타',
    location: '제주시 탑동광장',
    startDate: '2025.08.15',
    endDate: '2025.08.17',
    startTime: '13:00',
    endTime: '22:00',
    status: '진행 완료',
    region: '제주도',
    category: '푸드형',
    likes: 30,
    visitedFriend: 3,
    reviews: [],
    price: 2000,
    thumbnail: '/images/test/festival3.jpg',
    host: '제주시 관광진흥과',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '제주의 푸른 바다를 배경으로 전국 각지의 푸드트럭이 모여 다양한 먹거리를 선보이는 푸드 페스티벌입니다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 전국 푸드트럭 50대 이상 참여\n2. 지역 특산물 체험 부스 운영\n3. 야외 뮤직 공연 및 경품 이벤트',
      },
    ],
  },
  {
    id: 4,
    title: 'DMZ 평화 음악제',
    location: '철원 평화공원',
    startDate: '2025.09.01',
    endDate: '2025.09.03',
    startTime: '13:00',
    endTime: '22:00',
    status: '진행 예정',
    region: '경기도',
    category: '음악형',
    likes: 709,
    visitedFriend: 0,
    reviews: [],
    price: 0,
    thumbnail: '/images/test/festival4.jpg',
    host: '경기도청 문화관광과',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '한반도 평화를 기원하며 DMZ 인근에서 열리는 대규모 음악 축제로, 국내외 뮤지션들이 함께하는 평화 메시지를 담은 공연이 펼쳐집니다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 국내외 아티스트 초청 콘서트\n2. DMZ 문화 체험 부스\n3. 피스 퍼레이드와 불꽃쇼',
      },
    ],
  },{
    id: 101,
    title: '한강축제',
    location: '서울 여의도 한강공원',
    startDate: '2025.07.31',
    endDate: '2025.08.02',
    startTime: '14:00',
    endTime: '22:00',
    status: '진행 완료',
    region: '서울',
    category: '야외형',
    likes: 95,
    visitedFriend: 4,
    reviews: [],
    price: 0,
    thumbnail: '/images/test/festival5.jpg',
    host: '서울시 한강사업본부',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '서울의 대표 여름 축제로, 여의도 한강공원에서 다양한 문화 공연과 야외 프로그램이 진행됩니다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 야외 음악 공연 및 시민 참여 무대\n2. 푸드트럭과 피크닉존 운영\n3. 밤하늘을 수놓는 불꽃놀이',
      },
    ],
  },
  {
    id: 102,
    title: '서울비축제',
    location: '서울 비축기지 문화공원',
    startDate: '2025.07.30',
    endDate: '2025.08.01',
    startTime: '15:00',
    endTime: '21:00',
    status: '진행 완료',
    region: '서울',
    category: '문화형',
    likes: 47,
    visitedFriend: 2,
    reviews: [],
    price: 0,
    thumbnail: '/images/test/festival6.jpg',
    host: '서울특별시',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '친환경 에너지와 예술이 결합된 서울의 이색 문화 축제입니다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 업사이클링 아트 전시\n2. 시민 참여형 환경 캠페인\n3. 지역 예술가 공연 및 체험',
      },
    ],
  },
  {
    id: 103,
    title: '속초해변축제',
    location: '속초 해수욕장',
    startDate: '2025.07.28',
    endDate: '2025.08.02',
    startTime: '10:00',
    endTime: '22:00',
    status: '진행 완료',
    region: '강원',
    category: '관광형',
    likes: 81,
    visitedFriend: 1,
    reviews: [],
    price: 0,
    thumbnail: '/images/test/festival7.jpg',
    host: '속초시청 관광과',
    details: [
      {
        infoname: '행사소개',
        infotext:
          '시원한 바다와 함께하는 여름 휴양형 축제로, 다양한 해변 액티비티와 먹거리로 가득한 축제입니다.',
      },
      {
        infoname: '행사내용',
        infotext:
          '1. 해변 요가와 서핑 체험\n2. 지역 바다 먹거리 장터\n3. 저녁 해변 버스킹 및 불꽃쇼',
      },
    ],
  },
];
