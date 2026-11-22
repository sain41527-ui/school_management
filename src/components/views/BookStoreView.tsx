import React, { useMemo, useState } from 'react';
import { Minus, Plus, Search, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react';
import { StoreBook, StoreOrder } from '../../types/school';
import { Modal } from '../ui/Modal';
import { SafeImage } from '../ui/SafeImage';
import { StatusText } from '../ui/StatusText';

export interface CartItem {
  book: StoreBook;
  quantity: number;
}

interface BookStoreViewProps {
  books: StoreBook[];
  orders: StoreOrder[];
  cart: CartItem[];
  onAddToCart: (book: StoreBook) => void;
  onUpdateCartQty: (bookId: string, delta: number) => void;
  onRemoveFromCart: (bookId: string) => void;
  onCheckout: () => void;
  onToast: (title: string, description?: string) => void;
}

export const BookStoreView: React.FC<BookStoreViewProps> = ({
  books,
  orders,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onCheckout,
  onToast,
}) => {
  const [tab, setTab] = useState<'catalog' | 'orders'>('catalog');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [detailBook, setDetailBook] = useState<StoreBook | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchCat = category === 'All' || b.category === category;
      return matchQ && matchCat;
    });
  }, [books, search, category]);

  const cartTotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Campus Book Store
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Official curriculum textbooks, lab manuals, and annotated editions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              Catalog
            </button>
            <button
              type="button"
              onClick={() => setTab('orders')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                tab === 'orders'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Order History
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            <span className="font-mono tabular-nums">({cartCount})</span>
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
                placeholder="Search textbooks by title or author..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['All', 'Mathematics', 'Physics', 'Humanities', 'Computer Science'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    category === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((book) => (
              <div
                key={book.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setDetailBook(book)}
                    className="block w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
                  >
                    <SafeImage
                      src={book.coverUrl}
                      alt={book.title}
                      fallbackType="book"
                      fallbackLabel={book.title}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  </button>
                  <div className="p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {book.category} · {book.gradeLevel}
                    </p>
                    <button
                      type="button"
                      onClick={() => setDetailBook(book)}
                      className="mt-1 text-left font-display text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                    >
                      {book.title}
                    </button>
                    <p className="mt-0.5 text-xs text-slate-500">{book.author}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                  <span className="font-mono text-base font-bold text-slate-900 tabular-nums dark:text-slate-100">
                    ${book.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(book);
                      onToast('Added to Cart', `${book.title} added.`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
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
                  <th className="px-5 py-3">Order No</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                      {ord.orderNo}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {ord.customerName}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {ord.itemsSummary}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">
                      {ord.date}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusText status={ord.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      <Modal
        isOpen={Boolean(detailBook)}
        onClose={() => setDetailBook(null)}
        title={detailBook?.title || 'Book Details'}
        subtitle={detailBook ? `${detailBook.sku} · ${detailBook.category}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDetailBook(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Close
            </button>
            {detailBook && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart(detailBook);
                  onToast('Added to Cart', `${detailBook.title} added.`);
                  setDetailBook(null);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Add to Cart (${detailBook.price.toFixed(2)})
              </button>
            )}
          </>
        }
      >
        {detailBook && (
          <div className="grid gap-5 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <SafeImage
                src={detailBook.coverUrl}
                alt={detailBook.title}
                fallbackType="book"
                className="aspect-[3/4] w-full rounded-lg object-cover"
              />
            </div>
            <div className="space-y-3 sm:col-span-7">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {detailBook.gradeLevel} · {detailBook.stock} in stock
              </p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                By {detailBook.author}
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {detailBook.description}
              </p>
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                ${detailBook.price.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Shopping Cart Modal */}
      <Modal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Book Store Cart"
        subtitle={`${cartCount} item(s) ready for campus pickup or delivery`}
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Continue Browsing
            </button>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => {
                onCheckout();
                setCartOpen(false);
                setTab('orders');
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              Place Order (${cartTotal.toFixed(2)})
            </button>
          </>
        }
      >
        {cart.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Your cart is empty. Add textbooks from the Book Store catalog.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map((item) => (
              <div key={item.book.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.book.title}
                  </p>
                  <p className="font-mono text-xs text-slate-500 tabular-nums">
                    ${item.book.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateCartQty(item.book.id, -1)}
                    className="rounded border border-slate-200 p-1 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center font-mono text-xs font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateCartQty(item.book.id, 1)}
                    className="rounded border border-slate-200 p-1 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item.book.id)}
                    className="ml-1 rounded p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};
