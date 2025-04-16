import { t } from 'i18next';
import { useState } from 'react';
import { DropZone } from '@/app/shared/components/dropzone';
import { RejectedFiles } from '@/app/shared/components/dropzone/components/reject-files';
import { UploadedFiles } from '@/app/shared/components/dropzone/components/uploaded-file';

export function ChatBotForm({ onSubmit }) {
  const [value, setValue] = useState('');

  const acceptedTypes = ['.jpeg', '.png', '.bmp', '.gif'];
  const acceptedFileTypes = {
    'image/*': acceptedTypes
  };
  const acceptedFormat = t('dropzone.dynamicAcceptedFiles', {
    types: acceptedTypes.slice(0, acceptedTypes.length - 1).join(', '),
    lastType: acceptedTypes.slice(acceptedTypes.length - 1).join(', ')
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);

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
    onSubmit({
      content: value,
      file: uploadedFiles.length > 0 ? uploadedFiles[0] : null
    });
    setValue('');
    setUploadedFiles([]);
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
    <div className="flex flex-col w-full">
      {(uploadedFiles.length > 0 || rejectedFiles.length > 0) && (
        <div className="drop-zone-container !mt-0">
          <ul className="dropzone__uploaded-container !my-1.5">
            <UploadedFiles files={uploadedFiles} onRemove={removeUploadedFileHandler} />
            <RejectedFiles files={rejectedFiles} onRemove={removeRejectedFileHandler} />
          </ul>
        </div>
      )}
      <div className="flex w-full items-center">
        <div className="relative py-4 px-2 text-md flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type Your Message..."
            className="rounded-2xl shadow-sm text-gray-600 focus:shadow-md px-4 py-3 pe-14 bg-slate-200 focus:outline-none focus:bg-slate-300 w-full placeholder-gray-400"
          />

          <button
            className="absolute z-10 right-3 p-1 -translate-y-1/2 top-1/2 bg-blue-600 rounded-full text-white hover:bg-blue-700"
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
        <div className="bg-white text-center rounded-full text-blue-600/70 hover:text-blue-600 hover:border-blue-700 border border-white me-2">
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
