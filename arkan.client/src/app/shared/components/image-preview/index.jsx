import { Image } from 'primereact/image';
import { getImageFullPath } from '@utils/image-path';

export const ImagePreview = ({ src, className, alt = 'Image', preview = true, containerClassName = '' }) => (
  <Image
    src={getImageFullPath(src)}
    imageClassName={className}
    className={containerClassName}
    alt={alt}
    preview={preview}
  />
);
