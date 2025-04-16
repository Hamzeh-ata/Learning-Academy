import { useDispatch, useSelector } from 'react-redux';
import { selectUserCart } from '@/slices/client-slices/user-cart.slice';
import { getImageFullPath } from '@utils/image-path';
import { FeatherIcon } from '@shared/components';
import {
  deleteCartItem,
  getUserCart,
  checkoutCart,
  addCartCode,
  checkCartCode,
  removeCartCode
} from '@services/client-services/user-cart.service';
import { Button } from 'primereact/button';
import emptyCart from '@assets/icons/empty-cart.svg';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import alertService from '@services/alert/alert.service';

const CheckoutPage = () => {
  const cartItems = useSelector(selectUserCart);
  const dispatch = useDispatch();
  const [code, setCode] = useState(cartItems.promoCode || '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getUserCart());
  }, []);

  if (!cartItems?.items.length) {
    return (
      <div className="w-full h-full flex p-8 flex-wrap items-center justify-center">
        <div className=" text-lg">
          <p>You don`t have any items in your cart</p>
        </div>
        <img src={emptyCart} alt="empty cart" />
      </div>
    );
  }

  const total = cartItems.items.reduce(
    (acc, course) => ({
      totalPrice: acc.totalPrice + course.price,
      totalDiscount: acc.totalDiscount + (course.discountPrice || course.price)
    }),
    { totalPrice: 0, totalDiscount: 0 }
  );

  const handleDelete = (id) => {
    setIsDeleting(true);
    dispatch(deleteCartItem(id))
      .unwrap()
      .then(() => {
        dispatch(getUserCart());
        setIsDeleting(false);
      });
  };

  const handleCheckout = () => {
    dispatch(checkoutCart(code))
      .unwrap()
      .then(() => {
        alertService.showAlert({
          type: 'success',
          title: 'Order Submitted!',
          body: ' we will get back to you once confirmed!'
        });
        dispatch(getUserCart());
      });
  };

  const onSubmitCode = (codeObject) => {
    dispatch(addCartCode(codeObject))
      .unwrap()
      .then(() => {
        dispatch(getUserCart());
      });
  };

  const onSubmitPromoCode = (codeObject) => {
    dispatch(checkCartCode(codeObject));
  };

  const onRemoveCode = (itemId) => {
    dispatch(removeCartCode(itemId))
      .unwrap()
      .then(() => {
        dispatch(getUserCart());
      });
  };

  return (
    <div className="flex px-8 gap-4 flex-wrap mb-4">
      <div className="py-4 flex-col gap-6 flex w-full lg:w-[66%] overflow-hidden">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cart Items</h3>
          <p className="text-gray-600">
            <span className="font-semibold">{cartItems.items.length} items</span> in your cart
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-3xl overflow-y-auto max-h-[400px] xl:px-8 scrollable">
          <table className="table">
            <thead>
              <tr>
                <th className="pl-4 text-center">Item</th>
                <th>Price</th>
                <th>Discount Price</th>
                <th>Arkan Code</th>
                <th className="!text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.items.map((item) => (
                <CartItem
                  item={item}
                  key={item.id}
                  isDeleting={isDeleting}
                  handleDelete={handleDelete}
                  onSubmitCode={onSubmitCode}
                  onRemoveCode={onRemoveCode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:mt-20 flex flex-col w-full lg:w-[30%]">
        <div className="bg-white rounded-3xl px-6 py-4 shadow-lg">
          <h3 className="font-semibold text-base">Cart Total</h3>

          <div className="flex flex-col my-4 gap-4">
            <div className="flex justify-between">
              <p>Courses Prices</p>
              <p>{total?.totalPrice} JD</p>
            </div>
            <div className="flex justify-between">
              <p>Total Discount</p>
              <p className="text-red-400">{cartItems.amount - (total?.totalPrice || 0)} JD</p>
            </div>
            <div className="flex justify-between font-semibold">
              <p>Total Price</p>
              <p className="text-lg text-end">
                <span className={`${cartItems.discountAmount ? 'line-through text-gray-500' : ''}`}>
                  {cartItems.amount} JD
                </span>
                {cartItems.discountAmount && <p className="">{cartItems.discountAmount} JD</p>}
              </p>
            </div>
          </div>
          <div className="flex justify-between border-t pt-4 items-center">
            {cartItems.discountAmount && (
              <p className="text-md font-semibold text-green-400 flex items-center gap-1">
                <FeatherIcon name="Check" className="text-green-400" size={20} />
                {code} Applied
              </p>
            )}
            {!cartItems.discountAmount && (
              <div className="flex overflow-hidden">
                <InputText
                  placeholder="Promo code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border border-arkan px-1 py-1 rounded-r-none max-w-40"
                />
                <Button
                  tooltip="Apply Code"
                  className="bg-arkan text-white px-2 rounded-l-none py-1 hover:bg-arkan-dark"
                  onClick={() => onSubmitPromoCode({ orderAmount: cartItems.amount, code })}
                >
                  <FeatherIcon name="Check" size={18} />
                </Button>
              </div>
            )}
            <button className="bg-arkan px-4 py-2 text-white rounded-lg hover:bg-arkan-dark" onClick={handleCheckout}>
              Check out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

const CartItem = ({ item, handleDelete, onSubmitCode, onRemoveCode, isDeleting }) => {
  const [showAddCode, setShowAddCode] = useState(false);
  const [code, setCode] = useState(item.arkanCode);

  const handleRemoveCode = () => {
    setShowAddCode(false);
    setCode('');
    if (item.arkanCode) {
      onRemoveCode(item.id);
    }
  };

  return (
    <tr key={item.id}>
      <td className="pl-4 w-[45%]">
        <div className="flex gap-4">
          <img src={getImageFullPath(item.image)} alt={item.name} className="w-16 h-16 rounded-2xl" />
          <div className="flex flex-col justify-center">
            <p className="text-base font-semibold line-clamp-2 max-w-[200px]"> {item.name}</p>
            <p>{item.type}</p>
          </div>
        </div>
      </td>
      <td>{item.price} JD</td>
      <td>{item.discountPrice || 0}</td>
      <td className="w-40">
        {item.arkanCode && (
          <div className="flex items-center">
            <span className="px-2 py-1 bg-arkan text-white rounded-2xl text-sm rounded-r-none">{item.arkanCode}</span>
            <Button
              tooltip="Remove Code"
              className="bg-arkan text-white px-1 rounded-2xl rounded-l-none py-1 hover:bg-red-600"
              onClick={handleRemoveCode}
            >
              <FeatherIcon size={18} name="X" />
            </Button>
          </div>
        )}
        {showAddCode && !item.arkanCode && (
          <div className="flex overflow-hidden">
            <Button
              tooltip="Clear Code"
              className="bg-red-500 text-white px-1 rounded-r-none py-1 hover:bg-red-600"
              onClick={handleRemoveCode}
            >
              <FeatherIcon size={18} name="X" />
            </Button>
            <InputText
              placeholder="Arkan code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border-y border-arkan px-1 py-1 rounded-none max-w-40"
            />
            <Button
              tooltip="Apply Code"
              className="bg-arkan text-white px-1 rounded-l-none py-1 hover:bg-arkan-dark"
              onClick={() => onSubmitCode({ itemId: item.id, code })}
            >
              <FeatherIcon name="Check" size={18} />
            </Button>
          </div>
        )}
        {!showAddCode && !item.arkanCode && (
          <Button
            className="text-orange-500 hover:text-orange-600 cursor-pointer"
            onClick={() => {
              setShowAddCode(true);
            }}
            tooltip="Add Arkan code"
          >
            <FeatherIcon name="Tag" />
          </Button>
        )}
      </td>
      <td className="text-center">
        <Button
          className="text-red-500 hover:text-red-600 cursor-pointer"
          onClick={() => {
            handleDelete(item.id);
          }}
          tooltip="Remove item"
          disabled={isDeleting}
        >
          <FeatherIcon name="XCircle" />
        </Button>
      </td>
    </tr>
  );
};
