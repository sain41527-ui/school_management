import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/ToastContainer';
import { AcademicEntitiesView } from './components/views/AcademicEntitiesView';
import { AdminDashboard } from './components/views/AdminDashboard';
import { AttendanceView } from './components/views/AttendanceView';
import { BookStoreView, CartItem } from './components/views/BookStoreView';
import { ErpGatewayScreen } from './components/views/ErpGatewayScreen';
import { ExaminationsResultsView } from './components/views/ExaminationsResultsView';
import { FeesPaymentsView } from './components/views/FeesPaymentsView';
import { LibraryView } from './components/views/LibraryView';
import { MessagesView } from './components/views/MessagesView';
import { NoticesEventsReportsView } from './components/views/NoticesEventsReportsView';
import { SettingsProfileView } from './components/views/SettingsProfileView';
import { StudentDashboard } from './components/views/StudentDashboard';
import { StudentsDirectoryView } from './components/views/StudentsDirectoryView';
import { TeacherDashboard } from './components/views/TeacherDashboard';
import { TeachersDirectoryView } from './components/views/TeachersDirectoryView';
import { TimetableView } from './components/views/TimetableView';
import { ROLE_META, ROLE_NAV_ITEMS } from './config/navigation';
import {
  INITIAL_ATTENDANCE,
  INITIAL_BOOK_ISSUES,
  INITIAL_CLASSES,
  INITIAL_COURSES,
  INITIAL_EXAMS,
  INITIAL_FEES,
  INITIAL_GUARDIANS,
  INITIAL_HOMEWORK,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_RESULTS,
  INITIAL_SECTIONS,
  INITIAL_STORE_BOOKS,
  INITIAL_STORE_ORDERS,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_THREADS,
  INITIAL_TIMETABLE,
  INITIAL_EVENTS,
} from './data/mockSchoolData';
import {
  AttendanceRecord,
  AttendanceStatus,
  BookIssueRecord,
  ChatThread,
  ExamScheduleItem,
  FeeRecord,
  HomeworkAssignment,
  LibraryBook,
  NavPageId,
  NoticeItem,
  NotificationItem,
  RoleProfile,
  SchoolClassRecord,
  SchoolEvent,
  StoreBook,
  StoreOrder,
  StudentRecord,
  SubjectRecord,
  TeacherRecord,
  ToastMessage,
  UserRole,
} from './types/school';

