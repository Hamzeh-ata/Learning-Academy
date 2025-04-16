import { DashboardCharts, StatisticsCard, UserSessionsTable } from '@(admin)/features/home';
import './admin-home.css';

export default function Home() {
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)] pb-2">
      <div className="p-2 flex flex-col gap-8 px-10 overflow-y-auto">
        <StatisticsCard />
        <DashboardCharts />
        <UserSessionsTable />
      </div>
    </div>
  );
}
