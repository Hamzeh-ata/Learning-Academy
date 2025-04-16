import { configureStore } from '@reduxjs/toolkit';
import adminsReducer from '@/slices/admin-slices/user-slices/admins.slice';
import categoryCoursesReducer from '@/slices/admin-slices/catalog-management-slices/category-courses.slice';
import categoriesReducer from '@/slices/admin-slices/catalog-management-slices/category.slice';
import chaptersReducer from '@/slices/admin-slices/course-management-slices/chapters.slice';
import coursesReducer from '@/slices/admin-slices/catalog-management-slices/courses.slice';
import instructorsReducer from '@/slices/admin-slices/user-slices/instructor.slice';
import lessonsReducer from '@/slices/admin-slices/course-management-slices/lessons.slice';
import nonEnrolledReducer from '@/slices/admin-slices/user-slices/non-enrolled.slice';
import quizzesSlice from '@/slices/admin-slices/course-management-slices/quizzes.slice';
import rolesReducer from '@slices/admin-slices/roles.slice';
import studentCoursesSlice from '@/slices/admin-slices/user-slices/student-courses.slice';
import studentInfoSlice from '@/slices/admin-slices/user-slices/student-info.slice';
import studentsReducer from '@/slices/admin-slices/user-slices/students.slice';
import universitiesReducer from '@/slices/admin-slices/catalog-management-slices/university.slice';
import authReducer from '@slices/auth/auth.slice';
import { refreshTokenMiddleware } from '@slices/auth/refresh-token-middleware';
import contentManagementReducer from '@slices/client-slices/content-management.slice';
import courseProfileSlice from '@slices/client-slices/course-profile.slice';
import userProfileSlice from '@slices/client-slices/user-profile.slice';
import userCartSlice from '@slices/client-slices/user-cart.slice';
import { thunk } from 'redux-thunk';
import coursesFilterSlice from './slices/client-slices/courses-filter.slice';
import dropdownsSlice from './slices/shared/dropdown.slice';
import lessonQuizSlice from './slices/client-slices/lesson-quiz.slice';
import instructorSlice from './slices/client-slices/instructor.slice';
import ordersSlice from './slices/admin-slices/orders.slice';
import InstructorCourseProfileSlice from './slices/client-slices/instructor-course-profile.slice';
import instructorChaptersSlice from './slices/client-slices/instructor-chapters.slice';
import instructorQuizSlice from './slices/client-slices/instructor-quiz.slice';
import categoriesFilterSlice from './slices/client-slices/categories-filter.slice';
import { packagesReducer } from './slices/admin-slices/catalog-management-slices/package.slice';
import { arkanCodeReducer } from './slices/admin-slices/codes-slices/arkan-code.slice';
import { promoCodeReducer } from './slices/admin-slices/codes-slices/promo-code.slice';
import ChangePasswordRequestsSlicesReducer from './slices/admin-slices/change-password-requests.slice';
import QuizAttemptsSlice from './slices/admin-slices/quiz-attempts.slice';
import packagesFilterSlice from './slices/client-slices/packages-filter.slice';
import adminContentManagementReducer from './slices/admin-slices/content-management-slices';
import statisticsSlice from './slices/admin-slices/statistics.slice';
import notificationsSlice from './slices/shared/notifications.slice';
import { AdminNotificationsReducer } from './slices/admin-slices/admin-notifications.slice';
import chatRoomSlice from './slices/client-slices/chat-room.slice';
import clientRoomSlice from './slices/client-slices/client-chat.slice';
import StudentsChaptersSlice from './slices/admin-slices/students-chapters.slice';
import chatBotReducer from './slices/shared/chatbot.slice';
import frequentlyQuestionsSlice from './slices/admin-slices/frequently-questions.slice';
import { UserSessionsReducer } from './slices/admin-slices/user-sessions.slice';
import ActvitesLogSlice from './slices/admin-slices/activity-log.slice';
import liveStreamSlice from './slices/client-slices/live-stream.slice';
import coursesChatSlice from './slices/admin-slices/courses-chat.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admins: adminsReducer,
    students: studentsReducer,
    categories: categoriesReducer,
    categoryCourses: categoryCoursesReducer,
    nonEnrolled: nonEnrolledReducer,
    roles: rolesReducer,
    courses: coursesReducer,
    studentInfo: studentInfoSlice,
    instructors: instructorsReducer,
    chapters: chaptersReducer,
    lessons: lessonsReducer,
    studentCourses: studentCoursesSlice,
    quizzes: quizzesSlice,
    universities: universitiesReducer,
    contentManagement: contentManagementReducer,
    userProfile: userProfileSlice,
    courseProfile: courseProfileSlice,
    cart: userCartSlice,
    coursesFilter: coursesFilterSlice,
    dropdowns: dropdownsSlice,
    lessonQuiz: lessonQuizSlice,
    clientInstructors: instructorSlice,
    orders: ordersSlice,
    instructorCourseProfile: InstructorCourseProfileSlice,
    instructorChapters: instructorChaptersSlice,
    instructorQuiz: instructorQuizSlice,
    categoriesFilter: categoriesFilterSlice,
    packagesFilter: packagesFilterSlice,
    packages: packagesReducer,
    arkanCodes: arkanCodeReducer,
    promoCode: promoCodeReducer,
    changePasswordRequests: ChangePasswordRequestsSlicesReducer,
    quizAttempts: QuizAttemptsSlice,
    adminContentManagement: adminContentManagementReducer,
    adminStatistics: statisticsSlice,
    notifications: notificationsSlice,
    adminNotifications: AdminNotificationsReducer,
    chatRooms: chatRoomSlice,
    clientChatRooms: clientRoomSlice,
    studentsChapters: StudentsChaptersSlice,
    chatBot: chatBotReducer,
    frequentlyQuestions: frequentlyQuestionsSlice,
    userSessions: UserSessionsReducer,
    actvitesLog: ActvitesLogSlice,
    liveStream: liveStreamSlice,
    coursesChat: coursesChatSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(refreshTokenMiddleware, thunk)
});

export default store;
