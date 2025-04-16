import { useDispatch, useSelector } from 'react-redux';
import alertService from '@services/alert/alert.service';
import { arkanCodesThunks, selectLoading } from '@/slices/admin-slices/codes-slices/arkan-code.slice';
import { usePermissionCheck } from '@hooks';
import { EditIcon, TrashIcon, Loader } from '@shared/components';
import { Button } from 'primereact/button';
import { ARKAN_CODE_TYPE } from '@constants';
import { getKeyByValue } from '@utils/helpers';

export const ArkanCodesList = ({ arkanCodes, setSelectCode }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const { edit, delete: canDelete } = usePermissionCheck();

  const handleDelete = (arkanId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this Code',
      callback: () => dispatch(arkanCodesThunks.delete(arkanId))
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
            <th>Limit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan="6" className="text-center p-10 h-28">
                <Loader />
              </td>
            </tr>
          )}
          {!isLoading &&
            arkanCodes?.map((arkanCode) => (
              <tr key={arkanCode.id}>
                <td>{arkanCode.code}</td>
                <td>{getKeyByValue(ARKAN_CODE_TYPE, arkanCode.type)}</td>
                <td>{arkanCode.discount}</td>
                <td>{arkanCode.numberTimesUsedAllowed}</td>
                <td>
                  <span
                    className={`w-5 h-5 block rounded-full shadow-2xl} ${arkanCode.isActive ? 'bg-green-400' : 'bg-red-400'}`}
                  ></span>
                </td>
                <td>
                  <div className="flex gap-4">
                    {edit && (
                      <Button tooltip="Edit" onClick={() => setSelectCode(arkanCode)}>
                        <EditIcon />
                      </Button>
                    )}
                    {canDelete && (
                      <Button tooltip="Delete" onClick={() => handleDelete(arkanCode.id)}>
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
