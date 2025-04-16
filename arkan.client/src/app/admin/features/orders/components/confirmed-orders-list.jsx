import { EyeIcon, Loader, FeatherIcon, ExcelIcon } from '@shared/components';
import { selectConfirmedOrdersLoader, selectConfirmedOrdersPaginationData } from '@slices/admin-slices/orders.slice';
import { formatDateTime } from '@utils/date-format';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { downloadOrderExcel } from '@services/admin-services/orders.service';
import { Checkbox } from 'primereact/checkbox';

export const ConfirmedOrderList = ({
  confirmedOrders,
  filters,
  setFilters,
  viewOrderItems,
  setSelectedOrder,
  setSelectedOrders,
  selectedOrders
}) => {
  const isLoading = useSelector(selectConfirmedOrdersLoader);
  const pagination = useSelector(selectConfirmedOrdersPaginationData);
  const dispatch = useDispatch();

  const onPageChange = useCallback(
    (event) => {
      setFilters((f) => ({
        ...f,
        first: event.first,
        pageNumber: event.page + 1,
        pageSize: event.rows
      }));
    },
    [setFilters]
  );
  const handleDownloadExcel = (orderId) => {
    dispatch(downloadOrderExcel(orderId));
  };
  const handleSelectOrder = (id, checked) => {
    setSelectedOrders((prev) => (checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedOrders(confirmedOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setSelectedOrders([]);
    }
  }, [isLoading]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-center pt-2 overflow-y-auto max-h-[calc(100vh-300px)] pb-2">
        <table className="table">
          <thead>
            <tr>
              <th>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedOrders.length === confirmedOrders.length && confirmedOrders.length > 0}
                />
              </th>
              <th>Name</th>
              <th>Date</th>
              <th>Phone Number</th>
              <th>Amount</th>
              <th>Total Paid</th>
              <th>Remaining Amount</th>
              <th className="!text-center">Order Items</th>
              <th className="!text-center">Payments</th>
              <th className="!text-center">Excel</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="8" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {!isLoading &&
              confirmedOrders?.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Checkbox
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      checked={selectedOrders.includes(order.id)}
                    />
                  </td>

                  <td>{order.userName}</td>
                  <td>{formatDateTime(order.orderDate)}</td>
                  <td>{order.userPhone || '---'}</td>
                  <td className="font-semibold">{order.amount} JOD</td>
                  <td className="font-semibold">{order.totalPayments} JOD</td>
                  <td className="font-semibold w-[120px]">
                    <span
                      className={classNames('rounded-md px-2 py-1 text-white', {
                        'bg-red-400': order.remainingAmount > 0,
                        'bg-green-400': !order.remainingAmount
                      })}
                    >
                      {order.remainingAmount ? `- ${order.remainingAmount}` : order.remainingAmount} JOD
                    </span>
                  </td>
                  <td className="text-center">
                    {!!order.items?.length && (
                      <Button tooltip="view orders" onClick={() => viewOrderItems(order.items)}>
                        <EyeIcon />
                      </Button>
                    )}
                  </td>
                  <td className="w-[100px] text-center">
                    <Button
                      tooltip="view payments"
                      className="text-orange-500 hover:text-orange-600"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FeatherIcon name="CreditCard" />
                    </Button>
                  </td>
                  <td className="w-[100px] text-center">
                    <Button
                      tooltip={'download excel'}
                      className="text-orange-500 hover:text-orange-600"
                      onClick={() => handleDownloadExcel(order.id)}
                      disabled={order.remainingAmount == order.amount}
                    >
                      <ExcelIcon />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="py-2 flex justify-center w-full">
        <Paginator
          first={filters?.first}
          rows={filters?.pageSize}
          totalRecords={pagination?.totalCount}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onPageChange}
          className="flex w-full"
        />
      </div>
    </div>
  );
};
