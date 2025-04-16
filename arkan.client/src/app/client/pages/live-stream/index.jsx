import { useIsStudent } from '@/hooks';
import { getCourseByFilters } from '@/services/client-services/courses-filter.service';
import { selectFilteredCourses } from '@/slices/client-slices/courses-filter.slice';
import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarPanel, CourseLoader } from '@shared/components';
import { LiveStreamEntry, LiveStreamFilters, LiveStreamList } from '@(client)/features/live-stream';
import { useDebounce } from '@uidotdev/usehooks';
import emptyCoursesList from '@assets/images/empty-results.svg';
import { selectLiveStreams, selectLoading } from '@/slices/client-slices/live-stream.slice';
import './live-stream.css';
import { liveStreamThunks } from '@/services/client-services/live-stream.service';
import alertService from '@services/alert/alert.service';
import { DYTE_CLIENT } from '@/services/dyte-service';
import { useNavigate } from 'react-router-dom';
import { LiveSessionStatus } from '@/constants';

export default function LiveStream() {
  const [isModalOpen, setIsModalOpen] = useState();
  const [selectedLiveStream, setSelectedLiveStream] = useState();
  const isStudent = useIsStudent();
  const userProfile = useSelector(selectUserProfile);
  const courses = useSelector(selectFilteredCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const liveStreams = useSelector(selectLiveStreams);
  const isLoading = useSelector(selectLoading);
  const [liveSessions, setLiveSessions] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStudent) {
      dispatch(getCourseByFilters({ pageNumber: 1, pageSize: 1000, InstructorUserId: userProfile?.userId }));
    }
  }, [isStudent, userProfile?.userId]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLiveSessions(liveStreams.filter((liveStream) => liveStream.title.includes(debouncedSearchTerm)));
    } else {
      setLiveSessions(liveStreams);
    }
  }, [debouncedSearchTerm, liveStreams]);

  useEffect(() => {
    dispatch(liveStreamThunks.get());
  }, []);

  function reset() {
    setSelectedLiveStream(null);
    setIsModalOpen(false);
  }

  const handleDelete = (liveId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this session',
      callback: () => dispatch(liveStreamThunks.delete(liveId))
    });
  };

  async function handleStart(liveSession) {
    const response = await DYTE_CLIENT.createMeeting(liveSession.title + ' - ' + liveSession.courseName);

    if (response.data) {
      await dispatch(
        liveStreamThunks.toggleLive({
          liveId: liveSession.id,
          notifyUsers: true,
          status: LiveSessionStatus.Started,
          meetingId: response.data.id
        })
      ).unwrap();

      handleStudentJoin({ ...liveSession, meetingId: response.data.id, isHost: true });
    }
  }

  async function handleStudentJoin(liveSession) {
    const response = await DYTE_CLIENT.joinMeeting({
      meetingId: liveSession.meetingId,
      participantName: userProfile?.firstName + ' ' + userProfile?.lastName,
      participantId: userProfile?.userId,
      isHost: liveSession.isHost,
      participantImage: 'https://i.imgur.com/test.jpg' //getImageFullPath(userProfile?.image)
    });

    console.log({ response });

    if (response.data) {
      navigate(`/live/${response.data.token}`);
    }
  }

  async function onEnd(liveSession) {
    await dispatch(
      liveStreamThunks.toggleLive({
        liveId: liveSession.id,
        notifyUsers: false,
        status: LiveSessionStatus.Finished,
        meetingId: liveSession.meetingId
      })
    ).unwrap();

    await DYTE_CLIENT.stopMeeting(liveSession.meetingId);
  }

  return (
    <div className="px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1 live-stream-container">
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          <div className="flex justify-between flex-wrap items-center">
            <h3 className="text-xl font-semibold">Live Stream</h3>
            {!isStudent && !!courses.length && (
              <button className="btn" onClick={() => setIsModalOpen(true)}>
                + Add Live Stream
              </button>
            )}
          </div>
          <LiveStreamFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          {isLoading && (
            <div className="flex justify-center h-full mb-2">
              <CourseLoader />
            </div>
          )}
          {!isLoading && !liveSessions?.length && (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-600 mb-2">No Result Found</p>
              <img src={emptyCoursesList} alt="empty courses" />
            </div>
          )}
          {!isLoading && !!liveSessions?.length && (
            <LiveStreamList
              liveStreams={liveSessions}
              onDelete={handleDelete}
              onStart={handleStart}
              onStudentJoin={handleStudentJoin}
              onEnd={onEnd}
              onEdit={(liveStream) => {
                setSelectedLiveStream(liveStream);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <SidebarPanel
        isVisible={isModalOpen}
        onHide={reset}
        isDismissible
        isFullScreen
        title={`Create Live Stream`}
        className={'live-stream-container'}
      >
        <LiveStreamEntry liveStream={selectedLiveStream} onSubmitted={reset} courses={courses} />
      </SidebarPanel>
    </div>
  );
}
