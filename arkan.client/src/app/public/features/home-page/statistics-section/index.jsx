import { fetchStatisticsSection } from '@services/client-services/content-management.service';
import { selectStatsSection } from '@slices/client-slices/content-management.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatisticSection } from './components/statistic-section';
import { statisticsMapper } from './helpers/statistics-mapper';

export const StatisticsSection = () => {
  const dispatch = useDispatch();
  const statsContent = useSelector(selectStatsSection);

  useEffect(() => {
    if (!statsContent?.coursesCount && !statsContent.loading) {
      dispatch(fetchStatisticsSection());
    }
  }, []);

  const statsSections = statisticsMapper(statsContent);

  return (
    <div className="px-8 flex gap-8 bg-stats-bg bg-no-repeat justify-around items-center self-center w-[300px] md:w-[650px] lg:w-[850px] xl:w-[1360px] h-[267px] text-white text-xl bg-cover bg-center overflow-x-auto rounded-3xl">
      {statsSections.map(({ label, count, iconPaths }) => (
        <StatisticSection key={label} label={label} count={count} iconPaths={iconPaths} />
      ))}
    </div>
  );
};
