import React from 'react';
import {
  AlertTriangle,
  BookMarked,
  CheckCircle2,
  Clock,
  MinusCircle,
  XCircle,
} from 'lucide-react';

type StatusVariant =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Paid'
  | 'Pending'
  | 'Overdue'
  | 'Active'
  | 'Inactive'
  | 'On Leave'
  | 'Available'
  | 'Borrowed'
  | 'Issued'
  | 'Returned'
  | 'Submitted'
  | 'Graded'
  | 'Scheduled'
  | 'Completed'
  | 'Delivered'
  | 'Processing'
  | 'Ready for Pickup';

export const StatusText: React.FC<{ status: StatusVariant }> = ({ status }) => {
  switch (status) {
    case 'Present':
    case 'Paid':
    case 'Active':
    case 'Available':
    case 'Returned':
    case 'Graded':
    case 'Completed':
    case 'Delivered':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Late':
    case 'Pending':
    case 'On Leave':
    case 'Submitted':
    case 'Scheduled':
    case 'Processing':
    case 'Ready for Pickup':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Borrowed':
    case 'Issued':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
          <BookMarked className="h-3.5 w-3.5 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Overdue':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Absent':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
          <XCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Inactive':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <MinusCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{status}</span>
        </span>
      );
  }
};
