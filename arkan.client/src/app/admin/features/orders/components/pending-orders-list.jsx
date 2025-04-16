import { EyeIcon, Loader } from '@shared/components';
import { selectPendingOrdersLoader, selectPendingOrdersPaginationData } from '@slices/admin-slices/orders.slice';
import { formatDateTime } from '@utils/date-format';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Paginator } from 'primereact/paginator';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const PendingOrderList = ({
  pendingOrders,
  filters,
  setFilters,
  viewOrderItems,
  setSelectedOrders,
  selectedOrders
}) => {
  const isLoading = useSelector(selectPendingOrdersLoader);
  const pagination = useSelector(selectPendingOrdersPaginationData);

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

  const handleSelectOrder = (id, checked) => {
    setSelectedOrders((prev) => (checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedOrders(pendingOrders.map((order) => order.id));
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
                  checked={selectedOrders.length === pendingOrders.length && pendingOrders.length > 0}
                />
              </th>
              <th>Name</th>
              <th>Date</th>
              <th>Phone Number</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Promo Code</th>
              <th className="!text-center">Order Items</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="5" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {!isLoading &&
              pendingOrders?.map((order) => (
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
                  <td className="font-semibold">{order.discountAmount}%</td>
                  <td className="font-semibold">{order.promoCode ? order.promoCode : 'Not found'}</td>
                  <td className="text-center">
                    {!!order.items?.length && (
                      <Button tooltip="view orders" onClick={() => viewOrderItems(order.items)}>
                        <EyeIcon />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="py-2  flex justify-center w-full">
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
