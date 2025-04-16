import { getImageFullPath } from '@utils/image-path';
import { FeatherIcon } from '@shared/components';
import { useIsStudent, useIsAuthenticated } from '@hooks';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openLoginModal } from '@slices/auth/auth.slice';
import { addCartItem } from '@services/client-services/user-cart.service';
import { PRODUCT_TYPE, TABLET_MAX_WIDTH_QUERY } from '@constants';
import { selectUserCart } from '@/slices/client-slices/user-cart.slice';
import { useEffect, useState } from 'react';
import alertService from '@services/alert/alert.service';
import { useMediaQuery } from '@uidotdev/usehooks';
import classNames from 'classnames';

export const CourseOverView = ({ courseData, courseChapters }) => {
  const isLoggedIn = useIsAuthenticated();
  const isStudent = useIsStudent();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectUserCart);
  const [isItemInCart, setIsItemInCart] = useState(false);
  const isTablet = useMediaQuery(TABLET_MAX_WIDTH_QUERY);

  let completedLessons = 0;

  useEffect(() => {
    const itemInCart = cartItems.items.some((item) => item.id?.toString() === courseData.id?.toString());
    setIsItemInCart(itemInCart);
  }, [cartItems, courseData.id]);

  if (isLoggedIn) {
    if (!isStudent) {
      return;
    }
    if (courseData.isEnroll && courseData.lessonsCount) {
      if (courseChapters?.chapters?.length) {
        const lessons = courseChapters?.chapters.flatMap((e) => e.lessons);
        completedLessons = lessons?.filter((e) => e.isCompleted)?.length;
      }
    }
  }

  function handleOnClick() {
    if (!courseData.id) {
      alertService.showToast({ type: 'error', title: 'Failed to add course to cart' });
      return;
    }

    if (!isLoggedIn) {
      dispatch(openLoginModal());
      return;
    }

    if (isItemInCart) {
      navigate('/checkout');
      return;
    }

    if (courseData.isEnroll) {
      navigate(`/lesson/${courseData.id}`);
    } else {
      dispatch(addCartItem({ itemId: courseData.id, type: PRODUCT_TYPE.course }));
      alertService.showToast({ type: 'success', title: 'Added to cart' });
    }
  }

  const tabletClasses = classNames('animate-fade-up px-4 ');
  const desktopClasses = classNames(
    'bg-white animate-fade-up w-72 rounded-xl shadow-md shadow-slate-400 absolute top-10 left-10 xs:left-4 md:left-1/4 xl:top-80 lg:left-10'
  );

  return (
    <div className={isTablet ? tabletClasses : desktopClasses}>
      <div className="py-6 flex flex-col gap-4 items-center">
        <div>
          <img src={getImageFullPath(courseData.image)} alt="course image" className="h-36 rounded-lg w-52" />
        </div>
        <div className="flex gap-1 items-center pt-2">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-book"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#874900"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
            </svg>
          </span>
          <h3>{courseData.instructorName}</h3>
        </div>
        <div className="flex gap-1 items-center border-t w-full justify-center pt-4 border-slate-300">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-book"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#874900"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
              <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
              <path d="M3 6l0 13" />
              <path d="M12 6l0 13" />
              <path d="M21 6l0 13" />
            </svg>
          </span>

          {courseData.lessonsCount}

          <span>lessons</span>
        </div>
        {!!completedLessons && (
          <div className="flex gap-1 items-center border-t w-full justify-center pt-4 border-slate-300">
            <div className="flex gap-1 items-center">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-book"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#874900"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 21l8 0" />
                  <path d="M12 17l0 4" />
                  <path d="M7 4l10 0" />
                  <path d="M17 4v8a5 5 0 0 1 -10 0v-8" />
                  <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                </svg>
              </span>
              {completedLessons}/{courseData.lessonsCount}
              <span>lessons completed</span>
            </div>
          </div>
        )}

        {!courseData.isEnroll && !isItemInCart && !courseData.isPending && (
          <div className="border-slate-300 border-t w-full pt-4 text-center">
            <span className="text-lg text-center content-end">
              {courseData.discountPrice ? (
                <span className="flex flex-col gap-1">
                  <span className="font-bold">{courseData.discountPrice} JD</span>
                  <span className="line-through text-gray-400 mr-2">{courseData.price} JD</span>
                </span>
              ) : (
                <span className="text-center">{courseData.price} JD</span>
              )}
            </span>
          </div>
        )}

        <div className="text-center">
          {courseData.isPending && <p className="text-arkan font-semibold">Your order has been placed!</p>}

          {!courseData.isPending && (
            <button
              className="bg-arkan hover:bg-arkan-dark px-8 py-2 text-white rounded-md flex gap-2 items-center"
              onClick={handleOnClick}
            >
              {courseData.isEnroll && (
                <>
                  Continue Watching
                  <FeatherIcon name="Video" size="18" />
                </>
              )}
              {!courseData.isEnroll && !isItemInCart && (
                <>
                  Add to cart
                  <FeatherIcon name="ShoppingCart" size="18" />
                </>
              )}
              {isItemInCart && (
                <>
                  Check out
                  <FeatherIcon name="ShoppingCart" size="18" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
