import { studentStatisticsThunks } from '@/services/admin-services/statistics.service';
import { selectStudentStatistics } from '@/slices/admin-slices/statistics.slice';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useDispatch, useSelector } from 'react-redux';

export function StudentStatisticsCard({ students }) {
  const [selectedStudentId, setSelectedStudentId] = useState();
  const dispatch = useDispatch();
  const courseStatistics = useSelector(selectStudentStatistics);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setSelectedStudentId(students?.[1]?.userid);
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    dispatch(studentStatisticsThunks.getById({ key: 'userId', id: selectedStudentId }));
  }, [selectedStudentId]);

  useLayoutEffect(() => {
    if (!courseStatistics?.coursesCount) {
      setChartData({});
      return;
    }
    const { coursesCount, payments, completedLessonsCount } = courseStatistics;
    const data = {
      labels: ['Courses', 'Payments', 'Completed Lessons'],
      datasets: [
        {
          label: students.find((e) => e.userid === selectedStudentId)?.name,
          data: [coursesCount, payments, completedLessonsCount].map((e) => parseInt(e)),
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };
    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    setTimeout(() => {
      setChartData(data);
      setChartOptions(options);
    }, 500);
  }, [courseStatistics]);

  if (!students) return null;

  return (
    <div className="flex items-center flex-col gap-6 rounded-lg shadow-md shadow-gray-950/25 card-bg text-slate-400 p-8 w-1/3">
      <div className="flex gap-2 justify-between w-full flex-col">
        <h3 className="text-base font-semibold text-gray-200">Students</h3>
        <Dropdown
          value={selectedStudentId}
          optionLabel="name"
          optionValue="userid"
          placeholder="Select an Student"
          className="bg-slate-700 py-1 rounded-md pl-3 text-white"
          options={students}
          onChange={(e) => setSelectedStudentId(e.value)}
        />
      </div>
      <div className="flex flex-col gap-2 text-center w-full">
        {!courseStatistics?.coursesCount && <h3 className="text-md text-gray-400">This Student has no courses Yet</h3>}
        {!!courseStatistics?.coursesCount && (
          <Chart
            id="StudentChart"
            type="bar"
            data={chartData}
            options={chartOptions}
            className="w-full"
            height="130"
            width="200"
          />
        )}
      </div>
    </div>
  );
}
