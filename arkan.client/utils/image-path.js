import defaultImage from '@assets/default.png';

export const getImageFullPath = (image, replaceImage = defaultImage) => {
  const imagePath = image ? `${window.location.origin || import.meta.env.VITE_API_TARGET}${image}` : replaceImage;
  return imagePath;
};
