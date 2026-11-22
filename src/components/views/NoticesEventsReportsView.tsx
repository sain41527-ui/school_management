import React, { useState } from 'react';
import { Bell, Calendar, Download, MapPin, Plus } from 'lucide-react';
import {
  AttendanceRecord,
  FeeRecord,
  NoticeItem,
  SchoolEvent,
  StudentRecord,
  UserRole,
} from '../../types/school';
import { AttendanceOverviewChart, MonthlyRevenueChart } from '../charts/DashboardCharts';
import { Modal } from '../ui/Modal';

interface NoticesEventsReportsViewProps {
  mode: 'notices' | 'events' | 'reports';
  role: UserRole;
  notices: NoticeItem[];
  events: SchoolEvent[];
  students: StudentRecord[];
  fees: FeeRecord[];
  attendance: AttendanceRecord[];
  darkMode: boolean;
  onAddNotice: (notice: NoticeItem) => void;
  onAddEvent: (event: SchoolEvent) => void;
  onToast: (title: string, description?: string) => void;
}

export const NoticesEventsReportsView: React.FC<NoticesEventsReportsViewProps> = ({
  mode,
  role,
  notices,
  events,
  students,
  fees,
  attendance,
  darkMode,
  onAddNotice,
  onAddEvent,
  onToast,
}) => {
  const [noticeModal, setNoticeModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [body, setBody] = useState('');
  const [date, setDate] = useState('2026-12-10');
  const [location, setLocation] = useState('Main Auditorium');

  const downloadCsv = (filename: string, rows: string[][]) => {
    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Report Exported', `${filename} downloaded.`);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddNotice({
      id: `not-${Date.now()}`,
      title,
      category: category as NoticeItem['category'],
      audience: 'All',
      publishedBy: role === 'admin' ? 'Principal Claire Holloway' : 'Dr. Arthur Bennett',
      date: '2026-11-21',
      body: body || 'Official campus update published to notice board.',
    });
    onToast('Notice Published', title);
    setTitle('');
    setBody('');
    setNoticeModal(false);
  };

  const handlePublishEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddEvent({
      id: `evt-${Date.now()}`,
      title,
      category: category as SchoolEvent['category'],
      date,
      time: '03:00 PM – 05:00 PM',
      location,
      organizer: 'Thorm Birds Academy Administration',
      attendeesCount: 75,
      description: body || 'Scheduled school community event.',
    });
    onToast('Event Created', `${title} added to school calendar.`);
    setTitle('');
    setBody('');
    setEventModal(false);
  };

  if (mode === 'notices') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              School Notice Board
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Campus circulars, exam updates, and departmental announcements
            </p>
          </div>
          {role !== 'student' && (
            <button
              type="button"
              onClick={() => setNoticeModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Publish Notice</span>
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {notices.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {n.category} · Audience: {n.audience}
                </span>
                <Bell className="h-4 w-4 shrink-0 text-amber-500" />
              </div>
              <h3 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                {n.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {n.body}
              </p>
              <p className="mt-4 border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-400 dark:border-slate-800">
                Published by {n.publishedBy} · {n.date}
              </p>
            </div>
          ))}
        </div>

        <Modal
          isOpen={noticeModal}
          onClose={() => setNoticeModal(false)}
          title="Publish School Notice"
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setNoticeModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="notice-form"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Publish
              </button>
            </>
          }
        >
          <form id="notice-form" onSubmit={handlePublishNotice} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option>Academic</option>
                <option>Administration</option>
                <option>Examination</option>
                <option>Finance</option>
                <option>Campus</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (mode === 'events') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Campus Events & Calendar
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Academic colloquiums, parent evenings, and cultural showcases
            </p>
          </div>
          {role === 'admin' && (
            <button
              type="button"
              onClick={() => setEventModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {ev.category}
                </span>
                <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                  {ev.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {ev.description}
                </p>
              </div>
              <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                <p className="flex items-center gap-1.5 font-mono tabular-nums">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  {ev.date} · {ev.time}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  {ev.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={eventModal}
          onClose={() => setEventModal(false)}
          title="Create Campus Event"
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEventModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="event-form"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Save Event
              </button>
            </>
          }
        >
          <form id="event-form" onSubmit={handlePublishEvent} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Venue
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Reports Mode
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Institutional Reports & Exports
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Download structured CSV datasets and review operational trendlines
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Student Roster CSV
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Complete enrollment, GPA, attendance %, and guardian contacts ({students.length} records).
          </p>
          <button
            type="button"
            onClick={() =>
              downloadCsv('thorm-birds-students-roster.csv', [
                ['Roll No', 'Name', 'Class', 'Section', 'GPA', 'Attendance %', 'Fee Status'],
                ...students.map((s) => [
                  s.rollNo,
                  s.name,
                  s.className,
                  s.section,
                  String(s.gpa),
                  String(s.attendanceRate),
                  s.feeStatus,
                ]),
              ])
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Roster</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Tuition & Fee Ledger CSV
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Itemized invoice balances, settled payments, and due dates ({fees.length} invoices).
          </p>
          <button
            type="button"
            onClick={() =>
              downloadCsv('thorm-birds-fee-ledger.csv', [
                ['Invoice No', 'Student', 'Fee Type', 'Amount', 'Paid', 'Status'],
                ...fees.map((f) => [
                  f.invoiceNo,
                  f.studentName,
                  f.feeType,
                  String(f.amount),
                  String(f.paidAmount),
                  f.status,
                ]),
              ])
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Ledger</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
            Daily Attendance Log CSV
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Check-in timestamps and Present / Late / Absent records ({attendance.length} rows).
          </p>
          <button
            type="button"
            onClick={() =>
              downloadCsv('thorm-birds-attendance-log.csv', [
                ['Roll No', 'Student', 'Class', 'Date', 'Status', 'Check-In'],
                ...attendance.map((a) => [
                  a.rollNo,
                  a.studentName,
                  a.className,
                  a.date,
                  a.status,
                  a.checkInTime,
                ]),
              ])
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Attendance</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Weekly Attendance Analytics
          </h2>
          <AttendanceOverviewChart darkMode={darkMode} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            Monthly Fee Collection Trend
          </h2>
          <MonthlyRevenueChart darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};
