import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Button } from '@thihakyaw-leo/ui-components';
import type { EmployeeProfile } from '@thihakyaw-leo/shared-types';
import { apiBaseUrl } from '../hooks/apiBaseUrl';

type ProfilePageProps = {
  token: string;
  onLogout: () => void;
};

export function ProfilePage({ token, onLogout }: ProfilePageProps) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = (await res.json()) as { item?: EmployeeProfile };
        if (data.item) {
          setProfile(data.item);
          setPhone(data.item.phone ?? '');
          setAddress(data.item.address ?? '');
          setEmail(data.item.email ?? '');
        }
      } catch {
        setError('Unable to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/profile/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, address, email })
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to save.');
      }

      setMessage(t('profile.save_changes') + ' ✓');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError(t('profile.password_mismatch'));
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/profile/me/password`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to update password.');
      }

      setMessage(t('profile.password_updated'));
      // Auto logout after password change
      setTimeout(() => onLogout(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <p className="text-sm text-slate-400">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{t('profile.eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">{t('profile.title')}</h1>
      </header>

      {/* Status Messages */}
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
          <p className="text-sm text-emerald-400 text-center">{message}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Read-only Info */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('profile.name')}</p>
              <p className="mt-1 text-sm font-semibold text-white">{profile?.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('profile.employee_code')}</p>
              <p className="mt-1 text-sm font-semibold text-white">{profile?.employee_code}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('profile.role')}</p>
              <p className="mt-1 text-sm font-semibold text-white capitalize">{profile?.role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{t('profile.branch')}</p>
              <p className="mt-1 text-sm font-semibold text-white">{profile?.branch_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Profile Fields */}
      <Card>
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">{t('profile.personal_info')}</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">{t('profile.phone')}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('profile.phone_placeholder')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/50"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">{t('profile.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('profile.email_placeholder')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/50"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">{t('profile.address')}</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('profile.address_placeholder')}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/50 resize-none"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSaving}>
              {isSaving ? t('profile.saving') : t('profile.save_changes')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-amber-500/20">
        <CardContent className="p-5">
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full text-left text-sm font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors"
          >
            {t('profile.change_password')} {showPasswordForm ? '▲' : '▼'}
          </button>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label htmlFor="profile-current-pw" className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">{t('profile.current_password')}</label>
                <input
                  id="profile-current-pw"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  title={t('profile.current_password')}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/50"
                />
              </div>
              <div>
                <label htmlFor="profile-new-pw" className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">{t('profile.new_password')}</label>
                <input
                  id="profile-new-pw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  title={t('profile.new_password')}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/50"
                />
              </div>
              <div>
                <label htmlFor="profile-confirm-pw" className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-2">{t('profile.confirm_password')}</label>
                <input
                  id="profile-confirm-pw"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  title={t('profile.confirm_password')}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/50"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSaving}>
                {t('profile.update_password')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
