# Phazel Sound Admin Dashboard - Design System

## Brand Identity

### Logo & Visual
- **Logo**: Gradient play button (yellow → pink → purple → blue)
- **Brand Name**: Phazel Sound
- **Tagline**: Bảng quản trị (Admin Panel)
- **Style**: Modern, vibrant, music-focused

### Color Palette

#### Primary Gradient (Logo)
- Yellow: `#FDB022`
- Coral/Red: `#FF6B6B`  
- Pink: `#FF1493`
- Purple: `#9D4EDD`
- Blue: `#3A0CA3`
- Cyan: `#00D9FF`

#### OKLch Design Tokens
```css
:root {
  --primary: oklch(0.72 0.25 50);      /* Yellow-Gold */
  --accent: oklch(0.68 0.28 30);       /* Coral-Red */
  --chart-1: oklch(0.72 0.25 50);      /* Yellow */
  --chart-2: oklch(0.68 0.28 30);      /* Red */
  --chart-3: oklch(0.62 0.25 280);     /* Purple */
}

.dark {
  --primary: oklch(0.78 0.28 50);      /* Bright Yellow */
  --accent: oklch(0.75 0.32 30);       /* Bright Red */
}
```

### Spacing & Typography
- **Border Radius**: 0.625rem (10px) base
- **Sidebar Buttons**: `rounded-full` (pill shape)
- **Transitions**: 200-300ms duration-200
- **Font Scale**: Semantic HTML with consistent weights

## Component Library

### Navigation Items
**Active State:**
```html
<Link className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 
  text-white rounded-full h-10 px-4 shadow-lg shadow-pink-500/30">
  Label
</Link>
```

**Inactive State:**
```html
<Link className="text-slate-700 dark:text-slate-300 rounded-full 
  hover:bg-slate-200/60 dark:hover:bg-slate-800/60">
  Label
</Link>
```

### Status Badges

#### Vietnamese Status Labels
| Status | Vietnamese | Color |
|--------|-----------|-------|
| ACTIVE | Hoạt động | Emerald |
| PAUSED | Tạm dừng | Amber |
| ARCHIVED | Đã lưu trữ | Zinc |

### Logo Component
```tsx
// components/logo-icon.tsx
<LogoIcon size={40} />  // Gradient SVG play button
```

### Breadcrumb
- Separator: `›` (chevron)
- Active text: Gradient `from-yellow-500 via-pink-500 to-blue-500`
- Inactive: `text-slate-500 dark:text-slate-400`

### User Profile
```tsx
<div className="rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500">
  Avatar
</div>
```

## Dark Mode

### Implementation
- Uses `dark:` Tailwind prefix
- Background: `oklch(0.08 0.01 242)` - very dark blue-tinted
- Card: `oklch(0.12 0.015 242)` - dark blue-tinted
- Text: `oklch(0.92 0.015 240)` - bright blue-tinted white

### Color Adjustments
Dark mode enhances saturation:
- Primary becomes brighter: `oklch(0.78 0.28 50)`
- Accent becomes more vibrant: `oklch(0.75 0.32 30)`

## Localization - Vietnamese (100%)

### Key Phrases
| English | Vietnamese |
|---------|-----------|
| Navigation | (No label, context-based) |
| Dashboard | Tổng quan |
| Users | Người dùng |
| Music & Albums | Nhạc & Album |
| Subscriptions | Gói cước |
| Ads | Quảng cáo |
| Reports | Báo cáo |
| Analytics | Thống kê |
| Light Mode | Chế độ sáng |
| Dark Mode | Chế độ tối |
| Logout | Đăng xuất |
| Online | Hoạt động |
| Administrator | Quản trị viên |

### Form Labels (All Vietnamese)
- Advertiser → Nhà quảng cáo
- Title → Tiêu đề
- Description → Mô tả
- Target URL → Đường dẫn
- CPM → Chi phí/1K lần (VNĐ)
- Budget → Ngân sách (VNĐ)
- Duration → Thời lượng (s)
- Start Date → Ngày bắt đầu
- End Date → Ngày kết thúc
- Status → Trạng thái

## Animations & Interactions

### Navigation Hover
- Inactive: `hover:bg-slate-200/60 dark:hover:bg-slate-800/60` (subtle background)
- Smooth: `transition-all duration-200`

### Active State
- Gradient background with shadow: `shadow-lg shadow-pink-500/30`
- Filled icon: `weight={active ? 'fill' : 'regular'}`

### Sidebar Transitions
- Toggle slide: `transition-transform duration-300`
- Brand area: Static (no animation)

### Status Indicator
- Pulse animation: `animate-pulse` on dot
- Colors match theme (emerald for online)

## Responsive Behavior

### Sidebar
- Mobile (< lg): Fixed overlay with `translate-x-0/-translate-x-full`
- Desktop (≥ lg): Always visible on left
- Hamburger menu toggles visibility

### Header
- Breadcrumb: Always visible
- Status: Responsive spacing
- Theme toggle: Hidden on mobile (`hidden lg:flex`)

## API Integration

### Backend URL
```env
NEXT_PUBLIC_API_URL=https://phazelsound.oopsgolden.id.vn
```

### Request Deduplication
- Automatic in-flight request deduplication
- Cache-based response caching with TTL
- Vietnamese error messages

## Best Practices

### Adding New Pages
1. Use Vietnamese labels in NAV array
2. Add breadcrumb mapping in SEGMENT_LABELS
3. Follow gradient accent on active states
4. Ensure all UI text is Vietnamese

### Color Usage
- Primary (yellow): Main actions, headers
- Accent (red): Destructive, warnings
- Charts: Use chart-1 through chart-5 tokens
- Status colors: Emerald (success), Amber (warning), Zinc (inactive)

### Typography
- Headings: Bold, -0.02em letter-spacing, 1.2 line-height
- Body: Medium weight, 1.4-1.6 line-height
- Labels: Uppercase, small font, tracked wide
- Monospace: Numeric values, codes

## File Structure

```
components/
├── logo-icon.tsx          # Gradient SVG logo
├── ui/                    # shadcn/ui components
└── ...

app/
├── globals.css            # Color tokens, theme
├── layout.tsx             # Main layout
└── dashboard/
    ├── layout.tsx         # Sidebar, header, navigation
    ├── page.tsx           # Dashboard page
    ├── users/
    ├── music/
    ├── ads/
    ├── payments/
    ├── analytics/
    └── reports/
```

## Maintenance Notes

- All OKLch colors in `app/globals.css`
- Logo component in `components/logo-icon.tsx`
- Sidebar layout in `app/dashboard/layout.tsx`
- Gradient definitions for buttons in component files
- Status labels in individual page files

---

**Last Updated**: Today  
**Version**: 1.0  
**Language**: Vietnamese  
**Theme**: Spotify/SoundCloud inspired with Phazel Sound personality
