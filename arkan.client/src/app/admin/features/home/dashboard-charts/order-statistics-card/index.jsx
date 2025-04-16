import { selectOrdersStatistics } from '@/slices/admin-slices/statistics.slice';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useDispatch, useSelector } from 'react-redux';
import { subWeeks, subMonths, subYears } from 'date-fns';
import { formatRawDateTime } from '@utils/date-format';
import { ordersStatisticsThunks } from '@/services/admin-services/statistics.service';

const durations = [
  { label: '2 Weeks ago', date: subWeeks(new Date(), 2) },
  { label: '1 Month ago', date: subMonths(new Date(), 1) },
  { label: '6 Months ago', date: subMonths(new Date(), 6) },
  { label: 'Year ago', date: subYears(new Date(), 1) }
];

export function OrderStatisticsCard() {
  const [selectedDuration, setSelectedDuration] = useState(durations[2].date);
  const dispatch = useDispatch();
  const orderStats = useSelector(selectOrdersStatistics);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (!selectedDuration) {
      return;
    }
    dispatch(
      ordersStatisticsThunks.getByDateRange({
        startDate: formatRawDateTime(new Date(selectedDuration)),
        endDate: formatRawDateTime(new Date())
      })
    );
  }, [selectedDuration]);

  useLayoutEffect(() => {
    if (!orderStats?.orders.length) {
      setChartData({});
      return;
    }

    const { orders } = orderStats;
    const documentStyle = getComputedStyle(document.documentElement);
    const ordersPerMonth = new Array(12).fill(0);
    const totalSalesPerMonth = new Array(12).fill(0);
    const discountOrdersPerMonth = new Array(12).fill(0);
    const salesWithDiscounts = new Array(12).fill(0);
    const salesWithoutDiscounts = new Array(12).fill(0);

    orders.forEach((order) => {
      const orderMonth = new Date(order.orderDate).getMonth();
      ordersPerMonth[orderMonth]++;
      totalSalesPerMonth[orderMonth] += order.amount;
      if (order.discountAmount > 0) {
        discountOrdersPerMonth[orderMonth]++;
        salesWithDiscounts[orderMonth] += order.amount;
      } else {
        salesWithoutDiscounts[orderMonth] += order.amount;
      }
    });

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Number of Orders',
          data: ordersPerMonth,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4
        },
        {
          label: 'Total Sales Amount',
          data: totalSalesPerMonth,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'Number of Discounted Orders',
          data: discountOrdersPerMonth,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4
        },
        {
          label: 'Sales Amount with Discounts',
          data: salesWithDiscounts,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          tension: 0.4
        },
        {
          label: 'Sales Amount without Discounts',
          data: salesWithoutDiscounts,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--red-500'),
          tension: 0.4
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#ccc'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: '#374151'
          }
        },
        y: {
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: '#374151'
          }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, [orderStats]);

  return (
    <div className="flex flex-col gap-6 rounded-lg shadow-md shadow-gray-950/25 card-bg text-slate-400 p-8 w-[85%] h-full mt-6">
      <div className="flex gap-2 items-center justify-between w-full">
        <h3 className="text-base font-semibold text-gray-200 w-full">Orders</h3>
        <Dropdown
          value={selectedDuration}
          optionLabel="label"
          optionValue="date"
          placeholder="Select a duration"
          className="bg-slate-700 py-1 rounded-md pl-3 text-white !w-[20%]"
          options={durations}
          onChange={(e) => setSelectedDuration(e.value)}
        />
      </div>
      <div className="flex flex-col gap-2 text-center w-full">
        {!orderStats?.orders.length && (
          <h3 className="text-md text-gray-400">No Orders Were made in the selected duration</h3>
        )}
        {!!orderStats?.orders.length && (
          <Chart id="OrdersChart" type="line" data={chartData} options={chartOptions} className="w-full text-center" />
        )}
      </div>
    </div>
  );
}
