import axios from 'axios';

const accessToken = import.meta.env.VITE_VIEMO_ACCESS_TOKEN;

async function createSession(videoFile) {
  try {
    const createSessionResponse = await axios.post(
      'https://api.vimeo.com/me/videos',
      {
        upload: {
          approach: 'tus',
          size: videoFile.size
        }
      },
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vimeo.*+json;version=3.4'
        }
      }
    );

    return createSessionResponse?.data;
  } catch (error) {
    console.error('Error creating upload session:', error);
    throw error;
  }
}

export async function uploadVideo({ videoFile, onProgress, onError, fileTitle = '' }) {
  try {
    const sessionData = await createSession(videoFile);
    const uploadLink = sessionData.upload.upload_link;
    const fileName = fileTitle || videoFile.name;

    // Fetching the initial offset is required to resume uploads
    const res = await axios.head(uploadLink, {
      headers: {
        'Tus-Resumable': '1.0.0',
        Authorization: `bearer ${accessToken}`
      }
    });

    const offset = res.headers['upload-offset'];

    await axios.patch(uploadLink, videoFile, {
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': offset,
        'Content-Type': 'application/offset+octet-stream',
        Authorization: `bearer ${accessToken}`
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    });

    // Vimeo API requires an additional GET request to obtain video details after upload
    const updateMetadataResponse = await axios.patch(
      `https://api.vimeo.com${sessionData.uri}`,
      {
        name: fileName // Use the file name as video title
        // Add other metadata modifications here
      },
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vimeo.*+json;version=3.4'
        }
      }
    );
    const videoUrl = updateMetadataResponse.data.link;
    console.log('Upload successful:', videoUrl);
    return videoUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    if (onError) {
      onError(error);
    }
    throw error;
  }
}
