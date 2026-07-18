import React, { useState, useEffect, useRef } from 'react';
import { Users, Coins, ShoppingBag, ShieldAlert, ArrowLeft, Search, UserMinus, ToggleLeft, ToggleRight, Trash2, Edit2, Key, RefreshCw, Send, FileSpreadsheet, BarChart3, Database, MessageSquare, AlertCircle, Video, Settings, DollarSign, CheckCircle, UploadCloud, Clock, ArrowUpRight, FileText, XCircle, AlertTriangle, Inbox, Menu, X } from 'lucide-react';
import GlassCard from './GlassCard';

interface AdminPanelProps {
  currentUserEmail: string;
  transactions: any[];
  onBack: () => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  onAddGlobalNotification: (title: string, body: string, type: string) => void;
  onSendSimulatedEmail: (to: string, subject: string, body: string) => void;
  adminPath?: string;
  navigateTo?: (path: string) => void;
}

export default function AdminPanel({
  currentUserEmail,
  transactions,
  onBack,
  onToast,
  onAddGlobalNotification,
  onSendSimulatedEmail,
  adminPath,
  navigateTo
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'voucher_generator' | 'withdrawals'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Withdrawal Management System State
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  const [withdrawalSearch, setWithdrawalSearch] = useState('');
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'rejected'>('all');
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [loadingSelectedWithdrawal, setLoadingSelectedWithdrawal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [isDraggingSlip, setIsDraggingSlip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Balance modification state
  const [editBalanceAmount, setEditBalanceAmount] = useState('');
  const [editUserFullName, setEditUserFullName] = useState('');
  
  // Broadcast announcement state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastType, setBroadcastType] = useState('system');
  const [sendAsEmail, setSendAsEmail] = useState(true);

  // WDV Payment Config fields
  const [wdvBankName, setWdvBankName] = useState('PalmPay');
  const [wdvAccountNumber, setWdvAccountNumber] = useState('8960723295');
  const [wdvAccountName, setWdvAccountName] = useState('pwamunadi ishaku');
  const [wdvWhatsappLink, setWdvWhatsappLink] = useState('https://wa.me/2349162845073');
  const [wdvVoucherPrice, setWdvVoucherPrice] = useState('6500');
  const [wdvInstructions, setWdvInstructions] = useState('');
  const [wdvMaintenanceNotice, setWdvMaintenanceNotice] = useState('');
  const [savingWdvConfig, setSavingWdvConfig] = useState(false);

  // Dynamic Admin & Recovery Settings
  const [supportEmail, setSupportEmail] = useState('support@swiftpay.com');
  const [supportPhone, setSupportPhone] = useState('+2349162845073');
  const [whatsappNumber, setWhatsappNumber] = useState('+2349162845073');
  const [senderName, setSenderName] = useState('SwiftPay');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [recoveryEnabled, setRecoveryEnabled] = useState(true);
  const [smsRecoveryEnabled, setSmsRecoveryEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(false);

  // Diagnostic Logs state
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // WDV Voucher Management state
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [voucherSearchTerm, setVoucherSearchTerm] = useState('');
  const [generatingVoucher, setGeneratingVoucher] = useState(false);

  const getAdminHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem('swiftpay_admin_token') || '';
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
  };

  // Fetch users from server on mount
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        onToast('Failed to fetch user database', 'error');
      }
    } catch (err) {
      onToast('Network error loading admin panel', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/logs', {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs/clear', { 
        method: 'POST',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        setLogs([]);
        onToast('Diagnostic logs cleared successfully', 'success');
      }
    } catch (err) {
      onToast('Failed to clear logs', 'error');
    }
  };

  const fetchWdvConfig = async () => {
    try {
      const res = await fetch('/api/config/wdv');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          setWdvBankName(data.config.bankName);
          setWdvAccountNumber(data.config.accountNumber);
          setWdvAccountName(data.config.accountName);
          setWdvWhatsappLink(data.config.whatsappLink);
          setWdvVoucherPrice(String(data.config.voucherPrice));
          setWdvInstructions(data.config.instructions);
          setWdvMaintenanceNotice(data.config.maintenanceNotice);
        }
      }
    } catch (err) {
      console.error('Error fetching WDV config:', err);
    }
  };

  const handleSaveWdvConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWdvConfig(true);
    try {
      const res = await fetch('/api/admin/config/wdv', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          bankName: wdvBankName,
          accountNumber: wdvAccountNumber,
          accountName: wdvAccountName,
          whatsappLink: wdvWhatsappLink,
          voucherPrice: Number(wdvVoucherPrice),
          instructions: wdvInstructions,
          maintenanceNotice: wdvMaintenanceNotice
        })
      });
      if (res.ok) {
        onToast('WDV configuration saved and updated live!', 'success');
        fetchWdvConfig();
      } else {
        onToast('Failed to save WDV configuration', 'error');
      }
    } catch (err) {
      onToast('Network error saving configuration', 'error');
    } finally {
      setSavingWdvConfig(false);
    }
  };

  const fetchAdminSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          if (s.supportEmail) setSupportEmail(s.supportEmail);
          if (s.supportPhone) setSupportPhone(s.supportPhone);
          if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
          if (s.senderName) setSenderName(s.senderName);
          if (s.videoUrl) setVideoUrl(s.videoUrl);
          if (s.videoEnabled) setVideoEnabled(s.videoEnabled === 'true');
          if (s.recoveryEnabled) setRecoveryEnabled(s.recoveryEnabled === 'true');
          if (s.smsRecoveryEnabled) setSmsRecoveryEnabled(s.smsRecoveryEnabled === 'true');
        }
      }
    } catch (err) {
      console.error('Error fetching admin settings:', err);
    }
  };

  const handleSaveAdminSettings = async (e?: React.FormEvent, overrideSettings?: Record<string, string>) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const settingsToSave = overrideSettings || {
        supportEmail,
        supportPhone,
        whatsappNumber,
        senderName,
        videoUrl,
        videoEnabled: String(videoEnabled),
        recoveryEnabled: String(recoveryEnabled),
        smsRecoveryEnabled: String(smsRecoveryEnabled)
      };
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ settings: settingsToSave })
      });
      if (res.ok) {
        onToast('Admin settings saved successfully!', 'success');
        fetchAdminSettings();
      } else {
        onToast('Failed to save settings', 'error');
      }
    } catch (err) {
      onToast('Network error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/admin/video/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('swiftpay_admin_token') || ''}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          onToast('Walkthrough video uploaded successfully!', 'success');
          setVideoUrl(data.videoUrl);
          fetchAdminSettings();
        } else {
          onToast(data.message || 'Failed to upload video', 'error');
        }
      } else {
        onToast('Failed to upload video (Ensure it is MP4, under 100MB)', 'error');
      }
    } catch (err) {
      console.error('Error uploading video:', err);
      onToast('Network error uploading video', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleVideoDelete = async () => {
    if (!window.confirm('Are you sure you want to completely delete the video walkthrough guide?')) {
      return;
    }
    setDeletingVideo(true);
    try {
      const res = await fetch('/api/admin/video/delete', {
        method: 'POST',
        headers: getAdminHeaders()
      });

      if (res.ok) {
        onToast('Walkthrough video deleted from server', 'success');
        setVideoUrl('');
        fetchAdminSettings();
      } else {
        onToast('Failed to delete video', 'error');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      onToast('Network error deleting video', 'error');
    } finally {
      setDeletingVideo(false);
    }
  };

  React.useEffect(() => {
    fetchAllUsers();
    fetchLogs();
    fetchWdvConfig();
    fetchAdminSettings();
    fetchVouchers();
    fetchWithdrawals();
  }, []);

  // Fetch all withdrawal requests
  const fetchWithdrawals = async () => {
    setLoadingWithdrawals(true);
    try {
      const res = await fetch('/api/admin/withdrawals', {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.withdrawals || []);
      } else {
        onToast('Failed to fetch withdrawal database', 'error');
      }
    } catch (err) {
      console.error('Error loading withdrawals:', err);
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  // Fetch a single withdrawal details
  const fetchSelectedWithdrawalDetails = async (txId: string) => {
    setLoadingSelectedWithdrawal(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${txId}`, {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedWithdrawal(data.withdrawal);
        setAdminNotes(data.withdrawal?.notes || '');
      } else {
        onToast('Failed to fetch withdrawal request details', 'error');
      }
    } catch (err) {
      console.error('Error loading withdrawal details:', err);
    } finally {
      setLoadingSelectedWithdrawal(false);
    }
  };

  // Detect and handle SPA Details routing
  const isDetailsPage = adminPath?.startsWith('/admin/withdrawals/');
  const selectedTxId = isDetailsPage ? adminPath?.split('/').pop() : null;

  useEffect(() => {
    if (selectedTxId) {
      fetchSelectedWithdrawalDetails(selectedTxId);
      // Poll every 5 seconds for single transaction view live status updates
      const interval = setInterval(() => {
        fetchSelectedWithdrawalDetails(selectedTxId);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setSelectedWithdrawal(null);
    }
  }, [selectedTxId]);

  // General list real-time polling updates when tab is withdrawals
  useEffect(() => {
    if (activeTab === 'withdrawals' && !isDetailsPage) {
      fetchWithdrawals();
      const interval = setInterval(fetchWithdrawals, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, isDetailsPage]);

  // Update withdrawal status (pending, processing, completed, rejected)
  const updateWithdrawalStatus = async (status: string) => {
    if (!selectedWithdrawal) return;
    try {
      const res = await fetch(`/api/admin/withdrawals/${selectedWithdrawal.id}/status`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, notes: adminNotes })
      });
      if (res.ok) {
        onToast(`Withdrawal status updated to ${status}`, 'success');
        fetchSelectedWithdrawalDetails(selectedWithdrawal.id);
        fetchWithdrawals();
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to update withdrawal status', 'error');
      }
    } catch (err) {
      onToast('Network error updating status', 'error');
    }
  };

  // Update withdrawal internal notes only
  const saveInternalNotes = async () => {
    if (!selectedWithdrawal) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${selectedWithdrawal.id}/notes`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ notes: adminNotes })
      });
      if (res.ok) {
        onToast('Internal notes saved securely', 'success');
        setSelectedWithdrawal(prev => prev ? { ...prev, notes: adminNotes } : null);
      } else {
        onToast('Failed to save notes', 'error');
      }
    } catch (err) {
      onToast('Network error saving notes', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  // Upload POS decline slip
  const handleSlipFileUpload = async (file: File) => {
    if (!selectedWithdrawal) return;
    if (file.size > 10 * 1024 * 1024) {
      onToast('File exceeds the 10 MB maximum size limit', 'error');
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['png', 'jpg', 'jpeg', 'pdf'].includes(ext || '')) {
      onToast('Only PNG, JPG, JPEG, and PDF files are allowed', 'error');
      return;
    }

    setUploadingSlip(true);
    try {
      const formData = new FormData();
      formData.append('slip', file);

      const token = localStorage.getItem('swiftpay_admin_token') || '';
      const res = await fetch(`/api/admin/withdrawals/${selectedWithdrawal.id}/upload-slip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        onToast('POS Decline Slip uploaded successfully', 'success');
        fetchSelectedWithdrawalDetails(selectedWithdrawal.id);
      } else {
        const err = await res.json();
        onToast(err.error || 'Failed to upload POS slip', 'error');
      }
    } catch (err) {
      onToast('Network error uploading slip', 'error');
    } finally {
      setUploadingSlip(false);
    }
  };

  const fetchVouchers = async () => {
    setLoadingVouchers(true);
    try {
      const res = await fetch('/api/admin/wdv', {
        headers: getAdminHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setVouchers(data.vouchers || []);
      } else {
        // Fallback to existing path if custom route isn't loaded yet
        const fallbackRes = await fetch('/api/admin/vouchers', {
          headers: getAdminHeaders()
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setVouchers(data.vouchers || []);
        } else {
          onToast('Failed to fetch WDV vouchers', 'error');
        }
      }
    } catch (err) {
      onToast('Network error loading WDV vouchers', 'error');
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleGenerateVoucher = async () => {
    setGeneratingVoucher(true);
    try {
      const res = await fetch('/api/admin/wdv/generate', {
        method: 'POST',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        onToast(`New WDV voucher generated: ${data.voucher?.code || data.code}`, 'success');
        fetchVouchers();
      } else {
        onToast(data.error || 'Failed to generate voucher', 'error');
      }
    } catch (err) {
      onToast('Network error generating voucher', 'error');
    } finally {
      setGeneratingVoucher(false);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this voucher from the database?')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/wdv/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        onToast('Voucher permanently deleted.', 'success');
        fetchVouchers();
      } else {
        // Fallback to POST delete if needed
        const fallbackRes = await fetch('/api/admin/vouchers/delete', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify({ id })
        });
        if (fallbackRes.ok) {
          onToast('Voucher permanently deleted.', 'success');
          fetchVouchers();
        } else {
          onToast(data.error || 'Failed to delete voucher', 'error');
        }
      }
    } catch (err) {
      onToast('Network error deleting voucher', 'error');
    }
  };

  const handleDeactivateVoucher = async (id: string) => {
    if (!window.confirm('Are you sure you want to manually deactivate this voucher? This will permanently mark it as USED.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/vouchers/deactivate', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok) {
        onToast('Voucher successfully deactivated.', 'success');
        fetchVouchers();
      } else {
        onToast(data.error || 'Failed to deactivate voucher', 'error');
      }
    } catch (err) {
      onToast('Network error deactivating voucher', 'error');
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter vouchers
  const filteredVouchers = vouchers.filter(v => {
    const term = voucherSearchTerm.toLowerCase();
    const code = (v.voucherCode || '').toLowerCase();
    const status = (v.status || '').toLowerCase();
    const usedBy = (v.usedBy || '').toLowerCase();
    const purchasedBy = (v.purchasedBy || '').toLowerCase();
    return code.includes(term) || status.includes(term) || usedBy.includes(term) || purchasedBy.includes(term);
  });

  // Calculate admin statistics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => !u.isSuspended).length;
  const suspendedUsersCount = users.filter(u => u.isSuspended).length;
  const frozenUsersCount = users.filter(u => u.isFrozen).length;
  const totalSystemBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  
  const totalTxsCount = transactions.length;
  const airtimeTxs = transactions.filter(t => t.type === 'redeem_airtime');
  const transferTxs = transactions.filter(t => t.type === 'bank_transfer_direct' || t.type === 'withdraw');
  const wdvTxs = transactions.filter(t => t.type === 'buy_wdv');
  
  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => {
      // Revenue from network charges or buy fees
      if (t.type === 'bank_transfer_direct' || t.type === 'withdraw') {
        return sum + 10; // ₦10 charge per transfer
      }
      return sum;
    }, 0);

  // User database modifiers
  const handleUpdateUserStatus = async (email: string, field: 'isSuspended' | 'isFrozen', val: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/update-status`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ email, field, value: val })
      });
      if (res.ok) {
        onToast(`User status updated successfully`, 'success');
        fetchAllUsers();
        if (selectedUser && selectedUser.email === email) {
          setSelectedUser({ ...selectedUser, [field]: val });
        }
        // Send email alert to user (simulated)
        onSendSimulatedEmail(
          email,
          'Security Update: Account Status Modified',
          `Hello, \n\nAn administrator has updated your SwiftPay security status.\nParameter: ${field}\nNew Value: ${val ? 'TRUE (Active constraint applied)' : 'FALSE (Restored to default)'}\n\nIf you believe this was an error, contact premium support.`
        );
      } else {
        onToast('Failed to update user parameters', 'error');
      }
    } catch (e) {
      onToast('Error updating status', 'error');
    }
  };

  const handleEditWalletBalance = async (email: string) => {
    const amt = parseFloat(editBalanceAmount);
    if (isNaN(amt)) {
      onToast('Enter a valid numerical amount', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/edit-balance`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ email, balance: amt })
      });
      if (res.ok) {
        onToast(`Wallet balance successfully adjusted!`, 'success');
        setEditBalanceAmount('');
        fetchAllUsers();
        if (selectedUser && selectedUser.email === email) {
          setSelectedUser({ ...selectedUser, balance: amt });
        }
        // Send email notification
        onSendSimulatedEmail(
          email,
          'Wallet Credit/Debit Transaction Authorized',
          `Hello, \n\nYour SwiftPay wallet has been adjusted by an administrator.\nNew Wallet Balance: ₦${amt.toLocaleString()}\n\nThank you for choosing SwiftPay!`
        );
      } else {
        onToast('Failed to edit balance', 'error');
      }
    } catch (e) {
      onToast('Error updating balance', 'error');
    }
  };

  const handleAdminResetPassword = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/users/reset-password`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        onToast('Temporary password "SwiftPayAdmin99!" dispatched to user email', 'success');
        onSendSimulatedEmail(
          email,
          'SwiftPay: Account Credentials Reset by Admin',
          `Hello, \n\nAn administrator has reset your password.\nYour temporary password is: SwiftPayAdmin99!\n\nPlease log in immediately and update your security settings.`
        );
      } else {
        onToast('Failed to reset password', 'error');
      }
    } catch (e) {
      onToast('Error resetting password', 'error');
    }
  };

  const handleAdminDeleteAccount = async (email: string) => {
    if (email.toLowerCase() === currentUserEmail.toLowerCase()) {
      onToast('You cannot delete your own admin account!', 'error');
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to permanently delete account ${email}? This action is IRREVERSIBLE.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/delete`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        onToast('User account successfully deleted', 'success');
        setSelectedUser(null);
        fetchAllUsers();
      } else {
        onToast('Failed to delete account', 'error');
      }
    } catch (e) {
      onToast('Error deleting user', 'error');
    }
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) {
      onToast('Title and Body are required to broadcast', 'error');
      return;
    }

    // Add notification globally
    onAddGlobalNotification(broadcastTitle, broadcastBody, broadcastType);
    onToast('System announcement broadcast completed!', 'success');

    // Send emails if checked
    if (sendAsEmail) {
      users.forEach(u => {
        onSendSimulatedEmail(
          u.email,
          `SwiftPay Announcement: ${broadcastTitle}`,
          `Greetings, \n\nWe have published a new announcement on SwiftPay: \n\n${broadcastBody}\n\nTransact securely on SwiftPay!`
        );
      });
      onToast(`Announcement emails sent to ${users.length} active users!`, 'success');
    }

    setBroadcastTitle('');
    setBroadcastBody('');
  };

  const handleExportUsersCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Full Name,Email,Balance,dailyTarget,dailySpent,Pin Setup,Biometrics,Suspended,Frozen\n";
    users.forEach(u => {
      csvContent += `"${u.fullName}","${u.email}",${u.balance},${u.dailyTarget},${u.dailySpent},${u.pinCreated ? 'Yes':'No'},${u.biometricEnabled ? 'Yes':'No'},${u.isSuspended ? 'Yes':'No'},${u.isFrozen ? 'Yes':'No'}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SwiftPay_Users_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast('Users database exported as CSV!', 'success');
  };

  const handleExportTransactionsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Transaction ID,Type,Amount,Date,Status,Description,WDV Used,WDV Generated,Charges\n";
    transactions.forEach(t => {
      csvContent += `"${t.id}","${t.type}",${t.amount},"${t.date}","${t.status}","${t.description}","${t.wdvCodeUsed || ''}","${t.wdvCodeGenerated || ''}",${t.charges || 10}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SwiftPay_Transactions_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast('Transactions database exported as CSV!', 'success');
  };

  // Mask helper for account numbers
  const maskAccountNumber = (num: string) => {
    if (!num) return '';
    if (num.length <= 4) return num;
    return num.slice(0, 3) + '*'.repeat(num.length - 6) + num.slice(-3);
  };

  // Calculate live stats from the database (Section 8)
  const stats = React.useMemo(() => {
    let total = withdrawals.length;
    let pendingCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    let rejectedCount = 0;
    
    let amountToday = 0;
    let amountWeek = 0;
    let amountMonth = 0;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Get start of week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0,0,0,0);
    const weekStartTime = weekStart.getTime();

    // Get start of month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    for (const w of withdrawals) {
      const amt = Number(w.amount || 0);
      const statusLower = (w.status || '').toLowerCase();
      
      if (statusLower === 'pending') pendingCount++;
      else if (statusLower === 'processing') processingCount++;
      else if (statusLower === 'completed' || statusLower === 'success') completedCount++;
      else if (statusLower === 'rejected' || statusLower === 'failed' || statusLower === 'cancelled') rejectedCount++;

      const rawDate = w.timestamp || w.created_at;
      const parsedDate = rawDate ? new Date(rawDate) : null;
      const wTime = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getTime() : 0;
      
      if (statusLower === 'completed' || statusLower === 'success') {
        if (wTime >= todayStart) amountToday += amt;
        if (wTime >= weekStartTime) amountWeek += amt;
        if (wTime >= monthStart) amountMonth += amt;
      }
    }

    return {
      total,
      pendingCount,
      processingCount,
      completedCount,
      rejectedCount,
      amountToday,
      amountWeek,
      amountMonth
    };
  }, [withdrawals]);

  // Search and status filters for withdrawal request console (Section 1)
  const filteredWithdrawals = React.useMemo(() => {
    return withdrawals.filter(w => {
      const term = withdrawalSearch.toLowerCase().trim();
      const matchSearch = !term || 
        (w.accountName || w.accountname || '').toLowerCase().includes(term) ||
        (w.email || w.userId || '').toLowerCase().includes(term) ||
        (w.reference || w.id || '').toLowerCase().includes(term) ||
        (w.bankName || w.bankname || '').toLowerCase().includes(term) ||
        (w.accountNumber || w.accountnumber || '').toLowerCase().includes(term);

      const statusLower = (w.status || '').toLowerCase();
      let matchStatus = true;
      if (withdrawalStatusFilter !== 'all') {
        if (withdrawalStatusFilter === 'rejected') {
          matchStatus = statusLower === 'rejected' || statusLower === 'failed' || statusLower === 'cancelled';
        } else {
          matchStatus = statusLower === withdrawalStatusFilter;
        }
      }

      return matchSearch && matchStatus;
    });
  }, [withdrawals, withdrawalSearch, withdrawalStatusFilter]);

  const itemsPerPage = 8;
  const totalWithdrawalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage) || 1;
  const paginatedWithdrawals = React.useMemo(() => {
    const startIndex = (withdrawalPage - 1) * itemsPerPage;
    return filteredWithdrawals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWithdrawals, withdrawalPage]);

  // Conditionally Render Full-Screen Withdrawal Details Page (Do NOT use popup or modal)
  if (isDetailsPage) {
    if (loadingSelectedWithdrawal && !selectedWithdrawal) {
      return (
        <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 text-teal-400 animate-spin" />
          <p className="text-xs text-slate-400 font-mono tracking-widest">LOADING WITHDRAWAL SECURITY AUDIT DATABASES...</p>
        </div>
      );
    }

    if (!selectedWithdrawal) {
      return (
        <div className="p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Withdrawal request not found</h3>
          <p className="text-xs text-slate-400">The request may have been deleted or the transaction ID is invalid.</p>
          <button
            onClick={() => {
              setActiveTab('withdrawals');
              navigateTo && navigateTo('/admin');
            }}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    const statusLower = (selectedWithdrawal.status || '').toLowerCase();
    let statusBg = 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    let statusLabel = '🟡 Transaction Pending';
    let statusDesc = 'This withdrawal request is currently pending admin review.';

    if (statusLower === 'processing') {
      statusBg = 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      statusLabel = '🔵 Transaction Processing';
      statusDesc = 'This withdrawal request is currently being processed.';
    } else if (statusLower === 'completed' || statusLower === 'success') {
      statusBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      statusLabel = '🟢 Transaction Completed';
      statusDesc = 'This withdrawal has been successfully dispatched and completed.';
    } else if (statusLower === 'rejected' || statusLower === 'failed') {
      statusBg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      statusLabel = '🔴 Transaction Rejected';
      statusDesc = 'This withdrawal request was rejected and the user has been refunded.';
    } else if (statusLower === 'cancelled') {
      statusBg = 'bg-slate-500/10 border-slate-500/30 text-slate-400';
      statusLabel = '⚪ Transaction Cancelled';
      statusDesc = 'This withdrawal request was cancelled and the user has been refunded.';
    }

    return (
      <div className="p-5 space-y-6 h-full overflow-y-auto no-scrollbar animate-[fadeIn_0.2s_ease-out]">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <button
            onClick={() => {
              setActiveTab('withdrawals');
              navigateTo && navigateTo('/admin');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Withdrawals
          </button>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono block">TRANSACTION REF</span>
            <span className="text-xs font-bold text-teal-400 font-mono">{selectedWithdrawal.reference || selectedWithdrawal.id}</span>
          </div>
        </div>

        {/* 1. Large Status Card */}
        <div className={`p-6 rounded-2xl border ${statusBg} flex flex-col md:flex-row items-center justify-between gap-4 animate-[fadeIn_0.2s_ease-out]`}>
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-black tracking-tight">{statusLabel}</h2>
            <p className="text-xs opacity-80">{statusDesc}</p>
          </div>
          <div className="text-2xl font-mono font-black shrink-0">
            ₦{Number(selectedWithdrawal.amount || 0).toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Details and Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* 2. Account Details Section */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Account Details Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">USER FULL NAME:</span>
                  <span className="font-bold text-white text-sm">{selectedWithdrawal.fullName || selectedWithdrawal.accountName || selectedWithdrawal.accountname}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">EMAIL ADDRESS:</span>
                  <span className="font-bold text-white">{selectedWithdrawal.email || selectedWithdrawal.userId}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">PHONE NUMBER:</span>
                  <span className="font-bold text-white font-mono">{selectedWithdrawal.phone || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">WITHDRAWAL AMOUNT:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">₦{Number(selectedWithdrawal.amount || 0).toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">BANK NAME:</span>
                  <span className="font-bold text-white">{selectedWithdrawal.bankName || selectedWithdrawal.bankname || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">ACCOUNT NUMBER (MASKED):</span>
                  <span className="font-bold text-white font-mono">{maskAccountNumber(selectedWithdrawal.accountNumber || selectedWithdrawal.accountnumber)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">ACCOUNT NAME:</span>
                  <span className="font-bold text-white">{selectedWithdrawal.accountName || selectedWithdrawal.accountname || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">REFERENCE NUMBER:</span>
                  <span className="font-bold text-teal-400 font-mono">{selectedWithdrawal.reference}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">REQUEST DATE &amp; TIME:</span>
                  <span className="font-bold text-white font-mono">{new Date(selectedWithdrawal.timestamp || selectedWithdrawal.created_at).toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-mono text-[10px]">WDV VOUCHER CODE:</span>
                  <span className="font-bold text-indigo-400 font-mono">{selectedWithdrawal.voucherCode || selectedWithdrawal.vouchercode || 'None'}</span>
                </div>
              </div>
            </GlassCard>

            {/* 3. Action Buttons Section */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Admin Action Controls
              </h3>
              <p className="text-[10px] text-slate-400">
                Manage this withdrawal. Status updates are applied immediately, notifying the user inside their account.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => updateWithdrawalStatus('processing')}
                  disabled={statusLower === 'completed' || statusLower === 'rejected' || statusLower === 'cancelled' || statusLower === 'success'}
                  className="px-3 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-40 text-blue-400 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => updateWithdrawalStatus('completed')}
                  disabled={statusLower === 'completed' || statusLower === 'rejected' || statusLower === 'cancelled' || statusLower === 'success'}
                  className="px-3 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 text-emerald-400 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => updateWithdrawalStatus('rejected')}
                  disabled={statusLower === 'completed' || statusLower === 'rejected' || statusLower === 'cancelled' || statusLower === 'success'}
                  className="px-3 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 text-rose-400 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Reject Withdrawal
                </button>
                <button
                  onClick={() => updateWithdrawalStatus('cancelled')}
                  disabled={statusLower === 'completed' || statusLower === 'rejected' || statusLower === 'cancelled' || statusLower === 'success'}
                  className="px-3 py-2.5 rounded-xl border border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20 disabled:opacity-40 text-slate-300 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Cancel Withdrawal
                </button>
              </div>
            </GlassCard>
          </div>

          {/* POS Slip and Notes columns */}
          <div className="space-y-6">
            {/* 4. POS Decline Slip Requirement Section */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Requirement: POS Decline Slip Terminal
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Upload the POS decline slip for this withdrawal.
              </p>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingSlip(true);
                }}
                onDragLeave={() => setIsDraggingSlip(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingSlip(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleSlipFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDraggingSlip
                    ? 'border-teal-500 bg-teal-500/5'
                    : 'border-white/10 hover:border-teal-500/40 bg-white/5'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSlipFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                />
                {uploadingSlip ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="h-6 w-6 text-teal-400 animate-spin" />
                    <span className="text-[10px] text-slate-400 font-mono">UPLOADING...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-7 w-7 text-teal-400" />
                    <span className="text-[11px] text-slate-300 font-bold block">Drag &amp; Drop or Click</span>
                    <span className="text-[9px] text-slate-500 font-mono block">PNG, JPG, JPEG, PDF (Max 10MB)</span>
                  </div>
                )}
              </div>

              {/* Uploaded POS Slip View */}
              {(selectedWithdrawal.posSlipPath || selectedWithdrawal.posslippath) && (
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>POS SLIP ATTACHED:</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-400" />
                    <div className="truncate flex-1">
                      <span className="block text-xs font-bold text-white truncate">
                        {(selectedWithdrawal.posSlipPath || selectedWithdrawal.posslippath).split('/').pop()}
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        Uploaded: {new Date(selectedWithdrawal.posSlipUploadedAt || selectedWithdrawal.posslipuploadedat || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <a
                    href={selectedWithdrawal.posSlipPath || selectedWithdrawal.posslippath}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 py-2 rounded-lg hover:bg-teal-500/20 transition-all cursor-pointer"
                  >
                    View / Download POS Slip
                  </a>
                </div>
              )}
            </GlassCard>

            {/* 5. Admin Notes Section */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Internal Admin Notes
              </h3>
              <p className="text-[10px] text-slate-400">
                Write private annotations for other administrators regarding this transaction.
              </p>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 resize-none font-sans"
                placeholder="Insert audit notes, POS terminals logs, client compliance flags..."
              />
              <button
                onClick={saveInternalNotes}
                disabled={savingNotes}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {savingNotes ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Saving Notes...
                  </>
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    Save Internal Notes
                  </>
                )}
              </button>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 h-full overflow-y-auto no-scrollbar animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-teal-400 cursor-pointer flex items-center justify-center border border-white/5"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div>
            <h3 className="text-base font-black font-display text-slate-800 dark:text-white">Admin Central Console</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Fintech Management &amp; System Auditing</p>
          </div>
        </div>
        <button
          onClick={() => {
            fetchAllUsers();
            fetchVouchers();
            fetchLogs();
            setMobileMenuOpen(false);
          }}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-teal-400 border border-white/10 cursor-pointer flex items-center gap-1 text-[10px]"
          title="Refresh All Data"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sleek Sidebar Menu */}
        <div className={`w-full lg:w-64 shrink-0 flex flex-col space-y-2 bg-slate-950/20 border border-white/5 rounded-2xl p-4 transition-all duration-300 ${mobileMenuOpen ? 'flex' : 'hidden lg:flex'}`}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 px-2.5 font-bold">Admin Navigation</div>
          
          <button
            onClick={() => {
              setActiveTab('overview');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-teal-400 shadow-[0_4px_25px_rgba(20,184,166,0.06)]'
                : 'border border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4 text-teal-400" />
            Dashboard Overview
          </button>
          
          <button
            onClick={() => {
              setActiveTab('voucher_generator');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'voucher_generator'
                ? 'bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-teal-400 shadow-[0_4px_25px_rgba(20,184,166,0.06)]'
                : 'border border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Key className="h-4 w-4 text-teal-400" />
            WDV Voucher Generator
          </button>

          <button
            onClick={() => {
              setActiveTab('withdrawals');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-teal-400 shadow-[0_4px_25px_rgba(20,184,166,0.06)]'
                : 'border border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4 text-teal-400" />
            Withdrawals
          </button>

          <div className="pt-4 border-t border-white/5 mt-4">
            <button
              onClick={onBack}
              className="w-full text-left px-3.5 py-2.5 rounded-xl border border-white/5 hover:border-red-500/25 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit Console
            </button>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="flex-1 w-full space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Overview Statistics Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-slate-400 block uppercase">Total Users</span>
            <span className="text-sm font-bold text-white font-mono">{totalUsersCount}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-slate-400 block uppercase">Total Ledger</span>
            <span className="text-xs font-bold text-white font-mono">₦{(totalSystemBalance/1000).toFixed(0)}k</span>
          </div>
        </GlassCard>

        <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-slate-400 block uppercase">Charges Rev</span>
            <span className="text-xs font-bold text-white font-mono">₦{totalRevenue.toLocaleString()}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-slate-400 block uppercase">Transactions</span>
            <span className="text-sm font-bold text-white font-mono">{totalTxsCount}</span>
          </div>
        </GlassCard>
      </div>

      {/* Analytics Charts (Custom responsive SVG bar chart & line chart) */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-teal-400" />
            Fintech Transaction Volume &amp; Daily Statistics
          </h5>
          <span className="text-[8px] font-mono text-slate-500">Real-Time Data</span>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="space-y-3">
          <span className="text-[9px] font-mono text-slate-400 block">Transaction Categories (By Volume)</span>
          <div className="h-28 flex items-end justify-between px-6 pt-4 relative bg-slate-950/30 rounded-xl border border-white/5">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-white/[0.03] pointer-events-none" />
            <div className="absolute inset-x-0 top-2/4 border-t border-white/[0.03] pointer-events-none" />
            <div className="absolute inset-x-0 top-3/4 border-t border-white/[0.03] pointer-events-none" />

            {/* Direct Bank Transfers */}
            <div className="flex flex-col items-center gap-1 w-1/4 group cursor-pointer z-10">
              <span className="text-[8px] font-mono text-slate-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded -mt-6 absolute">{transferTxs.length} txs</span>
              <div
                style={{ height: `${Math.max(15, Math.min(80, (transferTxs.length / (totalTxsCount || 1)) * 100))}%` }}
                className="w-10 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md hover:from-indigo-500 hover:to-indigo-300 transition-all duration-300"
              />
              <span className="text-[8px] text-slate-400 font-mono">Transfers</span>
            </div>

            {/* WDV Generation Purchases */}
            <div className="flex flex-col items-center gap-1 w-1/4 group cursor-pointer z-10">
              <span className="text-[8px] font-mono text-slate-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded -mt-6 absolute">{wdvTxs.length} txs</span>
              <div
                style={{ height: `${Math.max(15, Math.min(80, (wdvTxs.length / (totalTxsCount || 1)) * 100))}%` }}
                className="w-10 bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-md hover:from-teal-400 hover:to-teal-200 transition-all duration-300"
              />
              <span className="text-[8px] text-slate-400 font-mono">WDV Codes</span>
            </div>

            {/* Airtime Redeem logs */}
            <div className="flex flex-col items-center gap-1 w-1/4 group cursor-pointer z-10">
              <span className="text-[8px] font-mono text-slate-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded -mt-6 absolute">{airtimeTxs.length} txs</span>
              <div
                style={{ height: `${Math.max(15, Math.min(80, (airtimeTxs.length / (totalTxsCount || 1)) * 100))}%` }}
                className="w-10 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-md hover:from-purple-400 hover:to-purple-200 transition-all duration-300"
              />
              <span className="text-[8px] text-slate-400 font-mono">Airtime/Data</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Reports Export Section */}
      <GlassCard className="p-4 border-white/5 space-y-3">
        <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4" />
          Fintech Audits &amp; Database Reports
        </h5>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleExportUsersCSV}
            className="p-3 bg-white/5 border border-white/5 hover:border-teal-500/20 hover:bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 text-center"
          >
            <Database className="h-4 w-4 mb-1 text-teal-400" />
            Export Users CSV
          </button>
          <button
            onClick={handleExportTransactionsCSV}
            className="p-3 bg-white/5 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 text-center"
          >
            <FileSpreadsheet className="h-4 w-4 mb-1 text-indigo-400" />
            Export Ledger CSV
          </button>
        </div>
      </GlassCard>

      {/* User Management Section */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400">User Database Management</h5>
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name or email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/40 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {loadingUsers ? (
            <div className="text-center py-6 text-slate-400 text-xs font-mono">Loading user database...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No users found.</div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.email}
                onClick={() => {
                  setSelectedUser(u);
                  setEditBalanceAmount((u.balance || 0).toString());
                  setEditUserFullName(u.fullName);
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedUser?.email === u.email
                    ? 'bg-teal-500/10 border-teal-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{u.fullName}</span>
                    {u.isSuspended && (
                      <span className="text-[7px] font-black uppercase bg-red-500 text-white px-1 py-0.5 rounded">
                        Suspended
                      </span>
                    )}
                    {u.isFrozen && (
                      <span className="text-[7px] font-black uppercase bg-indigo-500 text-white px-1 py-0.5 rounded">
                        Frozen
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block">{u.email}</span>
                </div>
                
                <div className="text-right font-mono text-xs font-bold text-teal-400">
                  ₦{(u.balance || 0).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected User Actions Panel */}
        {selectedUser && (
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase">Selected Profile</span>
                <h6 className="text-xs font-bold text-white">{selectedUser.fullName}</h6>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[9px] font-bold text-red-400 hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            </div>

            {/* Profile fields updating name */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Balance Editor */}
                <div className="flex-1">
                  <label className="text-[9px] font-mono text-slate-400 block mb-1">Adjust Wallet Balance (₦)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      value={editBalanceAmount}
                      onChange={(e) => setEditBalanceAmount(e.target.value)}
                      className="flex-1 text-xs bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                    <button
                      onClick={() => handleEditWalletBalance(selectedUser.email)}
                      className="px-3 bg-teal-500 hover:bg-teal-600 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggle Suspension or Freeze */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleUpdateUserStatus(selectedUser.email, 'isSuspended', !selectedUser.isSuspended)}
                  className={`py-2 px-3 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedUser.isSuspended
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {selectedUser.isSuspended ? 'Suspended (Revoke)' : 'Suspend Account'}
                </button>

                <button
                  onClick={() => handleUpdateUserStatus(selectedUser.email, 'isFrozen', !selectedUser.isFrozen)}
                  className={`py-2 px-3 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedUser.isFrozen
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {selectedUser.isFrozen ? 'Frozen (Unfreeze)' : 'Freeze Ledger'}
                </button>
              </div>

              {/* Reset Password & Delete */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 my-1">
                <button
                  onClick={() => handleAdminResetPassword(selectedUser.email)}
                  className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/10 text-amber-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Key className="h-3.5 w-3.5" /> Reset Pass
                </button>

                <button
                  onClick={() => handleAdminDeleteAccount(selectedUser.email)}
                  className="py-2 px-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/10 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Broadcast System Announcements Form */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            Global Announcement Broadcaster
          </h5>
          <p className="text-[10px] text-slate-400 mt-0.5">Publish alerts to user notifications and push simulated emails</p>
        </div>

        <form onSubmit={handleBroadcastAnnouncement} className="space-y-3">
          <div>
            <label className="text-[9px] font-mono text-slate-400 block mb-1">Alert Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Scheduled Core Maintenance Completed"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono text-slate-400 block mb-1">Alert Body</label>
            <textarea
              required
              rows={2}
              placeholder="Provide a detailed security alert or marketing description here..."
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none font-mono"
            />
          </div>

          <div className="flex justify-between items-center bg-slate-950/30 p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="send_sim_email_box"
                checked={sendAsEmail}
                onChange={(e) => setSendAsEmail(e.target.checked)}
                className="rounded border-white/10 text-teal-500 focus:ring-0"
              />
              <label htmlFor="send_sim_email_box" className="text-[9px] font-mono text-slate-400 select-none cursor-pointer">
                Send as simulated Email alerts
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Send className="h-3 w-3" /> Broadcast
            </button>
          </div>
        </form>
      </GlassCard>

      {/* WDV Payment & System Configurations */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-teal-400" />
              WDV Payment details &amp; Pricing Config
            </h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Control system bank transfer details, warning notices, and voucher pricing dynamically</p>
          </div>
        </div>

        <form onSubmit={handleSaveWdvConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Payment Bank Name</label>
              <input
                type="text"
                required
                value={wdvBankName}
                onChange={(e) => setWdvBankName(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Payment Account Number</label>
              <input
                type="text"
                required
                value={wdvAccountNumber}
                onChange={(e) => setWdvAccountNumber(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Payment Account Name</label>
              <input
                type="text"
                required
                value={wdvAccountName}
                onChange={(e) => setWdvAccountName(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Support WhatsApp URL Link</label>
              <input
                type="url"
                required
                value={wdvWhatsappLink}
                onChange={(e) => setWdvWhatsappLink(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-slate-400 block mb-1">Strict Locked Voucher Price (₦)</label>
            <input
              type="number"
              required
              value={wdvVoucherPrice}
              onChange={(e) => setWdvVoucherPrice(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono text-slate-400 block mb-1">Transfer Instructions Text</label>
            <textarea
              required
              rows={3}
              value={wdvInstructions}
              onChange={(e) => setWdvInstructions(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none font-sans"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono text-slate-400 block mb-1">System Warning / Bank Maintenance Notice (Leave blank to hide)</label>
            <textarea
              rows={2}
              value={wdvMaintenanceNotice}
              onChange={(e) => setWdvMaintenanceNotice(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none font-sans"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingWdvConfig}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 disabled:opacity-50 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              {savingWdvConfig ? 'Saving Settings...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </GlassCard>
            </>
          )}

          {activeTab === 'voucher_generator' && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
              {/* Introduction Header card */}
              <GlassCard className="p-5 border-white/5 bg-gradient-to-br from-indigo-950/10 via-slate-900/10 to-teal-950/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <Key className="h-5 w-5 text-teal-400" />
                      WDV Voucher Generator
                    </h4>
                    <p className="text-[10px] text-slate-400 max-w-xl">
                      Generate, manage, copy, and track secure, single-use cashout vouchers. 
                      Vouchers remain fully valid until a successful user withdrawal. Generating a new voucher 
                      <span className="text-teal-400 font-bold"> never invalidates</span> existing unused ones.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-slate-500">Unused Count:</span>
                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono font-bold animate-pulse">
                      {vouchers.filter(v => v.status === 'unused').length}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Large Generation Button Component */}
              <GlassCard className="p-6 border-white/5 text-center bg-slate-950/10 space-y-4">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="p-3 bg-teal-500/10 text-teal-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Key className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Secure Master Vault</h3>
                    <p className="text-[10px] text-slate-400">Generate a unique master voucher linked to the local SQL datastore.</p>
                  </div>

                  <button
                    onClick={handleGenerateVoucher}
                    disabled={generatingVoucher}
                    className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:shadow-teal-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {generatingVoucher ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating Code...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Generate New WDV Voucher
                      </>
                    )}
                  </button>
                  
                  <p className="text-[8px] text-slate-500 font-mono">
                    Format: WDV-XXXX-XXXX-XXXX • Stored in PostgreSQL/SQLite datastore with strict constraints.
                  </p>
                </div>
              </GlassCard>

              {/* Voucher Database & Search Section */}
              <GlassCard className="p-4 border-white/5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-3">
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">Voucher Datastore Ledger</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Filter records and execute administrative actions below</p>
                  </div>
                  
                  {/* Voucher Search Box */}
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search voucher codes, statuses..."
                      value={voucherSearchTerm}
                      onChange={(e) => setVoucherSearchTerm(e.target.value)}
                      className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-white/10 bg-slate-950/50 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 font-sans"
                    />
                  </div>
                </div>

                {/* Voucher Data Mobile Card Stack (Visible on mobile only) */}
                <div className="md:hidden space-y-3">
                  {loadingVouchers ? (
                    <div className="text-center py-12 text-slate-400 text-xs font-sans">
                      <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-teal-400" />
                      Loading master SQL voucher records...
                    </div>
                  ) : filteredVouchers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs font-sans">
                      No vouchers matching your search criteria.
                    </div>
                  ) : (
                    filteredVouchers.map((v) => {
                      const isUnused = v.status === 'unused';
                      return (
                        <div key={v.id} className={`p-4 rounded-xl border border-white/5 bg-slate-950/20 space-y-2.5 ${!isUnused ? 'opacity-65' : ''}`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-white tracking-wider select-all text-xs">{v.voucherCode || v.code}</span>
                            <span
                              className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                                isUnused
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-slate-850 text-slate-400 border border-white/5'
                              }`}
                            >
                              {v.status}
                            </span>
                          </div>
                          <div className="text-[10px] space-y-1 text-slate-400 font-mono">
                            <div className="flex justify-between">
                              <span>Created:</span>
                              <span className="text-slate-300">{v.createdAt || v.generatedAt ? new Date(v.createdAt || v.generatedAt).toLocaleString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Used By:</span>
                              <span className="text-teal-400 max-w-[150px] truncate">{v.usedBy || '-'}</span>
                            </div>
                            {v.usedAt && (
                              <div className="flex justify-between">
                                <span>Used Date:</span>
                                <span className="text-slate-300">{new Date(v.usedAt).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(v.voucherCode || v.code);
                                onToast('Voucher code copied to clipboard!', 'success');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-teal-400 text-[10px] font-bold uppercase border border-white/10"
                            >
                              Copy Code
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to hard-delete this voucher record?')) {
                                  handleDeleteVoucher(v.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Desktop-Friendly Voucher Data Table (Hidden on mobile) */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5 bg-slate-950/20 no-scrollbar">
                  <table className="w-full text-[11px] text-left border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] text-slate-400 uppercase tracking-wider bg-white/[0.02]">
                        <th className="px-4 py-3 font-bold">Voucher Code</th>
                        <th className="px-3 py-3 font-bold">Status</th>
                        <th className="px-3 py-3 font-bold">Created Date</th>
                        <th className="px-3 py-3 font-bold">Used By</th>
                        <th className="px-3 py-3 font-bold">Used Date</th>
                        <th className="px-4 py-3 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {loadingVouchers ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400 text-xs font-sans">
                            <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-teal-400" />
                            Loading master SQL voucher records...
                          </td>
                        </tr>
                      ) : filteredVouchers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-500 text-xs font-sans">
                            No vouchers matching your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredVouchers.map((v) => {
                          const isUnused = v.status === 'unused';
                          return (
                            <tr key={v.id} className={`hover:bg-white/[0.01] transition-colors ${!isUnused ? 'opacity-65' : ''}`}>
                              <td className="px-4 py-3.5 font-bold tracking-wider text-white whitespace-nowrap select-all">{v.voucherCode || v.code}</td>
                              <td className="px-3 py-3.5 whitespace-nowrap">
                                <span
                                  className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                                    isUnused
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-slate-850 text-slate-400 border border-white/5'
                                  }`}
                                >
                                  {v.status}
                                </span>
                              </td>
                              <td className="px-3 py-3.5 text-slate-300 whitespace-nowrap text-[9px]">
                                {v.createdAt || v.generatedAt ? new Date(v.createdAt || v.generatedAt).toLocaleString() : 'N/A'}
                              </td>
                              <td className="px-3 py-3.5 text-teal-400 whitespace-nowrap max-w-[120px] truncate" title={v.usedBy}>
                                {v.usedBy || <span className="text-slate-600">-</span>}
                              </td>
                              <td className="px-3 py-3.5 text-slate-400 whitespace-nowrap text-[9px]">
                                {v.usedAt ? new Date(v.usedAt).toLocaleString() : <span className="text-slate-600">-</span>}
                              </td>
                              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(v.voucherCode || v.code);
                                      onToast('Voucher code copied to clipboard!', 'success');
                                    }}
                                    className="p-1.5 bg-white/5 hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/20 text-teal-400 rounded-lg transition-all cursor-pointer"
                                    title="Copy Code"
                                  >
                                    <FileSpreadsheet className="h-3.5 w-3.5" />
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVoucher(v.id)}
                                    className="p-1.5 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/25 text-red-500 rounded-lg transition-all cursor-pointer"
                                    title="Delete Voucher"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
              {/* Introduction Header card */}
              <GlassCard className="p-5 border-white/5 bg-gradient-to-br from-indigo-950/10 via-slate-900/10 to-teal-950/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-teal-400" />
                      Live Withdrawal Management Console
                    </h4>
                    <p className="text-[10px] text-slate-400 max-w-xl">
                      Monitor, audit, and dispatch secure real-time withdrawal requests. Status modifications are saved instantly to the SQL database.
                    </p>
                  </div>
                  
                  <button
                    onClick={fetchWithdrawals}
                    disabled={loadingWithdrawals}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-teal-400 border border-white/10 cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase shrink-0 transition-all"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingWithdrawals ? 'animate-spin' : ''}`} />
                    Sync Logs
                  </button>
                </div>
              </GlassCard>

              {/* Live Statistics Cards (Section 8) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Total Requests</span>
                    <span className="text-sm font-bold text-white font-mono">{stats.total}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
                    <Clock className="h-4 w-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Pending Requests</span>
                    <span className="text-sm font-bold text-yellow-400 font-mono">{stats.pendingCount}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <RefreshCw className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Processing</span>
                    <span className="text-sm font-bold text-blue-400 font-mono">{stats.processingCount}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Completed</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{stats.completedCount}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Rejected / Cancelled</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">{stats.rejectedCount}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Withdrawn Today</span>
                    <span className="text-xs font-bold text-white font-mono">₦{stats.amountToday.toLocaleString()}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Withdrawn This Week</span>
                    <span className="text-xs font-bold text-white font-mono">₦{stats.amountWeek.toLocaleString()}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-3 bg-[#1e1b4b]/10 border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase">Withdrawn This Month</span>
                    <span className="text-xs font-bold text-white font-mono">₦{stats.amountMonth.toLocaleString()}</span>
                  </div>
                </GlassCard>
              </div>

              {/* Filtering and Search Controls (Section 1) */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/30 p-4 border border-white/5 rounded-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={withdrawalSearch}
                    onChange={(e) => {
                      setWithdrawalSearch(e.target.value);
                      setWithdrawalPage(1);
                    }}
                    placeholder="Search by name, email, transaction reference, bank, account number..."
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">Filter Status:</span>
                  <select
                    value={withdrawalStatusFilter}
                    onChange={(e) => {
                      setWithdrawalStatusFilter(e.target.value as any);
                      setWithdrawalPage(1);
                    }}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    <option value="all">All Transactions</option>
                    <option value="pending">🟡 Pending Only</option>
                    <option value="processing">🔵 Processing Only</option>
                    <option value="completed">🟢 Completed Only</option>
                    <option value="rejected">🔴 Rejected &amp; Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Withdrawals List Datagrid table */}
              <GlassCard className="p-0 border-white/5 overflow-hidden">
                {/* Mobile view stacked cards */}
                <div className="md:hidden divide-y divide-white/[0.03]">
                  {loadingWithdrawals && paginatedWithdrawals.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 font-mono animate-pulse text-xs">
                      Loading withdrawal security database...
                    </div>
                  ) : paginatedWithdrawals.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 font-mono">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Inbox className="h-8 w-8 text-slate-500" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">No withdrawal requests found</span>
                      </div>
                    </div>
                  ) : (
                    paginatedWithdrawals.map((w) => {
                      const statusLower = (w.status || '').toLowerCase();
                      let statusColor = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25';
                      let statusLabel = 'Pending';
                      if (statusLower === 'processing') {
                        statusColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
                        statusLabel = 'Processing';
                      } else if (statusLower === 'completed' || statusLower === 'success') {
                        statusColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
                        statusLabel = 'Completed';
                      } else if (statusLower === 'rejected' || statusLower === 'failed') {
                        statusColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
                        statusLabel = 'Rejected';
                      } else if (statusLower === 'cancelled') {
                        statusColor = 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
                        statusLabel = 'Cancelled';
                      }

                      return (
                        <div key={w.id} className="p-4 space-y-3 hover:bg-white/[0.01] transition-all">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white leading-tight text-xs">
                                {w.accountName || w.accountname || 'Anonymous User'}
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono truncate max-w-[180px] mt-0.5">
                                {w.email || w.userId}
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide shrink-0 ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                            <div>
                              <span className="block text-[8px] uppercase text-slate-500">Amount</span>
                              <span className="font-bold text-emerald-400 text-xs">₦{Number(w.amount || 0).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase text-slate-500">Bank Details</span>
                              <span className="text-slate-200 truncate block max-w-[120px]">{w.bankName || w.bankname}</span>
                              <span className="block text-[9px] text-slate-400">{maskAccountNumber(w.accountNumber || w.accountnumber)}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase text-slate-500">Date &amp; Time</span>
                              <span className="text-slate-300">
                                {new Date(w.timestamp || w.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase text-slate-500">Reference</span>
                              <span className="text-teal-400 text-[9px] select-all truncate block max-w-[120px]">{w.reference}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                navigateTo && navigateTo(`/admin/withdrawals/${w.id}`);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 hover:from-teal-500 hover:to-indigo-500 text-teal-400 hover:text-slate-950 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-teal-500/20 hover:border-transparent transition-all cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Desktop View Table (Hidden on mobile) */}
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-950/40 text-[9px] font-mono uppercase text-slate-400 tracking-wider">
                        <th className="py-3 px-4 font-bold">User Details</th>
                        <th className="py-3 px-4 font-bold">Amount</th>
                        <th className="py-3 px-4 font-bold">Bank Name</th>
                        <th className="py-3 px-4 font-bold">Account Number</th>
                        <th className="py-3 px-4 font-bold">Date &amp; Time</th>
                        <th className="py-3 px-4 font-bold">Reference</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-xs">
                      {loadingWithdrawals && paginatedWithdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 font-mono animate-pulse">
                            Loading withdrawal security database...
                          </td>
                        </tr>
                      ) : paginatedWithdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Inbox className="h-8 w-8 text-slate-500" />
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider">No withdrawal requests found</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedWithdrawals.map((w) => {
                          const statusLower = (w.status || '').toLowerCase();
                          let statusColor = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25';
                          let statusLabel = 'Pending';
                          if (statusLower === 'processing') {
                            statusColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
                            statusLabel = 'Processing';
                          } else if (statusLower === 'completed' || statusLower === 'success') {
                            statusColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
                            statusLabel = 'Completed';
                          } else if (statusLower === 'rejected' || statusLower === 'failed') {
                            statusColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
                            statusLabel = 'Rejected';
                          } else if (statusLower === 'cancelled') {
                            statusColor = 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
                            statusLabel = 'Cancelled';
                          }

                          return (
                            <tr key={w.id} className="hover:bg-white/[0.01] transition-all">
                              <td className="py-3 px-4">
                                <div className="font-bold text-white leading-tight">
                                  {w.accountName || w.accountname || 'Anonymous User'}
                                </div>
                                <div className="text-[9px] text-slate-500 font-mono truncate max-w-[150px]">
                                  {w.email || w.userId}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                                ₦{Number(w.amount || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-medium">
                                {w.bankName || w.bankname}
                              </td>
                              <td className="py-3 px-4 text-slate-400 font-mono">
                                {maskAccountNumber(w.accountNumber || w.accountnumber)}
                              </td>
                              <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                                {new Date(w.timestamp || w.created_at).toLocaleDateString()} &bull; {new Date(w.timestamp || w.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="py-3 px-4 font-mono text-teal-400 text-[10px] select-all">
                                {w.reference}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${statusColor}`}>
                                  {statusLabel}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigateTo && navigateTo(`/admin/withdrawals/${w.id}`);
                                  }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 hover:from-teal-500 hover:to-indigo-500 text-teal-400 hover:text-slate-950 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-teal-500/20 hover:border-transparent transition-all cursor-pointer"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalWithdrawalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-white/5 bg-slate-950/20 text-[10px] font-mono text-slate-400">
                    <button
                      disabled={withdrawalPage === 1}
                      onClick={() => setWithdrawalPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white disabled:opacity-40 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      PREV
                    </button>
                    <span>
                      PAGE {withdrawalPage} OF {totalWithdrawalPages}
                    </span>
                    <button
                      disabled={withdrawalPage === totalWithdrawalPages}
                      onClick={() => setWithdrawalPage(prev => Math.min(prev + 1, totalWithdrawalPages))}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white disabled:opacity-40 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      NEXT
                    </button>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {activeTab === 'overview' && (
            <>
              {/* Video Management Section */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Video className="h-4 w-4" />
            Direct Video Walkthrough Guide Manager
          </h5>
          <p className="text-[10px] text-slate-400 mt-0.5">Upload walkthrough MP4 guide directly to the SwiftPay server or delete existing guide videos. HTML5 native media players are used for rendering.</p>
        </div>

        <div className="space-y-4">
          {videoUrl ? (
            <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4 space-y-3">
              <span className="text-[9px] font-mono text-teal-400 block font-bold uppercase tracking-wider">Active Walkthrough Guide Video:</span>
              <div className="rounded-xl overflow-hidden border border-white/10 aspect-video max-w-sm mx-auto bg-slate-900">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="truncate">URL: {videoUrl}</span>
                <button
                  type="button"
                  disabled={deletingVideo}
                  onClick={handleVideoDelete}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[9px] font-bold uppercase border border-red-500/20 transition-colors disabled:opacity-50"
                >
                  {deletingVideo ? 'Deleting...' : 'Delete Video'}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center space-y-3 bg-slate-950/20">
              <div className="p-3 bg-teal-500/10 text-teal-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Video className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-200 font-bold">No active walkthrough video uploaded yet</p>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Upload an MP4 video file (max 100MB) to show a guided walkthrough for users.</p>
              </div>

              <div className="pt-2 max-w-xs mx-auto">
                <input
                  type="file"
                  id="direct-video-upload-input"
                  accept="video/mp4,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoUpload(file);
                  }}
                  disabled={uploadingVideo}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingVideo}
                  onClick={() => document.getElementById('direct-video-upload-input')?.click()}
                  className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {uploadingVideo ? 'Uploading Video...' : 'Upload MP4 Video File'}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-950/30 p-3 rounded-xl border border-white/5">
            <input
              type="checkbox"
              id="video_enabled_box"
              checked={videoEnabled}
              disabled={savingSettings}
              onChange={async (e) => {
                const checked = e.target.checked;
                setVideoEnabled(checked);
                await handleSaveAdminSettings(undefined, {
                  supportEmail,
                  supportPhone,
                  whatsappNumber,
                  senderName,
                  videoUrl,
                  videoEnabled: String(checked),
                  recoveryEnabled: String(recoveryEnabled),
                  smsRecoveryEnabled: String(smsRecoveryEnabled)
                });
              }}
              className="rounded border-white/10 text-teal-500 focus:ring-0"
            />
            <label htmlFor="video_enabled_box" className="text-[9px] font-mono text-slate-400 select-none cursor-pointer">
              Enable walkthrough video guide overlays for users
            </label>
          </div>
        </div>
      </GlassCard>

      {/* Admin Settings & Support Configurations */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            System Configurations &amp; Support Settings
          </h5>
          <p className="text-[10px] text-slate-400 mt-0.5">Manage support contact credentials, brand sender names, and recovery system parameters</p>
        </div>

        <form onSubmit={(e) => handleSaveAdminSettings(e)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Support Email Address</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Support Phone Number</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">WhatsApp URL / Number</label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">Default Branded Sender Name</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-3">
            <span className="text-[9px] font-mono text-slate-400 block">Security &amp; Password Recovery Options</span>
            
            <div className="flex items-center gap-2 bg-slate-950/30 p-2.5 rounded-xl border border-white/5">
              <input
                type="checkbox"
                id="recovery_enabled_box"
                checked={recoveryEnabled}
                onChange={(e) => setRecoveryEnabled(e.target.checked)}
                className="rounded border-white/10 text-teal-500 focus:ring-0"
              />
              <label htmlFor="recovery_enabled_box" className="text-[9px] font-mono text-slate-400 select-none cursor-pointer">
                Enable Email OTP Password Recovery system
              </label>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/30 p-2.5 rounded-xl border border-white/5">
              <input
                type="checkbox"
                id="sms_recovery_enabled_box"
                checked={smsRecoveryEnabled}
                onChange={(e) => setSmsRecoveryEnabled(e.target.checked)}
                className="rounded border-white/10 text-teal-500 focus:ring-0"
              />
              <label htmlFor="sms_recovery_enabled_box" className="text-[9px] font-mono text-slate-400 select-none cursor-pointer">
                Enable SMS Verification &amp; SMS OTP Password Recovery
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 disabled:opacity-50 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              {savingSettings ? 'Saving Settings...' : 'Save System Settings'}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* System Diagnostics logs auditing */}
      <GlassCard className="p-4 border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-teal-400" />
              System Diagnostics &amp; Audit Logs
            </h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time server exception logging &amp; threat detection</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLogs}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[9px] font-mono border border-white/10"
            >
              Refresh
            </button>
            <button
              onClick={handleClearLogs}
              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[9px] font-mono border border-red-500/20"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-[250px] overflow-y-auto no-scrollbar font-mono text-[9px]">
          {loadingLogs ? (
            <div className="text-center py-6 text-slate-400 font-mono">Fetching diagnostics from core...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 font-mono text-[10px]">No diagnostics generated yet. System healthy.</div>
          ) : (
            logs.map((l: any) => {
              let tagColor = 'bg-slate-500/20 text-slate-400';
              if (l.type === 'API_ERROR' || l.type === 'FAILED_TX') tagColor = 'bg-red-500/15 text-red-400 border border-red-500/30';
              if (l.type === 'SECURITY_ALERT' || l.type === 'FAILED_LOGIN') tagColor = 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
              if (l.type === 'INFO') tagColor = 'bg-teal-500/15 text-teal-400 border border-teal-500/30';

              return (
                <div key={l.id} className="p-2 bg-slate-950/40 rounded-lg border border-white/[0.03] flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${tagColor}`}>{l.type}</span>
                    <span className="text-slate-500 text-[8px]">{new Date(l.timestamp).toLocaleTimeString()} - {new Date(l.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 break-words leading-relaxed">{l.message}</p>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
