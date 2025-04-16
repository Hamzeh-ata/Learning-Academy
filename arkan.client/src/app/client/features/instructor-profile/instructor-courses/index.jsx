import { useNavigate } from 'react-router-dom';
import { getImageFullPath } from '@utils/image-path';

export const InstructorCourses = ({ profile }) => {
  const navigate = useNavigate();
  return (
    <div className="animate-flip-down">
      {!!profile?.courses?.length && (
        <div className="flex flex-wrap gap-6 justify-center pt-2 overflow-y-auto max-h-[400px]">
          {profile?.courses.map((course) => (
            <div
              className="flex transition transform mb-2 hover:-translate-y-1 hover:shadow-lg duration-300 ease-in-out items-center flex-col gap-3 bg-white rounded-lg cursor-pointer shadow-md border shadow-slate-300 w-[250px]"
              key={course.id}
              onClick={() => {
                navigate(`/course/${course.id}`);
              }}
            >
              <div className="bg-opacity-75 hover:bg-opacity-100 overflow-hidden w-full rounded-t-lg border-b-2">
                <img src={getImageFullPath(course.image)} className="bg-slate-100 w-full h-32" alt={course.name} />
              </div>
              <div className="px-4 pt-0 pb-1 text-gray-600 text-center">
                <h3 className="text-base font-semibold mb-2 line-clamp-2">{course.name}</h3>
                <p className="text-md text-gray-500 mb-4 line-clamp-3">{course.description || '----'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!profile?.courses?.length && <p>You don`t have any courses yet!</p>}
    </div>
  );
};
