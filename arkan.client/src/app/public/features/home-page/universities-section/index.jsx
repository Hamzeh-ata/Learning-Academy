import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUniversitiesSection } from '@services/client-services/content-management.service';
import { selectUniversitiesSection } from '@slices/client-slices/content-management.slice';
import { carousalBreakPoints } from '@helpers/carousal-breakpoints';
import { Carousel } from 'primereact/carousel';
import { t } from 'i18next';
import { getImageFullPath } from '@utils/image-path';

export const UniversitiesSection = () => {
  const dispatch = useDispatch();
  const universityContent = useSelector(selectUniversitiesSection);

  useEffect(() => {
    if (!universityContent?.universities?.length && !universityContent.loading) {
      dispatch(fetchUniversitiesSection());
    }
  }, []);

  return (
    <div className="flex justify-center flex-col items-center py-5">
      <div className="pt-10 flex flex-col items-center justify-center gap-8 text-center">
        <h3 className="text-2xl font-bold">
          {t('homePage.universitySection.title')}{' '}
          <span className="text-arkan">{t('homePage.universitySection.subTitle')}</span>
        </h3>
        <div className="mb-4 flex flex-col">
          {!!universityContent?.universities.length && (
            <Carousel
              value={universityContent?.universities}
              numVisible={3}
              numScroll={1}
              responsiveOptions={carousalBreakPoints}
              circular
              itemTemplate={universityCard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const universityCard = (university) => (
  <div className="relative transition duration-300 ease-in-out transform hover:-translate-y-1 pt-8">
    <div className="absolute -top-4 left-[40%] mobile:left-[35%]">
      <img
        className="rounded-full w-20 h-20 p-2 bg-white border border-slate-200"
        src={getImageFullPath(university.image)}
        alt={university.name}
      />
    </div>
    <div className="bg-white text-center shadow-sm shadow-slate-500 w-[400px] max-w-[400px] rounded-2xl pb-4 pt-8 hover:shadow-lg mobile:max-w-[240px] flex flex-col">
      <h4 className="text-lg font-semibold mb-2 line-clamp-2">{university.shortName}</h4>
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{university.name}</h3>
    </div>
  </div>
);
