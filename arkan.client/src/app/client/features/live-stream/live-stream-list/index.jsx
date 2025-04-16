import { FeatherIcon } from '@/app/shared/components';
import { LiveSessionStatus } from '@/constants';
import { useIsStudent } from '@/hooks';
import { formaDateTimeRange } from '@utils/date-format';
import { getKeyByValue } from '@utils/helpers';

export function LiveStreamList({ liveStreams, onEdit, onDelete, onStudentJoin, onEnd, onStart }) {
  const isStudent = useIsStudent();

  return (
    <div className="flex flex-wrap gap-4 pt-2 pb-4 px-2">
      {liveStreams?.map((liveStream) => (
        <div className="custom-card-content" key={liveStream.id}>
          <div className="p-4 bg-blue-grey-300/35 text-center inline-flex justify-center rounded-2xl drop-shadow-md">
            <h4>{liveStream.title}</h4>
          </div>
          <div className="custom-card-body">
            <div className="flex w-full bg-slate-200/40 rounded-md overflow-hidden">
              <p className="overflow-hidden w-full p-3 text-gray-800">
                <span className="text-muted"> Course Name: </span>
                <span className="capitalize inline-flex">{liveStream.courseName}</span>
              </p>
              <i>
                <FeatherIcon name="Clock" />
              </i>
            </div>
            <div className="flex w-full bg-slate-200/40 rounded-md overflow-hidden">
              <p className="overflow-hidden w-full p-3 text-gray-800">
                <span className="text-muted"> Instructor Name: </span>
                <span className="capitalize inline-flex">{liveStream.instructorName}</span>
              </p>
              <i>
                <FeatherIcon name="Clock" />
              </i>
            </div>
            <div className="flex w-full bg-slate-200/40 rounded-md overflow-hidden">
              <p className="overflow-hidden w-full p-3 text-gray-800">
                <span className="text-muted"> Session Time: </span>
                <span className="capitalize inline-flex">
                  {formaDateTimeRange(new Date(liveStream.startTime), new Date(liveStream.endTime))}
                </span>
              </p>
              <i>
                <FeatherIcon name="Clock" />
              </i>
            </div>
            <div className="flex w-full bg-slate-200/40 rounded-md overflow-hidden">
              <p className="overflow-hidden w-full p-3 text-gray-800">
                <span className="text-muted"> Status: </span>
                <span className="capitalize inline-flex">{getKeyByValue(LiveSessionStatus, liveStream.status)}</span>
              </p>
              <i>
                <FeatherIcon
                  name="Circle"
                  className={`block rounded-full shadow-2xl animate-pulse stroke-none ${liveStatusClass[liveStream.status]}`}
                />
              </i>
            </div>
            {isStudent && liveStream.isStarted && (
              <div className="flex w-full rounded-md overflow-hidden py-2 justify-center">
                <button className="btn" onClick={() => onStudentJoin(liveStream)}>
                  Join Session
                </button>
              </div>
            )}

            {liveStream.isOwner && (
              <div className="flex w-full bg-slate-200/40 rounded-md overflow-hidden py-2 justify-center gap-4">
                {liveStream.isStarted && (
                  <button className="btn" onClick={() => onEnd(liveStream)}>
                    End Session
                  </button>
                )}
                {!liveStream.isStarted && (
                  <button className="btn" onClick={() => onStart(liveStream)}>
                    Start Session
                  </button>
                )}
                <button className="btn !bg-blue-600" onClick={() => onEdit(liveStream)}>
                  Edit
                </button>
                <button className="btn danger" onClick={() => onDelete(liveStream.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
const liveStatusClass = {
  0: 'bg-green-400',
  1: 'bg-yellow-400',
  2: 'bg-red-400'
};
