import Lottie from 'lottie-react';
import animateStudent from '@assets/lottie/animate-student';
import animateLesson from '@assets/lottie/animate-lesson';
import animateCourse from '@assets/lottie/animate-course';

export const InstructorInfo = ({ profile }) => (
  <div className="flex flex-col gap-4 animate-flip-down">
    <div className="flex gap-8 justify-center border-b pb-4 flex-wrap">
      {renderStatistics('Courses', profile?.coursesCount, animateCourse)}
      {renderStatistics('Lessons', profile?.lessonsCount, animateLesson)}
      {profile?.showStudentsCount && renderStatistics('Students', profile?.studentsCount, animateStudent)}
    </div>
    <h3 className="font-semibold pt-2">General Info</h3>
    <div className="mt-2 flex flex-col gap-2 px-4 py-2 animate-fade-up">
      {renderProfileInfo('Email', profile?.email)}
      {renderProfileInfo('Phone Number', profile?.phone)}
      {renderProfileInfo('Gender', profile?.sex)}

      {renderProfileInfo('Specialization', profile?.specialty)}
      {renderProfileInfo('Experience', profile?.experience)}
      {renderProfileInfo('Office Hours', profile?.officeHours)}
      {renderProfileInfo('Location', profile?.location)}
    </div>
  </div>
);

const renderProfileInfo = (label, value) => (
  <div className="flex justify-between flex-wrap text-base">
    <label className="">{label}</label>
    <p>{value || '---'}</p>
  </div>
);

const renderStatistics = (label, value, icon) => (
  <div className="flex flex-col justify-center items-center shadow-lg border px-6 py-4 gap-2 rounded-xl animate-jump-in animate-delay-500">
    <Lottie className="h-20" loop animationData={icon} />
    <p>
      {value} {label}
    </p>
  </div>
);
