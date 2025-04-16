import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextInput, SwitchButtonField } from '@shared/components/form-elements';
import { uploadVideo } from '@services/viemo-service';
import { lessonsThunks } from '@services/client-services/instructor-course-profile.service';
import { getImageFullPath } from '@utils/image-path';

export const InstructorLessonEntry = ({ lesson, onSubmitted }) => {
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [materialRemoved, setMaterialRemoved] = useState(false);

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

  useEffect(() => {
    if (!lesson?.material) {
      setMaterialRemoved(true);
    }
  }, [lesson?.material]);

  const initializeForm = () => {
    reset({
      ...lesson,
      material: getImageFullPath(lesson?.material, null) || ''
    });
  };

  useEffect(initializeForm, [lesson, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      id: lesson?.id,
      chapterId: lesson.chapterId,
      material: data.material?.[0] || lesson?.material,
      isFree: Boolean(data.isFree)
    };

    if (lesson.id) {
      dispatch(lessonsThunks.update(processedData));
    } else {
      dispatch(lessonsThunks.create(processedData));
    }

    reset();
    setMaterialRemoved(false);
    onSubmitted();
  };

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

  const handleRemoveMaterial = () => {
    setMaterialRemoved(true);
    setValue('material', null);
  };

  return (
    <div className="overflow-y-auto max-h-screen">
      <form className="text-gray-400 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 pb-5">
          <TextInput
            label="Name"
            error={errors.name}
            register={register('name', { required: 'Chapter Name is required' })}
          />

          <TextInput
            label="Description"
            isTextArea
            error={errors.description}
            register={register('description', { required: 'Description is required' })}
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
            <div className="flex items-center space-x-2 w-full flex-col">
              {(materialRemoved || !lesson?.material) && (
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
              )}
              {!materialRemoved && lesson?.material && (
                <div className="flex items-center gap-2 w-full justify-center mt-2 pe-2 text-base">
                  <span className="text-red-400 hover:text-red-500 cursor-pointer" onClick={handleRemoveMaterial}>
                    Remove
                  </span>
                  <a
                    href={getImageFullPath(lesson.material, null)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View current
                  </a>
                </div>
              )}
            </div>
          </div>

          <TextInput
            label="Video URL"
            error={errors.videoUrl}
            register={register('videoUrl', { required: 'Video URL is required' })}
          />

          <SwitchButtonField name="isFree" label="Free Lesson?" control={control} />
        </div>
        <button className="btn text-end mt-2 md:mt-0" type="submit" disabled={isUploading || !videoUrl}>
          {lesson?.id ? 'Update Lesson' : 'Add Lesson'}
        </button>
      </form>
    </div>
  );
};
