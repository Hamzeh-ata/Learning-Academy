import logo from '@assets/icons/arkan-logo.png';
import { fetchCompanyInfo } from '@services/client-services/content-management.service';
import { FeatherIcon } from '@shared/components/feather-icon';
import { selectCompanyInfo } from '@slices/client-slices/content-management.slice';
import { t } from 'i18next';
import { Tooltip } from 'primereact/tooltip';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companyInfo = useSelector(selectCompanyInfo);

  useEffect(() => {
    if (!companyInfo?.id && !companyInfo?.loading) {
      dispatch(fetchCompanyInfo());
    }
  }, []);

  return (
    <div className="flex flex-col text-white">
      <div className="bg-slate-900 flex justify-around px-6 py-8 flex-wrap">
        <div className="flex flex-col gap-4 w-1/2">
          <div>
            <img
              src={logo}
              alt="logo"
              className="h-20 w-20"
              onClick={() => {
                navigate('/home');
              }}
            />
          </div>
          <p className="max-w-[80%]">{companyInfo?.aboutUs || 'About us section'}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-base">{t('social')}</p>
          <div className="flex gap-2 items-center flex-wrap">
            {renderProfileSocialLinks(companyInfo?.instagramUrl, 'Facebook')}
            {renderProfileSocialLinks(companyInfo?.facebookUrl, 'Instagram')}
            {renderTikTokLink(companyInfo?.tikTokUrl)}
            {renderSnapChatLink(companyInfo?.snapchatUrl)}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-base">{t('contactUs')}</p>
            {companyInfo?.phonenumber}
          </div>
        </div>
      </div>
      <div className="bg-arkan text-center py-6 text-base font-semibold">
        <p>©2024 - ArkanAcademy. {t('copyRights')}</p>
      </div>
    </div>
  );
};

const renderProfileSocialLinks = (value, icon) =>
  value &&
  icon && (
    <>
      <Tooltip target={`.footer-social-${icon}`}>{icon}</Tooltip>
      <a target="_blank" href={value}>
        {
          <FeatherIcon
            className={`footer-social-${icon} transition-transform duration-300 ease-in-out hover:scale-110`}
            name={icon}
          />
        }
      </a>
    </>
  );
const renderSnapChatLink = (value) =>
  value && (
    <>
      <Tooltip target={`.footer-social-snapchat`}>Snapchat</Tooltip>
      <a target="_blank" href={value}>
        {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`footer-social-snapchat transition-transform duration-300 ease-in-out hover:scale-110`}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M16.882 7.842a4.882 4.882 0 0 0 -9.764 0c0 4.273 -.213 6.409 -4.118 8.118c2 .882 2 .882 3 3c3 0 4 2 6 2s3 -2 6 -2c1 -2.118 1 -2.118 3 -3c-3.906 -1.709 -4.118 -3.845 -4.118 -8.118zm-13.882 8.119c4 -2.118 4 -4.118 1 -7.118m17 7.118c-4 -2.118 -4 -4.118 -1 -7.118" />
          </svg>
        }
      </a>
    </>
  );

const renderTikTokLink = (value) =>
  value && (
    <>
      <Tooltip target={`.footer-social-tikTok`}>TikTok</Tooltip>
      <a target="_blank" href={value}>
        {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`footer-social-tikTok transition-transform duration-300 ease-in-out hover:scale-110`}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />{' '}
          </svg>
        }
      </a>
    </>
  );
