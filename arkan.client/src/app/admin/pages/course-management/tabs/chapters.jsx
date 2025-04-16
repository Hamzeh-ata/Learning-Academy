import { useState } from 'react';
import { SidebarPanel } from '@shared/components/sidebar-panel';
import { selectAllChapters } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import { useDispatch, useSelector } from 'react-redux';
import { ChapterEntry, ChaptersList, SelectCourse } from '@/app/admin/features/course-management';
import { useFetchCourses } from '@/app/admin/hooks';

export const Chapters = () => {
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [selectedChapter, setSelectedChapter] = useState();
  const [showAddChapter, setShowAddChapter] = useState(false);

  const courses = useFetchCourses();
  const chapters = useSelector(selectAllChapters);

  const handleChapterCourse = (id) => {
    dispatch(fetchChapters({ currentPage: 1, pageSize: 10, courseId: id }));
    setSelectedCourseId(id);
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setShowAddChapter(true);
  };

  const reset = () => {
    setShowAddChapter(false);
    setSelectedChapter(null);
  };

  return (
    <div>
      <SelectCourse
        courses={courses}
        selectedCourseId={selectedCourseId}
        setShowAddChapter={setShowAddChapter}
        setSelectedCourseId={handleChapterCourse}
        className="!w-1/3"
      />

      {selectedCourseId && !chapters?.length && (
        <div className="flex items-center gap-4">
          <p className="text-center">This course does not belong to any chapter! </p>
        </div>
      )}
      {selectedCourseId && !!chapters?.length && (
        <ChaptersList chapters={chapters} courseId={selectedCourseId} setSelectedChapter={handleEditChapter} />
      )}
      <SidebarPanel
        isVisible={showAddChapter}
        position={'right'}
        onHide={reset}
        className="course-sidebar"
        isDismissible
        title={`${selectedChapter ? 'Update' : 'Add'} Chapter`}
      >
        <ChapterEntry onSubmitted={reset} chapter={selectedChapter} courseId={selectedCourseId} />
      </SidebarPanel>
    </div>
  );
};
