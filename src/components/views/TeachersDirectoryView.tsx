import React, { useMemo, useState } from 'react';
import { Edit2, Eye, Mail, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { TeacherRecord } from '../../types/school';
import { Modal } from '../ui/Modal';
import { SafeImage } from '../ui/SafeImage';
import { StatusText } from '../ui/StatusText';

interface TeachersDirectoryViewProps {
  teachers: TeacherRecord[];
  onAddTeacher: (teacher: TeacherRecord) => void;
  onUpdateTeacher: (teacher: TeacherRecord) => void;
  onDeleteTeacher: (id: string) => void;
  onToast: (title: string, description?: string) => void;
}

export const TeachersDirectoryView: React.FC<TeachersDirectoryViewProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onToast,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [profileTeacher, setProfileTeacher] = useState<TeacherRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Mathematics',
    qualification: '',
    subjectsText: '',
    classesText: 'Grade 11, Grade 12',
    experienceYears: 5,
    status: 'Active' as TeacherRecord['status'],
  });

  const departments = useMemo(
    () => Array.from(new Set(teachers.map((t) => t.department))),
    [teachers]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachers.filter((t) => {
      const matchesQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q));
      const matchesDept = deptFilter === 'All' || t.department === deptFilter;
      return matchesQ && matchesDept;
    });
  }, [teachers, search, deptFilter]);

  const openAdd = () => {
    setEditingId(null);
    setErrors({});
    setForm({
      name: '',
      email: '',
      phone: '',
      department: 'Mathematics',
      qualification: '',
      subjectsText: '',
      classesText: 'Grade 11, Grade 12',
      experienceYears: 5,
      status: 'Active',
    });
    setFormOpen(true);
  };

  const openEdit = (t: TeacherRecord) => {
    setEditingId(t.id);
    setErrors({});
    setForm({
      name: t.name,
      email: t.email,
      phone: t.phone,
      department: t.department,
      qualification: t.qualification,
      subjectsText: t.subjects.join(', '),
      classesText: t.classesAssigned.join(', '),
      experienceYears: t.experienceYears,
      status: t.status,
    });
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Faculty name is required.';
    if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Valid email required.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const subjects = form.subjectsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const classesAssigned = form.classesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingId) {
      const existing = teachers.find((t) => t.id === editingId);
      if (existing) {
        onUpdateTeacher({
          ...existing,
          name: form.name,
          email: form.email,
          phone: form.phone,
          department: form.department,
          qualification: form.qualification || existing.qualification,
          subjects: subjects.length ? subjects : existing.subjects,
          classesAssigned: classesAssigned.length ? classesAssigned : existing.classesAssigned,
          experienceYears: form.experienceYears,
          status: form.status,
        });
        onToast('Faculty Updated', `${form.name} record saved.`);
      }
    } else {
      const created: TeacherRecord = {
        id: `tch-${Date.now()}`,
        employeeId: `FAC-${1075 + teachers.length}`,
        name: form.name,
        email: form.email,
        phone: form.phone || '+1 (415) 902-0000',
        department: form.department,
        qualification: form.qualification || 'M.S. Education',
        subjects: subjects.length ? subjects : ['General Studies'],
        classesAssigned: classesAssigned.length ? classesAssigned : ['Grade 10'],
        joinDate: '2026-11-21',
        experienceYears: form.experienceYears,
        status: form.status,
      };
      onAddTeacher(created);
      onToast('Faculty Added', `${form.name} joined ${form.department}.`);
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Faculty & Teachers
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Academic instructors, department allocations, and teaching profiles
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by instructor name, ID, or subject..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          aria-label="Filter by department"
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="px-5 py-3">Faculty Member</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Subjects</th>
                <th className="px-4 py-3">Classes</th>
                <th className="px-4 py-3 text-right">Experience</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={t.avatar}
                        alt={t.name}
                        className="h-9 w-9 shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
                        <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                          {t.employeeId} · {t.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.department}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {t.subjects.join(' · ')}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {t.classesAssigned.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-700 tabular-nums dark:text-slate-300">
                    {t.experienceYears} yrs
                  </td>
                  <td className="px-4 py-3">
                    <StatusText status={t.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setProfileTeacher(t)}
                        title="View profile"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        title="Edit teacher"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-sky-50 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteTeacher(t.id);
                          onToast('Teacher Removed', `${t.name} removed from directory.`);
                        }}
                        title="Delete teacher"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Profile Modal */}
      <Modal
        isOpen={Boolean(profileTeacher)}
        onClose={() => setProfileTeacher(null)}
        title={profileTeacher?.name || 'Teacher Profile'}
        subtitle={profileTeacher ? `${profileTeacher.employeeId} · ${profileTeacher.department}` : ''}
        footer={
          <button
            type="button"
            onClick={() => setProfileTeacher(null)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Close
          </button>
        }
      >
        {profileTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <SafeImage
                src={profileTeacher.avatar}
                alt={profileTeacher.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profileTeacher.qualification}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {profileTeacher.email}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                    <Phone className="h-3.5 w-3.5" /> {profileTeacher.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-slate-500">Subjects Taught</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profileTeacher.subjects.join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Assigned Cohorts</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {profileTeacher.classesAssigned.join(', ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Joined Thorm Birds Academy</p>
                <p className="mt-1 font-mono text-sm text-slate-700 tabular-nums dark:text-slate-300">
                  {profileTeacher.joinDate}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status</p>
                <div className="mt-1">
                  <StatusText status={profileTeacher.status} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Edit Faculty Member' : 'Add Faculty Member'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="teacher-form"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save Faculty
            </button>
          </>
        }
      >
        <form id="teacher-form" onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Phone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Department
            </label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option>Physical Sciences</option>
              <option>Mathematics</option>
              <option>Humanities</option>
              <option>Computer Science</option>
              <option>Life Sciences</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TeacherRecord['status'] })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subjects (comma-separated)
            </label>
            <input
              type="text"
              value={form.subjectsText}
              onChange={(e) => setForm({ ...form, subjectsText: e.target.value })}
              placeholder="Applied Calculus, Linear Algebra"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Qualification
            </label>
            <input
              type="text"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              placeholder="Ph.D. Physics"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
