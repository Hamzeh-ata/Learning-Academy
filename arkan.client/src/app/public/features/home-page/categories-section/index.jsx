import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoriesSection } from '@services/client-services/content-management.service';
import { selectCategoriesSection } from '@slices/client-slices/content-management.slice';
import { carousalBreakPoints } from '@helpers/carousal-breakpoints';
import { Carousel } from 'primereact/carousel';
import { t } from 'i18next';
import { getImageFullPath } from '@utils/image-path';

export const CategoriesSection = () => {
  const dispatch = useDispatch();
  const categoriesContent = useSelector(selectCategoriesSection);
  useEffect(() => {
    if (!categoriesContent?.categories?.length && !categoriesContent.loading) {
      dispatch(fetchCategoriesSection());
    }
  }, []);

  return (
    !!categoriesContent?.categories.length && (
      <div className="flex justify-center flex-col items-center py-5">
        <div className="pt-10 flex flex-col items-center justify-center gap-8 text-center">
          <h3 className="text-2xl font-bold">
            {t('homePage.categorySection.title')}{' '}
            <span className="text-arkan">{t('homePage.categorySection.subTitle')}</span>
          </h3>
          <div className="mb-4 flex flex-col">
            <Carousel
              value={categoriesContent?.categories}
              numVisible={3}
              numScroll={1}
              responsiveOptions={carousalBreakPoints}
              circular
              itemTemplate={categoryCard}
            />
          </div>
        </div>
      </div>
    )
  );
};

const categoryCard = (category) => (
  <div className="relative transition duration-300 ease-in-out transform hover:-translate-y-1 pt-1">
    <div className="bg-white text-center shadow-sm shadow-slate-500 w-[400px] max-w-[400px] rounded-2xl pb-4 pt-2 hover:shadow-lg mobile:max-w-[240px] flex flex-col">
      <div className="p-4 self-center">
        <img
          className="rounded-full w-20 h-20 p-2 bg-white border border-slate-200 "
          src={getImageFullPath(category.image)}
          alt="image"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{category.name}</h3>
      <p className="text-l pr-2 pl-2  mb-2 line-clamp-4">{category.description}</p>
    </div>
  </div>
);
