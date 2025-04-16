import { useDispatch, useSelector } from 'react-redux';
import { useDropdownData } from '@hooks';
import { DROP_DOWN_TYPES } from '@constants';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { packagesThunks, selectPackageById } from '@/slices/admin-slices/catalog-management-slices/package.slice';
import { UploadImageField, MultiSelectField, NumberInput, TextInput } from '@shared/components/form-elements';

export const PackageEntry = ({ packageObj, onSubmitted }) => {
  const dispatch = useDispatch();
  const packageObject = useSelector((state) => selectPackageById(state, packageObj?.id));
  const { courses } = useDropdownData([DROP_DOWN_TYPES.Courses]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const priceValue = watch('price');
  const initializeForm = () => {
    const selectedCourses = packageObject?.courses?.map((course) => course.id) || [];

    reset({
      ...packageObject,
      price: packageObject?.price || 0,
      discountPrice: packageObject?.discountPrice || 0,
      coursesIds: selectedCourses
    });
  };

  useEffect(initializeForm, [packageObject, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data
    };
    if (packageObject) {
      processedData.id = packageObject.id;
      dispatch(packagesThunks.update(processedData));
    } else {
      dispatch(packagesThunks.create(processedData));
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

        <MultiSelectField
          name="coursesIds"
          label="Courses"
          error={errors.coursesIds}
          placeholder="Select Courses"
          rules={{ required: 'Courses is required' }}
          maxSelectedLabels={6}
          filter
          control={control}
          options={courses}
        />

        <UploadImageField
          name="image"
          label="Image"
          control={control}
          rules={{ required: 'Image is required' }}
          error={errors.image}
        />

        <button className="btn" type="submit">
          {packageObject ? 'Update' : 'Add'} Package
        </button>
      </form>
    </div>
  );
};
