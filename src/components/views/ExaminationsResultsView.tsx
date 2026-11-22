import React, { useState } from 'react';
import { Award, Calendar, Plus, Printer } from 'lucide-react';
import { ExamResultRecord, ExamScheduleItem, UserRole } from '../../types/school';
import { StudentPerformanceChart } from '../charts/DashboardCharts';
import { Modal } from '../ui/Modal';
import { StatusText } from '../ui/StatusText';

interface ExaminationsResultsViewProps {
  mode: 'examinations' | 'results';
  role: UserRole;
  exams: ExamScheduleItem[];
  results: ExamResultRecord[];
  darkMode: boolean;
  onAddExam: (exam: ExamScheduleItem) => void;
  onToast: (title: string, description?: string) => void;
}

export const ExaminationsResultsView: React.FC<ExaminationsResultsViewProps> = ({
  mode,
  role,
  exams,
  results,
  darkMode,
  onAddExam,
  onToast,
}) => {
  const [classFilter, setClassFilter] = useState('All');
  const [reportCardOpen, setReportCardOpen] = useState(false);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [subject, setSubject] = useState('AP Physics');
  const [examDate, setExamDate] = useState('2026-12-08');
  const [room, setRoom] = useState('Hall A-201');

  const scopedResults =
    role === 'student'
      ? results.filter((r) => r.studentId === 'stu-1')
      : results.filter((r) => classFilter === 'All' || r.className === classFilter);

  const scopedExams = exams.filter((e) => classFilter === 'All' || e.className === classFilter);

  const handleScheduleExam = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExam({
      id: `ex-${Date.now()}`,
      examTitle: 'Midterm Assessment',
      subject,
      className: 'Grade 11',
      date: examDate,
      time: '09:00 AM – 11:00 AM',
      room,
      maxMarks: 100,
      invigilator: 'Dr. Arthur Bennett',
      status: 'Scheduled',
    });
    onToast('Examination Scheduled', `${subject} added to exam roster for ${examDate}.`);
    setExamModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {mode === 'examinations' ? 'Examination Schedule' : 'Results & Marksheet'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === 'examinations'
              ? 'Official exam timetable, seating rooms, and faculty invigilators'
              : 'Subject grades, evaluation marks, and cohort performance chart'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {mode === 'results' && (
            <button
              type="button"
              onClick={() => setReportCardOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 whitespace-nowrap"
            >
              <Award className="h-4 w-4" />
              <span>View Result Card</span>
            </button>
          )}
          {mode === 'examinations' && role !== 'student' && (
            <button
              type="button"
              onClick={() => setExamModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      {role !== 'student' && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500">Filter Cohort:</span>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Grade 10', 'Grade 11', 'Grade 12'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setClassFilter(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  classFilter === c
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'examinations' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3">Assessment</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Cohort</th>
                  <th className="px-4 py-3">Date & Window</th>
                  <th className="px-4 py-3">Hall / Room</th>
                  <th className="px-4 py-3">Invigilator</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scopedExams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {ex.examTitle}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {ex.subject}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {ex.className}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {ex.date} · {ex.time}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{ex.room}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {ex.invigilator}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusText status={ex.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Subject Marks Analytics
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Score distribution across evaluated curriculum subjects
            </p>
            <StudentPerformanceChart
              darkMode={darkMode}
              labels={scopedResults.map((r) => `${r.subject} (${r.studentName.split(' ')[0]})`)}
              scores={scopedResults.map((r) => r.marksObtained)}
            />
          </div>

          {/* Marks Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    <th className="px-5 py-3">Student</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Exam</th>
                    <th className="px-4 py-3 text-right">Marks</th>
                    <th className="px-4 py-3 text-right">Grade</th>
                    <th className="px-5 py-3">Faculty Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scopedResults.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {r.studentName}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                          {r.rollNo} · {r.className}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {r.subject}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                        {r.examTitle}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                        {r.marksObtained} / {r.maxMarks}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {r.grade}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400">
                        {r.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Printable Report Card Modal */}
      <Modal
        isOpen={reportCardOpen}
        onClose={() => setReportCardOpen(false)}
        title="Official Academic Result Card"
        subtitle="Liam Carter · OA-2026-101 · Grade 11 Section A"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                onToast('Report Card Ready', 'Print dialog opened.');
                window.print();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => setReportCardOpen(false)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Close
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
            <div>
              <p className="text-[11px] text-slate-500">Term Average</p>
              <p className="font-mono text-lg font-bold text-indigo-600 tabular-nums">92.5%</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Cumulative GPA</p>
              <p className="font-mono text-lg font-bold text-slate-900 tabular-nums dark:text-slate-100">
                3.92
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Standing</p>
              <p className="text-sm font-bold text-emerald-600">Honor Roll</p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                <th className="py-2">Subject</th>
                <th className="py-2 text-right">Marks</th>
                <th className="py-2 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results
                .filter((r) => r.studentId === 'stu-1')
                .map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-slate-100">
                      {r.subject}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {r.marksObtained}/{r.maxMarks}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-600">
                      {r.grade}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Schedule Exam Modal */}
      <Modal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        title="Schedule Examination"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setExamModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="exam-form"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Publish Schedule
            </button>
          </>
        }
      >
        <form id="exam-form" onSubmit={handleScheduleExam} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Room / Hall
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
