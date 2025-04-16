import { CourseChaptersView, CourseOverView } from '@(client)/features/course-profile';
import coverImage from '@assets/images/user-cover.png';
import { useIsStudent } from '@hooks';
import { fetchCourseById, fetchCourseChapters } from '@services/client-services/course-profile.service';
import { selectCourseProfile, selectCourseProfileChapters } from '@slices/client-slices/course-profile.slice';
import Vimeo from '@u-wave/react-vimeo';
import { getImageFullPath } from '@utils/image-path';
import { Chip } from 'primereact/chip';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const CourseProfile = () => {
  const { id } = useParams();
  const isStudent = useIsStudent();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courseData = useSelector(selectCourseProfile);
  const courseChapters = useSelector(selectCourseProfileChapters);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
      dispatch(fetchCourseChapters(id));
    }
  }, [id, dispatch, isStudent]);

  useEffect(() => {
    if (!isStudent && courseData?.editAble) {
      navigate(`/instructor-course/${courseData.id}`);
    }
  }, [isStudent, courseData, navigate]);

  return (
    <div className="relative">
      <div className="relative">
        <img
          src={getImageFullPath(courseData.imageOverView, coverImage)}
          alt="courseCover"
          className="w-full h-[478px] brightness-50"
        />

        <div className="absolute top-0 text-3xl font-semibold w-full justify-center flex-col flex items-center h-full text-shadow-50 text-white text-center gap-1">
          <p>{courseData.name}</p>
          <p className="flex gap-2 flex-wrap">
            {!!courseData.categories.length &&
              courseData.categories.map((category) => (
                <Chip
                  key={category}
                  className="bg-slate-400 rounded-md bg-opacity-20 px-2 text-slate-300"
                  label={category}
                />
              ))}
          </p>
        </div>
      </div>

      <CourseOverView courseData={courseData} courseChapters={courseChapters} />

      <div className="flex justify-center py-4 flex-col items-center">
        <div className="flex w-[90%] px-2 lg:w-1/2 rounded-lg justify-center relative xl:-top-36 xl:left-0">
          <div className="relative w-full pt-[56.25%] overflow-hidden">
            {courseData.videoOverView && (
              <Vimeo
                video={courseData.videoOverView}
                width={'100%'}
                height={'100%'}
                className="inset-0 absolute w-full h-full"
              />
            )}
            {!courseData.videoOverView && (
              <img
                className="w-full h-full absolute inset-0"
                src={getImageFullPath(courseData.image)}
                alt="default video"
              />
            )}
          </div>
        </div>

        <div className="w-[90%] lg:w-1/2 text-center relative xl:-top-36">
          <div className="border-b border-blue-grey-900 pb-4">
            <h3 className="font-semibold py-4 text-arkan text-lg">Course Description</h3>
            <p className="text-center text-blue-grey-600">{courseData.description}</p>
          </div>

          <CourseChaptersView chapters={courseChapters?.chapters} courseData={courseData} />
        </div>
      </div>
    </div>
  );
};

export default CourseProfile;