export default function App() {
  const [schoolName, setSchoolName] = useState('Thorm Birds Academy');
  const [profiles, setProfiles] = useState<Record<UserRole, RoleProfile>>(ROLE_META);
  const [showGateway, setShowGateway] = useState(false);
  const [role, setRole] = useState<UserRole>('admin');
  const [activePage, setActivePage] = useState<NavPageId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Domain State
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS);
  const [guardians] = useState(INITIAL_GUARDIANS);
  const [classes, setClasses] = useState<SchoolClassRecord[]>(INITIAL_CLASSES);
  const [sections] = useState(INITIAL_SECTIONS);
  const [subjects, setSubjects] = useState<SubjectRecord[]>(INITIAL_SUBJECTS);
  const [courses] = useState(INITIAL_COURSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [homework, setHomework] = useState<HomeworkAssignment[]>(INITIAL_HOMEWORK);
  const [fees, setFees] = useState<FeeRecord[]>(INITIAL_FEES);
  const [exams, setExams] = useState<ExamScheduleItem[]>(INITIAL_EXAMS);
  const [results] = useState(INITIAL_RESULTS);
  const [timetable] = useState(INITIAL_TIMETABLE);
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(INITIAL_LIBRARY_BOOKS);
  const [bookIssues, setBookIssues] = useState<BookIssueRecord[]>(INITIAL_BOOK_ISSUES);
  const [storeBooks] = useState<StoreBook[]>(INITIAL_STORE_BOOKS);
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>(INITIAL_STORE_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    const validIds = new Set(ROLE_NAV_ITEMS[nextRole].map((item) => item.id));
    if (!validIds.has(activePage)) {
      setActivePage('dashboard');
    }
    addToast(
      `Switched to ${nextRole.charAt(0).toUpperCase() + nextRole.slice(1)} Portal`,
      undefined,
      'info'
    );
  };

  const handleEnterFromGateway = (targetRole: UserRole, page: NavPageId = 'dashboard') => {
    setRole(targetRole);
    setActivePage(page);
    setShowGateway(false);
  };

  // Attendance handler
  const handleUpdateAttendance = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              status,
              checkInTime: status === 'Absent' ? '—' : rec.checkInTime === '—' ? '08:05 AM' : rec.checkInTime,
            }
          : rec
      )
    );
  };

  // Fee Payment handler
  const handleRecordPayment = (id: string, method: FeeRecord['paymentMethod']) => {
    setFees((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              paidAmount: f.amount,
              status: 'Paid',
              paidDate: '2026-11-21',
              paymentMethod: method,
            }
          : f
      )
    );
  };

  // Library Borrow / Return
  const handleBorrowBook = (bookId: string) => {
    const book = libraryBooks.find((b) => b.id === bookId);
    if (!book || book.copiesAvailable <= 0) return;

    setLibraryBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const nextAvail = b.copiesAvailable - 1;
        return {
          ...b,
          copiesAvailable: nextAvail,
          status: nextAvail === 0 ? 'Borrowed' : 'Available',
        };
      })
    );

    setBookIssues((prev) => [
      {
        id: `iss-${Date.now()}`,
        bookId: book.id,
        bookTitle: book.title,
        borrowerName: role === 'teacher' ? 'Dr. Arthur Bennett' : 'Liam Carter',
        borrowerRole: role === 'teacher' ? 'Teacher' : 'Student',
        issueDate: '2026-11-21',
        dueDate: '2026-12-05',
        status: 'Issued',
      },
      ...prev,
    ]);
  };

  const handleReturnIssue = (issueId: string) => {
    const issue = bookIssues.find((i) => i.id === issueId);
    if (!issue) return;

    setBookIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, status: 'Returned', returnDate: '2026-11-21' } : i
      )
    );

    setLibraryBooks((prev) =>
      prev.map((b) =>
        b.id === issue.bookId
          ? {
              ...b,
              copiesAvailable: Math.min(b.copiesTotal, b.copiesAvailable + 1),
              status: 'Available',
            }
          : b
      )
    );
  };

  // Store Cart & Checkout
  const handleAddToCart = (book: StoreBook) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (bookId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.book.id === bookId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((s, i) => s + i.book.price * i.quantity, 0);
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const summary = cart.map((i) => `${i.book.title} (×${i.quantity})`).join(', ');
    setStoreOrders((prev) => [
      {
        id: `ord-${Date.now()}`,
        orderNo: `ORD-${9050 + prev.length}`,
        customerName: role === 'student' ? 'Liam Carter' : 'Claire Holloway',
        itemsSummary: summary,
        itemCount: count,
        total,
        date: '2026-11-21',
        status: 'Processing',
      },
      ...prev,
    ]);
    setCart([]);
    addToast('Order Placed', `Order total $${total.toFixed(2)} confirmed.`);
  };

  // Messages
  const handleSendMessage = (threadId: string, text: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastTimestamp: 'Just now',
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderName:
                    role === 'admin'
                      ? 'Claire Holloway'
                      : role === 'teacher'
                        ? 'Dr. Arthur Bennett'
                        : 'Liam Carter',
                  senderRole: role,
                  timestamp: 'Just now',
                  text,
                  isOwn: true,
                },
              ],
            }
          : t
      )
    );
  };

  const handleMarkThreadRead = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  const unreadMessagesCount = threads.reduce((s, t) => s + t.unreadCount, 0);
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (showGateway) {
    const presentSample = attendance.filter((a) => a.status !== 'Absent').length;
    const rate =
      attendance.length > 0 ? `${((presentSample / attendance.length) * 100).toFixed(1)}%` : '96.2%';
    return (
      <>
        <ErpGatewayScreen
          schoolName={schoolName}
          totalStudents={248 + students.length}
          totalTeachers={28 + teachers.length}
          totalCourses={16 + courses.length}
          attendanceRate={rate}
          onEnterConsole={handleEnterFromGateway}
        />
        <ToastContainer
          toasts={toasts}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      </>
    );
  }

  const activeProfile = profiles[role];

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        if (role === 'admin') {
          return (
            <AdminDashboard
              schoolName={schoolName}
              students={students}
              teachers={teachers}
              classes={classes}
              courses={courses}
              fees={fees}
              attendance={attendance}
              events={events}
              notifications={notifications}
              darkMode={darkMode}
              onNavigate={setActivePage}
            />
          );
        }
        if (role === 'teacher') {
          return (
            <TeacherDashboard
              profile={activeProfile}
              homework={homework}
              exams={exams}
              timetable={timetable}
              threads={threads}
              notices={notices}
              darkMode={darkMode}
              onNavigate={setActivePage}
            />
          );
        }
        return (
          <StudentDashboard
            profile={activeProfile}
            homework={homework}
            results={results}
            fees={fees}
            timetable={timetable}
            bookIssues={bookIssues}
            storeBooks={storeBooks}
            notices={notices}
            events={events}
            darkMode={darkMode}
            onNavigate={setActivePage}
          />
        );

      case 'students':
        return (
          <StudentsDirectoryView
            role={role}
            students={students}
            onAddStudent={(s) => setStudents((prev) => [s, ...prev])}
            onUpdateStudent={(s) =>
              setStudents((prev) => prev.map((item) => (item.id === s.id ? s : item)))
            }
            onDeleteStudent={(id) =>
              setStudents((prev) => prev.filter((item) => item.id !== id))
            }
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'teachers':
        return (
          <TeachersDirectoryView
            teachers={teachers}
            onAddTeacher={(t) => setTeachers((prev) => [t, ...prev])}
            onUpdateTeacher={(t) =>
              setTeachers((prev) => prev.map((item) => (item.id === t.id ? t : item)))
            }
            onDeleteTeacher={(id) =>
              setTeachers((prev) => prev.filter((item) => item.id !== id))
            }
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'guardians':
      case 'classes':
      case 'sections':
      case 'subjects':
      case 'courses':
      case 'homework':
      case 'assignments':
        return (
          <AcademicEntitiesView
            mode={activePage}
            role={role}
            guardians={guardians}
            classes={classes}
            sections={sections}
            subjects={subjects}
            courses={courses}
            homework={homework}
            onAddHomework={(hw) => setHomework((prev) => [hw, ...prev])}
            onSubmitStudentHomework={(id) =>
              setHomework((prev) =>
                prev.map((h) =>
                  h.id === id
                    ? { ...h, studentStatus: 'Submitted', submissionsCount: h.submissionsCount + 1 }
                    : h
                )
              )
            }
            onAddClass={(c) => setClasses((prev) => [...prev, c])}
            onAddSubject={(s) => setSubjects((prev) => [...prev, s])}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'attendance':
        return (
          <AttendanceView
            role={role}
            records={attendance}
            onUpdateStatus={handleUpdateAttendance}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'fees':
        return (
          <FeesPaymentsView
            role={role}
            fees={fees}
            onRecordPayment={handleRecordPayment}
            onAddInvoice={(inv) => setFees((prev) => [inv, ...prev])}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'examinations':
      case 'results':
        return (
          <ExaminationsResultsView
            mode={activePage}
            role={role}
            exams={exams}
            results={results}
            darkMode={darkMode}
            onAddExam={(ex) => setExams((prev) => [ex, ...prev])}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'timetable':
        return <TimetableView role={role} timetable={timetable} />;

      case 'library':
        return (
          <LibraryView
            role={role}
            books={libraryBooks}
            issues={bookIssues}
            onBorrowBook={handleBorrowBook}
            onReturnIssue={handleReturnIssue}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'bookstore':
        return (
          <BookStoreView
            books={storeBooks}
            orders={storeOrders}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={(id) =>
              setCart((prev) => prev.filter((item) => item.book.id !== id))
            }
            onCheckout={handleCheckout}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'messages':
        return (
          <MessagesView
            role={role}
            threads={threads}
            onSendMessage={handleSendMessage}
            onMarkThreadRead={handleMarkThreadRead}
          />
        );

      case 'notices':
      case 'events':
      case 'reports':
        return (
          <NoticesEventsReportsView
            mode={activePage}
            role={role}
            notices={notices}
            events={events}
            students={students}
            fees={fees}
            attendance={attendance}
            darkMode={darkMode}
            onAddNotice={(n) => setNotices((prev) => [n, ...prev])}
            onAddEvent={(ev) => setEvents((prev) => [ev, ...prev])}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      case 'profile':
      case 'settings':
        return (
          <SettingsProfileView
            mode={activePage}
            role={role}
            profile={activeProfile}
            schoolName={schoolName}
            onUpdateSchoolName={setSchoolName}
            onUpdateProfile={(targetRole, updated) =>
              setProfiles((prev) => ({ ...prev, [targetRole]: updated }))
            }
            onRoleChange={handleRoleChange}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((d) => !d)}
            onToast={(t, d) => addToast(t, d)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        schoolName={schoolName}
        role={role}
        profile={activeProfile}
        onRoleChange={handleRoleChange}
        activePage={activePage}
        onSelectPage={setActivePage}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        unreadMessagesCount={unreadMessagesCount}
        cartItemCount={cartItemCount}
        onOpenGateway={() => setShowGateway(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          role={role}
          profile={activeProfile}
          onRoleChange={handleRoleChange}
          activePage={activePage}
          onSelectPage={setActivePage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          notifications={notifications}
          onMarkAllNotificationsRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onNotificationClick={(item) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
            );
            setActivePage(item.targetPage);
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onOpenGateway={() => setShowGateway(true)}
        />

        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8">
          {renderMainContent()}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
            <span>© 2026 Artificial Pro · {schoolName}</span>
            <span>Academic Term 2026–2027</span>
          </div>
        </footer>
      </div>

      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
