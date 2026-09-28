"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import {
    LayoutDashboard,
    Search,
    TrendingUp,
    FileText,
    Calendar,
    Bell,
    User as UserIcon,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    X,
    ChevronRight,
    ArrowRight,
    Sprout,
    Sparkles,
    Utensils
} from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState<any[]>([]);

    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Prevent third-party browser extension injected script errors (e.g., Kaspersky 200.js / M_ID) from breaking Next.js overlay
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reasonStr = String(event?.reason?.message || event?.reason?.stack || event?.reason || '');
            if (
                reasonStr.includes('M_ID') ||
                reasonStr.includes('200.js') ||
                reasonStr.includes('chrome-extension://') ||
                reasonStr.includes('moz-extension://')
            ) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        if (isAuthenticated) {
            fetchNotifications();
        }

        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            const res = await apiClient.get('/notifications');
            if (res.notifications) {
                setNotifications(res.notifications);
            }
        } catch (err) {
            // Fallback
        }
    };

    const handleLogout = async () => {
        setUserMenuOpen(false);
        await logout();
        router.push('/login');
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Analysis', href: '/analysis', icon: Search },
        { label: 'Progress Tracker', href: '/progress', icon: TrendingUp },
        { label: 'My Plan', href: '/plan', icon: FileText },
        { label: 'Meal Plans', href: '/meal-plans', icon: Utensils },
        { label: 'Reminders', href: '/routine', icon: Bell },
        { label: 'My Profile', href: '/onboarding', icon: UserIcon },
        { label: 'Settings', href: '/onboarding', icon: Settings },
    ];

    const userName = user?.name || 'Ananya';
    const userInitial = userName.charAt(0).toUpperCase();

    const isAuthPage =
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup');

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen w-full bg-[#EBF2EB] text-[#12241A] flex font-sans antialiased selection:bg-[#0B3C26] selection:text-white">
            {/* 1. Desktop Web Fixed Full-Height Sidebar */}
            <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-[#EFF4EF] border-r border-[#D5E2D4] h-screen sticky top-0 justify-between p-6 z-30">
                <div className="space-y-6">
                    {/* Brand Header */}
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-[#0B3C26] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 flex-shrink-0 fill-current text-white" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                                <path d="M20.6 4.3c-2.3 0-5.1 1.8-6.9 3.6-1.8-1.8-4.6-3.6-6.9-3.6C3.7 4.3 1 7 1 10.1c0 6.6 8.5 10.7 11 11.8 2.5-1.1 11-5.2 11-11.8 0-3.1-2.7-5.8-5.8-5.8zm-8.6 15c-2.1-1-8.5-4.5-8.5-9.2 0-1.8 1.4-3.2 3.2-3.2 1.6 0 4.1 1.6 5.8 3.5l.5.6.5-.6c1.7-1.9 4.2-3.5 5.8-3.5 1.8 0 3.2 1.4 3.2 3.2 0 4.7-6.4 8.2-8.5 9.2z" />
                            </svg>
                        </div>
                        <span className="font-heading font-extrabold text-2xl text-[#0B2619] tracking-tight">
                            HairCare AI
                        </span>
                    </Link>

                    {/* Navigation items list */}
                    <nav className="space-y-1 pt-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${isActive
                                            ? 'bg-[#D6E5D4] text-[#0B3C26] shadow-2xs font-extrabold'
                                            : 'text-[#4F6256] hover:text-[#0B3C26] hover:bg-[#E0ECE0]'
                                        }`}
                                >
                                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0B3C26]' : 'text-[#617468]'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="space-y-4 pt-4">
                    {/* Upgrade to Premium Box */}
                    <div className="p-4 rounded-2xl bg-[#E1ECE0] border border-[#CBD8CB] space-y-2.5 shadow-2xs relative overflow-hidden">
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#0B3C26]">Upgrade to Premium</h4>
                        <p className="text-[11px] text-[#506356] leading-snug font-medium">
                            Get advanced analysis, expert consultations and more.
                        </p>
                        <button
                            onClick={() => router.push('/plan')}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#0B3C26] hover:bg-[#072B1B] text-white text-xs font-extrabold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-1"
                        >
                            <span>Upgrade Now</span> <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                        <div className="absolute -right-2 -bottom-2 opacity-20 pointer-events-none text-[#0B3C26]">
                            <Sprout className="w-12 h-12" />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#506356] hover:text-red-700 hover:bg-red-50/50 transition cursor-pointer"
                    >
                        <LogOut className="w-4.5 h-4.5 text-[#617468]" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="relative w-64 bg-[#EFF4EF] text-[#12241A] flex flex-col h-full z-10 p-5 shadow-2xl space-y-6 border-r border-[#D5E2D4]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-[#0B3C26] text-white flex items-center justify-center">
                                    <svg className="w-4.5 h-4.5 fill-current text-white" viewBox="0 0 24 24">
                                        <path d="M20.6 4.3c-2.3 0-5.1 1.8-6.9 3.6-1.8-1.8-4.6-3.6-6.9-3.6C3.7 4.3 1 7 1 10.1c0 6.6 8.5 10.7 11 11.8 2.5-1.1 11-5.2 11-11.8 0-3.1-2.7-5.8-5.8-5.8zm-8.6 15c-2.1-1-8.5-4.5-8.5-9.2 0-1.8 1.4-3.2 3.2-3.2 1.6 0 4.1 1.6 5.8 3.5l.5.6.5-.6c1.7-1.9 4.2-3.5 5.8-3.5 1.8 0 3.2 1.4 3.2 3.2 0 4.7-6.4 8.2-8.5 9.2z" />
                                    </svg>
                                </div>
                                <span className="font-heading font-extrabold text-lg text-[#0B2619]">HairCare AI</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 rounded-xl text-gray-700 hover:bg-[#D6E5D4]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${isActive ? 'bg-[#D6E5D4] text-[#0B3C26]' : 'text-[#506356] hover:bg-[#E0ECE0]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-[#0B3C26]" />
                                            {item.label}
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                                    </Link>
                                );
                            })}
                        </nav>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-xl"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Main Desktop Body */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-20 h-16 bg-[#EBF2EB]/90 backdrop-blur-md border-b border-[#D5E2D4] px-6 sm:px-10 flex items-center justify-between">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-[#D6E5D4] transition mr-3"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Input Box */}
                    <div className="w-full max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A7E71]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search anything..."
                                className="w-full bg-[#E0ECE0]/80 text-xs sm:text-sm text-[#0B2216] placeholder-[#718578] pl-10 pr-4 py-2 rounded-2xl border border-transparent focus:border-[#0B3C26] focus:bg-white focus:outline-none transition-all shadow-2xs font-medium"
                            />
                        </div>
                    </div>

                    {/* Profile & Notifications */}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2 rounded-xl text-gray-700 hover:bg-[#D6E5D4] transition relative cursor-pointer"
                                title="Notifications"
                            >
                                <Bell className="w-4.5 h-4.5 text-[#304439]" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                            <Bell className="w-3.5 h-3.5 text-[#0B3C26]" /> Notifications
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-mono">
                                            {notifications.length} Unread
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((n: any, idx) => (
                                                <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                                                    <p className="font-bold text-gray-900">{n.title}</p>
                                                    <p className="text-[11px] text-gray-600 mt-0.5">{n.message}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500 text-center py-4">No new notifications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile Pill */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-[#D6E5D4] transition text-left cursor-pointer"
                            >
                                <div className="w-8.5 h-8.5 rounded-full bg-[#0B3C26] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                                    {userInitial}
                                </div>
                                <div className="hidden sm:block text-left leading-tight">
                                    <p className="text-xs font-extrabold text-[#0B3C26] leading-none">{userName}</p>
                                    <p className="text-[10px] text-[#5C7063] leading-none mt-0.5 font-medium">Free Plan</p>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-[#4D6154] hidden sm:block" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 space-y-2 z-50">
                                    <div className="px-2 py-1.5 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-900">{userName}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{user?.email || 'ananya@example.com'}</p>
                                    </div>
                                    <Link
                                        href="/onboarding"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        <UserIcon className="w-4 h-4 text-[#0B3C26]" /> Edit Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Render Section */}
                <main className="flex-1 w-full p-6 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
