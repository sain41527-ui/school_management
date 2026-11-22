import React, { useMemo, useState } from 'react';
import { BookMarked, RotateCcw, Search } from 'lucide-react';
import { BookIssueRecord, LibraryBook, UserRole } from '../../types/school';
import { SafeImage } from '../ui/SafeImage';
import { StatusText } from '../ui/StatusText';

interface LibraryViewProps {
  role: UserRole;
  books: LibraryBook[];
  issues: BookIssueRecord[];
  onBorrowBook: (bookId: string) => void;
  onReturnIssue: (issueId: string) => void;
  onToast: (title: string, description?: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  role,
  books,
  issues,
  onBorrowBook,
  onReturnIssue,
  onToast,
}) => {
  const [tab, setTab] = useState<'catalog' | 'history'>('catalog');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Borrowed'>('All');

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [books, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Campus Library
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search academic catalog, verify shelf availability, and track circulation loans
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setTab('catalog')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === 'catalog'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Book Catalog
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === 'history'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Issue History
          </button>
        </div>
      </div>

      {tab === 'catalog' ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {(['All', 'Available', 'Borrowed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <SafeImage
                  src={book.coverUrl}
                  alt={book.title}
                  fallbackType="book"
                  fallbackLabel={book.title}
                  className="h-32 w-24 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {book.category} · Shelf {book.shelf}
                      </span>
                      <StatusText status={book.status} />
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{book.author}</p>
                    <p className="mt-1 font-mono text-[11px] text-slate-400 tabular-nums">
                      ISBN {book.isbn}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                    <span className="font-mono text-xs text-slate-600 tabular-nums dark:text-slate-300">
                      {book.copiesAvailable} / {book.copiesTotal} copies available
                    </span>
                    <button
                      type="button"
                      disabled={book.copiesAvailable === 0}
                      onClick={() => {
                        onBorrowBook(book.id);
                        onToast('Book Checked Out', `${book.title} issued for 14 days.`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <BookMarked className="h-3.5 w-3.5" />
                      <span>{role === 'admin' ? 'Issue Copy' : 'Borrow Book'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3">Book Title</th>
                  <th className="px-4 py-3">Borrower</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {issues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {iss.bookTitle}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {iss.borrowerName} · {iss.borrowerRole}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">
                      {iss.issueDate}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">
                      {iss.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <StatusText status={iss.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {iss.status !== 'Returned' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onReturnIssue(iss.id);
                            onToast('Book Returned', `${iss.bookTitle} checked back into shelf.`);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Mark Returned</span>
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-slate-400">
                          {iss.returnDate}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
