const getSvgIcon = (children) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-signature"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const sidebarRoutes = [
  {
    path: 'admin-home',
    label: 'Home',
    alias: ['Dashboard'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2" />
      </>
    )
  },
  {
    path: 'users',
    label: 'Users Management',
    alias: ['Admins', 'Students', 'Instructors'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5" />
        <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M19.001 15.5v1.5" />
        <path d="M19.001 21v1.5" />
        <path d="M22.032 17.25l-1.299 .75" />
        <path d="M17.27 20l-1.3 .75" />
        <path d="M15.97 17.25l1.3 .75" />
        <path d="M20.733 20l1.3 .75" />
      </>
    )
  },
  {
    path: 'catalog-management',
    label: 'Catalog Management',
    alias: ['Courses', 'Category', 'Packages', 'Universities'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12.5 19h-7.5a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3" />
        <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M19.001 15.5v1.5" />
        <path d="M19.001 21v1.5" />
        <path d="M22.032 17.25l-1.299 .75" />
        <path d="M17.27 20l-1.3 .75" />
        <path d="M15.97 17.25l1.3 .75" />
        <path d="M20.733 20l1.3 .75" />
      </>
    )
  },
  {
    path: 'course-management',
    label: 'Course Management',
    alias: ['Lessons', 'Chapters', 'quizzes', 'Quiz Attempts', 'Chapter Students'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 16h-8a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v7" />
        <path d="M7 20h5" />
        <path d="M9 16v4" />
        <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M19.001 15.5v1.5" />
        <path d="M19.001 21v1.5" />
        <path d="M22.032 17.25l-1.299 .75" />
        <path d="M17.27 20l-1.3 .75" />
        <path d="M15.97 17.25l1.3 .75" />
        <path d="M20.733 20l1.3 .75" />
      </>
    )
  },
  {
    path: 'codes',
    label: 'Codes',
    alias: ['PromoCodes', 'arkan code'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 10l-2 -6" />
        <path d="M7 10l2 -6" />
        <path d="M11 20h-3.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304c-.21 1.202 -.37 2.104 -.475 2.705" />
        <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M20 21l2 -2l-2 -2" />
        <path d="M17 17l-2 2l2 2" />
      </>
    )
  },

  {
    path: '/orders',
    label: 'Orders',
    alias: ['confirmed orders', 'pending orders', 'payments'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
        <path d="M12 17v1m0 -8v1" />
      </>
    )
  },
  {
    path: '/change-password-requests',
    label: 'Password requests',
    alias: ['forgotten passwords'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 17v4" />
        <path d="M10 20l4 -2" />
        <path d="M10 18l4 2" />
        <path d="M5 17v4" />
        <path d="M3 20l4 -2" />
        <path d="M3 18l4 2" />
        <path d="M19 17v4" />
        <path d="M17 20l4 -2" />
        <path d="M17 18l4 2" />
        <path d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        <path d="M7 14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2" />
      </>
    )
  },
  {
    path: 'content-management',
    label: 'Content Management',
    alias: ['client', 'sections', 'faq'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 4m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" />
        <path d="M7 20h10" />
        <path d="M9 16v4" />
        <path d="M15 16v4" />
        <path d="M7 10h2l2 3l2 -6l1 3h3" />{' '}
      </>
    )
  },
  {
    path: 'notifications',
    label: 'Notifications',
    alias: ['Announcements'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 17h-8a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v.5" />
        <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M19.001 15.5v1.5" />
        <path d="M19.001 21v1.5" />
        <path d="M22.032 17.25l-1.299 .75" />
        <path d="M17.27 20l-1.3 .75" />
        <path d="M15.97 17.25l1.3 .75" />
        <path d="M20.733 20l1.3 .75" />
        <path d="M9 17v1a3 3 0 0 0 3 3" />
      </>
    )
  },
  {
    path: 'inbox',
    label: 'Inbox',
    alias: ['messages', 'support'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5" />
        <path d="M12 11v-8h4l2 2l-2 2h-4" />
        <path d="M6 15h1" />
      </>
    )
  },
  {
    path: 'courses-inbox',
    label: 'Courses Inbox',
    alias: ['messages', 'courses-inbox'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5" />
        <path d="M12 11v-8h4l2 2l-2 2h-4" />
        <path d="M6 15h1" />
      </>
    )
  },
  {
    path: 'activity-log',
    label: 'Activity Log',
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 12h4l3 8l4 -16l3 8h4" />
      </>
    )
  },

  {
    path: 'roles',
    label: 'Roles & Permissions',
    alias: ['pages'],
    icon: getSvgIcon(
      <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M6 4v4" />
        <path d="M6 12v8" />
        <path d="M13.199 14.399a2 2 0 1 0 -1.199 3.601" />
        <path d="M12 4v10" />
        <path d="M12 18v2" />
        <path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M18 4v1" />
        <path d="M18 9v2.5" />
        <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M19.001 15.5v1.5" />
        <path d="M19.001 21v1.5" />
        <path d="M22.032 17.25l-1.299 .75" />
        <path d="M17.27 20l-1.3 .75" />
        <path d="M15.97 17.25l1.3 .75" />
        <path d="M20.733 20l1.3 .75" />
      </>
    )
  }
];
