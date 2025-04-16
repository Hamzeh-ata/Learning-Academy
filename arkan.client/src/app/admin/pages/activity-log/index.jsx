import { TabComponent, TabsCard } from '@shared/components';
import { ActivityLogList } from '@/app/admin/features/activity-log';
import { useFetchActivityLog } from '@/app/admin/hooks/useFetchActivityLog';

const ActivitesLog = () => {
  const actvites = useFetchActivityLog();
  return (
    <TabsCard title="Activity Log">
      <TabComponent title="Activity Log" tabTitle={'Logger'}>
        <ActivityLogList activites={actvites} />
      </TabComponent>
    </TabsCard>
  );
};
export default ActivitesLog;
