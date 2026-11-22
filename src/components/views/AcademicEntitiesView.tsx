import React, { useState } from 'react';
import { BookCopy, FileText, FolderKanban, Layers, Plus, School, Search, Users } from 'lucide-react';
import {
  CourseRecord,
  GuardianRecord,
  HomeworkAssignment,
  SchoolClassRecord,
  SectionRecord,
  SubjectRecord,
  UserRole,
} from '../../types/school';
import { Modal } from '../ui/Modal';
import { StatusText } from '../ui/StatusText';

interface AcademicEntitiesViewProps {
  mode: 'guardians' | 'classes' | 'sections' | 'subjects' | 'courses' | 'homework' | 'assignments';
  role: UserRole;
  guardians: GuardianRecord[];
  classes: SchoolClassRecord[];
  sections: SectionRecord[];
  subjects: SubjectRecord[];
  courses: CourseRecord[];
  homework: HomeworkAssignment[];
  onAddHomework: (item: HomeworkAssignment) => void;
  onSubmitStudentHomework: (id: string) => void;
  onAddClass: (item: SchoolClassRecord) => void;
  onAddSubject: (item: SubjectRecord) => void;
  onToast: (title: string, description?: string) => void;
}

export const AcademicEntitiesView: React.FC<AcademicEntitiesViewProps> = ({
  mode,
  role,
  guardians,
  classes,
  sections,
  subjects,
  courses,
  homework,
  onAddHomework,
  onSubmitStudentHomework,
  onAddClass,
  onAddSubject,
  onToast,
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSub, setNewSub] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newDate, setNewDate] = useState('2026-11-30');

  const meta = {
    guardians: {
      title: 'Parents & Guardians',
      subtitle: 'Emergency contacts, household directories, and linked student accounts',
      icon: Users,
      addLabel: 'Add Guardian',
    },
    classes: {
      title: role === 'admin' ? 'Classes & Grade Cohorts' : 'My Classes',
      subtitle: 'Grade-level enrollment, room assignments, and homeroom advisors',
      icon: School,
      addLabel: 'Add Class',
    },
    sections: {
      title: 'Class Sections',
      subtitle: 'Cohort tracks, section advisors, and classroom capacities',
      icon: Layers,
      addLabel: 'Add Section',
    },
    subjects: {
      title: 'Curriculum Subjects',
      subtitle: 'Subject codes, credit weights, and faculty assignments',
      icon: BookCopy,
      addLabel: 'Add Subject',
    },
    courses: {
      title: 'Academic Courses',
      subtitle: 'Structured multi-module curriculum tracks for Fall Term 2026',
      icon: FolderKanban,
      addLabel: 'Create Course',
    },
    homework: {
      title: 'Daily Homework',
      subtitle:
        role === 'student'
          ? 'Track and submit your assigned coursework before deadlines'
          : 'Manage problem sets and track student completion rates',
      icon: BookCopy,
      addLabel: 'Assign Homework',
    },
    assignments: {
      title: 'Term Assignments & Lab Reports',
      subtitle:
        role === 'student'
          ? 'Major coursework deliverables and graded rubric feedback'
          : 'Lab reports, essays, and graded assessment submissions',
      icon: FileText,
      addLabel: 'New Assignment',
    },
  }[mode];

  const q = search.trim().toLowerCase();

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (mode === 'homework' || mode === 'assignments') {
      onAddHomework({
        id: `${mode}-${Date.now()}`,
        kind: mode === 'homework' ? 'homework' : 'assignment',
        title: newTitle,
        subject: newSub || 'AP Physics',
        className: 'Grade 11 · Section A',
        assignedBy: 'Dr. Arthur Bennett',
        assignedDate: '2026-11-21',
        dueDate: newDate,
        submissionsCount: 0,
        totalStudents: 31,
        studentStatus: 'Pending',
        description: newDetail || 'Complete and upload PDF deliverables via the portal.',
      });
      onToast(
        mode === 'homework' ? 'Homework Assigned' : 'Assignment Published',
        `${newTitle} published to Grade 11 · Section A.`
      );
    } else if (mode === 'classes') {
      onAddClass({
        id: `cls-${Date.now()}`,
        name: newTitle,
        gradeLevel: 11,
        sections: ['Section A'],
        classTeacher: newSub || 'Dr. Arthur Bennett',
        roomNumber: newDetail || 'Hall C-102',
        studentCount: 28,
        capacity: 35,
      });
      onToast('Class Created', `${newTitle} added to academic directory.`);
    } else if (mode === 'subjects') {
      onAddSubject({
        id: `sub-${Date.now()}`,
        code: newSub || 'ELE-401',
        name: newTitle,
        department: newDetail || 'Physical Sciences',
        credits: 3,
        teacher: 'Dr. Arthur Bennett',
        classes: ['Grade 11', 'Grade 12'],
        type: 'Elective',
      });
      onToast('Subject Added', `${newTitle} added to curriculum.`);
    } else {
      onToast('Saved', `${newTitle} added successfully.`);
    }

    setNewTitle('');
    setNewSub('');
    setNewDetail('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {meta.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{meta.subtitle}</p>
        </div>
        {(role === 'admin' || (role === 'teacher' && (mode === 'homework' || mode === 'assignments'))) && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>{meta.addLabel}</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${meta.title.toLowerCase()}...`}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Mode Content */}
      {mode === 'guardians' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3">Guardian</th>
                  <th className="px-4 py-3">Relation</th>
                  <th className="px-4 py-3">Linked Student(s)</th>
                  <th className="px-4 py-3">Occupation</th>
                  <th className="px-5 py-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {guardians
                  .filter((g) => !q || g.name.toLowerCase().includes(q) || g.studentNames.join(' ').toLowerCase().includes(q))
                  .map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">{g.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{g.relation}</td>
                      <td className="px-4 py-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {g.studentNames.join(', ')}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{g.occupation}</td>
                      <td className="px-5 py-3">
                        <p className="text-xs text-slate-700 dark:text-slate-200">{g.email}</p>
                        <p className="font-mono text-[11px] text-slate-500 tabular-nums">{g.phone}</p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === 'classes' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes
            .filter((c) => !q || c.name.toLowerCase().includes(q) || c.classTeacher.toLowerCase().includes(q))
            .map((c) => {
              const pct = Math.round((c.studentCount / c.capacity) * 100);
              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.roomNumber}</p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                      {c.sections.length} Sections
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                    Lead Advisor: <span className="font-semibold">{c.classTeacher}</span>
                  </p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Enrollment</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {c.studentCount}/{c.capacity}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {mode === 'sections' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3">Class & Section</th>
                  <th className="px-4 py-3">Academic Track</th>
                  <th className="px-4 py-3">Advisor</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-5 py-3 text-right">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sections
                  .filter((s) => !q || s.className.toLowerCase().includes(q) || s.advisor.toLowerCase().includes(q))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {s.className} · {s.sectionName}
                      </td>
                      <td className="px-4 py-3 text-xs text-indigo-600 dark:text-indigo-400">{s.scheduleTrack}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{s.advisor}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.room}</td>
                      <td className="px-5 py-3 text-right font-mono text-xs font-semibold tabular-nums">
                        {s.studentsCount}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === 'subjects' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-4 py-3">Subject Title</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects
                  .filter((sub) => !q || sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q))
                  .map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {sub.code}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{sub.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{sub.department}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{sub.teacher}</td>
                      <td className="px-4 py-3 text-xs font-medium text-teal-600 dark:text-teal-400">{sub.type}</td>
                      <td className="px-5 py-3 text-right font-mono text-xs font-semibold tabular-nums">
                        {sub.credits}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === 'courses' && (
        <div className="grid gap-4 md:grid-cols-2">
          {courses
            .filter((crs) => !q || crs.title.toLowerCase().includes(q) || crs.code.toLowerCase().includes(q))
            .map((crs) => (
              <div
                key={crs.id}
                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {crs.code} · {crs.term}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                      {crs.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                    {crs.modules} Modules
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Instructor: {crs.instructor} · {crs.gradeBand} · {crs.enrolled} Enrolled
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Syllabus Completion</span>
                    <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {crs.completionRate}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600"
                      style={{ width: `${crs.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {(mode === 'homework' || mode === 'assignments') && (
        <div className="grid gap-4 md:grid-cols-2">
          {homework
            .filter((h) => h.kind === (mode === 'homework' ? 'homework' : 'assignment'))
            .filter((h) => !q || h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q))
            .map((h) => (
              <div
                key={h.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {h.subject} · {h.className}
                    </span>
                    <StatusText status={h.studentStatus} />
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                    {h.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {h.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <span className="font-mono text-slate-500 tabular-nums">
                    Due {h.dueDate} · {h.submissionsCount}/{h.totalStudents} submitted
                  </span>

                  {role === 'student' && h.studentStatus === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => {
                        onSubmitStudentHomework(h.id);
                        onToast('Submission Uploaded', `${h.title} marked as submitted.`);
                      }}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Submit Work
                    </button>
                  )}

                  {h.score && (
                    <span className="font-mono text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                      Score: {h.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Quick Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={meta.addLabel}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="entity-form"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </>
        }
      >
        <form id="entity-form" onSubmit={handleQuickCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Title / Name *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter title..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'subjects' ? 'Subject Code' : mode === 'classes' ? 'Lead Advisor' : 'Subject'}
            </label>
            <input
              type="text"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              placeholder={mode === 'subjects' ? 'PHY-402' : 'AP Physics'}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          {(mode === 'homework' || mode === 'assignments') && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Due Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Details / Room / Department
            </label>
            <textarea
              rows={3}
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
