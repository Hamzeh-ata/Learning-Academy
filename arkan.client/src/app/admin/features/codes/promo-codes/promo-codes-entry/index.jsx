import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { promoCodeThunks } from '@/slices/admin-slices/codes-slices/promo-code.slice';
import { PROMO_CODE_TYPE } from '@constants';
import { TextInput, NumberInput, DropdownField, SwitchButtonField } from '@shared/components/form-elements';
import { FeatherIcon } from '@shared/components';
import { generateRandomCode } from '@utils/helpers';

export const PromoCodesEntry = ({ promoCode, onSubmitted }) => {
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const initializeForm = () => {
    reset({
      ...promoCode,
      discount: promoCode?.discount || 0,
      thresholdValue: promoCode?.thresholdValue || 0
    });
  };

  useEffect(initializeForm, [promoCode, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      isActive: Boolean(data.isActive)
    };
    if (promoCode) {
      processedData.id = promoCode.id;
      dispatch(promoCodeThunks.update(processedData));
    } else {
      dispatch(promoCodeThunks.create(processedData));
    }

    onSubmitted();
    reset();
  };

  function getCodeTypes() {
    return Object.entries(PROMO_CODE_TYPE).map(([key, value]) => ({ id: value, name: key }));
  }

  function getCode(event) {
    event.preventDefault();
    setValue('code', generateRandomCode());
  }

  return (
    <div className="bg-gray-800">
      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Code"
          error={errors.code}
          inputClassName="!rounded-r-none"
          register={register('code', { required: 'Code is required' })}
          postFix={
            <button
              className="bg-arkan text-white px-4 py-3 rounded-r-md flex items-center gap-2 hover:bg-arkan-dark"
              onClick={getCode}
            >
              <FeatherIcon name="RefreshCcw" size={14} />
            </button>
          }
        />

        <NumberInput
          name="discount"
          label="Discount Value"
          control={control}
          rules={{ required: 'Discount is required' }}
          error={errors.discount}
        />

        <DropdownField
          name="type"
          error={errors.type}
          label="Limit By"
          placeholder="Select Limit By"
          rules={{ required: 'Limit By is required.' }}
          control={control}
          options={getCodeTypes()}
        />

        <NumberInput
          name="thresholdValue"
          label="Threshold Value"
          control={control}
          rules={{ required: 'Limit is required' }}
          error={errors.thresholdValue}
        />

        <SwitchButtonField name="isActive" label="Active" control={control} />

        <button className="btn" type="submit">
          {promoCode ? 'Update' : 'Add'} Promo Code
        </button>
      </form>
    </div>
  );
};
