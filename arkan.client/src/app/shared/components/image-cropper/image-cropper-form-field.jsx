import { useEffect, useState } from 'react';
import { ImageCropper } from '.';

export function ImageCropperFormField() {
  const [isImageCropVisible, setIsImageCropVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (file !== null) {
      setIsImageCropVisible(true);
    }
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImageSrc(null);
    }
  };

  const handleCropComplete = (value) => {
    const blobUrl = URL.createObjectURL(value);
    setImageSrc(blobUrl);
  };

  const handleImageChange = (value) => {
    setImageSrc(value);
  };

  return (
    <div>
      <div className="tw-relative tw-group">
        <label htmlFor="file-input" className="tw-block tw-w-full tw-h-full tw-cursor-pointer">
          {imageSrc ? (
            <>
              <span className="tw-hidden group-hover:tw-block tw-absolute tw-top-1/2 tw-inset-x-0 tw-text-center tw-text-white tw-text-lg tw-z-10">
                {'Edit Image'}
              </span>
              <img
                src={imageSrc}
                alt="Selected file"
                className="tw-w-full tw-h-full tw-object-cover group-hover:tw-brightness-50"
              />

              <ImageCropper
                key={imageSrc}
                imageSrc={imageSrc}
                isVisible={isImageCropVisible}
                onHide={setIsImageCropVisible.bind({}, false)}
                onCompleteCrop={handleCropComplete}
                onImageChange={handleImageChange}
              />
            </>
          ) : (
            <div className="tw-w-[250px] tw-h-[250px] tw-bg-blue-grey-400 tw-flex tw-items-center tw-justify-center">
              Upload
            </div>
          )}
        </label>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileChange}
          className="tw-absolute tw-inset-0 tw-opacity-0 tw-cursor-pointer"
        />
      </div>
    </div>
  );
}
