import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Notification } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from '../hooks/apiBaseUrl';

type NotificationBellProps = {
  token: string;
};

export function NotificationBell({ token }: NotificationBellProps) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/notifications/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await res.json()) as { items?: Notification[]; unread_count?: number };
      setNotifications(data.items ?? []);
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    void fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(() => void fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`${apiBaseUrl}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await fetch(`${apiBaseUrl}/api/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'alert': return '🚨';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95"
      >
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-rose-500 text-[10px] font-bold text-white px-1 shadow-lg shadow-rose-500/50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0f1c]/95 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => void markAllRead()}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t('notifications.mark_all_read')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-slate-400">{t('notifications.no_notifications')}</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => !notif.is_read && void markAsRead(notif.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-white/5 ${
                    !notif.is_read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-base shrink-0 mt-0.5">{typeIcon(notif.type)}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${notif.is_read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{notif.body}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
