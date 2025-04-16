import { useSelector, useDispatch } from 'react-redux';
import { selectLoading } from '@slices/admin-slices/change-password-requests.slice';
import { Loader } from '@shared/components';
import alertService from '@services/alert/alert.service';
import { deleteRequest, acceptRequest } from '@services/admin-services/change-password-requests.service';
import { ChangePasswordRequestsActions } from './components/change-password-requests-actions';
import { useState } from 'react';
import { Button } from 'primereact/button';

export const RequestsList = ({ requests }) => {
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const [showPasswordMap, setShowPasswordMap] = useState({});

  const handleDelete = (request) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this request',
      callback: () => dispatch(deleteRequest(request))
    });
  };

  const setSelectedRequest = (request) => {
    alertService.showConfirmation({
      title: 'Confirm Accept',
      body: 'Are you sure you want accept this request',
      callback: () => dispatch(acceptRequest(request))
    });
  };

  const togglePasswordVisibility = (requestId) => {
    setShowPasswordMap((prevState) => ({
      ...prevState,
      [requestId]: !prevState[requestId]
    }));
  };

  return (
    <>
      {!isLoading && !requests?.length && <p>There are no requests</p>}
      {!!requests?.length && (
        <table className="table">
          <thead>
            <tr>
              <th>UserName</th>
              <th>Phone</th>
              <th>Request Date</th>
              <th>New Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {!isLoading &&
              requests.length !== 0 &&
              requests?.map((request) => (
                <tr key={request.id}>
                  <td>{request.userName}</td>
                  <td>{request.phoneNumber}</td>
                  <td>{request.date}</td>
                  <td>
                    <Button tooltip="View Password" onClick={() => togglePasswordVisibility(request.id)}>
                      {showPasswordMap[request.id] ? request.password : '******'}
                    </Button>
                  </td>
                  <td>
                    <ChangePasswordRequestsActions
                      setSelectedRequest={setSelectedRequest}
                      handleDelete={handleDelete}
                      request={request}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};
