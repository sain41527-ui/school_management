export type UserRole = 'admin' | 'teacher' | 'student';

export interface RoleProfile {
  panelTitle: string;
  userName: string;
  userTitle: string;
  email: string;
  phone: string;
  departmentOrCohort: string;
  avatar: string;
}

export type NavPageId =
  | 'dashboard'
  | 'profile'
  | 'students'
  | 'teachers'
  | 'guardians'
  | 'classes'
  | 'sections'
  | 'subjects'
  | 'courses'
  | 'attendance'
  | 'homework'
  | 'assignments'
  | 'fees'
  | 'examinations'
  | 'results'
  | 'timetable'
  | 'library'
  | 'bookstore'
  | 'messages'
  | 'notices'
  | 'events'
  | 'reports'
  | 'settings';

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  admissionDate: string;
  attendanceRate: number;
  gpa: number;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  status: 'Active' | 'Inactive';
  address: string;
  avatar?: string;
}

export interface TeacherRecord {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  classesAssigned: string[];
  qualification: string;
  joinDate: string;
  experienceYears: number;
  status: 'Active' | 'On Leave';
  avatar?: string;
}

export interface GuardianRecord {
  id: string;
  name: string;
  relation: string;
  email: string;
  phone: string;
  occupation: string;
  studentNames: string[];
  studentIds: string[];
  address: string;
}

export interface SchoolClassRecord {
  id: string;
  name: string;
  gradeLevel: number;
  sections: string[];
  classTeacher: string;
  roomNumber: string;
  studentCount: number;
  capacity: number;
}

export interface SectionRecord {
  id: string;
  className: string;
  sectionName: string;
  advisor: string;
  room: string;
  studentsCount: number;
  scheduleTrack: string;
}

export interface SubjectRecord {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  teacher: string;
  classes: string[];
  type: 'Core' | 'Elective' | 'Lab';
}

export interface CourseRecord {
  id: string;
  code: string;
  title: string;
  gradeBand: string;
  instructor: string;
  enrolled: number;
  modules: number;
  completionRate: number;
  term: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  section: string;
  date: string;
  status: AttendanceStatus;
  checkInTime: string;
  remarks?: string;
}

export interface HomeworkAssignment {
  id: string;
  kind: 'homework' | 'assignment';
  title: string;
  subject: string;
  className: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
  studentStatus: 'Submitted' | 'Pending' | 'Graded';
  score?: string;
  description: string;
}

export interface FeeRecord {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'Card' | 'Bank Transfer' | 'Portal ACH' | 'Cash';
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ExamScheduleItem {
  id: string;
  examTitle: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  room: string;
  maxMarks: number;
  invigilator: string;
  status: 'Scheduled' | 'Completed';
}

export interface ExamResultRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  examTitle: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  time: string;
  className: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  shelf: string;
  copiesTotal: number;
  copiesAvailable: number;
  status: 'Available' | 'Borrowed';
  coverUrl: string;
}

export interface BookIssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerRole: 'Student' | 'Teacher';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
}

export interface StoreBook {
  id: string;
  sku: string;
  title: string;
  author: string;
  category: string;
  gradeLevel: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  coverUrl: string;
}

export interface StoreOrder {
  id: string;
  orderNo: string;
  customerName: string;
  itemsSummary: string;
  itemCount: number;
  total: number;
  date: string;
  status: 'Delivered' | 'Processing' | 'Ready for Pickup';
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: UserRole | 'guardian';
  timestamp: string;
  text: string;
  isOwn?: boolean;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantRole: 'teacher' | 'student' | 'guardian' | 'announcement';
  subtitle: string;
  unreadCount: number;
  lastTimestamp: string;
  messages: ChatMessage[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'Academic' | 'Administration' | 'Examination' | 'Finance' | 'Campus';
  audience: 'All' | 'Teachers' | 'Students & Parents';
  publishedBy: string;
  date: string;
  pinned?: boolean;
  body: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'Academic' | 'Athletics' | 'Cultural' | 'Parent Meeting';
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendeesCount: number;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  targetPage: NavPageId;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning' | 'error';
}
