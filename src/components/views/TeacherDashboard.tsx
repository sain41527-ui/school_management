import React from 'react';
import {
  BookCopy,
  CalendarClock,
  CheckSquare,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  School,
} from 'lucide-react';
import {
  ChatThread,
  ExamScheduleItem,
  HomeworkAssignment,
  NavPageId,
  NoticeItem,
  RoleProfile,
  TimetableSlot,
} from '../../types/school';
import { StudentPerformanceChart } from '../charts/DashboardCharts';
import { StatusText } from '../ui/StatusText';

interface TeacherDashboardProps {
  profile: RoleProfile;
  homework: HomeworkAssignment[];
  exams: ExamScheduleItem[];
  timetable: TimetableSlot[];
  threads: ChatThread[];
  notices: NoticeItem[];
  darkMode: boolean;
  onNavigate: (page: NavPageId) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  profile,
  homework,
  exams,
  timetable,
  threads,
  notices,
  darkMode,
  onNavigate,
}) => {
  const teacherSchedule = timetable.filter((t) => t.teacher === 'Dr. Arthur Bennett').slice(0, 4);

  const cards = [
    {
      label: 'My Classes',
      value: '4 Cohorts',
      sub: 'Grades 11 & 12 Physics',
      icon: School,
      bg: 'from-indigo-600 to-blue-600',
      target: 'classes' as NavPageId,
    },
    {
      label: 'My Students',
      value: '120',
      sub: '95.6% term attendance',
      icon: GraduationCap,
      bg: 'from-teal-500 to-emerald-600',
      target: 'students' as NavPageId,
    },
    {
      label: 'Pending Grading',
      value: String(homework.filter((h) => h.submissionsCount < h.totalStudents).length),
      sub: 'Homework & lab reports',
      icon: BookCopy,
      bg: 'from-amber-500 to-orange-600',
      target: 'homework' as NavPageId,
    },
    {
      label: 'Upcoming Exams',
      value: String(exams.filter((e) => e.status === 'Scheduled').length),
      sub: 'Midterms begin Nov 28',
      icon: ClipboardCheck,
      bg: 'from-purple-600 to-violet-600',
      target: 'examinations' as NavPageId,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Faculty Workspace — {profile.userName}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {profile.departmentOrCohort} · Fall Term 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('attendance')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Take Attendance</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('homework')}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap"
          >
            Assign Homework
          </button>
        </div>
      </div>

      {/* Top KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => onNavigate(c.target)}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-transform duration-150 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {c.label}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${c.bg} text-white`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {c.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {c.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Schedule + Performance */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Today&apos;s Teaching Schedule
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Full Week
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {teacherSchedule.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {slot.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {slot.className} · {slot.room}
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-indigo-600 tabular-nums dark:text-indigo-400">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                Cohort Assessment Average
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average student performance across assigned sections
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Gradebook
            </button>
          </div>
          <StudentPerformanceChart
            darkMode={darkMode}
            labels={['11A Physics', '11B Physics', '12A Optics', '12B Quantum', 'Lab Seminar']}
            scores={[91, 88, 94, 89, 95]}
          />
        </div>
      </div>

      {/* Homework/Assignments + Messages + Notice Board */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Homework & Assignment Tracker
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {homework.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.className} · Due {item.dueDate}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs font-semibold text-slate-700 tabular-nums dark:text-slate-300">
                  {item.submissionsCount}/{item.totalStudents}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Messages
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Inbox
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {threads.slice(0, 3).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onNavigate('messages')}
                className="flex w-full items-start gap-2.5 py-2.5 text-left first:pt-0 last:pb-0"
              >
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {t.participantName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {t.messages[t.messages.length - 1]?.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Notice Board
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
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {n.title}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {n.category} · {n.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Summary Quick Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Upcoming Examination Invigilation
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('examinations')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
          >
            Exam Roster
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-2.5 pr-4">Exam</th>
                <th className="px-4 py-2.5">Subject</th>
                <th className="px-4 py-2.5">Class</th>
                <th className="px-4 py-2.5">Date & Time</th>
                <th className="py-2.5 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {exams.map((e) => (
                <tr key={e.id}>
                  <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                    {e.examTitle}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {e.subject}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {e.className}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {e.date} · {e.time}
                  </td>
                  <td className="py-2.5 pl-4 text-right">
                    <StatusText status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
