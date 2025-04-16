import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllCategories } from '@/slices/admin-slices/catalog-management-slices/category.slice';
import { updateCourse, createCourse } from '@/services/admin-services/catalog-management-services/course.service';
import { COURSE_STATUSES } from '@constants';
import {
  selectAllInstructors,
  selectInstructorsPaginationData,
  selectInstructorsLoading
} from '@/slices/admin-slices/user-slices';
import {
  selectAllUniversities,
  selectPaginationData as universityPaginationSelector,
  selectLoading as universityLoader
} from '@/slices/admin-slices/catalog-management-slices/university.slice';
import {
  TextInput,
  NumberInput,
  DropdownField,
  MultiSelectField,
  UploadImageField
} from '@shared/components/form-elements';
import { fetchInstructors } from '@/services/admin-services/user-services';
import { fetchUniversities } from '@/services/admin-services/catalog-management-services/universities.service';
import { uploadVideo } from '@services/viemo-service';

export const CoursesEntry = ({ course, onSubmitted }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const instructors = useSelector(selectAllInstructors);
  const universities = useSelector(selectAllUniversities);
  const paginationData = useSelector(selectInstructorsPaginationData);
  const universityPaginationData = useSelector(universityPaginationSelector);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const loading = useSelector(selectInstructorsLoading);
  const universityLoading = useSelector(universityLoader);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const courseTitle = watch('name');
  const priceValue = watch('price');
  const videoUrl = watch('overViewUrl');

  const initializeForm = () => {
    const selectedCategories =
      course?.categories?.map((category) => categories.find((c) => c.id === category.id)) || [];

    const selectedUniversitiesIds = course?.universities?.map((university) => university.id) || [];

    reset({
      ...course,
      price: course?.price || 0,
      discountPrice: course?.discountPrice || 0,
      status: course?.status
        ? COURSE_STATUSES.find((e) => e.name.toLowerCase() === course.status.toLowerCase())?.id
        : COURSE_STATUSES[0].id,
      categoryIds: selectedCategories.map((c) => c.id),
      universitiesIds: selectedUniversitiesIds
    });
  };

  useEffect(() => {
    dispatch(fetchInstructors({ currentPage: paginationData.currentPage, pageSize: paginationData.pageSize }));
  }, [dispatch, paginationData.currentPage, paginationData.pageSize]);

  useEffect(() => {
    dispatch(
      fetchUniversities({
        currentPage: universityPaginationData.currentPage,
        pageSize: universityPaginationData.pageSize
      })
    );
  }, [dispatch, universityPaginationData.currentPage, universityPaginationData.pageSize]);

  useEffect(initializeForm, [course, categories, reset]);

  const onLazyLoad = (event) => {
    const currentlyLoadedItems = event.first + 10;
    if (paginationData.totalPages !== 1) {
      dispatch(fetchInstructors({ currentPage: 1, pageSize: currentlyLoadedItems }));
    }
  };

  const onUniversityLazyLoad = (event) => {
    const currentlyLoadedItems = event.first + 10;
    if (universityPaginationData.totalPages !== 1) {
      dispatch(fetchUniversities({ currentPage: 1, pageSize: currentlyLoadedItems }));
    }
  };

  const handleFileChange = async (event) => {
    setIsUploading(true);
    setValue('overViewUrl', '', { shouldValidate: true });

    const uploadVideoParam = {
      videoFile: event.target.files[0],
      fileTitle: courseTitle,
      onError: (err) => {
        console.log(err);
        setValue('overViewUrl', 'failed to upload', { shouldValidate: true });
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
      setValue('overViewUrl', uploadResponse, { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    const processedData = {
      ...data
    };

    if (course) {
      processedData.id = course.id;
      dispatch(updateCourse(processedData));
    } else {
      dispatch(createCourse(processedData));
    }

    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800 course-entry">
      <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-gray-400 flex flex-wrap gap-6">
          <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />

          <NumberInput
            name="price"
            label="Price"
            control={control}
            rules={{ required: 'Price is required' }}
            error={errors.price}
          />

          <NumberInput
            name="discountPrice"
            label="Discount Price"
            control={control}
            rules={{
              validate: (discountPrice) =>
                parseFloat(discountPrice) < parseFloat(priceValue) || 'Discount Price must be less than Price'
            }}
            error={errors.discountPrice}
          />

          <TextInput
            label="Description"
            error={errors.description}
            register={register('description', { required: 'Description is required' })}
            isTextArea
            inputClassName="w-full"
            containerClassName="field custom-field"
          />

          <DropdownField
            name="status"
            error={errors.status}
            label="Status"
            placeholder="Select a Status"
            rules={{ required: 'Status is required.' }}
            control={control}
            options={COURSE_STATUSES}
          />

          <DropdownField
            name="instructorId"
            error={errors.instructorId}
            label="Instructor"
            placeholder="Select an Instructor"
            rules={{ required: 'Instructor is required.' }}
            control={control}
            filter={false}
            options={instructors.map((e) => ({ name: e.firstName + ' ' + e.lastName, id: e.id }))}
            virtualScrollerOptions={{
              lazy: true,
              autoSize: true,
              onLazyLoad: onLazyLoad,
              itemSize: 38,
              showLoader: true,
              loading: loading,
              appendOnly: true
            }}
          />

          {!!categories.length && (
            <MultiSelectField
              name="categoryIds"
              label="Categories"
              error={errors.categoryIds}
              placeholder="Select Categories"
              rules={{ required: 'Categories is required' }}
              maxSelectedLabels={4}
              control={control}
              options={categories}
            />
          )}

          {!!universities.length && (
            <MultiSelectField
              name="universitiesIds"
              label="Universities"
              error={errors.universitiesIds}
              placeholder="Select Universities"
              rules={{ required: 'University is required' }}
              maxSelectedLabels={3}
              filter={false}
              control={control}
              options={universities}
              virtualScrollerOptions={{
                lazy: true,
                autoSize: true,
                onLazyLoad: onUniversityLazyLoad,
                itemSize: 38,
                showLoader: true,
                loading: universityLoading,
                appendOnly: true
              }}
            />
          )}

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
                          file:mr-4 file:py-2 file:px-4
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

          <TextInput
            label="Video Overview URL"
            error={errors.overViewUrl}
            register={register('overViewUrl', { required: 'Video URL is required' })}
          />
          <div className="flex w-full gap-4 flex-wrap">
            <UploadImageField
              name="coverImage"
              label="Cover Image"
              rules={{ required: 'Cover image is required' }}
              error={errors.coverImage}
              control={control}
            />

            <UploadImageField
              name="image"
              label="Course Image"
              rules={{ required: 'image is required' }}
              error={errors.image}
              control={control}
            />
          </div>
        </div>

        <button className="btn text-end" type="submit" disabled={isUploading || !videoUrl}>
          {course ? 'Update Course' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};
