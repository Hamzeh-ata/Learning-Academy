import { ChapterStudentsList, SelectChapter, SelectCourse } from '@/app/admin/features/course-management';
import { useFetchCourses } from '@/app/admin/hooks';
import { fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import { selectAllChapters } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const StudentsChapters = () => {
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [selectedChapterId, setSelectedChapterId] = useState();
  const [studentsType, setStudentsType] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filters, setFilters] = useState({ first: 0, pageNumber: 1, pageSize: 20 });

  const courses = useFetchCourses();
  const chapters = useSelector(selectAllChapters);

  const handleChapterCourse = (id) => {
    dispatch(fetchChapters({ currentPage: 1, pageSize: 20, courseId: id }));
    setSelectedCourseId(id);
    setSelectedChapterId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">
        <SelectCourse
          courses={courses}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={handleChapterCourse}
          isAddBtnVisible={false}
          containerClassName="!w-1/3"
        />

        {selectedCourseId && !!chapters?.length && (
          <SelectChapter
            chapters={chapters}
            courseId={selectedCourseId}
            selectedChapterId={selectedChapterId}
            setSelectedChapterId={(id) => {
              setSelectedChapterId(id);
              setStudentsType('chapter');
              setSelectedStudents([]);
            }}
            showAddLesson={false}
            className="w-full max-w-full"
            containerClassName="!w-1/2"
          />
        )}
        {selectedCourseId && !chapters?.length && (
          <div className="flex items-center gap-4 mt-4">
            <p className="text-center">This course does not belong to any Chapter! </p>
          </div>
        )}
      </div>

      {selectedCourseId && selectedChapterId && (
        <div className="mt-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l m-1"
            onClick={() => setStudentsType('chapter')}
          >
            Show Chapter Students
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r m-1"
            onClick={() => setStudentsType('none')}
          >
            Show None Chapter Students
          </button>

          <div className="mt-4">
            <span className="text-gray-300">
              {studentsType === 'chapter'
                ? 'Show Chapter Students'
                : studentsType === 'none'
                  ? 'Show None Chapter Students'
                  : 'Students'}
            </span>
            <ChapterStudentsList
              chapterId={selectedChapterId}
              courseId={selectedCourseId}
              setSelectedStudents={setSelectedStudents}
              selectedStudents={selectedStudents}
              filters={filters}
              setFilters={setFilters}
              studentsType={studentsType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsChapters;
