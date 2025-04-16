import smallBook from '@assets/icons/Small book.svg';
import { fetchInstructorsSection } from '@services/client-services/content-management.service';
import { selectInstructorsSection } from '@slices/client-slices/content-management.slice';
import { getImageFullPath } from '@utils/image-path';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const OurTeamSection = () => {
  const dispatch = useDispatch();
  const instructorsContent = useSelector(selectInstructorsSection);
  const navigate = useNavigate();

  useEffect(() => {
    if (!instructorsContent?.instructors?.length && !instructorsContent.loading) {
      dispatch(fetchInstructorsSection());
    }
  }, []);

  return (
    <div className="bg-gray-200 flex justify-center items-center py-10 flex-col mt-5">
      <h3 className="text-2xl font-bold">{t('homePage.teamTitle')}</h3>
      <img src={smallBook} alt="AboutUs" />
      <div className="flex gap-10 mt-8 text-center flex-wrap justify-center">
        {!!instructorsContent?.instructors.length &&
          instructorsContent?.instructors.map((instructor) => (
            <div
              className="flex flex-col gap-2 cursor-pointer hover:font-semibold"
              key={instructor.id}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/instructor/${instructor.instructorId}`);
              }}
            >
              <img src={getImageFullPath(instructor.image)} alt="default" className="rounded-full w-40 h-40" />
              <p>{instructor.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
