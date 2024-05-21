import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

const DiagnosisSchema = z.object({
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  provider: z.string().min(1, 'Provider is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  date_of_diagnosis: z.string().min(1, 'Date of diagnosis is required'),
  taking_medication: z.string().min(1, 'This field is required'),
});
export type IDiagnosis = z.infer<typeof DiagnosisSchema>;

export const PsychiatricHistoryInputsSchema = z.object({
  diagnosis: z.array(DiagnosisSchema),
  notes: z.string().default(''),
});
export type IPsychiatricHistoryInputs = z.infer<
  typeof PsychiatricHistoryInputsSchema
>;

const PsychiatricHistoryResponseSchema = PsychiatricHistoryInputsSchema.extend({
  id: z.string(),
  user_id: z.string(),
});

export default function PsychiatricHistory() {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  const user = useAppStore((state) => state.user);
  const access_token = useAppStore((state) => state.access_token);

  const headers = useMemo(
    () => ({
      Authorization: 'Bearer ' + access_token,
      userId: user?.id,
    }),
    [access_token, user?.id]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IPsychiatricHistoryInputs>({
    resolver: zodResolver(PsychiatricHistoryInputsSchema),
    defaultValues: {
      diagnosis: [
        {
          diagnosis: '',
          provider: '',
          phone_number: '',
          date_of_diagnosis: '',
          taking_medication: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'diagnosis',
  });

  const addNewDiagnosis = () =>
    append({
      diagnosis: '',
      provider: '',
      phone_number: '',
      date_of_diagnosis: '',
      taking_medication: '',
    });

  useEffect(() => {
    const fetchUserData = async () => {
      if (submissionId) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/get_psychiatric_history/${submissionId}`,
            { headers: { ...headers } }
          );
          const pastResponseData = response.data;

          PsychiatricHistoryResponseSchema.parse(pastResponseData);

          Object.keys(pastResponseData).forEach((key) => {
            if (key === 'id' || key === 'user_id') return;

            const formKey = key as keyof IPsychiatricHistoryInputs;
            if (key === 'date_of_diagnosis') {
              const newDate = new Date(pastResponseData[key])
                .toISOString()
                .split('T')[0];

              setValue(formKey, newDate);
            }
            setValue(formKey, pastResponseData[key]);
          });
        } catch (error) {
          alert('Something went wrong!');

          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [submissionId, headers, setValue]);

  const { mutate } = useMutation(
    async (data: IPsychiatricHistoryInputs) => {
      let responseData;
      let method;
      if (submissionId) {
        responseData = await axios.put(
          `http://127.0.0.1:5000/api/update_psychiatric_history/${submissionId}`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'updated';
      } else {
        responseData = await axios.post(
          'http://127.0.0.1:5000/api/add_psychiatric_history',
          { ...data },
          { headers: { ...headers } }
        );
        method = 'added';
      }

      const userData = responseData.data;
      PsychiatricHistoryResponseSchema.parse(userData);

      return { userData, method };
    },
    {
      onSuccess: (data) => {
        const { userData, method } = data;

        alert(`Psychiatric History ${method} successfully!`);
        console.log(
          `PsychiatricHistory data ${method} successfully.`,
          userData
        );

        navigate('/dashboard');
      },
      onError: () => {
        alert('Error while adding/updating PsychiatricHistory data.');
      },
    }
  );

  return (
    <div className="flex  justify-center w-full p-2 mt-2 text-base font-OpenSans">
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4"
      >
        <p className="font-semibold text-red-700">
          Complete with: OB/GYN, Primary Care Provider, or Mental Health
          Provider
        </p>
        <div className="w-full h-px bg-gray-300"></div>

        {fields.map((field, index) => (
          <div key={field.id} className="py-6">
            <div className="flex justify-between items-center">
              <p className="font-medium pb-2 pt-8">Diagnosis {index + 1}</p>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap"
              >
                - Remove Diagnosis
              </button>
            </div>
            <input
              {...register(`diagnosis.${index}.diagnosis`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.diagnosis && errors.diagnosis[index]?.diagnosis && (
              <span className="label-text-alt text-red-500">
                {errors.diagnosis[index]?.diagnosis?.message}
              </span>
            )}

            <p className="font-medium pt-6">Provider</p>
            <input
              {...register(`diagnosis.${index}.provider`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.diagnosis && errors.diagnosis[index]?.provider && (
              <span className="label-text-alt text-red-500">
                {errors.diagnosis[index]?.provider?.message}
              </span>
            )}

            <p className="font-medium pt-6">Phone Number</p>
            <input
              {...register(`diagnosis.${index}.phone_number`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.diagnosis && errors.diagnosis[index]?.phone_number && (
              <span className="label-text-alt text-red-500">
                {errors.diagnosis[index]?.phone_number?.message}
              </span>
            )}

            <p className="font-medium pt-6">Date of Diagnosis</p>
            <input
              {...register(`diagnosis.${index}.date_of_diagnosis`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="date"
            />
            {errors.diagnosis && errors.diagnosis[index]?.date_of_diagnosis && (
              <span className="label-text-alt text-red-500">
                {errors.diagnosis[index]?.date_of_diagnosis?.message}
              </span>
            )}

            <p className="font-medium pt-6">
              Are You Currently Taking Medicine for this Diagnosis?
            </p>
            <div className="flex flex-col space-y-2">
              {['Yes', 'No'].map((status, idx) => (
                <label key={idx} className="inline-flex items-center">
                  <input
                    {...register(`diagnosis.${index}.taking_medication`)}
                    type="radio"
                    value={status}
                    className="form-radio"
                  />
                  <span className="ml-2">{status}</span>
                </label>
              ))}
            </div>
            {errors.diagnosis && errors.diagnosis[index]?.taking_medication && (
              <span className="label-text-alt text-red-500">
                {errors.diagnosis[index]?.taking_medication?.message}
              </span>
            )}
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addNewDiagnosis}
            className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap"
          >
            + Add Diagnosis
          </button>
        </div>

        <p className="font-medium">Notes</p>
        <textarea
          {...register('notes')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
