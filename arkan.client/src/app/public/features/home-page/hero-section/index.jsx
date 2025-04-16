import { fetchHeroSection } from '@services/client-services/content-management.service';
import { selectHeroSection } from '@slices/client-slices/content-management.slice';
import { getImageFullPath } from '@utils/image-path';
import { Skeleton } from 'primereact/skeleton';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './hero-section.css';

export const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const heroContent = useSelector(selectHeroSection);

  useEffect(() => {
    if (!heroContent?.headerText) {
      dispatch(fetchHeroSection());
    }
  }, []);

  const isLoading = heroContent?.loading;

  const courseImage = getImageFullPath(heroContent?.image);

  return (
    <div className="px-4 md:px-26 xl:px-40 pt-16 flex justify-between gap-1 mobile:text-center">
      <div className="flex flex-col items-start justify-center mobile:text-center mobile:items-center">
        {isLoading && <Skeleton width="25rem" height="2rem" className="mb-2"></Skeleton>}
        {!isLoading && <h1 className="text-black font-extrabold text-5xl">{heroContent.headerText}</h1>}
        <span className="w-1/4 h-0.5 block rounded-full shadow-2xl bg-arkan"></span>
        <div className="py-6 pr-4">
          {isLoading && (
            <>
              <Skeleton width="15rem" className="mb-2"></Skeleton>
              <Skeleton width="12rem" className="mb-2"></Skeleton>
            </>
          )}
          {!isLoading && <p className=" text-gray-500 text-balance text-base">{heroContent.description}</p>}
        </div>
        <div className="mt-2">
          <button
            className="get-started"
            onClick={() => {
              navigate('/course');
            }}
          >
            Get Started
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=""
                width="20"
                height="20"
                viewBox="-2 -2 26 28"
                strokeWidth="1.2"
                stroke="#874900"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l14 0" />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div className="hidden lg:block">
        {isLoading && <Skeleton width="40rem" height="20rem" borderRadius="16px"></Skeleton>}
        {!isLoading && <img className="max-h-[532px] max-w-[532px]" src={courseImage} alt="Hero section" />}
      </div>
    </div>
  );
};
