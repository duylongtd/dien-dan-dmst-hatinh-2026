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
  drone-fixedwing.png / drone-multirotor.png
```

## Điểm nhấn kỹ thuật

- **Particle field morph** (`ParticleField.jsx`): 3 mục tiêu vị trí (aPos0/1/2) trộn trong vertex shader theo uniform `uMorph`, cuộn trang điều khiển morph. Chữ "HÀ TĨNH" được lấy mẫu điểm từ canvas 2D lúc chạy — đổi chữ ở dòng `textTarget('HÀ TĨNH', COUNT)`.
- **Split-light diễn giả** (`Speakers.jsx`): rê chuột/chạm để rọi sáng từng người; chữ khổng lồ "NHÀ ĐẦU TƯ" / "CHUYÊN GIA" nằm sau cutout đúng phong cách One Mount.
- **Hiệu suất**: `dpr={[1, 1.8]}`, additive blending, `depthWrite:false`, tôn trọng `prefers-reduced-motion`.

## Tuỳ biến nhanh

| Muốn đổi | Sửa ở |
|---|---|
| Nội dung, diễn giả, sản phẩm, ngày giờ | `lib/data.js` |
| Bảng màu | `:root` trong `app/globals.css` + `tailwind.config.js` |
| Số hạt particle | `COUNT` trong `components/scene/ParticleField.jsx` |
| Độ mạnh bloom | `<Bloom intensity=… />` trong `components/Experience.jsx` |
| Kết nối form đăng ký | `submit()` trong `components/sections/EventInfo.jsx` |

## Ảnh đã xử lý

4 ảnh trong `public/` đã được tách nền (rembg + u2net human-seg, alpha matting, lọc vùng liên thông). Thay ảnh gốc chất lượng cao hơn nếu có.
