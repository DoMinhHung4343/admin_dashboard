'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    SquaresFour,
    Users,
    SignOut,
    List,
    X,
    Sun,
    Moon,
    MusicNote,
    CreditCard,
    SpeakerHigh,
    Warning,
    ChartBar,
} from '@phosphor-icons/react';
import { useTheme } from '@/lib/theme';

const NAV = [
    { href: '/dashboard',           label: 'Tổng quan',     icon: SquaresFour, exact: true  },
    { href: '/dashboard/users',     label: 'Người dùng',   icon: Users,       exact: false },
    { href: '/dashboard/music',     label: 'Nhạc & Album',        icon: MusicNote,   exact: false },
    { href: '/dashboard/payments',  label: 'Gói cước',     icon: CreditCard,  exact: false },
    { href: '/dashboard/ads',       label: 'Quảng cáo',   icon: SpeakerHigh, exact: false },
    { href: '/dashboard/reports',   label: 'Báo cáo',     icon: Warning,     exact: false },
    { href: '/dashboard/analytics', label: 'Thống kê',    icon: ChartBar,    exact: false },
];

// Map segment → tên đẹp hơn cho breadcrumb
const SEGMENT_LABELS: Record<string, string> = {
    dashboard:  'Trang chủ',
    users:      'Người dùng',
    music:      'Nhạc & Album',
    payments:   'Gói cước',
    ads:        'Quảng cáo',
    reports:    'Báo cáo',
    analytics:  'Thống kê',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router   = useRouter();
    const pathname = usePathname();
    const { theme, toggle } = useTheme();
    const [open, setOpen] = useState(false);
    const [authenticated] = useState<boolean>(() =>
        typeof window !== 'undefined' && Boolean(localStorage.getItem('access_token')),
    );

    useEffect(() => {
        if (!authenticated) router.replace('/login');
    }, [router, authenticated]);

    const logout = () => { localStorage.clear(); router.replace('/login'); };
    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    if (!authenticated) return <div className="min-h-screen bg-background" />;

    const isDark = theme === 'dark';
    const segments = pathname.split('/').filter(Boolean);

    return (
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-200">

            {/* ── Sidebar ───────────────────────────────────────── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-56 flex flex-col
                bg-white dark:bg-[#0a0a0a]
                border-r border-slate-200 dark:border-slate-800
                transition-transform duration-300 ease-out
                ${open ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>

                {/* Brand */}
                <div className="h-14 flex items-center px-5 border-b border-slate-200 dark:border-slate-800 shrink-0 gap-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                    <div className="size-7 bg-gradient-to-br from-blue-600 to-emerald-600 dark:from-emerald-500 dark:to-blue-500 flex items-center justify-center shrink-0 rounded-lg shadow-md">
                        <MusicNote size={14} weight="fill" className="text-white" />
                    </div>
                    <div>
                        <p className="text-[12px] font-bold tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent leading-none">
                            Phazel Sound
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                            Admin Panel
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
                    {/* Label section */}
                    <p className="text-[9px] font-semibold tracking-[0.15em] text-slate-400 dark:text-slate-500 px-2.5 pt-2 pb-2 uppercase">
                        Navigation
                    </p>
                    {NAV.map(({ href, label, icon: Icon, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`
                                    flex items-center gap-2.5 px-3 h-9 text-[13px] rounded-lg transition-all duration-200
                                    ${active
                                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold shadow-lg shadow-blue-500/20 dark:shadow-emerald-500/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                                    }
                                `}
                            >
                                <Icon
                                    size={16}
                                    weight={active ? 'fill' : 'regular'}
                                    className={active ? '' : 'opacity-60'}
                                />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-2.5 py-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-1">
                    <button
                        onClick={toggle}
                        className="flex items-center gap-2.5 px-3 h-9 text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 w-full rounded-lg transition-all duration-200"
                    >
                        {isDark
                            ? <Sun size={16} weight="regular" className="opacity-70" />
                            : <Moon size={16} weight="regular" className="opacity-70" />}
                        {isDark ? 'Sáng' : 'Tối'}
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 h-9 text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 w-full rounded-lg transition-all duration-200"
                    >
                        <SignOut size={16} weight="regular" className="opacity-70" />
                        Đăng xuất
                    </button>

                    {/* User pill */}
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 px-2.5 pb-1">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <div className="size-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-md flex items-center justify-center shrink-0 text-white font-bold text-sm">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 truncate leading-none">
                                    Admin
                                </p>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                                    ROLE_ADMIN
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay mobile */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 lg:hidden backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Main ──────────────────────────────────────────── */}
            <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

                {/* Top header */}
                <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-5 gap-4 shrink-0 bg-white dark:bg-slate-950 sticky top-0 z-30 shadow-sm dark:shadow-lg dark:shadow-slate-900/20">

                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={18} /> : <List size={18} />}
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-[12px] min-w-0">
                        {segments.map((seg, i) => {
                            const isLast = i === segments.length - 1;
                            return (
                                <span key={seg} className="flex items-center gap-1.5 min-w-0">
                                    {i > 0 && (
                                        <span className="text-slate-300 dark:text-slate-700 select-none">/</span>
                                    )}
                                    <span className={
                                        isLast
                                            ? 'font-semibold bg-gradient-to-r from-blue-700 to-emerald-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent truncate'
                                            : 'text-slate-500 dark:text-slate-400 truncate'
                                    }>
                                        {SEGMENT_LABELS[seg] ?? seg}
                                    </span>
                                </span>
                            );
                        })}
                    </div>

                    {/* Right side actions */}
                    <div className="ml-auto flex items-center gap-3">
                        {/* Theme toggle (desktop) */}
                        <button
                            onClick={toggle}
                            className="hidden lg:flex size-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Status indicator */}
                        <div className="flex items-center gap-1.5 px-3 h-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full shadow-sm dark:shadow-emerald-500/10">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Online</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 lg:p-7 bg-slate-50 dark:bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
