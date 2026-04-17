# Album & Artist Management Features

## Overview

Added comprehensive management interfaces for albums and artists with full CRUD operations, search, pagination, and real-time updates.

## Features

### Albums Management (`/dashboard/albums`)

**Grid View**
- Album cover images with lazy loading
- Title, artist name, and description
- Statistics: song count and favorite count
- Responsive grid (1, 2, or 3 columns based on screen size)

**Operations**
- **Add Album**: Click "Thêm Album" button to open modal form
- **Edit Album**: Click "Chỉnh sửa" button on album card
- **Delete Album**: Click "Xóa" button with confirmation dialog
- **Search**: Real-time search across album titles
- **Pagination**: Navigate through paginated results (12 per page)

**Form Fields**
- Tiêu đề * (Title - required)
- Mô tả (Description)
- Ngày phát hành (Release date)
- ID Nghệ sĩ (Artist ID)

**Real-time Updates**
- Auto-refresh when changes detected via websocket
- Automatic cache invalidation

### Artists Management (`/dashboard/artists`)

**Table View**
- Artist avatar with gradient fallback
- Stage name and full name
- Statistics: songs, albums, followers
- Responsive table with horizontal scroll on mobile

**Operations**
- **Add Artist**: Click "Thêm Nghệ sĩ" button
- **Edit Artist**: Click pencil icon on artist row
- **Delete Artist**: Click trash icon with confirmation
- **Search**: Filter artists by name
- **Pagination**: 12 artists per page

**Form Fields**
- Tên Nghệ sĩ * (Stage name - required)
- Tên Thật (Full name)
- Tiểu sử (Biography)

**Real-time Updates**
- Automatic refresh on data changes
- WebSocket integration for live updates

## API Endpoints

### Albums
```
GET    /admin/albums?page=1&size=12&search=query
POST   /admin/albums
PUT    /admin/albums/{albumId}
DELETE /admin/albums/{albumId}
```

### Artists
```
GET    /admin/artists?page=1&size=12&search=query
POST   /admin/artists
PUT    /admin/artists/{artistId}
DELETE /admin/artists/{artistId}
```

## Navigation

Updated sidebar navigation:
- `Bài hát` → /dashboard/music (Songs)
- `Album` → /dashboard/albums (New)
- `Nghệ sĩ` → /dashboard/artists (New)

## Design System

### Colors
- Primary: Gradient (yellow → pink → purple → blue)
- Background: Slate 50/950 (light/dark)
- Text: Slate 900/white
- Borders: Slate 200/700

### Components
- **Buttons**: Rounded full (`rounded-full`) with gradient accent
- **Cards**: Rounded xl with hover shadow
- **Inputs**: Rounded lg, focus ring pink-500
- **Tables**: Striped rows with hover effect

### Interactions
- **Hover**: Shadow and background color change
- **Loading**: Spinner animation
- **Errors**: Red toast messages
- **Confirmation**: Dialog before delete

## Performance

- **Caching**: 5s TTL for search results, 10s for listings
- **Deduplication**: Automatic request deduplication
- **Pagination**: 12 items per page reduces initial load
- **Lazy Loading**: Images load only when visible
- **Real-time**: WebSocket updates without polling

## Error Handling

All errors display Vietnamese messages:
- "Không thể tải danh sách album"
- "Không thể lưu album"
- "Vui lòng nhập tiêu đề album"

## Responsive Design

**Mobile (< 768px)**
- Albums: 1 column grid
- Artists: Horizontal scroll table

**Tablet (768px - 1024px)**
- Albums: 2 column grid
- Artists: Full table

**Desktop (> 1024px)**
- Albums: 3 column grid
- Artists: Full table with optimal spacing

## Testing

Test the following scenarios:
1. Add new album/artist
2. Edit existing record
3. Delete with confirmation
4. Search functionality
5. Pagination navigation
6. Dark/light mode toggle
7. Real-time updates
8. Error messages
9. Responsive layouts
10. Image lazy loading

## Future Enhancements

- Bulk operations (select multiple items)
- Sort by name, date, popularity
- Filter by status, genre
- Batch import from CSV
- Image upload for covers/avatars
- Genre/category filtering
- Collaboration counts
- Release calendar view
