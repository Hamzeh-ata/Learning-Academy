import { heroThunks } from '@/services/admin-services/admin-content-management.service';
import { selectHeroSection } from '@/slices/admin-slices/content-management-slices/hero-section.slice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, UploadImageField } from '@shared/components/form-elements';

export function HeroSection() {
  const dispatch = useDispatch();
  const heroSection = useSelector(selectHeroSection);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (heroSection?.id) {
      return;
    }
    dispatch(heroThunks.get());
  }, []);

  const initializeForm = () => {
    reset({
      ...heroSection
    });
  };

  useEffect(initializeForm, [heroSection, reset]);

  const onSubmit = (data) => {
    if (heroSection?.id) {
      dispatch(heroThunks.update({ ...data, id: heroSection?.id }));
    } else {
      dispatch(heroThunks.create(data));
    }
    reset();
  };

  return (
    <div>
      <h4 className="text-lg text-gray-200">{heroSection?.id ? 'Update' : 'Create'} Hero Section</h4>
      <form className="text-gray-400 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex space-x-8 w-full">
          <div className="flex gap-2 flex-wrap w-full">
            <TextInput
              label="Header"
              error={errors.headerText}
              register={register('headerText', { required: 'Header is required' })}
            />

            <TextInput
              label="Body"
              error={errors.description}
              isTextArea
              register={register('description', { required: 'Body is required' })}
            />
          </div>

          <div className="w-full">
            <UploadImageField
              clickableDropzone
              className="w-full"
              name="image"
              label="Hero Image"
              error={errors.image}
              showUploadedFiles={false}
              control={control}
            />
          </div>
        </div>

        <button
          className="btn text-end mt-2 flex items-center justify-center"
          type="submit"
          disabled={heroSection?.loading}
        >
          {heroSection?.loading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current w-6 h-6 animate-spin"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
          )}
          Submit
        </button>
      </form>
    </div>
  );
}
