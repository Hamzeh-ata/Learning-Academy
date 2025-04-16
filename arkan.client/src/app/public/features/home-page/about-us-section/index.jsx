import smallBook from '@assets/icons/Small book.svg';
import { selectCompanyInfo } from '@slices/client-slices/content-management.slice';
import { t } from 'i18next';
import { useSelector } from 'react-redux';

export const AboutUsSection = () => {
  const companyInfo = useSelector(selectCompanyInfo);

  return (
    <div className="flex justify-center items-center py-10 flex-col">
      <h3 className="text-2xl font-bold">{t('aboutUs')}</h3>
      <img src={smallBook} alt="AboutUs" />
      <p className="mt-4 px-4 lg:max-w-[50%] text-center">{companyInfo?.aboutUs || 'About us section'}</p>
    </div>
  );
};
