import React, { useEffect, useState } from 'react';
import { Camera, Check, KeyRound, Moon, School, Sun, User, Users } from 'lucide-react';
import { ASSETS } from '../../data/mockSchoolData';
import { RoleProfile, UserRole } from '../../types/school';
import { SafeImage } from '../ui/SafeImage';

interface SettingsProfileViewProps {
  mode: 'settings' | 'profile';
  role: UserRole;
  profile: RoleProfile;
  schoolName: string;
  onUpdateSchoolName: (name: string) => void;
  onUpdateProfile: (role: UserRole, updated: RoleProfile) => void;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToast: (title: string, description?: string) => void;
}

const PRESET_AVATARS = [
  { label: 'Principal Portrait', url: ASSETS.adminAvatar },
  { label: 'Faculty Portrait', url: ASSETS.teacherAvatar },
  { label: 'Student Portrait', url: ASSETS.studentAvatar },
];

export const SettingsProfileView: React.FC<SettingsProfileViewProps> = ({
  mode,
  role,
  profile,
  schoolName,
  onUpdateSchoolName,
  onUpdateProfile,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  onToast,
}) => {
  const [tab, setTab] = useState<'profile' | 'school' | 'password' | 'theme'>(
    mode === 'profile' ? 'profile' : 'school'
  );

  useEffect(() => {
    setTab(mode === 'profile' ? 'profile' : 'school');
  }, [mode]);

  const [draftSchoolName, setDraftSchoolName] = useState(schoolName);
  const [schoolEmail, setSchoolEmail] = useState('admissions@thormbirds.edu');
  const [academicYear, setAcademicYear] = useState('2026–2027 (Fall Term)');

  const [fullName, setFullName] = useState(profile.userName);
  const [userTitle, setUserTitle] = useState(profile.userTitle);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [departmentOrCohort, setDepartmentOrCohort] = useState(profile.departmentOrCohort);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);

  useEffect(() => {
    setFullName(profile.userName);
    setUserTitle(profile.userTitle);
    setEmail(profile.email);
    setPhone(profile.phone);
    setDepartmentOrCohort(profile.departmentOrCohort);
    setAvatarPreview(profile.avatar);
  }, [profile]);

  useEffect(() => {
    setDraftSchoolName(schoolName);
  }, [schoolName]);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
        onToast('Photo Loaded', 'Click Save Profile Changes to apply your new photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onUpdateProfile(role, {
      ...profile,
      userName: fullName.trim(),
      userTitle: userTitle.trim() || profile.userTitle,
      email: email.trim(),
      phone: phone.trim(),
      departmentOrCohort: departmentOrCohort.trim(),
      avatar: avatarPreview,
    });
    onToast('Profile Updated', `Changes saved for ${fullName.trim()}.`);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New password and confirmation do not match.');
      return;
    }
    setPwdError('');
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    onToast('Password Updated', 'Your security credentials have been updated.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {mode === 'profile' ? 'Profile & Account Switcher' : 'System & Academy Settings'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edit your profile details, upload a new profile photo, switch active accounts, or manage{' '}
          {schoolName} preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setTab('profile')}
          className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'profile'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Edit Profile & Photo</span>
        </button>
        {role === 'admin' && (
          <button
            type="button"
            onClick={() => setTab('school')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === 'school'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <School className="h-3.5 w-3.5" />
            <span>Academy Profile</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'password'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Password</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('theme')}
          className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'theme'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {darkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          <span>Theme</span>
        </button>
      </div>

      {/* Edit Profile & Switcher */}
      {tab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleSaveProfile}
            className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Photo Change Block */}
            <div className="flex flex-wrap items-center gap-5 border-b border-slate-200 pb-5 dark:border-slate-800">
              <SafeImage
                src={avatarPreview}
                alt={fullName}
                className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="min-w-0 flex-1 space-y-2.5">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                    {fullName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {userTitle} · {schoolName}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700">
                    <Camera className="h-3.5 w-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-1.5">
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        title={`Use ${preset.label}`}
                        onClick={() => setAvatarPreview(preset.url)}
                        className={`relative h-8 w-8 overflow-hidden rounded-lg border transition-all ${
                          avatarPreview === preset.url
                            ? 'border-indigo-600 ring-2 ring-indigo-500/40'
                            : 'border-slate-200 opacity-75 hover:opacity-100 dark:border-slate-700'
                        }`}
                      >
                        <SafeImage
                          src={preset.url}
                          alt={preset.label}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Role Title / Designation
                </label>
                <input
                  type="text"
                  value={userTitle}
                  onChange={(e) => setUserTitle(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Department / Cohort Track
                </label>
                <input
                  type="text"
                  value={departmentOrCohort}
                  onChange={(e) => setDepartmentOrCohort(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Switch Active Account Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                Change Active Profile
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Switch between Administrator, Faculty, and Student portal profiles anytime.
            </p>

            <div className="mt-4 space-y-2.5">
              {(['admin', 'teacher', 'student'] as UserRole[]).map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onRoleChange(r)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200'
                    }`}
                  >
                    <span className="capitalize">{r} Profile</span>
                    <span>{active ? 'Active' : 'Switch'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Academy Settings */}
      {tab === 'school' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draftSchoolName.trim()) return;
            onUpdateSchoolName(draftSchoolName.trim());
            onToast('Academy Profile Saved', `${draftSchoolName.trim()} configuration updated.`);
          }}
          className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Academy Profile
          </h2>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Academy Name
            </label>
            <input
              type="text"
              value={draftSchoolName}
              onChange={(e) => setDraftSchoolName(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Official Contact Email
              </label>
              <input
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Active Academic Term
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save Academy Profile
            </button>
          </div>
        </form>
      )}

      {tab === 'password' && (
        <form
          onSubmit={handlePasswordSubmit}
          className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Change Account Password
          </h2>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          {pwdError && <p className="text-xs font-medium text-rose-600">{pwdError}</p>}
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Update Password
          </button>
        </form>
      )}

      {tab === 'theme' && (
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Interface Appearance
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Switch between Light SaaS canvas and Dark Slate workspace mode
          </p>

          <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Applied across all Admin, Teacher, and Student panels
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
