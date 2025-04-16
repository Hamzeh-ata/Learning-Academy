import { selectAllUsersSessions, userSessionsThunks } from '@/slices/admin-slices/user-sessions.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SessionsTable } from './sessions-table';

export function UserSessionsTable() {
  const userSessions = useSelector(selectAllUsersSessions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userSessionsThunks.fetchAll());
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="flex items-center flex-col gap-4 rounded-lg shadow-md shadow-gray-950/25 card-bg text-slate-400 p-8 w-80 w-full">
        <div className="flex w-full justify-between">
          <h3 className="text-base font-semibold text-gray-200">Users Sessions</h3>

          <h3 className="text-md text-green-300">{userSessions.length} Active Sessions</h3>
        </div>
        <div className="w-full">
          <SessionsTable userSessions={userSessions} key={userSessions?.length} />
        </div>
      </div>
    </div>
  );
}
