import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const tabs = [
  {
    label: 'Groups'
  },
  {
    label: 'Personal'
  }
];

export const useTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && currentTab != 'null') {
      setActiveIndex(tabs.findIndex((e) => e.label === currentTab));
    } else {
      setSearchParams({ tab: tabs[0].label });
      setActiveIndex(0);
    }
  }, [tabs, searchParams, setSearchParams]);

  const handleTabChange = (index) => {
    setActiveIndex(index);
    setSearchParams({ tab: tabs[index].label });
  };

  return {
    activeIndex,
    handleTabChange
  };
};
