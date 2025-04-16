import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { Layout } from '@/app/public/layout';
import { NotFoundPage } from '@/app/public/pages/not-found';
import LoginPage from '@/app/public/pages/login-page/login-page';
import HomePage from '@/app/public/pages/home/home-page';
import LiveStream from '@/app/client/pages/live-stream';
import AboutUs from '@/app/public/pages/about-us';
import Meeting from '@/app/client/pages/live-stream/meeting';

const UserProfile = React.lazy(() => import('@(client)/pages/user-profile'));
const CheckoutPage = React.lazy(() => import('@(client)/pages/checkout-page'));
const MyLessons = React.lazy(() => import('@(client)/pages/my-lessons'));
const CourseLesson = React.lazy(() => import('@(client)/pages/course-lesson'));
const Courses = React.lazy(() => import('@(client)/pages/courses'));
const CourseProfile = React.lazy(() => import('@(client)/pages/course-profile'));
const Instructors = React.lazy(() => import('@(client)/pages/instructors'));
const InstructorProfile = React.lazy(() => import('@(client)/pages/instructor-profile'));
const InstructorCourseProfile = React.lazy(() => import('@(client)/pages/instructor-course-profile'));
const Categories = React.lazy(() => import('@(client)/pages/categories'));
const ClientPackages = React.lazy(() => import('@(client)/pages/client-packages'));
const MessagesPage = React.lazy(() => import('@(client)/pages/messages'));

export const ClientRoutes = () => (
  <Routes>
    <Route Component={Layout}>
      {/* Public Routes */}
      <Route index Component={HomePage} />
      <Route path="/home" Component={HomePage} />
      <Route
        path="/course"
        element={
          <Suspense fallback={<>Loading...</>}>
            <Courses />
          </Suspense>
        }
      />
      <Route
        path="/course/:id"
        element={
          <Suspense fallback={<>Loading...</>}>
            <CourseProfile />
          </Suspense>
        }
      />
      <Route
        path="/instructor"
        element={
          <Suspense fallback={<>Loading...</>}>
            <Instructors />
          </Suspense>
        }
      />
      <Route
        path="/categories"
        element={
          <Suspense fallback={<>Loading...</>}>
            <Categories />
          </Suspense>
        }
      />
      <Route
        path="/packages"
        element={
          <Suspense fallback={<>Loading...</>}>
            <ClientPackages />
          </Suspense>
        }
      />
      <Route
        path="/instructor/:instructorId"
        element={
          <Suspense fallback={<>Loading...</>}>
            <InstructorProfile />
          </Suspense>
        }
      />
      <Route
        path="/about-us"
        element={
          <Suspense fallback={<>Loading...</>}>
            <AboutUs />
          </Suspense>
        }
      />

      {/* Routes for logged in users only*/}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/user-profile"
          element={
            <Suspense fallback={<>Loading...</>}>
              <UserProfile />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<>Loading...</>}>
              <CheckoutPage />
            </Suspense>
          }
        />
        <Route
          path="/instructor-course/:id"
          element={
            <Suspense fallback={<>Loading...</>}>
              <InstructorCourseProfile />
            </Suspense>
          }
        />
        <Route
          path="/my-lessons"
          element={
            <Suspense fallback={<>Loading...</>}>
              <MyLessons />
            </Suspense>
          }
        />
        <Route
          path="/lesson/:courseId/:lessonId?"
          element={
            <Suspense fallback={<>Loading...</>}>
              <CourseLesson />
            </Suspense>
          }
        />

        <Route
          path="/messages"
          element={
            <Suspense fallback={<>Loading...</>}>
              <MessagesPage />
            </Suspense>
          }
        />
        <Route
          path="/live-stream"
          element={
            <Suspense fallback={<>Loading...</>}>
              <LiveStream />
            </Suspense>
          }
        />
        <Route
          path="/Live/:meetingId"
          element={
            <Suspense fallback={<>Loading...</>}>
              <Meeting />
            </Suspense>
          }
        />
      </Route>
      <Route path="/unauthorized" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/" Component={<HomePage />} />
    </Route>
  </Routes>
);
