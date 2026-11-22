import React, { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { TimetableSlot, UserRole } from '../../types/school';

interface TimetableViewProps {
  role: UserRole;
  timetable: TimetableSlot[];
}

const DAYS: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimetableView: React.FC<TimetableViewProps> = ({ role, timetable }) => {
  const [selectedClass, setSelectedClass] = useState('Grade 11');

  const slots = timetable.filter((slot) => {
    if (role === 'teacher') return slot.teacher === 'Dr. Arthur Bennett';
    return slot.className === selectedClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Weekly Class Timetable
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {role === 'teacher'
              ? 'Your assigned lecture and laboratory sessions across the week'
              : 'Structured Monday–Friday academic timetable by grade cohort'}
          </p>
        </div>

        {role !== 'teacher' && (
          <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {['Grade 10', 'Grade 11', 'Grade 12'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedClass(c)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedClass === c
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {DAYS.map((day) => {
          const daySlots = slots.filter((s) => s.day === day).sort((a, b) => a.period - b.period);
          return (
            <div
              key={day}
              className="flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  {day}
                </span>
                <CalendarClock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div className="flex-1 divide-y divide-slate-100 p-3 dark:divide-slate-800">
                {daySlots.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">Study / Seminar Block</p>
                ) : (
                  daySlots.map((slot) => (
                    <div key={slot.id} className="py-3 first:pt-1 last:pb-1">
                      <p className="font-mono text-[11px] font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                        {slot.time}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {slot.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {slot.teacher}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-400">{slot.room}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
