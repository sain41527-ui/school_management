import React, { useMemo, useState } from 'react';
import { CreditCard, FileText, Plus, Printer, Receipt } from 'lucide-react';
import { FeeRecord, UserRole } from '../../types/school';
import { Modal } from '../ui/Modal';
import { StatusText } from '../ui/StatusText';

interface FeesPaymentsViewProps {
  role: UserRole;
  fees: FeeRecord[];
  onRecordPayment: (id: string, method: FeeRecord['paymentMethod']) => void;
  onAddInvoice: (invoice: FeeRecord) => void;
  onToast: (title: string, description?: string) => void;
}

export const FeesPaymentsView: React.FC<FeesPaymentsViewProps> = ({
  role,
  fees,
  onRecordPayment,
  onAddInvoice,
  onToast,
}) => {
  const [tab, setTab] = useState<'all' | 'pending' | 'history'>('all');
  const [receiptFee, setReceiptFee] = useState<FeeRecord | null>(null);
  const [payModalFee, setPayModalFee] = useState<FeeRecord | null>(null);
  const [payMethod, setPayMethod] = useState<FeeRecord['paymentMethod']>('Card');

  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [invStudent, setInvStudent] = useState('Liam Carter');
  const [invType, setInvType] = useState('Science Lab Equipment Fee');
  const [invAmount, setInvAmount] = useState('280');

  const scopedFees = useMemo(() => {
    const base = role === 'student' ? fees.filter((f) => f.studentId === 'stu-1') : fees;
    if (tab === 'pending') return base.filter((f) => f.status !== 'Paid');
    if (tab === 'history') return base.filter((f) => f.status === 'Paid');
    return base;
  }, [fees, role, tab]);

  const totalCollected = (role === 'student' ? fees.filter((f) => f.studentId === 'stu-1') : fees).reduce(
    (s, f) => s + f.paidAmount,
    0
  );
  const totalPending = (role === 'student' ? fees.filter((f) => f.studentId === 'stu-1') : fees).reduce(
    (s, f) => s + Math.max(0, f.amount - f.paidAmount),
    0
  );

  const handleConfirmPayment = () => {
    if (!payModalFee) return;
    onRecordPayment(payModalFee.id, payMethod);
    onToast(
      'Payment Settled',
      `${payModalFee.invoiceNo} marked as Paid via ${payMethod}.`
    );
    setPayModalFee(null);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(invAmount) || 250;
    onAddInvoice({
      id: `fee-${Date.now()}`,
      invoiceNo: `INV-2026-${8850 + fees.length}`,
      studentId: 'stu-1',
      studentName: invStudent,
      className: 'Grade 11',
      feeType: invType,
      amount: amt,
      paidAmount: 0,
      dueDate: '2026-12-15',
      status: 'Pending',
    });
    onToast('Invoice Generated', `Issued $${amt} invoice for ${invStudent}.`);
    setNewInvoiceOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Fees & Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {role === 'student'
              ? 'View tuition invoices, settle balances, and download receipts'
              : 'Fee collection ledger, pending balances, and official payment receipts'}
          </p>
        </div>

        {role === 'admin' && (
          <button
            type="button"
            onClick={() => setNewInvoiceOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500">Total Settled</p>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
            ${totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500">Outstanding Dues</p>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
            ${totalPending.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500">Overdue Accounts</p>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 tabular-nums dark:text-rose-400">
            {fees.filter((f) => f.status === 'Overdue').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'pending', label: 'Pending & Overdue' },
            { id: 'history', label: 'Payment History' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as 'all' | 'pending' | 'history')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="px-5 py-3">Invoice</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Fee Description</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scopedFees.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                    {f.invoiceNo}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{f.studentName}</p>
                    <p className="text-[11px] text-slate-500">{f.className}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{f.feeType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">{f.dueDate}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    ${f.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
                    ${f.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusText status={f.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {f.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => setPayModalFee(f)}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 whitespace-nowrap"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>{role === 'student' ? 'Pay Now' : 'Record Pay'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setReceiptFee(f)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={Boolean(payModalFee)}
        onClose={() => setPayModalFee(null)}
        title="Process Fee Payment"
        subtitle={payModalFee ? `${payModalFee.invoiceNo} · ${payModalFee.studentName}` : ''}
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPayModalFee(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmPayment}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Confirm Payment
            </button>
          </>
        }
      >
        {payModalFee && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500">Balance Due</p>
              <p className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                ${(payModalFee.amount - payModalFee.paidAmount).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {payModalFee.feeType}
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Method
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as FeeRecord['paymentMethod'])}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Card">Credit / Debit Card</option>
                <option value="Portal ACH">Portal ACH Transfer</option>
                <option value="Bank Transfer">Wire / Bank Transfer</option>
                <option value="Cash">Bursar Desk Cash</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Official Receipt Modal */}
      <Modal
        isOpen={Boolean(receiptFee)}
        onClose={() => setReceiptFee(null)}
        title="Official Tuition Receipt"
        subtitle="Thorm Birds Academy · Bursar Office"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                onToast('Receipt Prepared', 'Printable receipt view formatted.');
                window.print();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => setReceiptFee(null)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Done
            </button>
          </>
        }
      >
        {receiptFee && (
          <div className="space-y-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                  Artificial Pro · Thorm Birds Academy
                </p>
                <p className="text-xs text-slate-500">400 Academic Way, San Francisco, CA</p>
              </div>
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Invoice Number</span>
                <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {receiptFee.invoiceNo}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Student</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {receiptFee.studentName} ({receiptFee.className})
                </p>
              </div>
              <div>
                <span className="text-slate-500">Status</span>
                <div className="mt-0.5">
                  <StatusText status={receiptFee.status} />
                </div>
              </div>
              <div>
                <span className="text-slate-500">Payment Method</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {receiptFee.paymentMethod || 'Unpaid'}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{receiptFee.feeType}</span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  ${receiptFee.amount.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Amount Paid</span>
                <span className="font-mono font-semibold tabular-nums text-emerald-600">
                  ${receiptFee.paidAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={newInvoiceOpen}
        onClose={() => setNewInvoiceOpen(false)}
        title="Generate Fee Invoice"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setNewInvoiceOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="invoice-form"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Issue Invoice
            </button>
          </>
        }
      >
        <form id="invoice-form" onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Student Name
            </label>
            <input
              type="text"
              value={invStudent}
              onChange={(e) => setInvStudent(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fee Category
            </label>
            <input
              type="text"
              value={invType}
              onChange={(e) => setInvType(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount (USD)
            </label>
            <input
              type="number"
              value={invAmount}
              onChange={(e) => setInvAmount(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
