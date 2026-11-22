import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Save, XCircle } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, UserRole } from '../../types/school';
import { StatusText } from '../ui/StatusText';

interface AttendanceViewProps {
  role: UserRole;
  records: AttendanceRecord[];
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onToast: (title: string, description?: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  role,
  records,
  onUpdateStatus,
  onToast,
}) => {
  const [dateFilter, setDateFilter] = useState('2026-11-21');
  const [classFilter, setClassFilter] = useState('All');

  const visibleRecords = useMemo(() => {
    if (role === 'student') {
      return records.filter((r) => r.studentId === 'stu-1');
    }
    return records.filter((r) => classFilter === 'All' || r.className === classFilter);
  }, [records, role, classFilter]);

  const presentCount = visibleRecords.filter((r) => r.status === 'Present').length;
  const lateCount = visibleRecords.filter((r) => r.status === 'Late').length;
  const absentCount = visibleRecords.filter((r) => r.status === 'Absent').length;
  const rate =
    visibleRecords.length > 0
      ? (((presentCount + lateCount) / visibleRecords.length) * 100).toFixed(1)
      : '100.0';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {role === 'student' ? 'My Attendance Record' : 'Attendance Management'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {role === 'student'
              ? 'Daily check-in log and term attendance percentage'
              : 'Filter by date and class cohort to mark Present, Late, or Absent statuses'}
          </p>
        </div>

        {role !== 'student' && (
          <button
            type="button"
            onClick={() =>
              onToast('Attendance Sheet Saved', `Roll call saved for ${dateFilter}.`)
            }
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <Save className="h-4 w-4" />
            <span>Save Roll Call</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500">Attendance Rate</p>
          <p className="mt-2 font-display text-2xl font-bold text-indigo-600 tabular-nums dark:text-indigo-400">
            {role === 'student' ? '96.4%' : `${rate}%`}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Present</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
            {role === 'student' ? '48 Days' : presentCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Late Arrivals</p>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
            {role === 'student' ? '1 Day' : lateCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Absent</p>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 tabular-nums dark:text-rose-400">
            {role === 'student' ? '1 Day' : absentCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      {role !== 'student' && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Attendance date"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            aria-label="Filter by class"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Classes</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="px-5 py-3">Roll No</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check-In</th>
                <th className="px-4 py-3">Status</th>
                {role !== 'student' && <th className="px-5 py-3 text-right">Mark Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visibleRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500 tabular-nums">
                    {r.rollNo}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    {r.studentName}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                    {r.className} · {r.section}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">
                    {dateFilter}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 tabular-nums dark:text-slate-300">
                    {r.checkInTime}
                  </td>
                  <td className="px-4 py-3">
                    <StatusText status={r.status} />
                  </td>
                  {role !== 'student' && (
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                        {(['Present', 'Late', 'Absent'] as AttendanceStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => onUpdateStatus(r.id, st)}
                            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                              r.status === st
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
