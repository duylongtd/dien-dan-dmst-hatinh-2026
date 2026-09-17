# Diễn đàn ĐMST Hà Tĩnh 2026 — Landing page

Landing page cho **Diễn đàn "Từ ý tưởng đến thị trường — Kết nối chuyên gia, nhà đầu tư với khởi nghiệp đổi mới sáng tạo Hà Tĩnh 2026"**.

Xây bằng **Next.js 14 (App Router) + React Three Fiber + Three.js + GSAP + Lenis**. Toàn trang là một không gian WebGL cố định (particle field GPU + drone bay + lưới hologram + bloom), nội dung là các panel kính HUD nổi lên trên.

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:3000
```

> Lần build đầu cần mạng để `next/font/google` tải font **Be Vietnam Pro** & **JetBrains Mono**.

```bash
npm run build && npm start   # bản production
```

Yêu cầu: Node.js 18.17+ (khuyến nghị 20+).

## Kiến trúc

```
app/
  layout.jsx        # font (Be Vietnam Pro, JetBrains Mono) + metadata SEO
  page.jsx          # Lenis smooth-scroll, GSAP reveal, cầu nối scroll -> WebGL
  globals.css       # design tokens, glass panel, HUD frame, nút bấm
components/
  Experience.jsx    # <Canvas> R3F: camera rig, bloom, vignette, fog
  Loader.jsx        # overlay "đang khởi tạo không gian"
  scene/
    ParticleField.jsx   # 14.000 hạt GPU, morph 3 hình: chữ HÀ TĨNH → cầu → data-field
    Drone.jsx           # UAV tách nền bay lơ lửng, nghiêng theo con trỏ
    HoloGrid.jsx        # sàn lưới phát sáng lùi về chân trời
  shaders/particles.js  # GLSL vertex/fragment (morph + repulsion + twinkle)
  sections/
    Hero.jsx        # tiêu đề + đếm ngược + telemetry
    Journey.jsx     # 5 bước Ý tưởng → Đầu tư (rail tương tác) + số liệu
    Speakers.jsx    # "đối thoại" split-light 2 diễn giả (cutout PNG)
    TechShowcase.jsx# 6 nhóm sản phẩm trải nghiệm
    EventInfo.jsx   # ngày lễ, bản đồ, form đăng ký
  ui/
    Nav.jsx         # điều hướng cố định
    Countdown.jsx   # đồng hồ đếm ngược tới 18/9/2026
lib/
  data.js           # TOÀN BỘ nội dung sự kiện (sửa ở đây)
  store.js          # singleton nối scroll DOM với vòng lặp WebGL
public/
  speaker-ducanh.png / speaker-thuan.png   # 2 diễn giả đã tách nền
  drone-fixedwing.webp / drone-multirotor.webp
