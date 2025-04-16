import { companyInfoThunks } from '@/services/admin-services/admin-content-management.service';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, UploadImageField } from '@shared/components/form-elements';
import { selectCompanyInfo } from '@/slices/admin-slices/content-management-slices/company-info-section.slice';

export function CompanyInfoSection() {
  const dispatch = useDispatch();
  const companyInfo = useSelector(selectCompanyInfo);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (companyInfo?.id) {
      return;
    }
    dispatch(companyInfoThunks.get());
  }, []);

  const initializeForm = () => {
    reset({
      ...companyInfo
    });
  };

  useEffect(initializeForm, [companyInfo, reset]);

  const onSubmit = (data) => {
    if (companyInfo?.id) {
      dispatch(companyInfoThunks.update({ ...data, id: companyInfo?.id }));
    } else {
      dispatch(companyInfoThunks.create(data));
    }
    reset();
  };

  return (
    <div className="">
      <h4 className="text-lg text-gray-200 font-semi">{companyInfo?.id ? 'Update' : 'Create'} Company Section</h4>
      <form className="text-gray-400 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-nowrap gap-2 space-x-8 user-profile-entry">
          <UploadImageField
            clickableDropzone
            className="w-full"
            name="image"
            label="Footer Image"
            error={errors.image}
            showUploadedFiles={false}
            control={control}
          />
          <div className="w-full">
            <TextInput
              label="About Us"
              error={errors.aboutUs}
              isTextArea
              register={register('aboutUs', { required: 'About Us is required' })}
            />
            <TextInput label="Phone number" type="tel" register={register('phonenumber')} />
            <div className="flex gap-x-6  w-full instructor-info">
              <TextInput label="Facebook Url" register={register('facebookUrl')} />
              <TextInput label="Instagram Url" register={register('instagramUrl')} />
              <TextInput label="TikTok Url" register={register('tikTokUrl')} />
              <TextInput label="Snapchat Url" register={register('snapchatUrl')} />
            </div>
          </div>
        </div>

        <button
          className="btn text-end mt-2 flex items-center justify-center"
          type="submit"
          disabled={companyInfo?.loading}
        >
          {companyInfo?.loading && (
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
