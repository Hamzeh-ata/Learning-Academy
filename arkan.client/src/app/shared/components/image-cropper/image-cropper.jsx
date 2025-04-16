import './image-cropper.css';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { centerCrop } from 'react-image-crop';
import { useRef, useState, useEffect } from 'react';
import { canvasPreview } from './helpers/canvas-preview';
import { useDebounce } from '@uidotdev/usehooks';
import { Button } from 'primereact/button';
import FormModal from '../form-modal/form-modal';

function centerAspectCrop(mediaWidth, mediaHeight) {
  return centerCrop(
    {
      unit: 'px',
      width: 258,
      height: 173
    },
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropper({
  isVisible,
  onHide,
  onImageChange,
  onCompleteCrop,
  imageSrc,
  isLocked = true,
  isRounded = false
}) {
  const [completedCrop, setCompletedCrop] = useState();
  const [crop, setCrop] = useState(undefined);

  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInput = useRef(null);

  const debouncedCropImage = useDebounce(completedCrop, 100);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const imageSource = reader.result;
        onImageChange && onImageChange(imageSource);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }

  function onImageCropSave() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      const file = new File([blob], 'canvas.png', { type: 'image/png' });
      onCompleteCrop && onCompleteCrop(file);
      onHideModal();
    });
  }

  const handleCropChange = (_crop) => {
    setCrop(_crop);
  };

  const handleCropComplete = (pixelCrop) => {
    setCompletedCrop(pixelCrop);
  };

  const onHideModal = () => {
    setCompletedCrop(undefined);
    onHide(false);
  };

  const handleImageChange = () => {
    fileInput.current?.click();
  };

  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [debouncedCropImage]);

  return (
    <FormModal title={'Crop Image'} showModal={isVisible} onClose={onHideModal} size="large" type="form">
      <div className="image-cropper">
        <div className="image-cropper__controls">
          <input ref={fileInput} type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        <div className="image-cropper__container">
          {!!imageSrc && (
            <div className="image-cropper__editor">
              <ReactCrop
                locked={isLocked}
                circularCrop={isRounded}
                crop={crop}
                onChange={handleCropChange}
                onComplete={handleCropComplete}
              >
                <img ref={imgRef} alt="Crop me" src={imageSrc} onLoad={onImageLoad} />
              </ReactCrop>
            </div>
          )}
          {!!completedCrop && (
            <div className="image-cropper__preview">
              <canvas ref={previewCanvasRef} />
              <p className="image-cropper__caption">Preview</p>
            </div>
          )}
        </div>
      </div>
      <div className="image-cropper__actions">
        <Button label={'Change Image'} link onClick={handleImageChange} />
        <Button label={'Save'} className="btn" onClick={onImageCropSave} disabled={!completedCrop} />
      </div>
    </FormModal>
  );
}
