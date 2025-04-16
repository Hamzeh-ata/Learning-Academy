import { FeatherIcon } from '@shared/components';
import { Accordion, AccordionTab } from 'primereact/accordion';

export const CourseChaptersEditable = ({
  chapters,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz
}) => (
  <div className="mt-4">
    <div className="flex justify-between items-center">
      <h3>Chapters:</h3>
      <button
        onClick={onAddChapter}
        className="bg-arkan shadow-md px-3 py-2 rounded-md text-white hover:bg-arkan-dark transition-all flex items-center text-md gap-1"
      >
        <FeatherIcon name="Plus" size={18} />
        <span>Add Chapter</span>
      </button>
    </div>
    <div className="pt-4">
      <Accordion multiple activeIndex={[0]}>
        {chapters?.map((chapter, index) => (
          <AccordionTab
            header={
              <ChapterHeaderEditable
                chapter={chapter}
                index={index}
                onDeleteChapter={onDeleteChapter}
                onEditChapter={onEditChapter}
              />
            }
            key={chapter.id}
          >
            <LessonListEditable
              chapter={chapter}
              onAddLesson={onAddLesson}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onAddQuiz={onAddQuiz}
              onEditQuiz={onEditQuiz}
              onDeleteQuiz={onDeleteQuiz}
            />
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  </div>
);

const ChapterHeaderEditable = ({ chapter, index, onDeleteChapter, onEditChapter }) => (
  <div className="flex gap-4 items-center justify-between">
    <span>
      Chapter {index + 1} {chapter.name}
    </span>
    <div className="flex gap-2 items-center">
      <FeatherIcon
        name="Trash2"
        size={21}
        className="hover:text-red-600 text-red-500 cursor-pointer"
        onClick={() => onDeleteChapter(chapter.id)}
      />
      <FeatherIcon
        name="Edit"
        size={21}
        className="hover:text-blue-600 text-blue-500 cursor-pointer"
        onClick={() => onEditChapter(chapter)}
      />
    </div>
  </div>
);

const LessonListEditable = ({
  chapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz
}) => (
  <div>
    <div className="flex justify-between border-b pb-2 mb-2 items-center">
      <p> Lessons:</p>
      <button
        onClick={() => onAddLesson(chapter.id)}
        className="bg-arkan shadow-md px-3 py-2 rounded-md text-white hover:bg-arkan-dark transition-all flex items-center text-md gap-1"
      >
        <FeatherIcon name="Plus" size={18} />
        <span>Add Lesson</span>
      </button>
    </div>
    {chapter?.lessons?.map((lesson) => (
      <LessonItemEditable
        key={lesson.id}
        lesson={lesson}
        chapterId={chapter.id}
        onEditLesson={onEditLesson}
        onDeleteLesson={onDeleteLesson}
        onAddQuiz={onAddQuiz}
        onEditQuiz={onEditQuiz}
        onDeleteQuiz={onDeleteQuiz}
      />
    ))}
  </div>
);

const LessonItemEditable = ({
  lesson,
  chapterId,
  onEditLesson,
  onDeleteLesson,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz
}) => (
  <div className="flex justify-between py-2 border-b last:border-0 flex-wrap gap-y-1">
    <span>{lesson.name}</span>
    <div className="flex gap-4 items-center">
      {!lesson.quiz && (
        <button
          onClick={() => onAddQuiz(lesson.id)}
          className="border-arkan border shadow-md px-2 py-2 rounded-md text-arkan hover:bg-arkan-dark hover:text-white transition-all flex items-center text-md gap-1"
        >
          <FeatherIcon name="Plus" size={18} />
          <span>Add Quiz</span>
        </button>
      )}

      {lesson.quiz && (
        <>
          <button
            onClick={() => onEditQuiz({ ...lesson?.quiz, lessonId: lesson.id })}
            className="border-cyan-500 border shadow-md px-2 py-2 rounded-md text-cyan-500 hover:bg-cyan-600 hover:text-white transition-all flex items-center text-md gap-1"
          >
            <FeatherIcon name="Edit" size={18} />
            <span>Edit Quiz</span>
          </button>

          <button
            onClick={() => onDeleteQuiz(lesson?.quiz?.quizId || lesson?.quiz?.id)}
            className="border-red-500 border shadow-md px-2 py-2 rounded-md text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center text-md gap-1"
          >
            <FeatherIcon name="Trash2" size={18} />
            <span>Delete Quiz</span>
          </button>
        </>
      )}

      <FeatherIcon
        name="Edit"
        size={21}
        className="hover:text-blue-600 text-blue-500 cursor-pointer"
        onClick={() => onEditLesson({ ...lesson, chapterId })}
      />
      <FeatherIcon
        name="Trash2"
        size={21}
        className="hover:text-red-600 text-red-500 cursor-pointer"
        onClick={() => onDeleteLesson({ lessonId: lesson.id, chapterId })}
      />
    </div>
  </div>
);
