import { useDispatch, useSelector } from 'react-redux';
import { selectInstructorProfile } from '@slices/client-slices/instructor.slice';
import { useEffect, useState } from 'react';
import { getPublicProfile } from '@services/client-services/instructor.service';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { InstructorCourses, InstructorHeader, InstructorInfo } from '@(client)/features/instructor-profile';

const InstructorProfile = () => {
  const { instructorId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');

  const dispatch = useDispatch();

  useEffect(() => {
    if (instructorId) {
      dispatch(getPublicProfile({ instructorId }));
    }
  }, [dispatch, instructorId]);

  const instructorProfile = useSelector(selectInstructorProfile);

  if (!instructorProfile?.id) {
    return;
  }

  return (
    <div className="flex justify-center items-center px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1">
      <div className="flex flex-col bg-white rounded-4xl px-10 w-full py-6 relative gap-8 overflow-hidden xl:w-2/3">
        <InstructorHeader profile={instructorProfile} />
        <div className="lg:mt-28 mt-2 ps-2 justify-center flex flex-col">
          <div className="flex justify-center items-center gap-4 font-semibold mb-4">
            <button
              className={classNames({
                'decoration-2 underline-offset-4 decoration-arkan underline': activeTab === 'profile'
              })}
              onClick={() => {
                setActiveTab('profile');
              }}
            >
              Profile
            </button>
            <button
              className={classNames({
                'decoration-2 underline-offset-4 decoration-arkan underline': activeTab === 'courses'
              })}
              onClick={() => {
                setActiveTab('courses');
              }}
            >
              Courses
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-2xl border border-slate-400 py-4 px-4">
            {activeTab === 'profile' && <InstructorInfo profile={instructorProfile} />}
            {activeTab === 'courses' && <InstructorCourses profile={instructorProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
