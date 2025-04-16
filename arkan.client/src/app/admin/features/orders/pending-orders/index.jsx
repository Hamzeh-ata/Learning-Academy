import { usePermissionCheck } from '@hooks';
import { confirmOrders, deletePendingOrders, fetchPendingOrders } from '@services/admin-services/orders.service';
import alertService from '@services/alert/alert.service';
import { SidebarPanel } from '@shared/components';
import { selectPendingOrders, selectPendingOrdersLoader } from '@slices/admin-slices/orders.slice';
import { Button } from 'primereact/button';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderFilters } from '../components/order-filters';
import { OrderItems } from '../components/order-items';
import { PendingOrderList } from '../components/pending-orders-list';

export const PendingOrders = () => {
  const dispatch = useDispatch();
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
  const pendingOrders = useSelector(selectPendingOrders);
  const isLoading = useSelector(selectPendingOrdersLoader);
  const { edit, delete: canDelete } = usePermissionCheck();

  useEffect(() => {
    dispatch(fetchPendingOrders(JSON.parse(filterString)));
    setOrderItems([]);
    setSelectedOrders([]);
  }, [filterString, dispatch]);

  function confirmPendingOrders() {
    alertService.showConfirmation({
      title: 'Confirm Pending Orders',
      body: `Are you sure you want to confirm ${selectedOrders.length} order`,
      callback: () => dispatch(confirmOrders(selectedOrders))
    });
  }

  function handleDelete() {
    alertService.showConfirmation({
      title: 'Delete Pending Orders',
      body: `Are you sure you want to delete ${selectedOrders.length} order`,
      callback: () => dispatch(deletePendingOrders(selectedOrders))
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {!isLoading && !pendingOrders?.length && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-300 text-lg">No Pending Orders Found</p>
        </div>
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

      {!!pendingOrders?.length && (
        <>
          <div className="flex w-full justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-200">Pending Orders List</h3>
            <p className="text-base text-gray-200">{pendingOrders?.length} Orders Found</p>
          </div>

          <div className="flex gap-4 flex-wrap justify-start mt-2">
            {!!selectedOrders.length && (
              <>
                {edit && (
                  <Button
                    className="bg-teal-500 px-4 py-2 text-white hover:bg-teal-700 animate-fade-up"
                    onClick={() => confirmPendingOrders()}
                  >
                    Confirm Orders
                  </Button>
                )}
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
          <PendingOrderList
            pendingOrders={pendingOrders}
            filters={filters}
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
