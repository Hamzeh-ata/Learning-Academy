import { FeatherIcon } from '@shared/components';
import { Chip } from 'primereact/chip';
import { getImageFullPath } from '@utils/image-path';

export const CourseBanner = ({ courseData }) => {
  const handleShareClicked = async () => {
    const shareData = {
      title: courseData.name || 'Learn web development!',
      text: 'Check out this great course on web development.',
      url: window.location.href.replace('lesson', 'course')
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="px-12 pt-10 pb-24 border-t border-blue-grey-500 flex justify-between flex-wrap gap-4">
      <div className="text-white flex flex-col gap-3">
        <div className="inline-flex gap-3 items-center">
          <img
            className="rounded-full shadow-sm w-10 h-10"
            src={getImageFullPath(courseData.instructorImage)}
            alt="default video"
          />
          <p className="text-base text-slate-200">{courseData.instructorName}</p>
        </div>

        <p className="text-xl font-semibold">{courseData.name}</p>
        <div className="inline-flex gap-2 items-center">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-book"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
              <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
              <path d="M3 6l0 13" />
              <path d="M12 6l0 13" />
              <path d="M21 6l0 13" />
            </svg>
          </span>
          <p>{courseData.lessonsCount} Lessons</p>
        </div>
        <div className="flex gap-2">
          {!!courseData.categories.length &&
            courseData.categories.map((category) => (
              <Chip
                key={category}
                className="bg-slate-400 rounded-md bg-opacity-20 px-2 text-slate-300"
                label={category}
              />
            ))}
        </div>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <FeatherIcon name="CheckCircle" className="text-green-400" />
        <p className="text-white">You`re enrolled in this course</p>
        <button
          onClick={handleShareClicked}
          className="bg-gray-400 gap-2 items-center px-3 py-2 rounded-md bg-opacity-10 shadow-sm hover:bg-opacity-30 ms-4 text-white flex "
        >
          <FeatherIcon name="Share2" size={18} className="text-white" />
          Share
        </button>
      </div>
    </div>
  );
};
