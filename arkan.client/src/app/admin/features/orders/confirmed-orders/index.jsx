import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectConfirmedOrders, selectConfirmedOrdersLoader } from '@slices/admin-slices/orders.slice';
import { SidebarPanel } from '@shared/components';
import { OrderItems } from '../components/order-items';
import { usePermissionCheck } from '@hooks';
import {
  fetchConfirmedOrders,
  downloadOrdersExcel,
  deleteConfirmedOrders
} from '@services/admin-services/orders.service';
import { ConfirmedOrderList } from '../components/confirmed-orders-list';
import { OrderFilters } from '../components/order-filters';
import { OrderPayments } from '../components/order-payments';
import alertService from '@services/alert/alert.service';
import { Button } from 'primereact/button';

export const ConfirmedOrders = () => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [orderItems, setOrderItems] = useState([]);
  const [filters, setFilters] = useState({
    userName: '',
    sortBy: '',
    sortOrder: 'desc',
    pageNumber: 1,
    pageSize: 10,
    first: 0
  });

  const filterString = useMemo(() => JSON.stringify(filters), [filters]);
  const confirmedOrders = useSelector(selectConfirmedOrders);
  const isLoading = useSelector(selectConfirmedOrdersLoader);
  const { delete: canDelete } = usePermissionCheck();

  useEffect(() => {
    dispatch(fetchConfirmedOrders(JSON.parse(filterString)));
    setOrderItems([]);
    setSelectedOrder(null);
  }, [filterString, dispatch]);

  function handleOrderPaymentClosed() {
    setSelectedOrder(null);
    dispatch(fetchConfirmedOrders(JSON.parse(filterString)));
  }
  function handleDelete() {
    alertService.showConfirmation({
      title: 'Delete Confirmed Orders',
      body: `Are you sure you want to delete ${selectedOrders.length} order`,
      callback: () => dispatch(deleteConfirmedOrders(selectedOrders))
    });
  }
  const handleDownloadExcel = () => {
    dispatch(downloadOrdersExcel());
  };

  return (
    <div className="flex flex-col gap-3">
      {!isLoading && !confirmedOrders?.length && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-300 text-lg">No Confirmed Orders Found</p>
        </div>
      )}

      {selectedOrder && (
        <SidebarPanel
          isVisible={selectedOrder}
          onHide={handleOrderPaymentClosed}
          position={'top'}
          isDismissible
          isFullScreen
          title={`Order Payments`}
        >
          <OrderPayments order={selectedOrder} />
        </SidebarPanel>
      )}

      <SidebarPanel
        isVisible={!!orderItems.length}
        onHide={() => setOrderItems([])}
        position={'right'}
        isDismissible
        title={`Order Items`}
      >
        <OrderItems orderItems={orderItems} />
      </SidebarPanel>

      {!!confirmedOrders?.length && (
        <>
          <div className="flex w-full justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-200">Confirmed Orders List</h3>
            <button onClick={handleDownloadExcel} className="btn flex items-center">
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download Report</span>
            </button>
          </div>
          <p className="text-base text-gray-200">{confirmedOrders?.length} Orders Found</p>

          <div className="flex gap-4 flex-wrap justify-start mt-2">
            {!!selectedOrders.length && (
              <>
                {canDelete && (
                  <Button
                    className="bg-red-500 px-4 py-2 text-white hover:bg-red-700 animate-fade-up"
                    onClick={() => handleDelete()}
                  >
                    Delete Orders
                  </Button>
                )}
              </>
            )}
          </div>

          <OrderFilters filters={filters} setFilters={setFilters} />
          <ConfirmedOrderList
            confirmedOrders={confirmedOrders}
            filters={filters}
            setSelectedOrder={setSelectedOrder}
            setFilters={setFilters}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
            viewOrderItems={(items) => setOrderItems(items)}
          />
        </>
      )}
    </div>
  );
};
