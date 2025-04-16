import './course-lessons-list.css';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { FeatherIcon } from '@shared/components';
import classNames from 'classnames';
import alertService from '@services/alert/alert.service';
import { getImageFullPath } from '@utils/image-path';

export const CourseLessonsList = ({ chapters, setSelectedLesson, setSelectedQuiz, selectedLesson }) => {
  const selectedChapter = chapters.findIndex((e) => e.lessons.find((e) => e.id === selectedLesson?.id)) ?? 0;

  const handleTakeQuiz = (selectedQuiz, lessonId, lessonName) => {
    alertService.showConfirmation({
      title: 'Take Quiz',
      body: 'Are you sure you want to take quiz now?',
      callback: () => {
        setSelectedQuiz({ ...selectedQuiz, lessonId, lessonName });
      }
    });
  };

  return (
    <div className="pt-4 lessons-list">
      <Accordion multiple key={selectedChapter} activeIndex={[selectedChapter === -1 ? 0 : selectedChapter]}>
        {chapters?.map((chapter, index) => (
          <AccordionTab
            headerClassName={classNames('', {
              'border-l-4 rounded border-arkan': selectedChapter === index
            })}
            header={
              <div
                className={classNames('flex gap-4 items-center', {
                  'text-orange-400': selectedChapter === index
                })}
              >
                <span>
                  Chapter {index + 1} {chapter.name}
                </span>
                {chapter.isFree && <span className="text-teal-500">Free</span>}
                {!!chapter.lessons?.length && chapter.lessons?.every((e) => e.isCompleted) && (
                  <span className="inline-flex items-center gap-2 flex-1 justify-end text-teal-500">
                    Completed
                    <FeatherIcon name="Check" />
                  </span>
                )}
              </div>
            }
            key={chapter.id}
          >
            {!chapter?.lessons?.length && <p>New lessons will be added soon</p>}
            {!!chapter?.lessons?.length &&
              chapter.lessons.map((lesson) => (
                <div className="flex items-center border-b last:border-0 flex-wrap p-4" key={lesson.id}>
                  <div className="flex flex-col py-2 flex-1">
                    <div
                      className="flex justify-between group cursor-pointer items-center"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <a
                        className={classNames(
                          'text-base text-gray-600 group-hover:font-semibold items-center justify-center inline-flex gap-2',
                          {
                            'text-teal-700': lesson.isCompleted,
                            'text-orange-400': selectedLesson?.id === lesson.id
                          }
                        )}
                      >
                        <span
                          className={classNames(
                            'px-4 py-2 border bg-[linear-gradient(132deg,#ebe4e469,#53605d24)] rounded group-hover:bg-slate-400 group-hover:stroke-slate-200 stroke-slate-500',
                            {
                              'text-red-500 border-red-500': selectedLesson?.id === lesson.id,
                              'bg-slate-200': selectedLesson?.id !== lesson.id
                            }
                          )}
                        >
                          <FeatherIcon name="PlayCircle" size="24" />
                        </span>
                        {lesson.name}
                      </a>
                      <div className="flex gap-2 items-center">
                        {lesson.isCompleted && <FeatherIcon className="text-teal-500" name="CheckCircle" />}
                        {lesson.material && (
                          <a href={getImageFullPath(lesson.material, null)} target="_blank">
                            <FeatherIcon name="FileText" className="text-red-300" />
                          </a>
                        )}
                        {selectedLesson?.id === lesson.id && (
                          <FeatherIcon className="text-red-400 animate-spin animate-duration-[3s]" name="Loader" />
                        )}
                      </div>
                    </div>
                  </div>
                  {lesson.quiz && lesson.quiz.allowAttempt && (
                    <div
                      className={`text-sm text-end cursor-pointer text-white ms-2`}
                      onClick={() => handleTakeQuiz(lesson.quiz, lesson.id, lesson.name)}
                    >
                      <button
                        className={classNames('px-2 py-1 rounded', {
                          'bg-red-400': lesson.quiz.isRequierd,
                          'bg-blue-400': !lesson.quiz.isRequierd
                        })}
                      >
                        Take Quiz
                        {lesson.quiz.isCompleted ? <FeatherIcon name="CheckCircle" size="16" /> : null}
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};
