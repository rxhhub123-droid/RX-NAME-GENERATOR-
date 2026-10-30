import React, { useState, useRef } from 'react';
import { useAdmin, CustomAdItem, NotificationItem } from '../context/AdminContext';
import { BRAND_LOGO } from '../data/styles';
import { generateNoticeTranslations } from '../utils/notificationTranslator';
import {
  ShieldAlert,
  Save,
  RotateCcw,
  X,
  Megaphone,
  Share2,
  Sliders,
  Flame,
  Plus,
  Trash2,
  Power,
  CheckCircle2,
  Layers,
  Code,
  Upload,
  Image as ImageIcon,
  Edit,
  Bell,
  ExternalLink,
  Send,
  Radio,
  Sparkles,
  Globe,
  Copy,
  Check
} from 'lucide-react';

interface AdminPanelProps {
  onNotify: (msg: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNotify }) => {
  const {
    config,
    updateConfig,
    resetConfig,
    addAd,
    updateAd,
    deleteAd,
    toggleAd,
    addNotification,
    updateNotification,
    deleteNotification,
    broadcastNotification,
    isAdminOpen,
    setIsAdminOpen
  } = useAdmin();

  const [formData, setFormData] = useState({ ...config });
  const [activeTab, setActiveTab] = useState<'branding' | 'ads' | 'socials' | 'notices' | 'domain'>('ads');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Ad form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdPlacement, setNewAdPlacement] = useState<'top' | 'middle' | 'bottom'>('top');
  const [newAdCode, setNewAdCode] = useState('');

  // Edit Ad state
  const [editingAd, setEditingAd] = useState<CustomAdItem | null>(null);

  // Notification management states
  const [showAddNotifModal, setShowAddNotifModal] = useState(false);
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMessage, setNewNotifMessage] = useState('');
  const [newNotifTitleEn, setNewNotifTitleEn] = useState('');
  const [newNotifMessageEn, setNewNotifMessageEn] = useState('');
  const [newNotifType, setNewNotifType] = useState<'update' | 'announcement' | 'reward' | 'vip'>('vip');
  const [newNotifLink, setNewNotifLink] = useState('');

  // Edit Notification state
  const [editingNotif, setEditingNotif] = useState<NotificationItem | null>(null);
  const [editNotifTitle, setEditNotifTitle] = useState('');
  const [editNotifMessage, setEditNotifMessage] = useState('');
  const [editNotifTitleEn, setEditNotifTitleEn] = useState('');
  const [editNotifMessageEn, setEditNotifMessageEn] = useState('');
  const [editNotifType, setEditNotifType] = useState<'update' | 'announcement' | 'reward' | 'vip'>('vip');
  const [editNotifLink, setEditNotifLink] = useState('');

  if (!isAdminOpen) return null;

  const handleSave = () => {
    updateConfig(formData);
    setSavedSuccess(true);
    onNotify('এডমিন সেটিংস সফলভাবে সেভ হয়েছে!');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি সত্যিই সমস্ত সেটিংস ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান? এতে শুধু আপনার দেওয়া মূল ২টি অ্যাড থাকবে।')) {
      resetConfig();
      setFormData({ ...config });
      onNotify('ডিফল্ট সেটিংসে রিস্টোর করা হয়েছে!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ 2MB হতে হবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, brandLogo: result, showLogo: true }));
      onNotify('নতুন ছবি আপলোড হয়েছে! সেভ করতে Save Changes এ চাপুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim() || !newAdCode.trim()) {
      alert('দয়া করে অ্যাড এর নাম ও কোড দিন!');
      return;
    }

    addAd({
      title: newAdTitle.trim(),
      placement: newAdPlacement,
      code: newAdCode.trim(),
      enabled: true
    });

    setNewAdTitle('');
    setNewAdCode('');
    setShowAddModal(false);
    onNotify('নতুন অ্যাড সফলভাবে যুক্ত হয়েছে!');
  };

  const handleUpdateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;

    updateAd(editingAd.id, {
      title: editingAd.title.trim(),
      placement: editingAd.placement,
      code: editingAd.code.trim()
    });

    setEditingAd(null);
    onNotify('অ্যাডটি সফলভাবে এডিট ও আপডেট করা হয়েছে!');
  };

  const handleDeleteAd = (id: string, title: string) => {
    if (window.confirm(`আপনি কি "${title}" অ্যাডটি স্থায়ীভাবে ডিলিট করতে চান?`)) {
      deleteAd(id);
      onNotify('অ্যাডটি ডিলিট করা হয়েছে!');
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim() || !newNotifMessage.trim()) {
      alert('দয়া করে নোটিশের শিরোনাম ও বিস্তারিত বার্তা দিন!');
      return;
    }

    // Auto-generate translations for Bengali, English, Hindi, Indonesian, Portuguese, Spanish, Arabic, Urdu, etc.
    const translations = generateNoticeTranslations(
      newNotifTitle.trim(),
      newNotifMessage.trim(),
      newNotifTitleEn.trim(),
      newNotifMessageEn.trim(),
      newNotifType
    );

    addNotification({
      title: newNotifTitle.trim(),
      message: newNotifMessage.trim(),
      type: newNotifType,
      link: newNotifLink.trim() || undefined,
      titles: translations.titles,
      messages: translations.messages
    });

    setNewNotifTitle('');
    setNewNotifMessage('');
    setNewNotifTitleEn('');
    setNewNotifMessageEn('');
    setNewNotifLink('');
    setShowAddNotifModal(false);
    onNotify('নোটিশ সফলভাবে পাঠানো হয়েছে এবং সবার ফোনে চলে যাবে!');
  };

  const handleStartEditNotification = (notif: NotificationItem) => {
    setEditingNotif(notif);
    setEditNotifTitle(notif.titles?.bn || notif.title);
    setEditNotifMessage(notif.messages?.bn || notif.message);
    setEditNotifTitleEn(notif.titles?.en || '');
    setEditNotifMessageEn(notif.messages?.en || '');
    setEditNotifType(notif.type || 'vip');
    setEditNotifLink(notif.link || '');
  };

  const handleSaveEditedNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotif) return;

    if (!editNotifTitle.trim() || !editNotifMessage.trim()) {
      alert('দয়া করে নোটিশের শিরোনাম ও বিস্তারিত বার্তা দিন!');
      return;
    }

    const translations = generateNoticeTranslations(
      editNotifTitle.trim(),
      editNotifMessage.trim(),
      editNotifTitleEn.trim(),
      editNotifMessageEn.trim(),
      editNotifType
    );

    updateNotification(editingNotif.id, {
      title: editNotifTitle.trim(),
      message: editNotifMessage.trim(),
      type: editNotifType,
      link: editNotifLink.trim() || undefined,
      titles: translations.titles,
      messages: translations.messages
    });

    setEditingNotif(null);
    onNotify('নোটিশটি সফলভাবে এডিট ও আপডেট করা হয়েছে!');
  };

  const handleDeleteNotification = (id: string, title: string) => {
    if (window.confirm(`আপনি কি "${title}" নোটিশটি স্থায়ীভাবে ডিলিট করতে চান?`)) {
      deleteNotification(id);
      onNotify('নোটিশটি ডিলিট করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-red-500/40 rounded-3xl shadow-2xl shadow-red-600/30 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/60 via-[#181820] to-[#121217] border-b border-[#25252d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  ROBIXHUNTER ADMIN PANEL
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  FULL ACCESS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                বিজ্ঞাপন যোগ/এডিট/ডিলিট, নোটিশ ব্রডকাস্ট, ফটো ও সোশ্যাল লিংক কন্ট্রোল করুন
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white text-zinc-400 flex items-center justify-center transition-colors"
            title="প্যানেল বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#25252d] bg-[#14141a] px-3 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'ads', label: '📢 বিজ্ঞাপন (Ads)', icon: Megaphone },
            { id: 'notices', label: '🔔 নোটিশ সেন্ডার (Notices)', icon: Bell },
            { id: 'branding', label: '👑 ফটো ও নাম (Photo & Name)', icon: Sliders },
            { id: 'socials', label: '🔗 সোশ্যাল লিংক', icon: Share2 },
            { id: 'domain', label: '🌐 ডোমেইন ও গুগল সার্চ (Domain & SEO)', icon: Globe },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all duration-150 active:scale-95 shrink-0 ${
                  active
                    ? 'border-red-500 text-white bg-[#1a1a24] shadow-sm'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* ADS MANAGER TAB */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              {/* Header with "Add New Ad" Button */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#16161d] border border-[#2a2a35]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-400" />
                    সক্রিয় বিজ্ঞাপনের তালিকা ({config.adsList.length}টি ব্যানার অ্যাড)
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    আপনার দেওয়া মূল ব্যানারটি ছাড়া বাকি সব ক্লিয়ার করা হয়েছে। আপনি চাইলে আরও অ্যাড যোগ/এডিট/ডিলিট করতে পারেন।
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 hover:brightness-110 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> নতুন অ্যাড যোগ করুন
                </button>
              </div>

              {/* Add New Ad Form Modal */}
              {showAddModal && (
                <form
                  onSubmit={handleCreateAd}
                  className="p-4 rounded-2xl bg-[#181822] border-2 border-dashed border-red-500/50 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#2a2a35]">
                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-red-400" /> নতুন বিজ্ঞাপন যোগ করুন:
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      বাতিল (Cancel)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        বিজ্ঞাপনের নাম (Ad Title):
                      </label>
                      <input
                        type="text"
                        value={newAdTitle}
                        onChange={(e) => setNewAdTitle(e.target.value)}
                        placeholder="যেমন: My Custom Banner Ad"
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        কোথায় বসবে (Ad Placement):
                      </label>
                      <select
                        value={newAdPlacement}
                        onChange={(e) => setNewAdPlacement(e.target.value as any)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="top">উপরে হেডারে (Top Header)</option>
                        <option value="middle">মাঝের কনটেন্টে (In-Feed Middle)</option>
                        <option value="bottom">একদম নিচে (Bottom Footer)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      বিজ্ঞাপনের সম্পূর্ণ স্ক্রিপ্ট বা কোড (Ad Code / Script):
                    </label>
                    <textarea
                      rows={3}
                      value={newAdCode}
                      onChange={(e) => setNewAdCode(e.target.value)}
                      placeholder="<script>...</script>"
                      className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl p-3 text-xs font-mono text-zinc-300 focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                    >
                      বন্ধ
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                    >
                      অ্যাড সেভ করুন
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Ad Form Modal */}
              {editingAd && (
                <form
                  onSubmit={handleUpdateAd}
                  className="p-4 rounded-2xl bg-[#1b1b26] border-2 border-amber-500/50 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#2a2a35]">
                    <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Edit className="w-3.5 h-3.5" /> বিজ্ঞাপন এডিট করুন:
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingAd(null)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      বন্ধ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        বিজ্ঞাপনের নাম:
                      </label>
                      <input
                        type="text"
                        value={editingAd.title}
                        onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        কোথায় বসবে (Placement):
                      </label>
                      <select
                        value={editingAd.placement}
                        onChange={(e) => setEditingAd({ ...editingAd, placement: e.target.value as any })}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="top">উপরে হেডারে (Top Header)</option>
                        <option value="middle">মাঝের কনটেন্টে (In-Feed Middle)</option>
                        <option value="bottom">একদম নিচে (Bottom Footer)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      বিজ্ঞাপনের কোড/স্ক্রিপ্ট:
                    </label>
                    <textarea
                      rows={3}
                      value={editingAd.code}
                      onChange={(e) => setEditingAd({ ...editingAd, code: e.target.value })}
                      className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl p-3 text-xs font-mono text-zinc-300 focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingAd(null)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500"
                    >
                      আপডেট করুন
                    </button>
                  </div>
                </form>
              )}

              {/* List of Existing Ads with Edit, Delete and Toggle */}
              <div className="space-y-2.5">
                {config.adsList.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-3.5 rounded-2xl bg-[#16161d] border border-[#25252d] flex items-center justify-between gap-3 hover:border-[#353545] transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ad.enabled ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-zinc-600'}`} />
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {ad.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
                          {ad.placement === 'top' ? 'Top Header' : ad.placement === 'middle' ? 'Middle Feed' : 'Bottom Footer'}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 truncate mt-1 max-w-sm">
                        {ad.code.substring(0, 70)}...
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Toggle On/Off */}
                      <button
                        onClick={() => toggleAd(ad.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          ad.enabled
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}
                        title={ad.enabled ? 'অ্যাড বন্ধ করুন' : 'অ্যাড চালু করুন'}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">{ad.enabled ? 'ON' : 'OFF'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingAd(ad)}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 transition-all"
                        title="এই অ্যাডটি এডিট করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteAd(ad.id, ad.title)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition-all"
                        title="এই অ্যাডটি ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {config.adsList.length === 0 && (
                  <div className="p-8 text-center rounded-2xl bg-[#16161d] border border-dashed border-zinc-700 text-zinc-400 text-xs">
                    কোনো সক্রিয় ব্যানার অ্যাড নেই। উপরে <strong>"নতুন অ্যাড যোগ করুন"</strong> বাটনে ক্লিক করে অ্যাড যুক্ত করুন।
                  </div>
                )}
              </div>

              {/* Social Bar Global Script Ad (Ad 2) */}
              <div className="p-4 rounded-2xl bg-[#16161d] border border-[#2a2a35] space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      ২নং অ্যাড: সোশ্যাল বার স্ক্রিপ্ট (Social Bar Ad)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      আপনার দেওয়া সোশ্যাল বার অ্যাড চালু/বন্ধ বা এডিট করুন
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.socialAdEnabled}
                      onChange={(e) => setFormData({ ...formData, socialAdEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#25252d]">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Social Bar Ad Script URL:
                  </label>
                  <input
                    type="text"
                    value={formData.socialAdScriptUrl}
                    onChange={(e) => setFormData({ ...formData, socialAdScriptUrl: e.target.value })}
                    className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Adsterra Direct Link (5s Copy Monetization) Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1418] to-[#14141d] border border-amber-500/30 space-y-3 mt-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-amber-400" />
                      💰 Adsterra Direct Link (৫ সেকেন্ড কপি মনিটাইজেশন)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      ইউজার কপি বাটনে চাপলে অ্যাডস্টাররা ডিরেক্ট লিংক নতুন পেজে ওপেন হবে এবং ৫ সেকেন্ড পর নাম কপি হবে
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.directLinkEnabled}
                      onChange={(e) => setFormData({ ...formData, directLinkEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#25252d]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-300">
                        Adsterra Direct Link URL (আপনার ডিরেক্ট লিংক):
                      </label>
                      {formData.directLinkUrl && (
                        <a
                          href={formData.directLinkUrl.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          লিংক টেস্ট করুন
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.directLinkUrl}
                      onChange={(e) => setFormData({ ...formData, directLinkUrl: e.target.value })}
                      placeholder="আপনার নতুন ডিরেক্ট লিংক পেস্ট করুন..."
                      className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                    />
                    <div className="mt-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse" />
                      <span><strong>স্মার্টলিংক সক্রিয়:</strong> ইউজার কপি বাটনে চাপলেই ৫ সেকেন্ড হিউম্যান ভেরিফিকেশন শুরু হবে এবং নতুন ট্যাবে বিজ্ঞাপন ওপেন হয়ে আপনার একাউন্টে সর্বোচ্চ আর্নিং জমা হবে।</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#0d0d10] p-2.5 rounded-xl border border-[#25252d]">
                    <span className="text-xs text-zinc-300 font-semibold">
                      টাইমার সময় (কত সেকেন্ড অপেক্ষা করবে):
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formData.countdownSeconds || 5}
                        onChange={(e) => setFormData({ ...formData, countdownSeconds: Math.max(1, parseInt(e.target.value) || 5) })}
                        className="w-16 bg-[#181822] border border-[#353545] rounded-lg px-2 py-1 text-xs text-center text-white font-bold focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs text-zinc-400 font-bold">সেকেন্ড</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRANDING TAB (Header Photo, Name, Subtitle, Badge) */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              {/* Header Photo Management Card */}
              <div className="p-4 rounded-2xl bg-[#16161d] border border-[#2a2a35] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-red-400" />
                      হেডার ফটো কন্ট্রোল (Profile / Mascot Photo)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      উপরের ফটো পরিবর্তন, ডিলিট বা নিজের ফটো আপলোড করুন
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-400 font-semibold">
                      {formData.showLogo ? 'ছবি প্রদর্শিত' : 'ছবি লুকানো'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showLogo}
                        onChange={(e) => setFormData({ ...formData, showLogo: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>

                {/* Photo Preview and Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-[#0d0d10] border border-[#25252d]">
                  <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] shadow-md shadow-red-600/40 shrink-0">
                    {formData.brandLogo ? (
                      <img
                        src={formData.brandLogo}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <div className="w-full h-full rounded-[14px] bg-zinc-900 flex items-center justify-center text-zinc-500 text-xs text-center font-bold">
                        ফটো নেই
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-black/80 border border-red-500/40 rounded-full p-1 text-red-400">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <Upload className="w-3.5 h-3.5" /> ডিভাইস থেকে ছবি আপলোড
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, brandLogo: '' }));
                          onNotify('ফটো রিমুভ করা হয়েছে!');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-950 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> ফটো ডিলিট/মুছে ফেলুন
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, brandLogo: BRAND_LOGO, showLogo: true }));
                          onNotify('ডিফল্ট ফটো রিস্টোর করা হয়েছে!');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> আগের ছবি ফিরিয়ে আনুন
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                        অথবা সরাসরি ছবির ওয়েব লিংক (Image URL) পেস্ট করুন:
                      </label>
                      <input
                        type="text"
                        value={formData.brandLogo}
                        onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                        placeholder="https://i.postimg.cc/.../photo.png"
                        className="w-full bg-[#14141a] border border-[#2d2d38] rounded-xl px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Title & Subtitle Card */}
              <div className="p-4 rounded-2xl bg-[#16161d] border border-[#2a2a35] space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-400" />
                  হেডার নাম ও সাবটাইটেল কন্ট্রোল (Website Title & Subtitle)
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      ওয়েবসাইটের নাম (Website Name / Title):
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      placeholder="যেমন: 亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗"
                      className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3.5 py-2 text-sm text-white focus:border-red-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      সাবটাইটেল (Subtitle Description):
                    </label>
                    <input
                      type="text"
                      value={formData.brandSubtitle}
                      onChange={(e) => setFormData({ ...formData, brandSubtitle: e.target.value })}
                      placeholder="যেমন: Free Fire styles web • Nickname Maker"
                      className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        ব্যাজ ট্যাগ লেখা (Badge Tag Text):
                      </label>
                      <input
                        type="text"
                        value={formData.brandBadge}
                        onChange={(e) => setFormData({ ...formData, brandBadge: e.target.value })}
                        placeholder="FF PRO, VIP, RX"
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-start sm:gap-4 pt-4">
                      <span className="text-xs font-semibold text-zinc-300">
                        ব্যাজ প্রদর্শন করবেন?
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showBadge}
                          onChange={(e) => setFormData({ ...formData, showBadge: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="p-4 rounded-2xl bg-[#16161d] border border-[#2a2a35] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-400" />
                      টপ নোটিশ বার (Announcement Bar)
                    </h3>
                    <p className="text-xs text-zinc-400">
                      ভিজিটরদের জন্য সাইটের একদম উপরে কোনো নোটিশ দেখাতে চাইলে
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showAnnouncement}
                      onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {formData.showAnnouncement && (
                  <textarea
                    rows={2}
                    value={formData.announcement}
                    onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                    placeholder="নোটিশের লেখা লিখুন..."
                    className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl p-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* SOCIALS TAB */}
          {activeTab === 'socials' && (
            <div className="p-4 rounded-2xl bg-[#16161d] border border-[#2a2a35] space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">
                সোশ্যাল মিডিয়া পেজ ও গ্রুপ লিংক পরিবর্তন করুন:
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-red-400 mb-1">
                    YouTube Channel Link:
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-400 mb-1">
                    Telegram Channel Link:
                  </label>
                  <input
                    type="text"
                    value={formData.telegramUrl}
                    onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                    className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NOTICES MANAGER TAB */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#16161d] border border-[#2a2a35]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-400" />
                    নোটিশ ব্রডকাস্ট সিস্টেম ({config.notificationsList?.length || 0}টি নোটিশ পাঠানো হয়েছে)
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    এখানে নতুন নোটিশ সেন্ড করলে সকল ইউজারের ফোনের নোটিফিকেশন সেন্টারে আনসিন কাউন্ট সহ চলে যাবে।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddNotifModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 hover:brightness-110 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> নতুন নোটিশ পাঠান
                </button>
              </div>

              {/* Add New Notice Form */}
              {showAddNotifModal && (
                <form
                  onSubmit={handleSendNotification}
                  className="p-4 sm:p-5 rounded-2xl bg-[#181824] border-2 border-dashed border-red-500/50 space-y-3.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#2a2a35]">
                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-red-400" /> সবার ফোনে নোটিশ সেন্ড করুন:
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddNotifModal(false)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      বাতিল (Cancel)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        নোটিশ টাইটেল (বাংলা / দেশীয় ভাষা) *:
                      </label>
                      <input
                        type="text"
                        value={newNotifTitle}
                        onChange={(e) => setNewNotifTitle(e.target.value)}
                        placeholder="যেমন: নতুন ভিআইপি নাম যোগ হয়েছে!"
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Notice Title (English - ঐচ্ছিক):
                      </label>
                      <input
                        type="text"
                        value={newNotifTitleEn}
                        onChange={(e) => setNewNotifTitleEn(e.target.value)}
                        placeholder="e.g. New VIP Nicknames Added!"
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        নোটিশ বার্তা (বাংলা / মূল বার্তা) *:
                      </label>
                      <textarea
                        rows={2}
                        value={newNotifMessage}
                        onChange={(e) => setNewNotifMessage(e.target.value)}
                        placeholder="নোটিশের বিস্তারিত কথা এখানে লিখুন..."
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Notice Message (English - ঐচ্ছিক):
                      </label>
                      <textarea
                        rows={2}
                        value={newNotifMessageEn}
                        onChange={(e) => setNewNotifMessageEn(e.target.value)}
                        placeholder="Detailed notice text in English..."
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        নোটিশ টাইপ / ক্যাটাগরি:
                      </label>
                      <select
                        value={newNotifType}
                        onChange={(e) => setNewNotifType(e.target.value as any)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="vip">👑 VIP Style (ভিআইপি আপডেট)</option>
                        <option value="update">⚡ Game Update (গেম আপডেট)</option>
                        <option value="reward">🎁 Giveaway / Reward (পুরস্কার)</option>
                        <option value="announcement">📢 Announcement (সাধারণ ঘোষণা)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        অ্যাকশন লিংক (ঐচ্ছিক - YouTube/Telegram link):
                      </label>
                      <input
                        type="url"
                        value={newNotifLink}
                        onChange={(e) => setNewNotifLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/40 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> সবার ফোনে সেন্ড করুন (Broadcast Now)
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Existing Notice Form Modal */}
              {editingNotif && (
                <form
                  onSubmit={handleSaveEditedNotification}
                  className="p-4 sm:p-5 rounded-2xl bg-[#1b1722] border-2 border-amber-500/60 space-y-3.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#2a2a35]">
                    <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Edit className="w-3.5 h-3.5" /> নোটিশ এডিট করুন (Edit Notice):
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingNotif(null)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      বাতিল (Cancel)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        নোটিশ টাইটেল (বাংলা / মূল ভাষা) *:
                      </label>
                      <input
                        type="text"
                        value={editNotifTitle}
                        onChange={(e) => setEditNotifTitle(e.target.value)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Notice Title (English):
                      </label>
                      <input
                        type="text"
                        value={editNotifTitleEn}
                        onChange={(e) => setEditNotifTitleEn(e.target.value)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        নোটিশ বার্তা (বাংলা / মূল বার্তা) *:
                      </label>
                      <textarea
                        rows={2}
                        value={editNotifMessage}
                        onChange={(e) => setEditNotifMessage(e.target.value)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Notice Message (English):
                      </label>
                      <textarea
                        rows={2}
                        value={editNotifMessageEn}
                        onChange={(e) => setEditNotifMessageEn(e.target.value)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        নোটিশ টাইপ / ক্যাটাগরি:
                      </label>
                      <select
                        value={editNotifType}
                        onChange={(e) => setEditNotifType(e.target.value as any)}
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="vip">👑 VIP Style (ভিআইপি আপডেট)</option>
                        <option value="update">⚡ Game Update (গেম আপডেট)</option>
                        <option value="reward">🎁 Giveaway / Reward (পুরস্কার)</option>
                        <option value="announcement">📢 Announcement (সাধারণ ঘোষণা)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        অ্যাকশন লিংক (ঐচ্ছিক):
                      </label>
                      <input
                        type="url"
                        value={editNotifLink}
                        onChange={(e) => setEditNotifLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#0d0d10] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingNotif(null)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 transition-colors"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" /> আপডেট সেভ করুন (Save Changes)
                    </button>
                  </div>
                </form>
              )}

              {/* List of Sent Notifications */}
              <div className="space-y-2.5">
                {config.notificationsList?.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-2xl bg-[#14141d] border border-[#262635] flex items-start justify-between gap-3 hover:border-zinc-700 transition-all"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 border border-red-500/30 text-red-400 uppercase">
                          {notif.type}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {notif.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-2">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <a
                          href={notif.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:underline pt-0.5"
                        >
                          {notif.link} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Broadcast / Resend to Phones Button */}
                      <button
                        type="button"
                        onClick={() => {
                          broadcastNotification(notif.id);
                          onNotify('সবার ফোনে নোটিশ ব্রডকাস্ট পাঠানো হয়েছে!');
                        }}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 transition-all"
                        title="সবার ফোনে নোটিশ ব্রডকাস্ট করুন"
                      >
                        <Radio className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEditNotification(notif)}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 transition-all"
                        title="এই নোটিশটি এডিট করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteNotification(notif.id, notif.title)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-600 hover:text-white text-zinc-400 border border-white/5 transition-all"
                        title="নোটিশ মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!config.notificationsList || config.notificationsList.length === 0) && (
                  <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-[#252533] rounded-2xl">
                    এখনও কোনো নোটিশ পাঠানো হয়নি। উপরের "নতুন নোটিশ পাঠান" বাটনে চাপুন।
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DOMAIN & GOOGLE SEO / HOSTING TAB */}
          {activeTab === 'domain' && (
            <div className="space-y-4">
              {/* Primary Domain Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-950/60 via-[#181824] to-[#12121a] border border-red-500/40 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-md">
                      <Globe className="w-6 h-6 stroke-[2.2] animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">
                        OFFICIAL DOMAIN NAME
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                        www.rxgenaretor.com
                      </h3>
                      <p className="text-xs text-zinc-400">
                        আপনার কাঙ্ক্ষিত শর্ট ও প্রফেশনাল ডোমেইন
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.rxgenaretor.com');
                      onNotify('ডোমেইন লিংক কপি হয়েছে: www.rxgenaretor.com');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all shrink-0 active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" /> কপি করুন
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-mono text-red-300">https://www.rxgenaretor.com/</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    SEO কনফিগারেশন সক্রিয়
                  </span>
                </div>
              </div>

              {/* Current Live Cloud Hosting Status */}
              <div className="p-4 rounded-2xl bg-[#161622] border border-[#2a2a38] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      সার্ভার হোস্টিং স্ট্যাটাস (Live Cloud Hosting)
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    🟢 ২৪/৭ অনলাইন ও লাইভ
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  আপনার ওয়েবসাইটটি ক্লাউড সার্ভারে ২৪ ঘণ্টা লাইভ হোস্ট করা আছে। যেকোনো দেশের যে কেউ এই লিঙ্কে ঢুকলে তাৎক্ষণিকভাবে আপনার পুরো সাইট দেখতে পাবে।
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 block">
                    বর্তমান পাবলিক হোস্টেড লিঙ্ক (Shared Live App URL):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://ais-pre-w4sixtqq6allz6aoahhd2j-537231097329.asia-southeast1.run.app"
                      className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('https://ais-pre-w4sixtqq6allz6aoahhd2j-537231097329.asia-southeast1.run.app');
                        onNotify('লাইভ ক্লাউড হোস্ট লিঙ্ক কপি হয়েছে!');
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" /> কপি
                    </button>
                    <a
                      href="https://ais-pre-w4sixtqq6allz6aoahhd2j-537231097329.asia-southeast1.run.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all"
                      title="নতুন ট্যাবে সাইট খুলুন"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Search Ranking & SEO Steps */}
              <div className="p-4 rounded-2xl bg-[#161622] border border-[#2a2a38] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  গুগল ক্রোম ও সার্চে সবার সামনে নিয়ে আসার উপায় (Google SEO Checklist)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> মেটা ট্যাগ ও কীওয়ার্ডস
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      `rx generator`, `www.rxgenaretor.com`, `free fire stylish name` সহ ২০+ হাই-র‍্যাঙ্কিং সার্চ কীওয়ার্ড কোডে সেট করা হয়েছে।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> গুগল সাইটম্যাপ ও রোবটস
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      `/sitemap.xml` এবং `/robots.txt` কনফিগার করা হয়েছে যাতে গুগল ক্রোম ক্রলার দ্রুত সাইটটি রিড করতে পারে।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> সোশ্যাল কার্ড ও থিম
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      WhatsApp, Facebook ও Twitter-এ লিংক দিলে ব্র্যান্ডেড প্রিভিউ কার্ড এবং ছবি স্বয়ংক্রিয়ভাবে শো করবে।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" /> স্কিমা ডট ওআরজি (JSON-LD)
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Google Rich Result স্নিপেট যুক্ত করা হয়েছে যাতে সার্চ রেজাল্টে প্রফেশনাল অ্যাপ ব্যাজ দেখায়।
                    </p>
                  </div>
                </div>

                {/* Google Search Console Direct Instruction */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 to-black border border-red-500/30 space-y-2">
                  <h5 className="text-xs font-bold text-white flex items-center justify-between">
                    <span>🚀 গুগল সার্চে দ্রুত র‍্যাঙ্ক করার জন্য করণীয়:</span>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-red-400 hover:text-red-300 underline inline-flex items-center gap-1"
                    >
                      Google Search Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </h5>
                  <ol className="list-decimal list-inside text-[11px] text-zinc-300 space-y-1">
                    <li><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-red-300 underline font-semibold">Google Search Console</a> এ যান এবং আপনার জিমেইল দিয়ে লগইন করুন।</li>
                    <li>"Add Property" তে আপনার ডোমেইন <strong className="text-white">www.rxgenaretor.com</strong> অথবা ক্লাউড লিঙ্কটি পেস্ট করুন।</li>
                    <li>"URL Inspection" এ গিয়ে "Request Indexing" বাটনে চাপুন। গুগল ২৪-৪৮ ঘণ্টার মধ্যে সাইটটিকে ক্রোম সার্চের প্রথমে নিয়ে আসবে!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#14141a] border-t border-[#25252d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ডিফল্ট করুন
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all w-full sm:w-auto justify-center"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> সেটিংস সেভ হয়েছে!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> সেভ করুন (Save Changes)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
