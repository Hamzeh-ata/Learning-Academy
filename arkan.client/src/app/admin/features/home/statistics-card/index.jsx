import { statisticsThunks } from '@/services/admin-services/statistics.service';
import { selectStatistics } from '@/slices/admin-slices/statistics.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import animateStudent from '@assets/lottie/animate-students';
import animateCourse from '@assets/lottie/animate-course';
import Lottie from 'lottie-react';
import animateInstructor from '@assets/lottie/animate-instructor';
import { humanizeWords } from '@utils/helpers';

export function StatisticsCard() {
  const dispatch = useDispatch();
  const statistics = useSelector(selectStatistics);

  useEffect(() => {
    if (statistics?.studentsCount) {
      return;
    }
    dispatch(statisticsThunks.get());
  }, []);

  return (
    <div className="flex gap-8 justify-center">
      {Object.entries(statistics)
        .filter(([key]) => !['loading', 'key', 'error'].includes(key))
        .map(([key, value]) => (
          <CardCountCard key={key} count={value} label={key} icon={icons[key]} />
        ))}
    </div>
  );
}

const CardCountCard = ({ count, label, icon }) => (
  <div className="flex items-center gap-6 rounded-lg shadow-md shadow-gray-950/25 card-bg text-slate-400 p-8 w-80">
    <div className="w-1/2">
      <Lottie className="h-24 w-full" loop animationData={icon} />
    </div>
    <div className="flex flex-col gap-2 w-1/2 text-end">
      <div className="text-xl font-semibold text-white">{count}</div>
      <div className="text-lg">{humanizeWords(label)}</div>
    </div>
  </div>
);

const icons = {
  studentsCount: animateStudent,
  coursesCount: animateCourse,
  instructorsCount: animateInstructor
};
