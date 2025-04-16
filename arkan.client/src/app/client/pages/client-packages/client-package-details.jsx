import { CourseCard, FeatherIcon } from '@shared/components';
import AlertService from '@services/alert/alert.service';
import { useDispatch } from 'react-redux';
import { useIsStudent, useIsAuthenticated } from '@hooks';
import { openLoginModal } from '@slices/auth/auth.slice';
import { useNavigate } from 'react-router-dom';
import { addCartItem } from '@services/client-services/user-cart.service';
import { PRODUCT_TYPE } from '@constants';

export const ClientPackageDetails = ({ packageObj }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useIsAuthenticated();
  const navigate = useNavigate();
  const isStudent = useIsStudent();

  async function handleOnClick() {
    if (!packageObj.id) {
      AlertService.showToast({ type: 'error', title: 'Failed to add course to cart' });
      return;
    }

    if (!isLoggedIn) {
      dispatch(openLoginModal());
      return;
    }

    if (!isStudent) {
      return;
    }

    if (packageObj.isInCart) {
      navigate('/checkout');
      return;
    }

    if (packageObj.isEnrolled) {
      return;
    } else {
      await dispatch(addCartItem({ itemId: packageObj.id, type: PRODUCT_TYPE.package })).unwrap();
      AlertService.showToast({ type: 'success', title: 'Added to cart' });
      navigate('/checkout');
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-2xl mb-2 font-semibold">{packageObj?.name}</h3>
        <div className="flex gap-2">
          <p>{packageObj?.coursesCount} Courses</p>
          <span>-</span>
          <p>{packageObj?.lessonsCount} Lessons</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center p-6 overflow-y-auto max-h-[calc(100vh-400px)] border rounded-md mb-2">
        {packageObj?.courses?.map((course) => (
          <CourseCard
            course={{ ...course, instructorName: course.instructor }}
            key={course.id}
            className="lg:min-w-[300px] max-w-[250px] min-w-[250px]"
          />
        ))}
      </div>

      {isStudent && !packageObj.isEnrolled && !packageObj.isPending && (
        <div className="text-center self-center z-10">
          <button
            className="bg-arkan hover:bg-arkan-dark px-8 py-2 text-white rounded-md flex gap-2 items-center"
            onClick={handleOnClick}
          >
            {!packageObj.isInCart && (
              <>
                Add to cart
                <FeatherIcon name="ShoppingCart" size="18" />
              </>
            )}
            {packageObj.isInCart && (
              <>
                Check out
                <FeatherIcon name="ShoppingCart" size="18" />
              </>
            )}
          </button>
        </div>
      )}
      {packageObj.isEnrolled && (
        <div className="text-center self-center z-10 text-arkan px-8 py-2  rounded-md">Already Enrolled 🎉</div>
      )}
      {packageObj.isPending && <p className="text-arkan self-center font-semibold">Your order has been placed!</p>}
    </div>
  );
};
