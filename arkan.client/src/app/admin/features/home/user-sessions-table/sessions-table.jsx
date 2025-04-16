import { FeatherIcon, Loader } from '@/app/shared/components';
import { usePermissionCheck } from '@/hooks';
import alertService from '@/services/alert/alert.service';
import { selectLoading, userSessionsThunks } from '@/slices/admin-slices/user-sessions.slice';
import { useDebounce } from '@uidotdev/usehooks';
import { getDateAgo } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function SessionsTable({ userSessions }) {
  const [sessions, setSessions] = useState(userSessions);
  const isLoading = useSelector(selectLoading);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { delete: canDelete } = usePermissionCheck('sessions');

  const dispatch = useDispatch();

  const handleRevoke = (userId) => {
    alertService.showConfirmation({
      title: 'Confirm Revoke',
      body: 'Are you sure you want to revoke this session',
      callback: () => dispatch(userSessionsThunks.delete(userId))
    });
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearInput = () => {
    setSearchTerm('');
  };

  function handleSort(field) {
    const sorted = [...sessions].sort((a, b) => {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
    setSessions(sorted);
  }

  useEffect(() => {
    if (isLoading) return;
    if (!debouncedSearchTerm) {
      setSessions(userSessions);
      return;
    }
    const filtered = userSessions.filter(
      (session) =>
        session.email.trim()?.toLowerCase()?.includes(debouncedSearchTerm?.trim()?.toLowerCase()) ||
        session.firstName.trim()?.toLowerCase()?.includes(debouncedSearchTerm?.trim()?.toLowerCase()) ||
        session.lastName.trim()?.toLowerCase()?.includes(debouncedSearchTerm?.trim()?.toLowerCase())
    );
    setSessions(filtered);
  }, [debouncedSearchTerm]);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="w-full flex relative items-center gap-4 justify-between mt-4 flex-wrap">
          <div className="flex-1 relative min-w-[80%]">
            <span className="absolute left-2 top-1/2 bottom-1 transform -translate-y-1/2 text-gray-400">
              <FeatherIcon name="Search" size="18" />
            </span>
            <InputText
              placeholder="Search by User Name or Email..."
              className="w-full py-3 ps-8 transition-all ease-in-out delay-100 placeholder:text-md duration-300 hover:bg-slate-600 hover:shadow-md px-4 rounded-lg bg-slate-700 ring-0 text-white placeholder:text-slate-400"
              value={searchTerm}
              onChange={handleChange}
            />
            {searchTerm && (
              <button
                onClick={clearInput}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
              >
                <FeatherIcon name="XCircle" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSort('email');
                  }}
                >
                  Email
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      handleSort('email');
                    }}
                    className="ml-1 cursor-pointer"
                  >
                    <svg
                      className="w-3 h-3 ms-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSort('firstName');
                  }}
                >
                  Name
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      handleSort('firstName');
                    }}
                    className="ml-1 cursor-pointer"
                  >
                    <svg
                      className="w-3 h-3 ms-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Device</div>
              </th>
              <th scope="col" className="px-6 py-3">
                Browser
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSort('lastLoggedTime');
                  }}
                >
                  Last Login
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      handleSort('lastLoggedTime');
                    }}
                    className="ml-1 cursor-pointer"
                  >
                    <svg
                      className="w-3 h-3 ms-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Revoke</span>
              </th>
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
              sessions?.map((session) => (
                <tr className="border-b bg-gray-800 border-gray-700" key={session.id}>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    <div className="flex gap-2 items-center">
                      <span>
                        <img
                          className="rounded-md shadow-xl w-12 h-12 object-fill"
                          src={getImageFullPath(session.image)}
                          alt={'user'}
                        />
                      </span>
                      <span className="max-w-[300px] truncate">{session.email}</span>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    {session.firstName} {session.lastName}
                  </td>
                  <td className="px-6 py-4">{getSessionDevice(session.deviceType)}</td>
                  <td className="px-6 py-4">{session.browser}</td>
                  <td className="px-6 py-4">{getDateAgo(new Date(session.lastLoggedTime))}</td>
                  <td className="px-6 py-4 text-right">
                    {canDelete && (
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          handleRevoke(session.id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Revoke
                      </a>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getSessionDevice(device) {
  if (device === 'desktop') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#597e8d"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-12z" />
        <path d="M3 13h18" />
        <path d="M8 21h8" />
        <path d="M10 17l-.5 4" />
        <path d="M14 17l.5 4" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#597e8d"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z" />
      <path d="M11 4h2" />
      <path d="M12 17v.01" />
    </svg>
  );
}
