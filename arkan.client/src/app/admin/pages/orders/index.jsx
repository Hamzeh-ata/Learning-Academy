import { FeatherIcon, TabComponent, TabsCard } from '@shared/components';
import { ConfirmedOrders, PendingOrders } from '@(admin)/features/orders';

const Orders = () => (
  <TabsCard title="Orders" icon={<FeatherIcon size={35} className="text-orange-400" name="DollarSign" />}>
    <TabComponent tabTitle="Pending Orders">
      <PendingOrders />
    </TabComponent>
    <TabComponent tabTitle="Confirmed Orders">
      <ConfirmedOrders />
    </TabComponent>
  </TabsCard>
);

export default Orders;
