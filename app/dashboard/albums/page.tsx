'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { openAdminRealtime } from '@/lib/realtime';
import { MusicNotesPlus, ArrowClockwise, Trash, PencilSimple, MagnifyingGlass } from '@phosphor-icons/react';

interface Album {
    id: string;
    title: string;
    description?: string;
    coverUrl?: string;
    artistId?: string;
    artistName?: string;
    ownerStageName?: string;
    releaseDate?: string;
    totalSongs?: number;
    totalFavorites?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface PageResult<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}

interface AlbumRequest {
    title: string;
    description?: string;
    releaseDate?: string;
    artistId?: string;
}

export default function AlbumsPage() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [totalAlbums, setTotalAlbums] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<AlbumRequest>({ title: '', description: '', releaseDate: '', artistId: '' });

    const loadAlbums = useCallback(async () => {
        setLoading(true);
        try {
            const query = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
            const result = await apiFetch<PageResult<Album>>(
                `/admin/albums?page=${page}&size=${pageSize}${query}`,
                { ttlMs: 5_000 }
            );
            setAlbums(result?.content ?? []);
            setTotalAlbums(result?.totalElements ?? 0);
            setError(null);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Không thể tải danh sách album');
            setAlbums([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, page, pageSize]);

    useEffect(() => {
        loadAlbums();
    }, [loadAlbums]);

    useEffect(() => {
        const close = openAdminRealtime(() => loadAlbums());
        return () => close();
    }, [loadAlbums]);

    const handleAddAlbum = () => {
        setForm({ title: '', description: '', releaseDate: '', artistId: '' });
        setEditingId(null);
        setShowModal(true);
    };

    const handleEditAlbum = (album: Album) => {
        setForm({
            title: album.title,
            description: album.description || '',
            releaseDate: album.releaseDate || '',
            artistId: album.artistId || '',
        });
        setEditingId(album.id);
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setError('Vui lòng nhập tiêu đề album');
            return;
        }

        try {
            if (editingId) {
                await apiFetch(`/admin/albums/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(form),
                });
            } else {
                await apiFetch('/admin/albums', {
                    method: 'POST',
                    body: JSON.stringify(form),
                });
            }
            setShowModal(false);
            setForm({ title: '', description: '', releaseDate: '', artistId: '' });
            setEditingId(null);
            await loadAlbums();
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Không thể lưu album');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn chắc chắn muốn xóa album này?')) return;
        try {
            await apiFetch(`/admin/albums/${id}`, { method: 'DELETE' });
            await loadAlbums();
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Không thể xóa album');
        }
    };

    const totalPages = Math.ceil(totalAlbums / pageSize);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Album</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tổng cộng {totalAlbums} album</p>
                </div>
                <button
                    onClick={handleAddAlbum}
                    className="flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200"
                >
                    <MusicNotesPlus size={18} weight="fill" />
                    Thêm Album
                </button>
            </div>

            {/* Search bar */}
            <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm album..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                    }}
                    className="w-full pl-10 pr-4 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60">
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <ArrowClockwise size={24} className="text-pink-500 animate-spin" />
                </div>
            )}

            {/* Albums grid */}
            {!loading && albums.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {albums.map((album) => (
                        <div
                            key={album.id}
                            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            {album.coverUrl && (
                                <img
                                    src={album.coverUrl}
                                    alt={album.title}
                                    className="w-full aspect-square rounded-lg object-cover mb-3"
                                    loading="lazy"
                                />
                            )}
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white truncate">{album.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                    {album.ownerStageName || album.artistName || 'Không rõ'}
                                </p>
                                {album.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 line-clamp-2">
                                        {album.description}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-3 text-xs text-slate-600 dark:text-slate-400">
                                    {album.totalSongs && <span>{album.totalSongs} bài hát</span>}
                                    {album.totalFavorites && <span>❤️ {album.totalFavorites}</span>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEditAlbum(album)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm font-medium"
                                >
                                    <PencilSimple size={14} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(album.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all text-sm font-medium"
                                >
                                    <Trash size={14} />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && albums.length === 0 && (
                <div className="text-center py-12">
                    <MusicNotesPlus size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">Chưa có album nào</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 h-9 rounded-lg text-sm font-medium transition-all ${
                                page === p
                                    ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {editingId ? 'Chỉnh sửa Album' : 'Thêm Album Mới'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Nhập tiêu đề album"
                                    className="w-full px-3 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Nhập mô tả album"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Ngày phát hành
                                </label>
                                <input
                                    type="date"
                                    value={form.releaseDate}
                                    onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                                    className="w-full px-3 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    ID Nghệ sĩ
                                </label>
                                <input
                                    type="text"
                                    value={form.artistId}
                                    onChange={(e) => setForm({ ...form, artistId: e.target.value })}
                                    placeholder="Nhập ID nghệ sĩ"
                                    className="w-full px-3 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 h-9 rounded-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all font-medium"
                                >
                                    {editingId ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
