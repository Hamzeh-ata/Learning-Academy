import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextInput, SwitchButtonField } from '@shared/components/form-elements';
import { uploadVideo } from '@services/viemo-service';
import { updateLesson, createLesson } from '@/services/admin-services/course-management-services/lessons.service';

export const LessonEntry = ({ lesson, onSubmitted, chapterId }) => {
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ mode: 'all' });

  const lessonTitle = watch('name');
  const videoUrl = watch('videoUrl');

  const initializeForm = () => {
    reset({
      ...lesson
    });
  };

  useEffect(initializeForm, [lesson, reset]);

  const handleFileChange = async (event) => {
    setIsUploading(true);
    setValue('videoUrl', '', { shouldValidate: true });

    const uploadVideoParam = {
      videoFile: event.target.files[0],
      fileTitle: lessonTitle,
      onError: (err) => {
        console.log(err);
        setValue('videoUrl', 'failed to upload', { shouldValidate: true });
        setIsUploading(false);
      },
      onProgress: (e) => {
        setUploadProgress(e);
        if (e === 100) {
          setIsUploading(false);
        }
      }
    };

    const uploadResponse = await uploadVideo(uploadVideoParam);
    if (uploadResponse) {
      setValue('videoUrl', uploadResponse, { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    data.chapterId = chapterId;
    if (data.material) {
      data.material = data.material[0];
    }
    if (lesson) {
      data.id = lesson.id;
      dispatch(updateLesson(data));
    } else {
      dispatch(createLesson(data));
    }
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />
        <TextInput
          label="Description"
          error={errors.description}
          register={register('description', { required: 'Description is required' })}
          isTextArea
        />
        <div className="field">
          <label>Upload Video</label>
          <div className="flex items-center space-x-2 cursor-pointer w-full flex-col">
            <label className="block cursor-pointer w-full">
              <span className="sr-only cursor-pointer">Choose video file</span>
              <input
                type="file"
                disabled={isUploading}
                accept="video/*"
                className="block cursor-pointer w-full text-sm text-gray-500
                          file:mr-4 file:cursor-pointer file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100
                        "
                onChange={handleFileChange}
              />
            </label>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
        </div>

        <div className="field">
          <label>Upload Material</label>
          <div className="flex items-center space-x-2 cursor-pointer w-full flex-col">
            <label className="block cursor-pointer w-full">
              <span className="sr-only cursor-pointer">Choose material file</span>
              <input
                name="material"
                type="file"
                {...register('material')}
                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                text/plain, application/pdf"
                className="block cursor-pointer file:cursor-pointer w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100
                      "
              />
            </label>
          </div>
        </div>

        <TextInput
          label="Video URL"
          error={errors.videoUrl}
          register={register('videoUrl', { required: 'Video URL is required' })}
        />

        <SwitchButtonField name="isFree" label="Free" control={control} />
        <button className="btn" type="submit" disabled={isUploading || !videoUrl}>
          {lesson ? 'Update Lesson' : 'Add Lesson'}
        </button>
      </form>
    </div>
  );
};
