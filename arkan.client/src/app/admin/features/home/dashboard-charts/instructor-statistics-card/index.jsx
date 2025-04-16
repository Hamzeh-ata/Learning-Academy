import { instructorStatisticsThunks } from '@/services/admin-services/statistics.service';
import { selectInstructorStatistics } from '@/slices/admin-slices/statistics.slice';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useDispatch, useSelector } from 'react-redux';

export function InstructorStatisticsCard({ instructors }) {
  const [selectedInstructorId, setSelectedInstructorId] = useState();
  const dispatch = useDispatch();
  const courseStatistics = useSelector(selectInstructorStatistics);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setSelectedInstructorId(instructors?.[1]?.userid);
  }, [instructors]);

  useEffect(() => {
    if (!selectedInstructorId) {
      setChartData({});
      return;
    }
    dispatch(instructorStatisticsThunks.getById({ key: 'userId', id: selectedInstructorId }));
  }, [selectedInstructorId]);

  useLayoutEffect(() => {
    if (!courseStatistics?.coursesCount) {
      setChartData({});
      return;
    }
    const { coursesCount, lessonsCount, studentsCount } = courseStatistics;
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['Courses', 'Lessons', 'Students'],
      datasets: [
        {
          data: [coursesCount, lessonsCount, studentsCount].map((e) => parseInt(e)),
          backgroundColor: [
            documentStyle.getPropertyValue('--pink-600'),
            documentStyle.getPropertyValue('--orange-600'),
            documentStyle.getPropertyValue('--green-600')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--pink-400'),
            documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--green-400')
          ]
        }
      ]
    };
    const options = {
      cutout: '60%',
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

  if (!instructors) return null;

  return (
    <div className="flex items-center flex-col gap-6 rounded-lg shadow-md shadow-gray-950/25 card-bg text-slate-400 p-8 w-1/4">
      <div className="flex gap-2 justify-between w-full flex-col">
        <h3 className="text-base font-semibold text-gray-200">Instructors</h3>
        <Dropdown
          value={selectedInstructorId}
          optionLabel="name"
          optionValue="userid"
          placeholder="Select an Instructor"
          className="bg-slate-700 py-1 rounded-md pl-3 text-white"
          options={instructors}
          onChange={(e) => setSelectedInstructorId(e.value)}
        />
      </div>
      <div className="flex flex-col gap-2 text-center w-full">
        {!courseStatistics?.coursesCount && (
          <h3 className="text-md text-gray-400">This Instructor has no courses Yet</h3>
        )}
        {!!courseStatistics?.coursesCount && (
          <Chart
            id="InstructorChart"
            type="doughnut"
            data={chartData}
            options={chartOptions}
            className="w-full text-center"
          />
        )}
      </div>
    </div>
  );
}
