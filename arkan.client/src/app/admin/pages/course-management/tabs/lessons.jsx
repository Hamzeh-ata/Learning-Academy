import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchCourses } from '@/app/admin/hooks';
import { selectAllChapters } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { selectAllLessons } from '@/slices/admin-slices/course-management-slices/lessons.slice';
import { fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import { SidebarPanel, Modal } from '@shared/components';
import { fetchLessons } from '@/services/admin-services/course-management-services/lessons.service';
import Vimeo from '@u-wave/react-vimeo';
import { LessonEntry, LessonsList, SelectChapter, SelectCourse } from '@/app/admin/features/course-management';

export const Lessons = () => {
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [selectedChapterId, setSelectedChapterId] = useState();
  const [selectedLesson, setSelectedLesson] = useState();
  const [selectedLessonVideo, setSelectedLessonVideo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const courses = useFetchCourses();
  const chapters = useSelector(selectAllChapters);
  const lessons = useSelector(selectAllLessons);

  const handleChapterCourse = (id) => {
    dispatch(fetchChapters({ currentPage: 1, pageSize: 10, courseId: id }));
    setSelectedCourseId(id);
  };
  const handleLessonChapter = (id) => {
    dispatch(fetchLessons({ currentPage: 1, pageSize: 10, chapterId: id }));
    setSelectedChapterId(id);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };
  const reset = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">
        <SelectCourse
          courses={courses}
          selectedCourseId={selectedCourseId}
          setShowAddChapter={setIsModalOpen}
          setSelectedCourseId={handleChapterCourse}
          isAddBtnVisible={false}
          containerClassName="!w-1/3"
        />
        {selectedCourseId && !!chapters?.length && (
          <SelectChapter
            chapters={chapters}
            courseId={selectedCourseId}
            selectedChapterId={selectedChapterId}
            setShowAddLesson={setIsModalOpen}
            setSelectedChapterId={handleLessonChapter}
            containerClassName="!w-1/3"
          />
        )}

        {selectedCourseId && selectedChapterId && !lessons?.length && (
          <div className="flex items-center gap-4">
            <p className="text-center">This chapter does not belong to any Lesson! </p>
          </div>
        )}
      </div>

      {selectedCourseId && selectedChapterId && !!lessons?.length && (
        <LessonsList
          lessons={lessons}
          setSelectedLessons={handleEditLesson}
          setSelectedLessonVideo={setSelectedLessonVideo}
        />
      )}

      {selectedLessonVideo && (
        <Modal isOpen onClose={() => setSelectedLessonVideo('')}>
          <div>
            <label className="text-white font-md">{selectedLessonVideo.name}</label>
            <div className="flex w-full rounded-lg justify-center bg-slate-700 relative">
              <Vimeo video={selectedLessonVideo?.videoUrl} width={'800'} height={'500'} autoplay />
            </div>
          </div>
        </Modal>
      )}
      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={reset}
        className="course-sidebar"
        isDismissible
        title={`${selectedLesson ? 'Update' : 'Add'} Lesson`}
      >
        <LessonEntry
          chapterId={selectedChapterId}
          lesson={selectedLesson}
          onSubmitted={reset}
          courseId={selectedCourseId}
        />
      </SidebarPanel>
    </div>
  );
};
