import React, { useEffect, useState } from 'react';
import { ShieldCheck, Scale, Mail, ArrowLeft, Home, FileText, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';

interface StandalonePageProps {
  navigateTo: (path: string) => void;
}

// Dynamically handle SEO on mount
const useSEO = (title: string, description: string) => {
  useEffect(() => {
    document.title = `${title} | SwiftPay`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);
};

export function StandaloneTermsPage({ navigateTo }: StandalonePageProps) {
  useSEO(
    'Terms of Service',
    'Read the official Terms of Service for SwiftPay. Learn about our digital wallet usage, deposit rules, withdrawals, WDV voucher terms, and legal agreements.'
  );

  const [activeSection, setActiveSection] = useState<string>('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'accounts', title: '2. User Accounts' },
    { id: 'wallet', title: '3. Wallet Usage' },
    { id: 'deposits', title: '4. Deposits' },
    { id: 'withdrawals', title: '5. Withdrawals' },
    { id: 'vouchers', title: '6. Voucher Purchases' },
    { id: 'prohibited', title: '7. Prohibited Activities' },
    { id: 'fraud', title: '8. Fraud Prevention' },
    { id: 'suspension', title: '9. Account Suspension' },
    { id: 'liability', title: '10. Limitation of Liability' },
    { id: 'intellectual', title: '11. Intellectual Property' },
    { id: 'changes', title: '12. Changes to Terms' },
    { id: 'contact', title: '13. Contact Information' },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigateTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] [background:radial-gradient(circle_at_0%_0%,#1e1b4b_0%,#050507_50%),radial-gradient(circle_at_100%_100%,#082f49_0%,#050507_50%)] text-slate-100 flex flex-col font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 w-full bg-[#050507]/85 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-950/80 border border-indigo-500/40 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Scale className="h-4.5 w-4.5 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight font-display bg-gradient-to-r from-indigo-300 to-teal-300 bg-clip-text text-transparent">SwiftPay</span>
              <span className="text-[9px] font-mono block text-slate-400 leading-none">LEGAL COMPLIANCE</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-teal-300 hover:text-teal-200 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Go to App</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar Navigation (Desktop only) */}
        <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-24">
          <GlassCard className="p-5 border-white/[0.06] bg-white/[0.02]">
            <h5 className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold mb-4">Table of Contents</h5>
            <nav className="space-y-1.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-between group cursor-pointer ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-indigo-500/20 to-teal-500/10 text-teal-300 border-l-2 border-teal-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{section.title}</span>
                  <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-400 ${activeSection === section.id ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </nav>
          </GlassCard>
        </aside>

        {/* Legal Text Content */}
        <section className="flex-1 min-w-0">
          {/* Breadcrumb / Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase mb-3">
              <FileText className="h-3 w-3" />
              <span>Terms of Service Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white mb-2">
              SwiftPay Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Last Updated: July 16, 2026 • Effective Immediately
            </p>
          </div>

          <GlassCard className="p-6 sm:p-10 space-y-8 border-white/[0.06] bg-slate-900/20 shadow-2xl">
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Please read these Terms of Service carefully before utilizing the SwiftPay platform, virtual wallet services, and diagnostic systems. By accessing the application, creating an account, or purchasing virtual vouchers, you explicitly consent to be legally bound by these conditions.
            </p>

            <hr className="border-white/5" />

            {/* Acceptance of Terms */}
            <div id="acceptance" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">01</span> Acceptance of Terms
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                By downloading, registering for, accessing, or using the SwiftPay mobile interface or web dashboard ("the Service"), you represent that you are at least 18 years of age and possess the legal authority to enter into this agreement. If you do not agree with any portion of these Terms of Service, you are strictly prohibited from utilizing the platform and must terminate your session immediately.
              </p>
            </div>

            {/* User Accounts */}
            <div id="accounts" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">02</span> User Accounts
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To access full transaction capabilities, users must register for a secure SwiftPay wallet account. You agree to provide current, accurate, and complete information during registration. You are solely responsible for safeguarding your session authentication tokens, passwords, local 4-digit security PINs, and biometric credential bypass keys. Any action performed under your authenticated credentials will be deemed executed by you.
              </p>
            </div>

            {/* Wallet Usage */}
            <div id="wallet" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">03</span> Wallet Usage
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay maintains a secure virtual ledger in Nigerian Naira (₦). Balances represented in your digital wallet are virtual and intended solely for bill settlements, peer-to-peer transfers, and utility payments. SwiftPay is a virtual ledger provider; virtual balances are held in secure non-interest-bearing state stores. Daily transaction spending is restricted by your account limits and target profiles.
              </p>
            </div>

            {/* Deposits */}
            <div id="deposits" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">04</span> Deposits &amp; Account Funding
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Deposits into your SwiftPay digital wallet are completed via manual peer-to-peer bank transfers, authorized virtual channels, or verified voucher redemptions. When submitting a manual transfer notice, you are required to upload genuine receipt metadata. Our operators manually audit deposit queues. Fraudulent, forged, or duplicated deposit notifications will lead to immediate account review.
              </p>
            </div>

            {/* Withdrawals */}
            <div id="withdrawals" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">05</span> Withdrawals
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Withdrawals can be processed to verified external commercial banks within Nigeria. Standard settlements are processed through automated clearing networks. Under regular operating conditions, withdrawal transactions clear within minutes; however, network disruptions or commercial bank downtime may extend completion windows. Limits vary depending on your verification tier (Tiers 1, 2, or 3).
              </p>
            </div>

            {/* Voucher Purchases */}
            <div id="vouchers" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">06</span> Voucher Purchases (WDV)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay facilitates the purchase and redemption of unique Withdrawal Voucher (WDV) codes. Each premium WDV voucher possesses a fixed commercial value of ₦6,500. Verification of voucher codes is performed server-side with strict duplicate prevention. WDV vouchers are strictly non-refundable and cannot be exchanged back for cash except through authorized utility settlement mechanisms within the app.
              </p>
            </div>

            {/* Prohibited Activities */}
            <div id="prohibited" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">07</span> Prohibited Activities
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-rose-300">
                You are strictly forbidden from: bypassing, simulating, or brute-forcing voucher codes; reverse engineering the application software; executing scripts or automated macros to interact with the API; uploading forged transaction screenshots; or misrepresenting receipt identifiers to manipulate wallet balances.
              </p>
            </div>

            {/* Fraud Prevention */}
            <div id="fraud" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">08</span> Fraud Prevention
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay utilizes advanced server-side auditing, cryptographic request signatures, and terminal access tracking to monitor for anomalous transaction velocities. Any suspicious transaction attempt, duplicate voucher redemption claim, or multi-device login activity is flagged and recorded inside our diagnostic logging enclaves for operator review.
              </p>
            </div>

            {/* Account Suspension */}
            <div id="suspension" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">09</span> Account Suspension &amp; Wallet Freezing
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-amber-300">
                SwiftPay reserves the absolute unilateral right to temporarily freeze balances or permanently suspend account access for users who breach these terms, submit forged bank transfer confirmations, manipulate vouchers, or engage in suspicious behavior. Suspended accounts lose access to digital cashout and utility settlement services.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div id="liability" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">10</span> Limitation of Liability
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                TO THE FULLEST EXTENT PERMITTED BY LAW, SWIFTPAY PROVIDES SERVICES "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED. SWIFTPAY, ITS OPERATORS, OR AFFILIATES SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, FINANCIAL LOSSES, OR CORRUPT STATES ARISING FROM SERVER DISRUPTIONS, NETWORK ENCLAVE TIMEOUTS, TELECOMMUNICATION DELAYS, OR FORCE MAJEURE EVENTS.
              </p>
            </div>

            {/* Intellectual Property */}
            <div id="intellectual" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">11</span> Intellectual Property
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                All platform interfaces, custom logo styling, CSS structures, database designs, branding components, and code logic remain the exclusive intellectual property of SwiftPay. You are granted a limited, personal, non-transferable, and revocable license to access the customer application solely for your personal utility settlements.
              </p>
            </div>

            {/* Changes to Terms */}
            <div id="changes" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">12</span> Changes to Terms
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay reserves the right to revise, amend, or modify these Terms of Service at any time. When substantial adjustments are updated, the revised date at the top of this document will be revised. Your continued usage of the application following the publication of alterations signifies your acceptance of the updated terms.
              </p>
            </div>

            {/* Contact Information */}
            <div id="contact" className="scroll-mt-24 space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 pb-1.5 text-teal-300">
                <Mail className="h-4.5 w-4.5 text-teal-400" />
                <span>13. Contact Information</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If you have questions, dispute a locked balance, or wish to report a security discrepancy, you can get in touch with our operations team via:
              </p>
              <div className="mt-3.5 space-y-1.5 font-mono text-xs text-slate-300">
                <p>📧 Email Support: <a href="mailto:support@swiftpay.ng" className="text-teal-400 hover:underline">support@swiftpay.ng</a></p>
                <p>💬 Telegram Support: <a href="https://t.me/SwiftPay_HQ" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-0.5">@SwiftPay_HQ <ExternalLink className="h-3 w-3 inline" /></a></p>
                <p>📍 Operations Hub: Block B2, Silicon Gardens, Victoria Island, Lagos, Nigeria</p>
              </div>
            </div>

          </GlassCard>
        </section>
      </main>

      {/* Shared Footer */}
      <footer className="w-full bg-[#050507]/90 border-t border-white/5 py-12 px-4 text-center mt-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs text-slate-500 font-mono tracking-wider">
            © 2026 SwiftPay. All rights reserved. Registered FinTech operator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400">
            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, '/terms')}
              className="text-slate-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick(e, '/privacy')}
              className="text-slate-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="mailto:support@swiftpay.ng"
              className="text-slate-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function StandalonePrivacyPage({ navigateTo }: StandalonePageProps) {
  useSEO(
    'Privacy Policy',
    'Read the official Privacy Policy for SwiftPay. Learn how we securely protect, store, and process your financial transaction data and personal information.'
  );

  const [activeSection, setActiveSection] = useState<string>('collect');

  const sections = [
    { id: 'collect', title: '1. Information We Collect' },
    { id: 'personal', title: '2. Personal Information' },
    { id: 'device', title: '3. Device Information' },
    { id: 'cookies', title: '4. Cookies' },
    { id: 'use', title: '5. How We Use Information' },
    { id: 'security', title: '6. Data Security' },
    { id: 'retention', title: '7. Data Retention' },
    { id: 'third-party', title: '8. Third-Party Services' },
    { id: 'rights', title: '9. User Rights' },
    { id: 'children', title: '10. Children\'s Privacy' },
    { id: 'contact', title: '11. Contact Information' },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigateTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] [background:radial-gradient(circle_at_0%_0%,#1e1b4b_0%,#050507_50%),radial-gradient(circle_at_100%_100%,#082f49_0%,#050507_50%)] text-slate-100 flex flex-col font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 w-full bg-[#050507]/85 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-950/80 border border-indigo-500/40 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="h-4.5 w-4.5 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight font-display bg-gradient-to-r from-indigo-300 to-teal-300 bg-clip-text text-transparent">SwiftPay</span>
              <span className="text-[9px] font-mono block text-slate-400 leading-none">PRIVACY PROTECTION</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-teal-300 hover:text-teal-200 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Go to App</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-24">
          <GlassCard className="p-5 border-white/[0.06] bg-white/[0.02]">
            <h5 className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold mb-4">Table of Contents</h5>
            <nav className="space-y-1.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-between group cursor-pointer ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-indigo-500/20 to-teal-500/10 text-teal-300 border-l-2 border-teal-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{section.title}</span>
                  <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-400 ${activeSection === section.id ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </nav>
          </GlassCard>
        </aside>

        {/* Legal Text Content */}
        <section className="flex-1 min-w-0">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase mb-3">
              <ShieldCheck className="h-3 w-3" />
              <span>Data Protection Guidelines</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white mb-2">
              SwiftPay Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Last Updated: July 16, 2026 • Your Privacy Is Protected
            </p>
          </div>

          <GlassCard className="p-6 sm:p-10 space-y-8 border-white/[0.06] bg-slate-900/20 shadow-2xl">
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              At SwiftPay, we are strongly committed to securing your personal and financial transaction details. This Privacy Policy details the exact specifications of the information we collect, the secure hashing protocols we utilize, and your individual data rights.
            </p>

            <hr className="border-white/5" />

            {/* Information We Collect */}
            <div id="collect" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">01</span> Information We Collect
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay collects specific elements of user information to safely initialize digital wallets, process real-time transfer receipts, and audit manual deposit requests. We collect both information you directly input and device telemetry required for security and fraud prevention.
              </p>
            </div>

            {/* Personal Information */}
            <div id="personal" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">02</span> Personal Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Direct personal inputs we collect include your: Full Name, email address, password hashes, mobile phone number, uploaded profile avatars, manual transfer payment details (e.g., bank names and reference screenshots), and customized transaction pin passcodes.
              </p>
            </div>

            {/* Device Information */}
            <div id="device" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">03</span> Device Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To prevent concurrent multi-device session attacks and voucher duplication, we collect device telemetry on mount, including: your IP address, device model parameters, operating system variables, unique browser user-agents, and approximate geographical network indicators.
              </p>
            </div>

            {/* Cookies */}
            <div id="cookies" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">04</span> Cookies &amp; Local Persistence
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay utilizes cookies, browser local storage enclaves, and encrypted token keys to maintain active sessions without asking for re-login on refresh. These cookies store cryptographically signed tokens containing email markers and local security preferences. No intrusive ad tracking cookie is deployed.
              </p>
            </div>

            {/* How We Use Information */}
            <div id="use" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">05</span> How We Use Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your collected data is used exclusively to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
                <li>Authenticate session access and prevent multi-device token hijacking.</li>
                <li>Compute and balance active wallets, transaction histories, and transfer receipts.</li>
                <li>Verify submitted manual bank transfers through back-office operator checks.</li>
                <li>Dispatch OTP (One-Time Password) recovery codes via verified mail/SMS gateways.</li>
                <li>Maintain diagnostic security logs for fraud analysis and terminal debugging.</li>
              </ul>
            </div>

            {/* Data Security */}
            <div id="security" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">06</span> Data Security
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-emerald-300 font-sans">
                SwiftPay utilizes multi-layered security measures. Account passwords are encrypted using robust bcrypt salting algorithms server-side. Security tokens are signed using high-grade HMAC-SHA256 protocols, making session theft virtually impossible. Biometric fingerprint hashes are strictly stored locally in your device's hardware secure enclave (Android Keystore) and are never uploaded.
              </p>
            </div>

            {/* Data Retention */}
            <div id="retention" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">07</span> Data Retention
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We retain your account profile and transaction ledger data as long as your digital wallet remains active. Diagnostic logs and historical session histories are maintained for up to 500 records per database cluster to assist in back-office auditing and compliance tracing. If you close your wallet, your information is securely overwritten.
              </p>
            </div>

            {/* Third-Party Services */}
            <div id="third-party" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">08</span> Third-Party Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We integrate with secure external telecommunication gateways to deliver transactional SMS and recovery OTP emails. Verified banking networks are queried during out-bound cashout operations solely to validate recipient account names before initiating transfers. SwiftPay does not trade or lease your data to external advertisers.
              </p>
            </div>

            {/* User Rights */}
            <div id="rights" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">09</span> User Rights
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Under financial privacy standards, you have the right to access your state, modify account parameters (Full Name, profile picture, phone connection), adjust your security PIN controls, download your transaction receipt ledger history, or request the permanent deletion of your account files through admin dispute channels.
              </p>
            </div>

            {/* Children's Privacy */}
            <div id="children" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-teal-400 font-mono text-sm">10</span> Children's Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SwiftPay does not intentionally market services or collect digital wallet registrations from minors under 18 years of age. If we detect that a minor has bypass-registered an active ledger, we will immediately lock transaction capabilities and delete their records from our databases.
              </p>
            </div>

            {/* Contact Information */}
            <div id="contact" className="scroll-mt-24 space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2 pb-1.5 text-teal-300">
                <Mail className="h-4.5 w-4.5 text-teal-400" />
                <span>11. Contact Information</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To execute any user privacy rights or report data discrepancies, you may reach our dedicated Privacy Officer through:
              </p>
              <div className="mt-3.5 space-y-1.5 font-mono text-xs text-slate-300">
                <p>📧 Data Officer: <a href="mailto:privacy@swiftpay.ng" className="text-teal-400 hover:underline">privacy@swiftpay.ng</a></p>
                <p>💬 Support Telegram: <a href="https://t.me/SwiftPay_HQ" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-0.5">@SwiftPay_HQ <ExternalLink className="h-3 w-3 inline" /></a></p>
                <p>📍 Privacy Enclave: Silicon Gardens, Block B2, Victoria Island, Lagos, Nigeria</p>
              </div>
            </div>

          </GlassCard>
        </section>
      </main>

      {/* Shared Footer */}
      <footer className="w-full bg-[#050507]/90 border-t border-white/5 py-12 px-4 text-center mt-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs text-slate-500 font-mono tracking-wider">
            © 2026 SwiftPay. All rights reserved. Registered FinTech operator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400">
            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, '/terms')}
              className="text-slate-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick(e, '/privacy')}
              className="text-slate-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="mailto:support@swiftpay.ng"
              className="text-slate-400 hover:text-teal-300 hover:underline transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Custom404Page({ navigateTo }: StandalonePageProps) {
  useSEO(
    'Page Not Found',
    'The page you are looking for does not exist on SwiftPay. Return home to continue managing your digital wallet.'
  );

  return (
    <div className="min-h-screen bg-[#050507] [background:radial-gradient(circle_at_0%_0%,#1e1b4b_0%,#050507_50%),radial-gradient(circle_at_100%_100%,#082f49_0%,#050507_50%)] text-slate-100 flex flex-col items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* Neon Icon */}
        <div className="mx-auto h-20 w-20 bg-indigo-950/80 border border-indigo-500/40 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 animate-pulse">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black font-display tracking-widest bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Terminal Access Forbidden
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-4">
            The path you are trying to query does not resolve to an active secure terminal route. If you think this is a banking mistake, please contact support.
          </p>
        </div>

        {/* Navigation Action */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center px-4">
          <button
            onClick={() => navigateTo('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/10 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </button>
          
          <a
            href="mailto:support@swiftpay.ng"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white font-semibold transition-all"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Support</span>
          </a>
        </div>

        {/* Simple footer reference */}
        <p className="text-[10px] text-slate-500 font-mono pt-6">
          © 2026 SwiftPay • Security Audit Ledger v4.11
        </p>

      </div>
    </div>
  );
}
