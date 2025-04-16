import { t } from 'i18next';

export const statisticsMapper = (statsContent) => [
  {
    label: t('teachers'),
    count: statsContent?.instructorsCount,
    iconPaths: ['M22 9l-10 -4l-10 4l10 4l10 -4v6', 'M6 10.6v5.4a6 3 0 0 0 12 0v-5.4']
  },
  {
    label: t('students'),
    count: statsContent?.studentsCount,
    iconPaths: [
      'M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0',
      'M6 21v-2a4 4 0 0 1 4 -4h.5',
      'M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z'
    ]
  },
  {
    label: t('courses'),
    count: statsContent?.coursesCount,
    iconPaths: [
      'M10 19h-6a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1h6a2 2 0 0 1 2 2a2 2 0 0 1 2 -2h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2z',
      'M12 5v16',
      'M7 7h1',
      'M7 11h1',
      'M16 7h1',
      'M16 11h1',
      'M16 15h1'
    ]
  },
  {
    label: t('videos'),
    count: statsContent?.videosCount,
    iconPaths: [
      'M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z',
      'M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z'
    ]
  }
];
