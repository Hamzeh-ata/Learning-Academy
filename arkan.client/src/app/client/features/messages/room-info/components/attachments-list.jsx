import { UploadedFiles } from '@/app/shared/components/dropzone/components/uploaded-file';
import { getImageFullPath } from '@utils/image-path';
import { useTabs } from '../../hooks/useTabs';

export function AttachmentsList({ attachments }) {
  const { activeIndex } = useTabs();

  if (!attachments.length || activeIndex) {
    return null;
  }

  return (
    <div className="flex flex-col shadow-md rounded-2xl px-3 mt-2 py-4 gap-2">
      <h3 className="text-base font-semibold text-gray-800">Attachments</h3>
      <div className="flex flex-col justify-start items-start gap-2 max-h-[300px] overflow-y-auto">
        <div className="drop-zone-container">
          <ul className="!mt-0 dropzone__uploaded-container pe-2 ">
            <UploadedFiles
              classNames="!w-full"
              actionClassNames="hidden"
              fileNameClassNames="!max-w-[120px]"
              files={getUploadFiles(attachments)}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

const urlToFile = (url, filename, mimeType) => ({
  path: filename,
  fileName: filename,
  preview: getImageFullPath(url, null),
  type: mimeType,
  size: 10000
});

const getUploadFiles = (attachments) => attachments.map((e, i) => urlToFile(e, `Image ${i + 1}`, 'image/jpeg'));
