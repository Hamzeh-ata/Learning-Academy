import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { arkanCodesThunks } from '@/slices/admin-slices/codes-slices/arkan-code.slice';
import { useDropdownData } from '@hooks';
import { DROP_DOWN_TYPES, ARKAN_CODE_TYPE } from '@constants';
import { TextInput, NumberInput, DropdownField, SwitchButtonField } from '@shared/components/form-elements';
import { FeatherIcon } from '@shared/components';
import { generateRandomCode } from '@utils/helpers';

export const ArkanCodesEntry = ({ arkanCode, onSubmitted }) => {
  const dispatch = useDispatch();

  const { courses, packages, instructors } = useDropdownData([
    DROP_DOWN_TYPES.Courses,
    DROP_DOWN_TYPES.Instructors,
    DROP_DOWN_TYPES.Packages
  ]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const codeType = watch('type');

  const initializeForm = () => {
    let selectedArkanCodeItem = null;
    if (arkanCode && arkanCode.itemId) {
      selectedArkanCodeItem = codeTypeItems[arkanCode.type]?.find((item) => item.id === arkanCode.itemId);
    }

    reset({
      ...arkanCode,
      discount: arkanCode?.discount || 0,
      itemId: selectedArkanCodeItem?.id || null,
      numberTimesUsedAllowed: arkanCode?.numberTimesUsedAllowed || 0
    });
  };

  useEffect(initializeForm, [arkanCode, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      isActive: Boolean(data.isActive)
    };
    if (arkanCode) {
      processedData.id = arkanCode.id;
      dispatch(arkanCodesThunks.update(processedData));
    } else {
      dispatch(arkanCodesThunks.create(processedData));
    }

    onSubmitted();
    reset();
  };

  function getCodeTypes() {
    return Object.entries(ARKAN_CODE_TYPE).map(([key, value]) => ({ id: value, name: key }));
  }

  const codeTypeItems = {
    [ARKAN_CODE_TYPE.Course]: courses,
    [ARKAN_CODE_TYPE.Instructor]: instructors,
    [ARKAN_CODE_TYPE.Package]: packages
  };

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

        <NumberInput
          name="numberTimesUsedAllowed"
          label="Uses Limit"
          control={control}
          rules={{ required: 'Limit is required' }}
          error={errors.numberTimesUsedAllowed}
        />

        <DropdownField
          name="type"
          error={errors.type}
          label="Code Type"
          placeholder="Select a Code Type"
          rules={{ required: 'Code type is required.' }}
          control={control}
          options={getCodeTypes()}
          onChange={() => setValue('itemId', null)}
        />

        <DropdownField
          name="itemId"
          error={errors.itemId}
          label="Code Type Item"
          placeholder="Select a Code Type Item"
          rules={{ required: 'Code type item is required.' }}
          control={control}
          options={codeTypeItems[codeType]}
        />

        <SwitchButtonField name="isActive" label="Active" control={control} />

        <button className="btn" type="submit">
          {arkanCode ? 'Update' : 'Add'} Arkan Code
        </button>
      </form>
    </div>
  );
};
