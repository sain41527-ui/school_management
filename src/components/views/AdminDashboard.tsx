import React from 'react';
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckSquare,
  CreditCard,
  FolderKanban,
  GraduationCap,
  School,
  UserCheck,
  Wallet,
} from 'lucide-react';
import {
  AttendanceRecord,
  CourseRecord,
  FeeRecord,
  NavPageId,
  NotificationItem,
  SchoolClassRecord,
  SchoolEvent,
  StudentRecord,
  TeacherRecord,
} from '../../types/school';
import { AttendanceOverviewChart, MonthlyRevenueChart } from '../charts/DashboardCharts';
import { StatusText } from '../ui/StatusText';

interface AdminDashboardProps {
  schoolName: string;
  students: StudentRecord[];
  teachers: TeacherRecord[];
  classes: SchoolClassRecord[];
  courses: CourseRecord[];
  fees: FeeRecord[];
  attendance: AttendanceRecord[];
  events: SchoolEvent[];
  notifications: NotificationItem[];
  darkMode: boolean;
  onNavigate: (page: NavPageId) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  schoolName,
  students,
  teachers,
  classes,
  courses,
  fees,
  attendance,
  events,
  notifications,
  darkMode,
  onNavigate,
}) => {
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = fees.reduce((sum, f) => sum + Math.max(0, f.amount - f.paidAmount), 0);
  const presentToday = attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendancePct =
    attendance.length > 0 ? ((presentToday / attendance.length) * 100).toFixed(1) : '95.8';
  const activeUsers = students.length + teachers.length + 14;

  const kpiCards = [
    {
      label: 'Total Students',
      value: String(248 + students.length),
      sub: '4 new admissions this week',
      icon: GraduationCap,
      iconBg: 'from-blue-600 to-indigo-600',
      accentText: 'text-blue-600 dark:text-blue-400',
      target: 'students' as NavPageId,
    },
    {
      label: 'Total Teachers',
      value: String(28 + teachers.length),
      sub: '5 academic departments',
      icon: UserCheck,
      iconBg: 'from-teal-500 to-emerald-600',
      accentText: 'text-teal-600 dark:text-teal-400',
      target: 'teachers' as NavPageId,
    },
    {
      label: 'Total Classes',
      value: String(classes.length),
      sub: '8 active cohort sections',
      icon: School,
      iconBg: 'from-purple-600 to-violet-600',
      accentText: 'text-purple-600 dark:text-purple-400',
      target: 'classes' as NavPageId,
    },
    {
      label: 'Total Courses',
      value: String(16 + courses.length),
      sub: 'Fall Term 2026 curriculum',
      icon: FolderKanban,
      iconBg: 'from-sky-500 to-blue-600',
      accentText: 'text-sky-600 dark:text-sky-400',
      target: 'courses' as NavPageId,
    },
    {
      label: 'Total Fees Collected',
      value: `$${(135450 + totalCollected).toLocaleString()}`,
      sub: '94.2% collection target met',
      icon: Wallet,
      iconBg: 'from-emerald-500 to-teal-600',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      target: 'fees' as NavPageId,
    },
    {
      label: 'Pending Fees',
      value: `$${totalPending.toLocaleString()}`,
      sub: `${fees.filter((f) => f.status !== 'Paid').length} open invoices`,
      icon: CreditCard,
      iconBg: 'from-amber-500 to-orange-600',
      accentText: 'text-orange-600 dark:text-orange-400',
      target: 'fees' as NavPageId,
    },
    {
      label: "Today's Attendance",
      value: `${attendancePct}%`,
      sub: `${presentToday} of ${attendance.length} sampled present`,
      icon: CheckSquare,
      iconBg: 'from-indigo-600 to-purple-600',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      target: 'attendance' as NavPageId,
    },
    {
      label: 'Active Users',
      value: String(280 + activeUsers),
      sub: 'Students, staff & guardians',
      icon: Activity,
      iconBg: 'from-cyan-500 to-sky-600',
      accentText: 'text-cyan-600 dark:text-cyan-400',
      target: 'reports' as NavPageId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Administrator Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {schoolName} · Fall Term 2026 operational metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('students')}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
          >
            Manage Students
          </button>
          <button
            type="button"
            onClick={() => onNavigate('fees')}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            Collect Fees
          </button>
        </div>
      </div>

      {/* 8 Colorful Responsive KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigate(card.target)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.label}
                </span>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${card.iconBg} text-white shadow-sm`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3">
                <p className="font-display text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
                  {card.value}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className={`text-xs font-medium ${card.accentText}`}>{card.sub}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Attendance Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly campus attendance distribution (%)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Open Log
            </button>
          </div>
          <AttendanceOverviewChart darkMode={darkMode} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Monthly Revenue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tuition collected vs pending receivables ($k)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              View Ledger
            </button>
          </div>
          <MonthlyRevenueChart darkMode={darkMode} />
        </div>
      </div>

      {/* Tables Row: Recent Admissions & Recent Payments */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Recent Admissions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest enrolled student cohorts
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              All Students
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Admitted</th>
                  <th className="px-5 py-3 text-right">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.slice(0, 5).map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                      <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {s.rollNo}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {s.className} · {s.section}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                      {s.admissionDate}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusText status={s.feeStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Recent Payments & Invoices
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bursar fee transactions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Manage Fees
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-4 py-3">Fee Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fees.slice(0, 5).map((f) => (
                  <tr
                    key={f.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {f.studentName}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {f.invoiceNo}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {f.feeType}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                      ${f.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusText status={f.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: Student Statistics + Upcoming Events + Recent Notifications */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Student Statistics by Grade */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Student Statistics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enrollment capacity across grade cohorts
          </p>
          <div className="mt-4 space-y-4">
            {classes.map((c) => {
              const pct = Math.round((c.studentCount / c.capacity) * 100);
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {c.name}
                    </span>
                    <span className="font-mono text-slate-500 tabular-nums dark:text-slate-400">
                      {c.studentCount} / {c.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Upcoming Events
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Calendar
            </button>
          </div>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {events.map((evt) => (
              <div key={evt.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {evt.title}
                  </p>
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {evt.date} · {evt.time} · {evt.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('notices')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              All Notices
            </button>
          </div>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onNavigate(n.targetPage)}
                className="flex w-full flex-col gap-0.5 py-2.5 text-left transition-colors first:pt-0 last:pb-0 hover:text-indigo-600"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {n.title}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{n.detail}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
