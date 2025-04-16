import { FeatherIcon } from '@/app/shared/components';
import { DropZone } from '@/app/shared/components/dropzone';
import { RejectedFiles } from '@/app/shared/components/dropzone/components/reject-files';
import { UploadedFiles } from '@/app/shared/components/dropzone/components/uploaded-file';
import signalRService from '@/services/signalr-service';
import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';
import { t } from 'i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { useClickAway } from '@uidotdev/usehooks';

export function ChatForm({ onSubmit, roomId, parentMessage, setParentMessage }) {
  const [value, setValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const ref = useClickAway(() => setShowEmoji(false));
  const userProfile = useSelector(selectUserProfile);

  const acceptedTypes = ['.jpeg', '.png', '.bmp', '.gif'];
  const acceptedFileTypes = {
    'image/*': acceptedTypes
  };
  const acceptedFormat = t('dropzone.dynamicAcceptedFiles', {
    types: acceptedTypes.slice(0, acceptedTypes.length - 1).join(', '),
    lastType: acceptedTypes.slice(acceptedTypes.length - 1).join(', ')
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  function handleSubmit(e) {
    if (!value.length) {
      return;
    }

    e.preventDefault();

    signalRService.sendUserTypingNotification(roomId.toString(), {
      image: '',
      name: ''
    });

    onSubmit({
      content: value,
      file: uploadedFiles.length > 0 ? uploadedFiles[0] : null,
      parentMessageID: parentMessage?.id
    });

    setValue('');
    setUploadedFiles([]);
    setParentMessage(null);
    setRejectedFiles([]);
  }

  const removeUploadedFileHandler = (file) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setUploadedFiles(newFiles);
  };

  const removeRejectedFileHandler = (file) => {
    const newFiles = [...rejectedFiles];
    newFiles.splice(newFiles.flatMap((e) => e.file).indexOf(file), 1);
    setRejectedFiles(newFiles);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {(uploadedFiles.length > 0 || rejectedFiles.length > 0) && (
        <div className="drop-zone-container">
          <ul className="dropzone__uploaded-container">
            <UploadedFiles files={uploadedFiles} onRemove={removeUploadedFileHandler} />
            <RejectedFiles files={rejectedFiles} onRemove={removeRejectedFileHandler} />
          </ul>
        </div>
      )}

      {parentMessage && (
        <div className="w-full px-4 py-2 flex">
          <div className="flex flex-col gap-2 border-r-[6px] rounded-xl border-arkan rounded-r-lg px-4 bg-slate-300 py-4 flex-1">
            <span className="text-md font-semibold text-arkan">{parentMessage?.senderName}</span>
            <span className="text-md ">{parentMessage?.content}</span>
          </div>
          <FeatherIcon
            name="X"
            onClick={() => setParentMessage(null)}
            size={20}
            className="text-arkan-dark hover:text-red-500 cursor-pointer"
          />
        </div>
      )}

      <div className="flex justify-between w-full items-center pe-4 gap-2">
        <div className="relative py-4 px-2 text-md flex-1">
          <input
            type="text"
            value={value}
            onKeyDown={handleKeyPress}
            onChange={(e) => {
              signalRService.sendUserTypingNotification(roomId.toString(), {
                image: userProfile.image,
                name: userProfile.firstName
              });
              setValue(e.target.value);
            }}
            placeholder="Type Your Message..."
            className="rounded-2xl shadow-sm text-gray-600 focus:shadow-md px-4 py-3 bg-slate-200 focus:outline-none focus:bg-slate-300 w-full placeholder-gray-400"
          />

          <button
            className="absolute z-10 right-3 p-1 -translate-y-1/2 top-1/2 bg-arkan rounded-full text-white hover:bg-arkan-dark"
            onClick={handleSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="p-1"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
              <path d="M6.5 12h14.5" />
            </svg>
          </button>
        </div>
        <div>
          <div
            className="bg-white border-arkan border-2 text-center rounded-full text-arkan hover:text-white hover:bg-arkan cursor-pointer px-1 py-1 relative"
            ref={ref}
          >
            <FeatherIcon
              name="Smile"
              onClick={() => {
                setShowEmoji(true);
              }}
            />
            <div className="absolute bottom-0 right-0 z-20">
              <EmojiPicker
                onReactionClick={(e) => {
                  console.log(e);
                }}
                onEmojiClick={(e) => {
                  setValue((prev) => prev + e.emoji);
                  setShowEmoji(false);
                }}
                className="absolute bottom-0 left-0"
                reactionsDefaultOpen={false}
                open={showEmoji}
              />
            </div>
          </div>
        </div>
        <div className="bg-white border-arkan border-2 text-center rounded-full text-arkan hover:text-white hover:bg-arkan">
          <DropZone
            onChange={(e) => {
              setUploadedFiles(e.acceptedFiles);
              setRejectedFiles(e.rejectedFiles);
            }}
            acceptedFileTypes={acceptedFileTypes}
            acceptedFormatText={acceptedFormat}
            showClickableImage={false}
            label="Attachment"
            clickableDropzone
            showUploadedFiles={false}
          />
        </div>
      </div>
    </div>
  );
}