```

## Điểm nhấn kỹ thuật

- **Particle field morph** (`ParticleField.jsx`): 3 mục tiêu vị trí (aPos0/1/2) trộn trong vertex shader theo uniform `uMorph`, cuộn trang điều khiển morph. Chữ "HÀ TĨNH" được lấy mẫu điểm từ canvas 2D lúc chạy — đổi chữ ở dòng `textTarget('HÀ TĨNH', COUNT)`.
- **Split-light diễn giả** (`Speakers.jsx`): rê chuột/chạm để rọi sáng từng người; chữ khổng lồ "NHÀ ĐẦU TƯ" / "CHUYÊN GIA" nằm sau cutout đúng phong cách One Mount.
- **Hiệu suất** (`Experience.jsx`, `page.jsx`):
  - Canvas nằm trong `.webgl-layer` (`position: fixed`) — không đặt `position` lên chính `<Canvas>` vì R3F ghi inline style `position: relative` đè lên class.
  - Kích thước hạt tính theo px CSS và **clamp** (`gl_PointSize ≤ 22px × dpr`); trước đây mỗi hạt phình tới hàng trăm px, 14.000 hạt phủ chồng lên nhau khiến GPU nghẽn (~16 fps ngay cả khi canvas chỉ cao 150px).
  - `dpr` tối đa 1.5, `antialias: false`, `EffectComposer multisampling={0}` (MSAA 8× vô nghĩa với hạt additive nhưng tốn bộ đệm rất lớn).
  - Panel `.glass` không dùng `backdrop-filter` (16 panel blur trên canvas vẽ lại mỗi frame là gánh nặng compositor lớn nhất); nav vẫn giữ blur vì chỉ có một.
  - Ba chế độ tự chọn khi tải: `full` (desktop), `lite` (điện thoại / màn nhỏ / CPU yếu: dpr 1, 5.000 hạt, không bloom), `off` (`prefers-reduced-motion`: không tạo canvas).
  - Canvas chỉ mount sau khi font hiển thị sẵn sàng (chữ hạt "HÀ TĨNH" được lấy mẫu bằng đúng font Be Vietnam Pro qua biến `--font-display`).
  - Khi cuộn qua hero, hạt và drone tự mờ còn ~45% (`uFade`), các section nội dung có lớp `.scrim` tối và chữ có viền tối để đọc được trên nền chuyển động.
  - Countdown render rỗng ở SSR rồi mới điền số ở client — tránh lỗi hydration khiến React vứt toàn bộ HTML server.
  - Cuộn chương trình dùng `lenis.scrollTo` (`lib/store.js`) thay vì `scrollIntoView` để không giằng co với Lenis.

## Tuỳ biến nhanh

| Muốn đổi | Sửa ở |
|---|---|
| Nội dung, diễn giả, sản phẩm, ngày giờ | `lib/data.js` |
| Bảng màu | `:root` trong `app/globals.css` + `tailwind.config.js` |
| Số hạt particle | `COUNT` trong `components/scene/ParticleField.jsx` |
| Độ mạnh bloom | `<Bloom intensity=… />` trong `components/Experience.jsx` |
| Kết nối form đăng ký | `submit()` trong `components/sections/EventInfo.jsx` |

## Ảnh đã xử lý

Ảnh gốc rất nhỏ (drone 355×135, chân dung ~750 px, mềm) và mask tách nền cũ quá rộng. Quy trình xử lý lại, chạy hoàn toàn offline:

1. Inpaint vùng trong suốt rồi **siêu phân giải 4×** bằng Real-ESRGAN (`pip install realesrgan-ncnn-py`, model `realesrgan-x4plus`, chạy qua Vulkan trên Apple Silicon). Chân dung giữ ở 2×, drone giữ 4×.
2. Cắt lại ở độ phân giải cao bằng Vision của macOS: `tools/segment-person.swift` (person segmentation, có tham số bào mòn mask) cho diễn giả; `tools/lift-subject.swift` (lift subject, macOS 14+) cho drone đa rotor. Drone cánh cố định giữ alpha gốc phóng lên vì cánh quá mỏng, mask Vision cắt mất.
3. Làm mềm alpha ~1 px để hết răng cưa. Drone lưu WebP q92 (texture Three.js tải trực tiếp), diễn giả lưu PNG để `next/image` tự tối ưu.
- `next/image` cho ảnh diễn giả dùng `sizes="320px"` + `quality={92}` để khớp kích thước hiển thị thực và không bị nén mềm viền alpha. Thay ảnh gốc độ phân giải cao hơn nếu có.

## Kiểm tra hiệu năng

Đo bằng Edge headless (GPU thật, ANGLE Metal, 1440×900 @2x) trên Apple M1:

| | Trước | Sau |
|---|---|---|
| Canvas thực tế | 1440×150 (dải mỏng đầu trang) | 1440×900 toàn màn hình |
| Hero | 16 fps | 60 fps |
| Cuộn toàn trang | rAF chết (0 frame / 6 s) | 60 fps, không spike |
