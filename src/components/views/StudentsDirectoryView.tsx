import React, { useMemo, useState } from 'react';
import {
  Edit2,
  Eye,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { StudentRecord, UserRole } from '../../types/school';
import { Modal } from '../ui/Modal';
import { SafeImage } from '../ui/SafeImage';
import { StatusText } from '../ui/StatusText';

interface StudentsDirectoryViewProps {
  role: UserRole;
  students: StudentRecord[];
  onAddStudent: (student: StudentRecord) => void;
  onUpdateStudent: (student: StudentRecord) => void;
  onDeleteStudent: (id: string) => void;
  onToast: (title: string, description?: string) => void;
}

const PAGE_SIZE = 5;

export const StudentsDirectoryView: React.FC<StudentsDirectoryViewProps> = ({
  role,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onToast,
}) => {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');
  const [page, setPage] = useState(1);

  const [profileStudent, setProfileStudent] = useState<StudentRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoName, setPhotoName] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    className: 'Grade 11',
    section: 'Section A',
    guardianName: '',
    guardianPhone: '',
    address: '',
    feeStatus: 'Paid' as StudentRecord['feeStatus'],
    status: 'Active' as StudentRecord['status'],
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const matchClass = classFilter === 'All' || s.className === classFilter;
      const matchFee = feeFilter === 'All' || s.feeStatus === feeFilter;
      return matchQuery && matchClass && matchFee;
    });
  }, [students, search, classFilter, feeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openAddModal = () => {
    setEditingId(null);
    setErrors({});
    setPhotoName('');
    setForm({
      name: '',
      email: '',
      phone: '',
      className: 'Grade 11',
      section: 'Section A',
      guardianName: '',
      guardianPhone: '',
      address: '',
      feeStatus: 'Paid',
      status: 'Active',
    });
    setFormOpen(true);
  };

  const openEditModal = (student: StudentRecord) => {
    setEditingId(student.id);
    setErrors({});
    setPhotoName('');
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      className: student.className,
      section: student.section,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      address: student.address,
      feeStatus: student.feeStatus,
      status: student.status,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Full name is required.';
    if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Valid email required.';
    if (!form.guardianName.trim()) nextErrors.guardianName = 'Guardian name is required.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (editingId) {
      const existing = students.find((s) => s.id === editingId);
      if (existing) {
        onUpdateStudent({ ...existing, ...form });
        onToast('Student Updated', `${form.name} profile saved.`);
      }
    } else {
      const nextNum = 101 + students.length;
      const created: StudentRecord = {
        id: `stu-${Date.now()}`,
        rollNo: `OA-2026-${nextNum}`,
        admissionDate: '2026-11-21',
        attendanceRate: 100,
        gpa: 3.8,
        ...form,
      };
      onAddStudent(created);
      onToast('Student Enrolled', `${form.name} added to ${form.className}.`);
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {role === 'teacher' ? 'My Students' : 'Student Directory'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, filter, inspect profiles, and manage student admissions
          </p>
        </div>
        {role === 'admin' && (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by student name, roll no, or email..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by grade"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Grades</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>

          <select
            value={feeFilter}
            onChange={(e) => {
              setFeeFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by fee status"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Fee Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {paged.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              No students match your current filter
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try clearing your search query or selecting another grade level.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setClassFilter('All');
                setFeeFilter('All');
              }}
              className="mt-4 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3">Guardian</th>
                  <th className="px-4 py-3 text-right">Attendance</th>
                  <th className="px-4 py-3 text-right">GPA</th>
                  <th className="px-4 py-3">Fee Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paged.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={s.avatar}
                          alt={s.name}
                          className="h-9 w-9 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                            {s.name}
                          </p>
                          <p className="truncate font-mono text-[11px] text-slate-500 tabular-nums">
                            {s.rollNo} · {s.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">
                      {s.className} · {s.section}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {s.guardianName}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {s.guardianPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-slate-800 tabular-nums dark:text-slate-200">
                      {s.attendanceRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                      {s.gpa.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusText status={s.feeStatus} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setProfileStudent(s)}
                          title="View student profile"
                          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {role === 'admin' && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(s)}
                              title="Edit student"
                              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-sky-50 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteStudent(s.id);
                                onToast('Student Removed', `${s.name} archived from active roster.`);
                              }}
                              title="Delete student"
                              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="tabular-nums">
            Showing {paged.length} of {filtered.length} students
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            >
              Prev
            </button>
            <span className="px-2 font-mono tabular-nums">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      <Modal
        isOpen={Boolean(profileStudent)}
        onClose={() => setProfileStudent(null)}
        title={profileStudent?.name || 'Student Profile'}
        subtitle={
          profileStudent
            ? `${profileStudent.rollNo} · ${profileStudent.className} · ${profileStudent.section}`
            : ''
        }
        footer={
          <button
            type="button"
            onClick={() => setProfileStudent(null)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Close
          </button>
        }
      >
        {profileStudent && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <SafeImage
                src={profileStudent.avatar}
                alt={profileStudent.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profileStudent.email}
                </p>
                <p className="font-mono text-xs text-slate-500 tabular-nums">
                  {profileStudent.phone}
                </p>
                <div className="mt-1.5 flex items-center gap-4">
                  <StatusText status={profileStudent.status} />
                  <StatusText status={profileStudent.feeStatus} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {profileStudent.attendanceRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Cumulative GPA</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-indigo-600 tabular-nums dark:text-indigo-400">
                  {profileStudent.gpa.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Guardian</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profileStudent.guardianName}
                </p>
                <p className="font-mono text-xs text-slate-500 tabular-nums">
                  {profileStudent.guardianPhone}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Residential Address</p>
                <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
                  {profileStudent.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Student Form Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Edit Student Record' : 'Enroll New Student'}
        subtitle="Complete student admission and guardian details below"
        footer={
          <>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="student-form"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              {editingId ? 'Save Changes' : 'Save Student'}
            </button>
          </>
        }
      >
        <form id="student-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Amelia Johnson"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Student Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="student@thormbirds.edu"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (415) 555-0140"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Grade / Class
            </label>
            <select
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Section
            </label>
            <select
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option>Section A</option>
              <option>Section B</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Guardian Name *
            </label>
            <input
              type="text"
              value={form.guardianName}
              onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
              placeholder="Parent / Guardian Name"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.guardianName && (
              <p className="mt-1 text-xs text-rose-600">{errors.guardianName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Guardian Phone
            </label>
            <input
              type="text"
              value={form.guardianPhone}
              onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
              placeholder="+1 (415) 555-0199"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fee Status
            </label>
            <select
              value={form.feeStatus}
              onChange={(e) =>
                setForm({ ...form, feeStatus: e.target.value as StudentRecord['feeStatus'] })
              }
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Student Photo Attachment
            </label>
            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-xs font-medium text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Upload className="h-3.5 w-3.5 text-indigo-600" />
              <span className="truncate">{photoName || 'Upload portrait (JPG/PNG)'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name || '')}
              />
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Residential Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street address, City, State"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
