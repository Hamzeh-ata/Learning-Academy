import { useDispatch, useSelector } from 'react-redux';
import alertService from '@services/alert/alert.service';
import { promoCodeThunks, selectLoading } from '@/slices/admin-slices/codes-slices/promo-code.slice';
import { usePermissionCheck } from '@hooks';
import { EditIcon, TrashIcon, Loader } from '@shared/components';
import { Button } from 'primereact/button';
import { PROMO_CODE_TYPE } from '@constants';
import { getKeyByValue } from '@utils/helpers';

export const PromoCodesList = ({ promoCodes, setSelectCode }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const { edit, delete: canDelete } = usePermissionCheck();

  const handleDelete = (codeId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this Code',
      callback: () => dispatch(promoCodeThunks.delete(codeId))
    });
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Discounted %</th>
            <th>Threshold Value</th>
            <th>Uses Count</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan="7" className="text-center p-10 h-28">
                <Loader />
              </td>
            </tr>
          )}
          {!isLoading &&
            promoCodes?.map((promoCode) => (
              <tr key={promoCode.id}>
                <td>{promoCode.code}</td>
                <td>{getKeyByValue(PROMO_CODE_TYPE, promoCode.type)}</td>
                <td>{promoCode.discount}</td>
                <td>{promoCode.thresholdValue}</td>
                <td>{promoCode.numberOfTimeUsed}</td>
                <td>
                  <span
                    className={`w-5 h-5 block rounded-full shadow-2xl} ${promoCode.isActive ? 'bg-green-400' : 'bg-red-400'}`}
                  ></span>
                </td>
                <td>
                  <div className="flex gap-4">
                    {edit && (
                      <Button tooltip="Edit" onClick={() => setSelectCode(promoCode)}>
                        <EditIcon />
                      </Button>
                    )}
                    {canDelete && (
                      <Button tooltip="Delete" onClick={() => handleDelete(promoCode.id)}>
                        <TrashIcon />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
