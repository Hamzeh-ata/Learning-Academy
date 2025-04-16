import { CategoryIcon, TabComponent, TabsCard } from '@shared/components';
import { useFetchChangePasswordRequests } from '@/app/admin/hooks';
import { RequestsList } from '@(admin)/features/change-password-requests';
const Requests = () => {
  const requests = useFetchChangePasswordRequests();

  return (
    <TabsCard title="Change Password Requests" icon={CategoryIcon}>
      <TabComponent title="Change Password Requests" tabTitle={'Requests'}>
        <RequestsList requests={requests} />
      </TabComponent>
    </TabsCard>
  );
};
export default Requests;
