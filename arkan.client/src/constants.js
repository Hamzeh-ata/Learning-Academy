export const USER_TOKEN = 'ARKAN_TOKEN';
export const ADMIN_ROLE = 'Admin';
export const STUDENT_ROLE = 'Student';

export const MOBILE_MAX_WIDTH_QUERY = '(max-width: 768px)';
export const TABLET_MAX_WIDTH_QUERY = '(max-width: 1024px)';

export const IGNORED_ERROR_KEYS = [
  'QuizNotFound',
  'Unauthorized',
  'InvalidCredentials',
  'Email not found',
  'Password change request already made',
  'EmailExists'
];

export const ERROR_MESSAGES = {
  ['InvalidCredentials']: '*Username or password is incorrect',
  ['EmailExists']: '*Email already exists'
};
export const COURSE_STATUSES = [
  { name: 'Active', id: 0 },
  { name: 'Inactive', id: 1 },
  { name: 'Archived', id: 2 }
];

export const SEX = [
  { name: 'Male', id: 'male' },
  { name: 'Female', id: 'female' }
];

export const PRODUCT_TYPE = {
  course: 0,
  package: 1
};

export const DROP_DOWN_TYPES = {
  Instructors: 'Instructors',
  Categories: 'Categories',
  Packages: 'Packages',
  Universities: 'Universities',
  Courses: 'Courses',
  Students: 'Students'
};

export const ARKAN_CODE_TYPE = {
  Course: 0,
  Instructor: 1,
  Package: 2
};

export const PROMO_CODE_TYPE = {
  AmountThreshold: 0,
  CountThreshold: 1
};

export const NOTIFICATION_TYPE = {
  Course: 0,
  Package: 1,
  Announcements: 2
};

export const NOTIFICATION_AUDIENCE = {
  Student: 0,
  Instructor: 1
};

export const SOCKET_TOPICS = {
  ADMIN: 'admin',
  CLIENT: 'client'
};

export const LiveSessionStatus = {
  Started: 0,
  Pending: 1,
  Finished: 2
};
