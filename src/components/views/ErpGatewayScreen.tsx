import React from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { NavPageId, UserRole } from '../../types/school';

interface ErpGatewayScreenProps {
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  attendanceRate: string;
  onEnterConsole: (role: UserRole, page?: NavPageId) => void;
}

export const ErpGatewayScreen: React.FC<ErpGatewayScreenProps> = ({
  schoolName,
  totalStudents,
  totalTeachers,
  totalCourses,
  attendanceRate,
  onEnterConsole,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {schoolName}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Artificial Pro · Unified Campus ERP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEnterConsole('admin', 'dashboard')}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 whitespace-nowrap shrink-0"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Open ERP Dashboard</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                Academic Year 2026–2027
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
                School Operations & Academic Administration
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                Centralized admissions, live classroom attendance, tuition billing, examination
                gradebooks, library circulation, and parent communication across three dedicated
                role consoles.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onEnterConsole('admin', 'dashboard')}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-blue-700 whitespace-nowrap"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Access Administrator Console</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onEnterConsole('teacher', 'dashboard')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                <BookOpenCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Faculty Portal</span>
              </button>

              <button
                type="button"
                onClick={() => onEnterConsole('student', 'dashboard')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span>Student Portal</span>
              </button>
            </div>
          </div>

          {/* Right Live Campus Summary */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Enrolled Students
              </span>
              <div>
                <p className="font-display text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {totalStudents}
                </p>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Grades 9–12 Active</p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Faculty Members
              </span>
              <div>
                <p className="font-display text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {totalTeachers}
                </p>
                <p className="mt-1 text-xs text-teal-600 dark:text-teal-400">5 Academic Depts</p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Active Courses
              </span>
              <div>
                <p className="font-display text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {totalCourses}
                </p>
                <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">Fall Term 2026</p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Today&apos;s Attendance
              </span>
              <div>
                <p className="font-display text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {attendanceRate}
                </p>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Campus Average</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Role Portals Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              role: 'admin' as UserRole,
              title: 'Administrator Console',
              desc: 'Full institutional oversight: student & faculty records, fee collection, exam schedules, library, bookstore, and analytics.',
              cta: 'Access Administrator Console',
              accent: 'from-indigo-600 to-blue-600',
            },
            {
              role: 'teacher' as UserRole,
              title: 'Teacher Portal',
              desc: 'Daily class schedules, instant roll-call attendance, homework & assignment tracking, gradebook entry, and student messaging.',
              cta: 'Open Teacher Dashboard',
              accent: 'from-teal-600 to-emerald-600',
            },
            {
              role: 'student' as UserRole,
              title: 'Student Portal',
              desc: 'Personal attendance metrics, timetable, homework submissions, report cards, tuition invoices, library loans, and campus store.',
              cta: 'Open Student Dashboard',
              accent: 'from-sky-600 to-indigo-600',
            },
          ].map((card) => (
            <div
              key={card.role}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-transform duration-150 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {card.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEnterConsole(card.role, 'dashboard')}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${card.accent} px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95`}
              >
                <span>{card.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
