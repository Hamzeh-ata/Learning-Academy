import { t } from 'i18next';
import { Tooltip } from 'primereact/tooltip';
import { FeatherIcon } from '@shared/components/feather-icon';

export const RejectedFiles = (props) => {
  const removeFile = (file) => () => {
    props.onRemove(file);
  };

  const FileErrors = {
    'file-too-large': 'Size',
    'file-invalid-type': 'Type'
  };

  const getErrorType = (code) => FileErrors[code];
  return (
    <>
      {props.files.map(({ file, errors }) => (
        <li className="dropzone__uploaded dropzone__uploaded-rejected" key={file.path}>
          <div className="dropzone__file-info">
            <span className="dropzone__icon">{errorFile()}</span>
            <div className="dropzone__description">
              <span className="dropzone__file-name dropzone__file-name-error">
                <Tooltip tooltipContent={file.path} title={file.path} />
              </span>
              <ul>
                {errors.map((error) => (
                  <li className="dropzone__file-error" key={error.code}>
                    {getErrorType(error.code) ? t(`dropzone.file${getErrorType(error.code)}Error`) : error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="dropzone__actions">
            <button className="dropzone__actions-delete" onClick={removeFile(file)}>
              <FeatherIcon name="Trash2" size={16} />
            </button>
          </div>
        </li>
      ))}
    </>
  );
};

const errorFile = () => (
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18.5" cy="18.5" r="18.5" fill="#E52D42" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8787 7.87868C11.4413 7.31607 12.2044 7 13 7H21C21.2652 7 21.5196 7.10536 21.7071 7.29289L27.7071 13.2929C27.8946 13.4804 28 13.7348 28 14V26C28 26.7957 27.6839 27.5587 27.1213 28.1213C26.5587 28.6839 25.7957 29 25 29H13C12.2043 29 11.4413 28.6839 10.8787 28.1213C10.3161 27.5587 10 26.7957 10 26V10C10 9.20435 10.3161 8.44129 10.8787 7.87868ZM13 9C12.7348 9 12.4804 9.10536 12.2929 9.29289C12.1054 9.48043 12 9.73478 12 10V26C12 26.2652 12.1054 26.5196 12.2929 26.7071C12.4804 26.8946 12.7348 27 13 27H25C25.2652 27 25.5196 26.8946 25.7071 26.7071C25.8946 26.5196 26 26.2652 26 26V14.4142L20.5858 9H13Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 7C21.5523 7 22 7.44772 22 8V13H27C27.5523 13 28 13.4477 28 14C28 14.5523 27.5523 15 27 15H21C20.4477 15 20 14.5523 20 14V8C20 7.44772 20.4477 7 21 7Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 19C14 18.4477 14.4477 18 15 18H23C23.5523 18 24 18.4477 24 19C24 19.5523 23.5523 20 23 20H15C14.4477 20 14 19.5523 14 19Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 23C14 22.4477 14.4477 22 15 22H23C23.5523 22 24 22.4477 24 23C24 23.5523 23.5523 24 23 24H15C14.4477 24 14 23.5523 14 23Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 15C14 14.4477 14.4477 14 15 14H17C17.5523 14 18 14.4477 18 15C18 15.5523 17.5523 16 17 16H15C14.4477 16 14 15.5523 14 15Z"
      fill="white"
    />
  </svg>
);
