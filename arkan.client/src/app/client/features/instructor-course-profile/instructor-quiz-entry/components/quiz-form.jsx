import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { quizzesThunks } from '@services/client-services/instructor-course-profile.service';
import { TextInput, NumberInput, SwitchButtonField } from '@shared/components/form-elements';
import { Button } from 'primereact/button';
import { EditIcon } from '@shared/components/icons/edit-icon';

export const QuizForm = ({ lessonId, onSubmitted, quiz }) => {
  const [isEditing, setIsEditing] = useState(!quiz?.id);

  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const initializeForm = () => {
    reset({
      ...quiz,
      title: quiz?.title || quiz?.name || '',
      timeLimit: quiz?.timeLimit || 0,
      totalMarks: quiz?.totalMarks || 0,
      isRequired: Boolean(quiz?.isRequired),
      isRandomized: Boolean(quiz?.isRandomized)
    });
  };

  useEffect(initializeForm, [quiz, reset]);

  const onSubmit = async (data) => {
    const processedData = {
      ...data,
      id: quiz?.id,
      quizId: quiz?.id,
      lessonId,
      isRequired: Boolean(data.isRequired),
      isRandomized: Boolean(data.isRandomized)
    };
    let quizResult = processedData;
    if (quiz?.id) {
      dispatch(quizzesThunks.update(processedData));
      quizResult = await dispatch(quizzesThunks.update(processedData)).unwrap();
    } else {
      quizResult = await dispatch(quizzesThunks.create(processedData)).unwrap();
    }

    onSubmitted(quizResult);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isEditing ? (
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="form-title">{quiz?.id ? 'Update' : 'Add'} Quiz General Info</h3>
          <div className="form-grid">
            <TextInput
              label="Title"
              error={errors.title}
              register={register('title', { required: 'Title is required' })}
            />
            <TextInput
              label="Description"
              error={errors.description}
              register={register('description', { required: 'Description is required' })}
              isTextArea
            />
            <NumberInput
              name="timeLimit"
              label="Time Limit (Minutes)"
              control={control}
              error={errors.timeLimit}
              rules={{ required: 'Time Limit is required' }}
            />
            <NumberInput
              name="totalMarks"
              label="Total Marks"
              control={control}
              error={errors.totalMarks}
              rules={{ required: 'Total Marks is required' }}
            />
            <SwitchButtonField name="isRequired" label="Required Quiz" control={control} />
            <SwitchButtonField name="isRandomized" label="Randomly Ordered" control={control} />
          </div>
          <div className="text-end">
            <button className="btn submit-button" type="submit">
              {quiz?.id ? 'Update Quiz' : 'Add Quiz'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 text-black border p-10 rounded-lg shadow bg-white bg-opacity-95">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4 text-base text-slate-500 w-full">
              <h3 className="font-semibold text-xl text-slate-700 break-all">Quiz {quiz?.title || quiz?.name}</h3>
              <p>{quiz?.description}</p>

              <div className="flex gap-4 justify-between">
                <p>
                  Total Marks:
                  <span className="font-semibold text-base text-slate-700"> {quiz?.totalMarks || 0}</span>
                </p>
              </div>
              <div className="flex gap-4 justify-between">
                <p>
                  Time Limit:
                  <span className="font-semibold text-base text-slate-700"> {quiz?.timeLimit} Minutes</span>
                </p>
              </div>
              <p>
                Required:
                <span className="font-semibold text-base text-slate-700"> {quiz?.isRequired ? 'Yes' : 'No'}</span>
              </p>
              <p>
                Randomized:
                <span className="font-semibold text-base text-slate-700"> {quiz?.isRandomized ? 'Yes' : 'No'}</span>
              </p>
            </div>

            <Button tooltip="Edit" onClick={toggleEdit}>
              <EditIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
