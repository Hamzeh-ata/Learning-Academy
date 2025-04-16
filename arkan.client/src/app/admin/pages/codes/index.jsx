import { TabComponent, TabsCard } from '@shared/components';
import ArkanCodes from './arkan-codes';
import PromoCodes from './promo-codes';
const Codes = () => (
  <TabsCard title="Codes" icon={'🎫'}>
    <TabComponent tabTitle={'Arkan Codes'}>
      <ArkanCodes />
    </TabComponent>

    <TabComponent tabTitle={'Promo Codes'}>
      <PromoCodes />
    </TabComponent>
  </TabsCard>
);
export default Codes;
