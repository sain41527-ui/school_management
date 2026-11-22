import React, { useMemo, useState } from 'react';
import { Megaphone, Search, Send, User } from 'lucide-react';
import { ChatThread, UserRole } from '../../types/school';

interface MessagesViewProps {
  role: UserRole;
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onMarkThreadRead: (threadId: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  threads,
  onSendMessage,
  onMarkThreadRead,
}) => {
  const [selectedId, setSelectedId] = useState(threads[0]?.id || '');
  const [filter, setFilter] = useState<'all' | 'teacher' | 'student' | 'guardian' | 'announcement'>('all');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((t) => {
      const matchRole = filter === 'all' || t.participantRole === filter;
      const matchQ = !q || t.participantName.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q);
      return matchRole && matchQ;
    });
  }, [threads, filter, search]);

  const activeThread = threads.find((t) => t.id === selectedId) || filteredThreads[0] || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeThread) return;
    onSendMessage(activeThread.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Campus Messaging
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Direct faculty, student, guardian communication and official announcements
        </p>
      </div>

      <div className="grid min-h-[540px] overflow-hidden rounded-xl border border-slate-200 bg-white lg:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        {/* Left Threads Column */}
        <div className="flex flex-col border-b border-slate-200 lg:col-span-4 lg:border-r lg:border-b-0 dark:border-slate-800">
          <div className="space-y-3 border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'teacher', label: 'Teachers' },
                { id: 'guardian', label: 'Guardians' },
                { id: 'student', label: 'Students' },
                { id: 'announcement', label: 'Notices' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    filter === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {filteredThreads.map((t) => {
              const active = activeThread?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(t.id);
                    onMarkThreadRead(t.id);
                  }}
                  className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors ${
                    active
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                    {t.participantRole === 'announcement' ? (
                      <Megaphone className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                        {t.participantName}
                      </p>
                      <span className="shrink-0 font-mono text-[10px] text-slate-400">
                        {t.lastTimestamp}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-slate-500">{t.subtitle}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                        {t.messages[t.messages.length - 1]?.text}
                      </p>
                      {t.unreadCount > 0 && (
                        <span className="shrink-0 rounded bg-indigo-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white tabular-nums">
                          {t.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Conversation Pane */}
        <div className="flex flex-col lg:col-span-8">
          {activeThread ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                    {activeThread.participantName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeThread.subtitle}
                  </p>
                </div>
                <span className="text-xs font-medium capitalize text-indigo-600 dark:text-indigo-400">
                  {activeThread.participantRole} channel
                </span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/40 p-5 dark:bg-slate-950/30">
                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-xl px-4 py-2.5 text-sm ${
                        msg.isOwn
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-slate-400">
                      {msg.senderName} · {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2.5 border-t border-slate-200 p-3.5 dark:border-slate-800"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${activeThread.participantName}...`}
                  className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">
              Select a conversation to begin messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
