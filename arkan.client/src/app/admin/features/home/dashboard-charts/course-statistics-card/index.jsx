import { courseStatisticsThunks } from '@/services/admin-services/statistics.service';
import { selectCourseStatistics } from '@/slices/admin-slices/statistics.slice';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useDispatch, useSelector } from 'react-redux';

export function CourseStatisticsCard({ courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState();
  const dispatch = useDispatch();
  const courseStatistics = useSelector(selectCourseStatistics);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setSelectedCourseId(courses?.[1]?.id);
  }, [courses]);

  useEffect(() => {
    if (!selectedCourseId) {
      setChartData({});
      return;
    }
    dispatch(courseStatisticsThunks.getById({ key: 'courseId', id: selectedCourseId }));
  }, [selectedCourseId]);

  useLayoutEffect(() => {
    if (!courseStatistics?.studentsCount) {
      setChartData({});
      return;
    }

    const { studentsCount, lessonsCount, chaptersCount, quizzesCount } = courseStatistics;
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['Students', 'Lessons', 'Chapters', 'Quizzes'],
      datasets: [
        {
          data: [studentsCount, lessonsCount, chaptersCount, quizzesCount].map((e) => parseInt(e)),
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-700'),
            documentStyle.getPropertyValue('--red-700'),

            documentStyle.getPropertyValue('--purple-700'),
            documentStyle.getPropertyValue('--teal-700')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--red-400'),

            documentStyle.getPropertyValue('--purple-400'),
            documentStyle.getPropertyValue('--teal-400')
          ]
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    };
    setChartData({});
    setTimeout(() => {
      setChartData(data);
      setChartOptions(options);
    }, 1000);
  }, [courseStatistics]);

  if (!courses) return null;

  return (
    <div className="flex items-center flex-col gap-6 rounded-lg shadow-md shadow-gray-950/25 card-bg text-slate-400 p-8 w-1/4">
      <div className="flex gap-2 justify-between w-full flex-col">
        <h3 className="text-base font-semibold text-gray-200">Courses</h3>
        <Dropdown
          value={selectedCourseId}
          optionLabel="name"
          optionValue="id"
          placeholder="Select a course"
          className="bg-slate-700 py-1 rounded-md pl-3 text-white"
          options={courses}
          onChange={(e) => setSelectedCourseId(e.value)}
        />
      </div>
      <div className="flex flex-col gap-2 text-center w-full">
        {!courseStatistics?.studentsCount && <h3 className="text-md text-gray-400">This Course has no students Yet</h3>}
        {!!courseStatistics?.studentsCount && (
          <Chart type="pie" data={chartData} options={chartOptions} className="w-full text-center" />
        )}
      </div>
    </div>
  );
}
