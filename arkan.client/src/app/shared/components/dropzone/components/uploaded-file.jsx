import { FeatherIcon } from '@shared/components/feather-icon';
import { formatBytes } from '@utils/format-bytes';
import classNames from 'classnames';
import { Tooltip } from 'primereact/tooltip';

export const UploadedFiles = (props) => {
  const removeFile = (file) => () => {
    props.onRemove(file);
  };

  return (
    <>
      {props.files.map((file, i) => (
        <li className={classNames('dropzone__uploaded', props.classNames)} key={file.path || i}>
          <div className="dropzone__file-info">
            <span className="dropzone__icon">{file.preview ? <img src={file.preview} alt="test" /> : FileText()}</span>
            <div className="dropzone__description">
              <span className="dropzone__file-name">
                <Tooltip tooltipContent={file.path || file.name} title={file.path || file.name} />
              </span>
              {file.fileName && (
                <span className={classNames('dropzone__file-name', props.fileNameClassNames)}>{file.fileName}</span>
              )}
              {!!file.size && <span className="dropzone__file-size">{formatBytes(file.size)}</span>}
            </div>
          </div>
          <div className="dropzone__actions">
            <a className="dropzone__actions-download" href={file.preview} target="_blank" rel="noreferrer">
              <FeatherIcon name="Download" size={16} />
            </a>
            <button
              className={classNames('dropzone__actions-delete', props.actionClassNames)}
              onClick={removeFile(file)}
            >
              <FeatherIcon name="Trash2" size={16} />
            </button>
          </div>
        </li>
      ))}
    </>
  );
};

const FileText = () => (
  <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18.5" cy="19" r="18.5" fill="#62769D" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8787 8.37868C11.4413 7.81607 12.2044 7.5 13 7.5H21C21.2652 7.5 21.5196 7.60536 21.7071 7.79289L27.7071 13.7929C27.8946 13.9804 28 14.2348 28 14.5V26.5C28 27.2957 27.6839 28.0587 27.1213 28.6213C26.5587 29.1839 25.7957 29.5 25 29.5H13C12.2043 29.5 11.4413 29.1839 10.8787 28.6213C10.3161 28.0587 10 27.2957 10 26.5V10.5C10 9.70435 10.3161 8.94129 10.8787 8.37868ZM13 9.5C12.7348 9.5 12.4804 9.60536 12.2929 9.79289C12.1054 9.98043 12 10.2348 12 10.5V26.5C12 26.7652 12.1054 27.0196 12.2929 27.2071C12.4804 27.3946 12.7348 27.5 13 27.5H25C25.2652 27.5 25.5196 27.3946 25.7071 27.2071C25.8946 27.0196 26 26.7652 26 26.5V14.9142L20.5858 9.5H13Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 7.5C21.5523 7.5 22 7.94772 22 8.5V13.5H27C27.5523 13.5 28 13.9477 28 14.5C28 15.0523 27.5523 15.5 27 15.5H21C20.4477 15.5 20 15.0523 20 14.5V8.5C20 7.94772 20.4477 7.5 21 7.5Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 19.5C14 18.9477 14.4477 18.5 15 18.5H23C23.5523 18.5 24 18.9477 24 19.5C24 20.0523 23.5523 20.5 23 20.5H15C14.4477 20.5 14 20.0523 14 19.5Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 23.5C14 22.9477 14.4477 22.5 15 22.5H23C23.5523 22.5 24 22.9477 24 23.5C24 24.0523 23.5523 24.5 23 24.5H15C14.4477 24.5 14 24.0523 14 23.5Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 15.5C14 14.9477 14.4477 14.5 15 14.5H17C17.5523 14.5 18 14.9477 18 15.5C18 16.0523 17.5523 16.5 17 16.5H15C14.4477 16.5 14 16.0523 14 15.5Z"
      fill="white"
    />
  </svg>
);
