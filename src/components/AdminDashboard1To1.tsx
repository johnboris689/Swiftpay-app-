import React, { useState } from 'react';
import {
  Users,
  Wallet,
  ShoppingBag,
  Database,
  MoreVertical,
  Calendar,
  SlidersHorizontal,
  Search,
  Bell,
  Menu,
  X,
  Home,
  ArrowLeftRight,
  CreditCard,
  Package,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Download,
  UserPlus,
  ShieldAlert,
  Layers,
  ArrowUp,
  ArrowDown,
  User,
  ChevronDown
} from 'lucide-react';

interface AdminDashboard1To1Props {
  totalUsersCount: number;
  totalSystemBalance: number;
  totalRevenue: number;
  totalTxsCount: number;
  transactions: any[];
  users: any[];
  logs: any[];
  stats: any;
  onNavigateTab: (tab: string) => void;
  onBack: () => void;
}

// Sparkline SVG Component
const Sparkline = ({ color, points }: { color: string; points: number[] }) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 140;
  const height = 45;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 12) - 6;
    return `${x},${y}`;
  });

  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function AdminDashboard1To1({
  totalUsersCount,
  totalSystemBalance,
  totalRevenue,
  totalTxsCount,
  transactions,
  users,
  logs,
  stats,
  onNavigateTab,
  onBack
}: AdminDashboard1To1Props) {
  const [activeSidebar, setActiveSidebar] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sparkline mock data matching design curves
  const sparkUsers = [15, 22, 18, 30, 25, 38, 32, 45, 40, 52, 48, 60];
  const sparkLedger = [10, 25, 20, 35, 28, 42, 35, 50, 42, 58, 52, 65];
  const sparkRev = [10, 10, 10, 12, 12, 11, 12, 12, 12, 12, 12, 12];
  const sparkTxs = [12, 20, 18, 32, 26, 40, 34, 48, 42, 55, 50, 62];

  // Default transactions fallback for 1:1 match if empty
  const defaultTransactions = [
    { id: '#TXN-0001', type: 'Transfer', user: 'Abdullahi H.', amount: '₦50,000', status: 'Success' },
    { id: '#TXN-0002', type: 'Airtime', user: 'Maryam T.', amount: '₦5,000', status: 'Success' },
    { id: '#TXN-0003', type: 'Withdrawal', user: 'Ibrahim U.', amount: '₦100,000', status: 'Success' },
    { id: '#TXN-0004', type: 'WDV Code', user: 'Hauwa Aliyu', amount: '₦10,000', status: 'Pending' },
    { id: '#TXN-0005', type: 'Transfer', user: 'Yusuf Lawal', amount: '₦20,000', status: 'Success' },
  ];

  const recentTransactionsList = transactions.length > 0
    ? transactions.slice(0, 5).map((t, idx) => ({
        id: t.id ? (t.id.startsWith('#') ? t.id : `#TXN-${t.id.slice(0, 4)}`) : `#TXN-000${idx + 1}`,
        type: t.type === 'redeem_airtime' ? 'Airtime' : t.type === 'buy_wdv' ? 'WDV Code' : t.type === 'withdraw' ? 'Withdrawal' : 'Transfer',
        user: t.user || t.email || 'System User',
        amount: `₦${Number(t.amount || 0).toLocaleString()}`,
        status: t.status === 'success' || t.status === 'completed' ? 'Success' : t.status === 'pending' ? 'Pending' : 'Failed'
      }))
    : defaultTransactions;

  return (
    <div className="w-full min-h-screen bg-[#0a0b12] text-slate-100 font-sans text-xs select-none">
      {/* Top Header Bar */}
      <header className="w-full h-16 bg-[#0c0d16] border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* SwiftPay Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSidebar('home')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-500/20">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SwiftPay</span>
          </div>
        </div>

        {/* Top Header Right Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <Search className="h-4 w-4" />
          </button>

          <div className="relative">
            <button className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Bell className="h-4 w-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#0c0d16]" />
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden ring-1 ring-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0d16]" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight">Admin User</div>
              <div className="text-[10px] text-slate-400">Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-40 w-16 bg-[#0c0d16] border-r border-slate-800/80 flex flex-col items-center py-5 space-y-6 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <button
            onClick={() => {
              setActiveSidebar('home');
              onNavigateTab('overview');
            }}
            title="Dashboard Overview"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'home'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('users');
              onNavigateTab('users');
            }}
            title="User Database Management"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'users'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('vouchers');
              onNavigateTab('voucher_generator');
            }}
            title="WDV Voucher Generator"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'vouchers'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('withdrawals');
              onNavigateTab('withdrawals');
            }}
            title="Withdrawal Management Console"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'withdrawals'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('packages');
              onNavigateTab('overview');
            }}
            title="Packages & System Config"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'packages'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Package className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('analytics');
              onNavigateTab('overview');
            }}
            title="Analytics"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'analytics'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('security');
              onNavigateTab('logs');
            }}
            title="Security & System Alerts"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'security'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shield className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setActiveSidebar('settings');
              onNavigateTab('settings');
            }}
            title="Settings"
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              activeSidebar === 'settings'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>

          <div className="mt-auto pt-4">
            <button
              onClick={onBack}
              title="Exit Console"
              className="p-3 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto overflow-x-hidden">
          {/* Title Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
              <p className="text-xs text-slate-400 mt-0.5">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-[#121320] border border-slate-800/80 px-3.5 py-2 rounded-xl text-slate-300 text-xs font-medium">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>May 18, 2026</span>
              </div>
              <button className="p-2 bg-[#121320] border border-slate-800/80 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 1. Top 4 Horizontal Statistics Cards */}
          <div className="space-y-3.5">
            {/* Card 1: TOTAL USERS */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL USERS</span>
                  <div className="text-2xl md:text-3xl font-black text-white">{totalUsersCount || 3}</div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <ArrowUp className="h-3 w-3" />
                    <span>12.5%</span>
                    <span className="text-slate-400 ml-1">from last 7 days</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Sparkline color="#2dd4bf" points={sparkUsers} />
                </div>
                <button className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Card 2: TOTAL LEDGER */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL LEDGER</span>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    ₦{totalSystemBalance > 0 ? totalSystemBalance.toLocaleString() : '440,000'}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <ArrowUp className="h-3 w-3" />
                    <span>8.7%</span>
                    <span className="text-slate-400 ml-1">from last 7 days</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Sparkline color="#a855f7" points={sparkLedger} />
                </div>
                <button className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Card 3: CHARGES REV */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">CHARGES REV</span>
                  <div className="text-2xl md:text-3xl font-black text-white">₦{totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <span>—</span>
                    <span>0%</span>
                    <span className="text-slate-400 ml-1">from last 7 days</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Sparkline color="#10b981" points={sparkRev} />
                </div>
                <button className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Card 4: TRANSACTIONS */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Database className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">TRANSACTIONS</span>
                  <div className="text-2xl md:text-3xl font-black text-white">{totalTxsCount || 1}</div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <ArrowUp className="h-3 w-3" />
                    <span>15.3%</span>
                    <span className="text-slate-400 ml-1">from last 7 days</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <Sparkline color="#a855f7" points={sparkTxs} />
                </div>
                <button className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Fintech Transaction Volume & Daily Statistics Card */}
          <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs md:text-sm font-bold tracking-wider text-white uppercase">
                FINTECH TRANSACTION VOLUME &amp; DAILY STATISTICS
              </h2>
              <div className="relative">
                <button className="flex items-center gap-2 bg-[#171828] border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-medium cursor-pointer">
                  <span>This Week</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Custom Multi-line Curved Area Chart */}
            <div className="w-full relative">
              <div className="flex text-xs text-slate-400">
                {/* Y Axis Labels */}
                <div className="flex flex-col justify-between pr-3 py-1 text-right w-10 text-slate-500 font-mono text-[11px]">
                  <span>20K</span>
                  <span>15K</span>
                  <span>10K</span>
                  <span>5K</span>
                  <span>0</span>
                </div>

                {/* SVG Curves */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-b border-slate-800/40 w-full" />
                    <div className="border-b border-slate-800/40 w-full" />
                    <div className="border-b border-slate-800/40 w-full" />
                    <div className="border-b border-slate-800/40 w-full" />
                    <div className="border-b border-slate-800/40 w-full" />
                  </div>

                  <svg viewBox="0 0 600 180" className="w-full h-48 md:h-56 overflow-visible">
                    {/* Purple line (Transfers) */}
                    <path
                      d="M 20,70 C 80,85 140,35 200,40 C 260,45 320,15 380,30 C 440,45 500,25 580,50"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Blue line (Airtime/Data) */}
                    <path
                      d="M 20,105 C 80,120 140,80 200,90 C 260,100 320,60 380,75 C 440,90 500,70 580,95"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Teal line (Withdrawals) */}
                    <path
                      d="M 20,135 C 80,145 140,120 200,130 C 260,140 320,110 380,120 C 440,130 500,110 580,125"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Orange line (WDV Codes) */}
                    <path
                      d="M 20,160 C 80,165 140,150 200,155 C 260,160 320,140 380,150 C 440,160 500,145 580,155"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-3 px-1">
                    <span>May 12</span>
                    <span>May 13</span>
                    <span>May 14</span>
                    <span>May 15</span>
                    <span>May 16</span>
                    <span>May 17</span>
                    <span>May 18</span>
                  </div>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-5 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Transfers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Airtime/Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Withdrawals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>WDV Codes</span>
                </div>
              </div>
            </div>

            {/* Bottom 4 Columns Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/60">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL VOLUME</span>
                <div className="text-lg md:text-xl font-bold text-white font-mono">₦1,248,450</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>10.2%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">AVG. DAILY VOLUME</span>
                <div className="text-lg md:text-xl font-bold text-white font-mono">₦178,350</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>7.6%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">SUCCESS RATE</span>
                <div className="text-lg md:text-xl font-bold text-white font-mono">98.42%</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>2.4%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL TRANSACTIONS</span>
                <div className="text-lg md:text-xl font-bold text-white font-mono">1,842</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>14.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Two Column Row: RECENT TRANSACTIONS & SYSTEM ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Recent Transactions Table (7 cols) */}
            <div className="lg:col-span-7 bg-[#11121d] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-white uppercase">RECENT TRANSACTIONS</h3>
                <button
                  onClick={() => onNavigateTab('overview')}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-2">ID</th>
                      <th className="pb-3 px-2">TYPE</th>
                      <th className="pb-3 px-2">USER</th>
                      <th className="pb-3 px-2">AMOUNT</th>
                      <th className="pb-3 pl-2 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {recentTransactionsList.map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 pr-2 font-mono text-slate-300 font-bold">{tx.id}</td>
                        <td className="py-3 px-2 text-slate-300">{tx.type}</td>
                        <td className="py-3 px-2 text-slate-300">{tx.user}</td>
                        <td className="py-3 px-2 font-mono font-bold text-white">{tx.amount}</td>
                        <td className="py-3 pl-2 text-right">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'Success'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: System Alerts (5 cols) */}
            <div className="lg:col-span-5 bg-[#11121d] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-white uppercase">SYSTEM ALERTS</h3>
                <button
                  onClick={() => onNavigateTab('logs')}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {/* Alert 1 */}
                <div className="p-3.5 rounded-xl bg-[#161726] border border-slate-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">High number of pending withdrawal requests</div>
                    <div className="text-[10px] text-slate-400">12m ago</div>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-3.5 rounded-xl bg-[#161726] border border-slate-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">Abnormal transaction volume detected</div>
                    <div className="text-[10px] text-slate-400">28m ago</div>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="p-3.5 rounded-xl bg-[#161726] border border-slate-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">Daily system backup completed successfully</div>
                    <div className="text-[10px] text-slate-400">1h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bottom Row 4 Statistic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: PENDING WITHDRAWALS */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                <Download className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">PENDING WITHDRAWALS</span>
                <div className="text-xl font-black text-white">{stats.pendingCount || 32}</div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-rose-400">
                  <ArrowDown className="h-3 w-3" />
                  <span>5.1%</span>
                </div>
              </div>
            </div>

            {/* Card 2: NEW USERS */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">NEW USERS</span>
                <div className="text-xl font-black text-white">8</div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>18.6%</span>
                </div>
              </div>
            </div>

            {/* Card 3: FAILED TRANSACTIONS */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">FAILED TRANSACTIONS</span>
                <div className="text-xl font-black text-white">4</div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-rose-400">
                  <ArrowDown className="h-3 w-3" />
                  <span>2.4%</span>
                </div>
              </div>
            </div>

            {/* Card 4: SYSTEM STATUS */}
            <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">SYSTEM STATUS</span>
                <div className="text-xl font-black text-emerald-400">Operational</div>
                <div className="text-[10px] font-medium text-slate-400">All systems active</div>
              </div>
            </div>
          </div>

          {/* 5. RECENT ADMIN ACTIVITIES */}
          <div className="bg-[#11121d] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wider text-white uppercase">RECENT ADMIN ACTIVITIES</h3>
              <button
                onClick={() => onNavigateTab('logs')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                View logs
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-2">ADMIN</th>
                    <th className="pb-3 px-2">ACTION</th>
                    <th className="pb-3 px-2">DETAILS</th>
                    <th className="pb-3 pl-2 text-right">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                              alt="Admin User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-[#11121d]" />
                        </div>
                        <span className="font-bold text-white">Admin User</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-medium">Logged In</td>
                    <td className="py-3 px-2 text-slate-400">Successfully logged in to the system</td>
                    <td className="py-3 pl-2 text-right text-slate-400 font-mono text-[11px]">2m ago</td>
                  </tr>

                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                              alt="Admin User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-[#11121d]" />
                        </div>
                        <span className="font-bold text-white">Admin User</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-medium">Approved Withdrawal</td>
                    <td className="py-3 px-2 text-slate-400">Approved withdrawal request of ₦50,000</td>
                    <td className="py-3 pl-2 text-right text-slate-400 font-mono text-[11px]">15m ago</td>
                  </tr>

                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                              alt="Admin User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-[#11121d]" />
                        </div>
                        <span className="font-bold text-white">Admin User</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-medium">Generated WDV Code</td>
                    <td className="py-3 px-2 text-slate-400">Generated WDV code worth ₦10,000</td>
                    <td className="py-3 pl-2 text-right text-slate-400 font-mono text-[11px]">32m ago</td>
                  </tr>

                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                              alt="Admin User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-[#11121d]" />
                        </div>
                        <span className="font-bold text-white">Admin User</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-medium">Updated Settings</td>
                    <td className="py-3 px-2 text-slate-400">Updated system configuration</td>
                    <td className="py-3 pl-2 text-right text-slate-400 font-mono text-[11px]">56m ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between text-[11px] text-slate-500 pt-6 border-t border-slate-800/60 pb-4">
            <div>© 2026 SwiftPay. All rights reserved.</div>
            <div>Version 1.0.0</div>
          </footer>
        </main>
      </div>
    </div>
  );
}
