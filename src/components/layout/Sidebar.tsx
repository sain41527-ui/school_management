import React from 'react';
import { Compass, GraduationCap, X } from 'lucide-react';
import { ROLE_NAV_ITEMS } from '../../config/navigation';
import { NavPageId, RoleProfile, UserRole } from '../../types/school';

interface SidebarProps {
  schoolName: string;
  role: UserRole;
  profile: RoleProfile;
  onRoleChange: (role: UserRole) => void;
  activePage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadMessagesCount: number;
  cartItemCount: number;
  onOpenGateway: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  schoolName,
  role,
  profile,
  onRoleChange,
  activePage,
  onSelectPage,
  collapsed,
  mobileOpen,
  onCloseMobile,
  unreadMessagesCount,
  cartItemCount,
  onOpenGateway,
}) => {
  const navItems = ROLE_NAV_ITEMS[role];

  const handleNavClick = (pageId: NavPageId) => {
    onSelectPage(pageId);
    onCloseMobile();
  };

  const renderSidebarInner = (isMobile: boolean) => {
    const isCompact = collapsed && !isMobile;

    return (
      <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* School Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="flex min-w-0 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!isCompact && (
              <div className="min-w-0">
                <span className="block truncate font-display text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {schoolName}
                </span>
                <span className="block truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Artificial Pro ERP
                </span>
              </div>
            )}
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Role Switcher */}
        {!isCompact ? (
          <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-800">
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80">
              {(['admin', 'teacher', 'student'] as UserRole[]).map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onRoleChange(r)}
                    className={`rounded-md px-2 py-1.5 text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 truncate px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {profile.panelTitle}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 border-b border-slate-200 py-2.5 dark:border-slate-800">
            {(['admin', 'teacher', 'student'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                title={`Switch to ${r} panel`}
                onClick={() => onRoleChange(r)}
                className={`flex h-7 w-9 items-center justify-center rounded text-[11px] font-bold uppercase transition-colors ${
                  role === r
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {r[0]}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3" aria-label="Primary sidebar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const badgeCount =
              item.id === 'messages'
                ? unreadMessagesCount
                : item.id === 'bookstore'
                  ? cartItemCount
                  : 0;

            return (
              <button
                key={item.id}
                type="button"
                title={isCompact ? item.label : undefined}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isCompact ? 'justify-center px-2' : ''
                } ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : item.iconColor
                  }`}
                />
                {!isCompact && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="font-mono text-[11px] font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                        {badgeCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Portal Gateway Switcher */}
        <div className="shrink-0 border-t border-slate-200 p-2.5 dark:border-slate-800">
          <button
            type="button"
            onClick={onOpenGateway}
            title="Open ERP Portal Launcher"
            className={`flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 ${
              isCompact ? 'justify-center px-2' : ''
            }`}
          >
            <Compass className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            {!isCompact && <span className="truncate">Open ERP Gateway</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 transition-all duration-200 lg:block ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderSidebarInner(false)}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-[272px] max-w-[85vw]">
            {renderSidebarInner(true)}
          </aside>
        </div>
      )}
    </>
  );
};
