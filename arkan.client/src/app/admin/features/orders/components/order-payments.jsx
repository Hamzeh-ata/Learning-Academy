import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrderPayment, getOrderPayments, postOrderPayment } from '@services/admin-services/orders.service';
import { selectOrderPayments } from '@slices/admin-slices/orders.slice';
import { formatDateTime } from '@utils/date-format';
import { InputNumber } from 'primereact/InputNumber';
import { FeatherIcon, Loader } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const OrderPayments = ({ order }) => {
  const dispatch = useDispatch();
  const orderPayment = useSelector(selectOrderPayments);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const { edit, delete: canDelete } = usePermissionCheck();

  useEffect(() => {
    if (order.id) {
      dispatch(getOrderPayments(order.id));
    }
    setPaymentAmount(null);
  }, [dispatch, order]);

  function handleAddPayment() {
    if (paymentAmount) {
      dispatch(postOrderPayment({ orderId: order.id, amountPaid: paymentAmount }))
        .unwrap()
        .then(() => {
          dispatch(getOrderPayments(order.id));
        });
      setPaymentAmount(null);
    }
  }

  function handleDeletePayment(paymentId) {
    dispatch(deleteOrderPayment(paymentId))
      .unwrap()
      .then(() => {
        dispatch(getOrderPayments(order.id));
      });
  }

  return (
    <div>
      <div className="flex gap-8 justify-center border-b pb-4 mb-2 border-blue-grey-500">
        <div className="flex flex-col text-center gap-2 rounded-md shadow-md border-blue-grey-600 border p-4 bg-slate-800 text-gray-200">
          Order Amount
          <span className="text-white font-semibold">{orderPayment.orderAmount} JOD</span>
        </div>

        <div className="flex flex-col text-center gap-2 rounded-md shadow-md border-blue-grey-600 border p-4 bg-slate-800 text-gray-200">
          Total Payments
          <span className="text-white font-semibold">{orderPayment.totalPayments} JOD</span>
        </div>
        <div className="flex flex-col text-center gap-2 rounded-md shadow-md border-blue-grey-600 border p-4 bg-slate-800 text-gray-200">
          Remaining Amount
          <span className="text-white font-semibold">{orderPayment.remainingAmount} JOD</span>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-gray-200 text-base">Payments:</p>
        {edit && (
          <div className="field flex border-b pb-4 border-blue-grey-500 px-2 !mb-4">
            <InputNumber
              value={paymentAmount}
              onValueChange={(e) => setPaymentAmount(e.value)}
              useGrouping={false}
              min={0}
              className="flex-1"
            />
            <button
              className="bg-arkan hover:bg-arkan-dark text-white px-2 py-3 rounded-md shadow-md"
              onClick={handleAddPayment}
            >
              Add Payment
            </button>
          </div>
        )}
        {orderPayment.loading && (
          <div className="text-center p-10 h-28">
            <Loader />
          </div>
        )}
        {!orderPayment?.payments?.length && <p className="text-gray-200 text-center">No Payments Yet!</p>}
        {!orderPayment.loading && !!orderPayment?.payments?.length && (
          <div className="flex flex-wrap gap-4">
            {orderPayment?.payments?.map((payment, index) => (
              <div
                key={payment.id}
                className="text-gray-300 flex flex-col gap-4 mb-2 rounded-md bg-slate-900 px-4 py-2"
              >
                <div className="flex justify-between items-center pt-2">
                  <p>Payment {index + 1}: </p>
                  {canDelete && (
                    <button className="text-red-400 hover:text-red-500" onClick={() => handleDeletePayment(payment.id)}>
                      <FeatherIcon name="Trash2" size={20} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col px-2 gap-4 pb-2">
                  <p>
                    Amount Paid: <span className="text-white">{payment.amountPaid} JOD</span>
                  </p>
                  <p>
                    Date: <span className="text-white">{formatDateTime(payment.paymentDate)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
