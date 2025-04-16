import { carousalBreakPoints } from '@helpers/carousal-breakpoints';
import { fetchCoursesSection } from '@services/client-services/content-management.service';
import { CourseCard } from '@shared/components/course-card';
import { selectCoursesSection } from '@slices/client-slices/content-management.slice';
import { t } from 'i18next';
import { Carousel } from 'primereact/carousel';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

export const CoursesSection = () => {
  const dispatch = useDispatch();
  const courseContent = useSelector(selectCoursesSection);

  const navigate = useNavigate();

  useEffect(() => {
    if (!courseContent?.courses?.length) {
      dispatch(fetchCoursesSection());
    }
  }, []);

  return (
    <div className="flex justify-center flex-col items-center py-5">
      <span className="w-1/4 h-0.5 block rounded-full shadow-2xl bg-arkan"></span>
      <div className="pt-10 flex flex-col items-center justify-center gap-8 text-center">
        <h3 className="text-2xl font-bold">
          {t('homePage.courseSection.title')}
          <span className="text-arkan"> {t('homePage.courseSection.subTitle')}</span>
        </h3>
        <div className="mb-4 flex flex-col">
          {!!courseContent?.courses.length && (
            <Carousel
              value={courseContent?.courses}
              numVisible={3}
              numScroll={1}
              responsiveOptions={carousalBreakPoints}
              circular
              autoplayInterval={3000}
              itemTemplate={(course) =>
                CourseCard({
                  course,
                  onClick: () => {
                    navigate(`/course/${course.courseId}`);
                  }
                })
              }
            />
          )}
          <div className="text-center">
            <NavLink
              to="/course"
              className="bg-white rounded-full shadow-arkan shadow text-arkan font-semibold px-8 py-3 hover:text-white hover:bg-arkan transition-all ease-in-out duration-200 cursor-pointer"
            >
              {t('homePage.courseSection.action')}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
