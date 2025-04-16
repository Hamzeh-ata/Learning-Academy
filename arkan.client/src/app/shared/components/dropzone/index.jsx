import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FeatherIcon } from '../feather-icon';
import parse from 'html-react-parser';
import { Button } from 'primereact/button';
import { UploadedFiles } from './components/uploaded-file';
import { RejectedFiles } from './components/reject-files';
import './dropzone.css';
import classNames from 'classnames';
import defaultImage from '@assets/default.png';
import { getImageFullPath } from '@utils/image-path';

const defaultAcceptedFileTypes = {
  //images
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
  // pdf
  'application/pdf': [],
  // doc
  'application/msword': [],
  // docx
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  // txt
  'text/plain': [],
  // rtf
  'application/rtf': []
};
const urlToFile = (url, filename, mimeType) => ({
  path: filename, // Use the filename or any identifier
  preview: getImageFullPath(url, null),
  type: mimeType,
  size: 10000
});

export const DropZone = ({
  acceptedFileTypes,
  maxSize = 5000000,
  onChange,
  showUploadedFiles,
  acceptedFormatText,
  multiple = true,
  clickableDropzone,
  hint,
  isAccumulated = false,
  hideAfterSelect = false,
  showClickableImage = true,
  uploadedAttachments,
  rejectedAttachments
}) => {
  // eslint-disable-next-line no-unused-vars
  const [_files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  useEffect(() => {
    if (uploadedAttachments) {
      const initialFiles = uploadedAttachments.map((file) => {
        if (typeof file === 'string') {
          // Assuming image URLs are passed as strings. Adjust mimeType as necessary.
          return urlToFile(file, 'image.jpg', 'image/jpeg');
        }
        return file;
      });
      setUploadedFiles(initialFiles);
    }
    if (rejectedAttachments) {
      setRejectedFiles(rejectedAttachments);
    }
  }, [uploadedAttachments, rejectedAttachments]);

  const {
    getRootProps,
    getInputProps,
    open: openDropzone
  } = useDropzone({
    accept: acceptedFileTypes ?? defaultAcceptedFileTypes,
    maxSize: maxSize,
    multiple: true,
    onDrop: (newAcceptedFiles, newRejectedFiles) => {
      // override default behavior of dropzone for multiple files
      if (!multiple) {
        newAcceptedFiles = newAcceptedFiles?.slice(0, 1);
        newRejectedFiles = newAcceptedFiles?.length ? [] : newRejectedFiles?.slice(0, 1);
      }
      setFiles(
        newAcceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );

      let acceptedAttachments = newAcceptedFiles;
      let rejectedAttachments = newRejectedFiles;

      // accumulate already uploaded files with the newly uploaded files
      if (isAccumulated) {
        acceptedAttachments = [...uploadedFiles, ...newAcceptedFiles];
        rejectedAttachments = [...rejectedFiles, ...newRejectedFiles];
      }
      setUploadedFiles(acceptedAttachments);
      setRejectedFiles(rejectedAttachments);
      onChange &&
        onChange({
          acceptedFiles: acceptedAttachments,
          rejectedFiles: rejectedAttachments
        });
    }
  });

  const removeUploadedFileHandler = (file) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setUploadedFiles(newFiles);
    onChange &&
      onChange({
        acceptedFiles: newFiles,
        rejectedFiles: rejectedFiles
      });
  };
  const removeRejectedFileHandler = (file) => {
    const newFiles = [...rejectedFiles];
    newFiles.splice(newFiles.flatMap((e) => e.file).indexOf(file), 1);
    setRejectedFiles(newFiles);
    onChange &&
      onChange({
        acceptedFiles: uploadedFiles,
        rejectedFiles: newFiles
      });
  };

  return (
    <section className={classNames('drop-zone-container', { 'drop-zone-clickable-container': clickableDropzone })}>
      {(!hideAfterSelect || (uploadedFiles.length == 0 && rejectedFiles.length == 0)) && (
        <div className={`dropzone__area${clickableDropzone ? '--hidden' : ''}`}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <FeatherIcon name="UploadCloud" className="dropzone__upload-icon" />
            <div className="dropzone__title">
              {t('dropzone.dropFiles')}
              <Button onClick={(e) => e.preventDefault()}>{t('dropzone.clickUpload')}</Button>
            </div>
            <div className="dropzone__body">
              {hint && <p className="dropzone__hint">{hint}</p>}
              <p className="dropzone__formats">{acceptedFormatText || parse(t('dropzone.acceptedFiles'))}</p>
            </div>
          </div>
        </div>
      )}

      {clickableDropzone && (
        <Button
          className={classNames('rounded-full relative', {
            'hover:brightness-75': showClickableImage,
            'px-1 pt-1': !showClickableImage
          })}
          onClick={(e) => {
            e.preventDefault();
            openDropzone();
          }}
        >
          {showClickableImage && (
            <>
              <img className="w-40 h-40 brightness-50" src={uploadedFiles[0]?.preview || defaultImage} />
              <span className="absolute left-[20%] lg:left-4 text-white text-center flex flex-col items-center gap-2 ">
                <FeatherIcon name="Paperclip" className="text-center" />
                {t('dropzone.clickUpload')}
              </span>
            </>
          )}
          {!showClickableImage && <FeatherIcon name="UploadCloud" size={22} className="mb-1" />}
        </Button>
      )}

      {showUploadedFiles && (
        <aside>
          <ul className="dropzone__uploaded-container">
            <UploadedFiles files={uploadedFiles} onRemove={removeUploadedFileHandler} />
            <RejectedFiles files={rejectedFiles} onRemove={removeRejectedFileHandler} />
          </ul>
        </aside>
      )}
    </section>
  );
};
