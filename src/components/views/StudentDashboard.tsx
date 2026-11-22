import React from 'react';
import {
  Award,
  BookOpen,
  CalendarClock,
  CheckSquare,
  CreditCard,
  FileText,
  ShoppingBag,
} from 'lucide-react';
import {
  BookIssueRecord,
  ExamResultRecord,
  FeeRecord,
  HomeworkAssignment,
  NavPageId,
  NoticeItem,
  RoleProfile,
  SchoolEvent,
  StoreBook,
  TimetableSlot,
} from '../../types/school';
import { StudentPerformanceChart } from '../charts/DashboardCharts';
import { SafeImage } from '../ui/SafeImage';
import { StatusText } from '../ui/StatusText';

interface StudentDashboardProps {
  profile: RoleProfile;
  homework: HomeworkAssignment[];
  results: ExamResultRecord[];
  fees: FeeRecord[];
  timetable: TimetableSlot[];
  bookIssues: BookIssueRecord[];
  storeBooks: StoreBook[];
  notices: NoticeItem[];
  events: SchoolEvent[];
  darkMode: boolean;
  onNavigate: (page: NavPageId) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  homework,
  results,
  fees,
  timetable,
  bookIssues,
  storeBooks,
  notices,
  events,
  darkMode,
  onNavigate,
}) => {
  const myResults = results.filter((r) => r.studentId === 'stu-1');
  const myFees = fees.filter((f) => f.studentId === 'stu-1');
  const myPendingFees = myFees.reduce((sum, f) => sum + Math.max(0, f.amount - f.paidAmount), 0);
  const myTimetable = timetable.filter((t) => t.className === 'Grade 11' && t.day === 'Monday');

  const kpis = [
    {
      label: 'Attendance Rate',
      value: '96.4%',
      sub: '48 of 50 days present',
      icon: CheckSquare,
      bg: 'from-emerald-500 to-teal-600',
      target: 'attendance' as NavPageId,
    },
    {
      label: 'Current GPA',
      value: '3.92',
      sub: 'Term 1 Honor Roll',
      icon: Award,
      bg: 'from-indigo-600 to-blue-600',
      target: 'results' as NavPageId,
    },
    {
      label: 'Open Homework',
      value: String(homework.filter((h) => h.studentStatus === 'Pending').length),
      sub: 'Due this week',
      icon: FileText,
      bg: 'from-amber-500 to-orange-600',
      target: 'homework' as NavPageId,
    },
    {
      label: 'Fee Balance',
      value: `$${myPendingFees.toLocaleString()}`,
      sub: myPendingFees === 0 ? 'All tuition settled' : '1 upcoming invoice',
      icon: CreditCard,
      bg: 'from-purple-600 to-indigo-600',
      target: 'fees' as NavPageId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Student Profile Summary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <SafeImage
            src={profile.avatar}
            alt={profile.userName}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
              Welcome back, {profile.userName}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Roll No: <span className="font-mono">OA-2026-101</span> · {profile.departmentOrCohort} ·
              Advisor: Dr. Arthur Bennett
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => onNavigate('timetable')}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap"
          >
            Class Timetable
          </button>
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 whitespace-nowrap"
          >
            View Report Card
          </button>
        </div>
      </div>

      {/* 4 Student Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <button
              key={k.label}
              type="button"
              onClick={() => onNavigate(k.target)}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-transform duration-150 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {k.label}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${k.bg} text-white`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {k.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {k.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart + Timetable */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Subject Performance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recent evaluation scores across enrolled subjects
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Full Marks
            </button>
          </div>
          <StudentPerformanceChart
            darkMode={darkMode}
            labels={myResults.map((r) => r.subject)}
            scores={myResults.map((r) => r.marksObtained)}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Today&apos;s Classes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Full Timetable
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myTimetable.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {slot.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {slot.teacher} · {slot.room}
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-indigo-600 tabular-nums dark:text-indigo-400">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Homework + Library + Store + Notices */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Homework & Assignments
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('homework')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Open All
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {homework.slice(0, 4).map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {h.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {h.subject} · Due {h.dueDate}
                  </p>
                </div>
                <StatusText status={h.studentStatus} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Library & Book Store
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('bookstore')}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400"
            >
              Store Catalog
            </button>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                  Borrowed Book
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('library')}
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  Details
                </button>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-900 dark:text-slate-100">
                {bookIssues[0]?.bookTitle}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                Due back: {bookIssues[0]?.dueDate}
              </p>
            </div>

            {storeBooks.slice(0, 2).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onNavigate('bookstore')}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-100 p-2.5 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                <SafeImage
                  src={b.coverUrl}
                  alt={b.title}
                  fallbackType="book"
                  className="h-12 w-9 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {b.title}
                  </p>
                  <p className="font-mono text-xs font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                    ${b.price.toFixed(2)}
                  </p>
                </div>
                <ShoppingBag className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Notices & Events
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('notices')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              All
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notices.slice(0, 2).map((n) => (
              <div key={n.id} className="py-2.5 first:pt-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {n.title}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">{n.date}</p>
              </div>
            ))}
            {events.slice(0, 2).map((ev) => (
              <div key={ev.id} className="py-2.5 last:pb-0">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                  {ev.title}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {ev.date} · {ev.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
