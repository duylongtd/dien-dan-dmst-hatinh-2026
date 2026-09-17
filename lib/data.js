// Toàn bộ nội dung sự kiện — nguồn: Báo Hà Tĩnh & bộ banner chính thức.

export const EVENT = {
  host: 'UBND TỈNH HÀ TĨNH',
  kicker: 'DIỄN ĐÀN',
  title: 'Từ ý tưởng đến thị trường',
  subtitle:
    'Kết nối chuyên gia, nhà đầu tư với khởi nghiệp đổi mới sáng tạo tại Hà Tĩnh',
  tagline: 'Kết nối tri thức — Kiến tạo tương lai',
  // Thời gian sự kiện — dùng cho đồng hồ đếm ngược
  datetimeISO: '2026-09-18T08:00:00+07:00',
  dateLabel: '08:00, Thứ Sáu 18/9/2026',
  venue: 'Khách sạn Đại Bàng',
  address: '268 Trần Phú, phường Thành Sen, tỉnh Hà Tĩnh',
  // Toạ độ Khách sạn Đại Bàng (Hà Tĩnh) cho HUD telemetry
  geo: { lat: 18.3428, lng: 105.9057 },
  celebrate: [
    { d: '01/10', label: 'Ngày hội Đổi mới sáng tạo Việt Nam' },
    { d: '10/10', label: 'Ngày Chuyển đổi số quốc gia' },
    { d: '13/10', label: 'Ngày Doanh nhân Việt Nam' },
  ],
};

export const STATS = [
  { value: 400, suffix: '', label: 'đại biểu dự kiến', hint: '350 – 400' },
  { value: 2, suffix: '', label: 'diễn giả dẫn dắt' },
  { value: 6, suffix: '', label: 'nhóm công nghệ trải nghiệm' },
  { value: 5, suffix: ' bước', label: 'hành trình thương mại hoá' },
];

// Trục kể chuyện có sẵn trong poster: Ý tưởng → Đầu tư
export const JOURNEY = [
  {
    id: 'idea',
    n: '01',
    title: 'Ý TƯỞNG',
    desc: 'Nhận diện cơ hội, hoàn thiện ý tưởng khởi nghiệp đổi mới sáng tạo từ thực tiễn Hà Tĩnh.',
  },
  {
    id: 'tech',
    n: '02',
    title: 'CÔNG NGHỆ',
    desc: 'Chuyển hoá sáng chế, công nghệ và sở hữu trí tuệ thành lõi giá trị của sản phẩm.',
  },
  {
    id: 'product',
    n: '03',
    title: 'SẢN PHẨM',
    desc: 'Định hình sản phẩm có khả năng thương mại hoá, kiểm chứng với người dùng thật.',
  },
  {
    id: 'market',
    n: '04',
    title: 'THỊ TRƯỜNG',
    desc: 'Xây chiến lược tiếp cận thị trường, mô hình kinh doanh và tệp khách hàng đầu tiên.',
  },
  {
    id: 'invest',
    n: '05',
    title: 'ĐẦU TƯ',
    desc: 'Kết nối nhà đầu tư, gọi vốn và tăng trưởng thành doanh nghiệp phát triển nhanh.',
  },
];

export const SPEAKERS = [
  {
    id: 'ducanh',
    side: 'left',
    photo: '/speaker-ducanh.png',
    name: 'Bùi Đức Anh',
    role: 'Giám đốc đầu tư — KBTG',
    bigword: 'NHÀ ĐẦU TƯ',
    quote: 'Tôi đặt cược vào nghề đầu tư mạo hiểm.',
    creds: [
      'Chuyên gia đầu tư khởi nghiệp công nghệ, trí tuệ nhân tạo & an ninh mạng',
      'Top 30 người trẻ ảnh hưởng nhất châu Á — lĩnh vực Tài chính Công nghệ',
    ],
    focus:
      'Góc nhìn nhà đầu tư về những yếu tố quyết định một dự án khởi nghiệp có thể thương mại hoá, gọi vốn và trở thành doanh nghiệp tăng trưởng nhanh.',
    accent: '#38D0FF',
  },
  {
    id: 'thuan',
    side: 'right',
    photo: '/speaker-thuan.png',
    name: 'TS. Ngô Đắc Thuần',
    role: 'Chủ tịch HĐQT — IP Group',
    bigword: 'CHUYÊN GIA',
    quote: 'Biến sáng chế thành sản phẩm ra được thị trường.',
    creds: [
      'Thành viên Ban Cố vấn Trung tâm Đổi mới sáng tạo Quốc gia (NIC)',
      'Chuyên sâu sở hữu trí tuệ & thương mại hoá công nghệ',
    ],
    focus:
      'Góc nhìn chuyên gia về khởi nghiệp sáng tạo trong lĩnh vực công nghệ và sản phẩm nông nghiệp — từ ý tưởng, sáng chế đến sản phẩm thương mại hoá.',
    accent: '#F5C542',
  },
];

export const TECH = [
  {
    id: 'uav-fixed',
    name: 'UAV cố định cánh',
    tag: 'Giải pháp bay — thu thập dữ liệu hiệu quả',
    img: '/drone-fixedwing.webp',
  },
  {
    id: 'uav-multi',
    name: 'UAV đa rotor',
    tag: 'Linh hoạt — mạnh mẽ — ứng dụng đa lĩnh vực',
    img: '/drone-multirotor.webp',
  },
  {
    id: 'survey',
    name: 'Thiết bị đo đạc, bản đồ',
    tag: 'Dữ liệu chính xác — nền tảng phát triển',
    img: null,
  },
  {
    id: 'camera-ai',
    name: 'Camera AI & thiết bị thông minh',
    tag: 'Giám sát thông minh — an toàn hơn cho cuộc sống',
    img: null,
  },
  {
    id: 'misa',
    name: 'Giải pháp phần mềm MISA SME 2026',
    tag: 'Quản trị thông minh — kiến tạo tăng trưởng',
    img: null,
  },
  {
    id: 'stem',
    name: 'Sản phẩm STEM & sáng tạo học sinh',
    tag: 'Nuôi dưỡng đam mê — kiến tạo thế hệ tương lai',
    img: null,
  },
];

export const NAV = [
  { id: 'hero', label: 'Mở đầu' },
  { id: 'journey', label: 'Hành trình' },
  { id: 'speakers', label: 'Diễn giả' },
  { id: 'tech', label: 'Trải nghiệm' },
  { id: 'register', label: 'Tham dự' },
];
