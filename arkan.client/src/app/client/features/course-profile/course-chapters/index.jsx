import { FeatherIcon } from '@shared/components';
import classNames from 'classnames';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal } from '@shared/components/modal';
import Vimeo from '@u-wave/react-vimeo';

export const CourseChaptersView = ({ chapters, courseData }) => (
  <div className="mt-4">
    <h3 className="font-semibold py-4 text-arkan text-lg text-center">Course Content</h3>
    {!chapters?.length && <p>Course Content will be added soon</p>}
    <div className="pt-4">
      <Accordion multiple activeIndex={[0]}>
        {chapters?.map((chapter, index) => (
          <AccordionTab header={<ChapterHeaderView chapter={chapter} index={index} />} key={chapter.id}>
            <LessonListView chapter={chapter} courseData={courseData} />
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  </div>
);

const ChapterHeaderView = ({ chapter, index }) => (
  <div className="flex gap-4 items-center justify-between">
    <span>
      Chapter {index + 1} {chapter.name}
    </span>
    {chapter.isFree && <span className="text-teal-500">Free</span>}
  </div>
);

const LessonListView = ({ chapter, courseData }) => (
  <div>
    {!chapter?.lessons?.length && <p>New lessons will be added soon</p>}
    {chapter?.lessons?.map((lesson) => (
      <LessonItemView key={lesson.id} lesson={lesson} courseData={courseData} />
    ))}
  </div>
);

const LessonItemView = ({ lesson, courseData }) => {
  const [showVideo, setShowVideo] = useState(false);
  function handleVideoClick(event) {
    event.preventDefault();
    if (!lesson.isFree || !lesson.videoUrl) {
      return;
    }

    setShowVideo(true);
  }
  return (
    <div className="flex justify-between py-2 border-b last:border-0">
      {courseData.isEnroll && (
        <>
          <NavLink
            to={`${`/lesson/${courseData.id}/${lesson.id}`}`}
            className={classNames(
              'text-base text-gray-600 hover:font-semibold cursor-pointer items-center inline-flex gap-2',
              {
                'text-indigo-500': lesson.isCompleted
              }
            )}
          >
            <FeatherIcon name="PlayCircle" className="fill-gray-600 stroke-slate-100" size="18" />
            <span>{lesson.name}</span>
          </NavLink>
          {lesson.isCompleted && <FeatherIcon name="Check" className="text-teal-500" />}
        </>
      )}
      {!courseData.isEnroll && (
        <div className="flex gap-2 items-center">
          {lesson.isFree && <FeatherIcon name="PlayCircle" className="fill-gray-600 stroke-slate-100" size="18" />}
          <a
            className={classNames({
              'text-base text-indigo-500 hover:font-semibold cursor-pointer': lesson.isFree
            })}
            onClick={handleVideoClick}
          >
            {lesson.name}
          </a>
          {lesson.isFree && <span className="text-teal-500">Free</span>}
        </div>
      )}
      {showVideo && (
        <Modal isOpen onClose={() => setShowVideo(false)}>
          <div>
            <label className="text-lg font-semibold">{lesson.name}</label>
            <div className="relative w-full pt-[56.25%] overflow-hidden">
              <Vimeo
                video={lesson?.videoUrl}
                width={'100%'}
                height={'100%'}
                className="inset-0 absolute w-full h-full"
                autoplay
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
