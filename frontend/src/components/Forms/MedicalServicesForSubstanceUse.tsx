import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useEffect, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';
import ChatLoadingSkeleton from '../LoadingSkeleton';

const MedicationSchema = z.object({
  medication: z.string().min(1, 'Medication required'),
  dose: z.string().min(1, 'Dose required'),
});
export type IMedication = z.infer<typeof MedicationSchema>;

const MedicalServicesSubstanceUseInputsSchema = z.object({
  mat_engaged: z.string().min(1, 'MAT engaged required'),
  date_used_mat: z.string().nullable(),
  medications: z.array(MedicationSchema),
  mat_clinic_name: z.string().nullable(),
  mat_clinic_phone: z.string().nullable(),
  used_addiction_medicine_services: z.string().min(1, 'This field is required'),
  date_used_medicine_service: z.string().nullable(),
  addiction_medicine_clinic: z.string().nullable(),
  addiction_medicine_clinic_phone: z.string().nullable(),
});
type IMedicalServicesSubstanceUseInputs = z.infer<typeof MedicalServicesSubstanceUseInputsSchema>;

const MedicalServicesSubstanceUseResponse = MedicalServicesSubstanceUseInputsSchema.extend({
  id: z.string(),
  user_id: z.string(),
});
type IMedicalServicesSubstanceUseResponse = z.infer<typeof MedicalServicesSubstanceUseResponse>;

export default function MedicalServicesForSubstanceUse() {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  const user = useAppStore((state) => state.user);
  const access_token = useAppStore((state) => state.access_token);

  const setSuccessMessage = useAppStore(state => state.setSuccessMessage);
  const setError = useAppStore(state => state.setError);
  
  const headers = useMemo(() => ({
      Authorization: 'Bearer ' + access_token,
      userId: user?.id,
    }),
    [access_token, user?.id]
  );

  const [showMatDetails, setShowMatDetails] = useState(false);
  const handleShowMatDetails = (value: string) => {
    if (value === 'Prior MAT use') {
      setShowMatDetails(true);

      return;
    }

    setShowMatDetails(false);
    setValue('date_used_mat', null);
    setValue('mat_clinic_name', null);
    setValue('mat_clinic_phone', null);
  };

  const [showAddictionServiceDetails, setShowAddictionServiceDetails] =
    useState(false);
  const handleShowAddictionServiceDetails = (value: string) => {
    if (value === 'Prior Use') {
      setShowAddictionServiceDetails(true);

      return;
    }

    setShowAddictionServiceDetails(false);
    setValue('date_used_medicine_service', null);
    setValue('addiction_medicine_clinic', null);
    setValue('addiction_medicine_clinic_phone', null);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IMedicalServicesSubstanceUseInputs>({
    resolver: zodResolver(MedicalServicesSubstanceUseInputsSchema),
    defaultValues: {
      date_used_mat: '',
      date_used_medicine_service: '',
      medications: [
        {
          medication: '',
          dose: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const addNewMedication = () => append({ medication: '', dose: '' });

  const { isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: [submissionId],
    queryFn: async () => {
      if(!submissionId) return;

      const response = await axios.get(`http://127.0.0.1:5000/api/get_medical_services_for_substance_use/${submissionId}`, { headers: { ...headers } });

      return response.data;
    },
    onSuccess: (data: IMedicalServicesSubstanceUseResponse) => {
      MedicalServicesSubstanceUseResponse.parse(data);

      Object.keys(data).forEach((key) => {
        if (key === 'id' || key === 'user_id') return;

        const formKey = key as keyof IMedicalServicesSubstanceUseInputs;
        if (key === 'date_used_mat' || key === 'date_used_medicine_service') {
          if(!data[key]) return;
          
          const newDate = new Date(data[key]!).toISOString().split('T')[0];

          setValue(formKey, newDate);
        } else {
          setValue(formKey, data[key as keyof IMedicalServicesSubstanceUseInputs]);
        }
      });

      setShowMatDetails(data.mat_engaged === 'Prior MAT use');
      setShowAddictionServiceDetails(data.used_addiction_medicine_services === 'Prior Use');
    },
    onError: () => {
      setError("Something went wrong! Please try again later");
    }
  })

  useEffect(() => {
    if(!submissionId) return;

    refetch();
  }, [submissionId, headers, refetch])

  const { mutate: updateMutation, isLoading: isMutationLoading } = useMutation(
    async (data: IMedicalServicesSubstanceUseInputs) => {
      let responseData;
      let method;
      if (submissionId) {
        responseData = await axios.put(
          `http://127.0.0.1:5000/api/update_medical_services_for_substance_use/${submissionId}`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'updated';
      } else {
        responseData = await axios.post(
          'http://127.0.0.1:5000/api/add_medical_services_for_substance_use',
          { ...data },
          { headers: { ...headers } }
        );
        method = 'added';
      }

      const userData = responseData.data;
      MedicalServicesSubstanceUseResponse.parse(userData);

      return { userData, method };
    },
    {
      onSuccess: (data) => {
        const { userData, method } = data;

        setSuccessMessage(`Medical Services For Substance Use ${method} successfully!`);
        console.log(`MedicalServicesForSubstanceUse data ${method} successfully.`, userData);

        navigate('/dashboard');
      },
      onError: () => {
        setError("Something went wrong! Please try again later");
      },
    }
  );

  if(isFetching) {
    return <ChatLoadingSkeleton />
  }

  return (
    <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
      <form
        onSubmit={handleSubmit((data) => updateMutation(data))}
        className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4"
      >
        <p className="font-semibold text-red-700">Complete with MAT Provider</p>
        <div className="w-full h-px bg-gray-300"></div>

        <p className="font-medium">
          Medication Assisted Treatment (MAT) engaged?
        </p>
        {['Never', 'Currently', 'Prior MAT use'].map((status) => (
          <label key={status} className="flex pt-2">
            <input
              {...register('mat_engaged')}
              type="radio"
              value={status}
              className="form-radio"
              onChange={(e) => handleShowMatDetails(e.target.value)}
            />
            <span className="ml-2">{status}</span>
          </label>
        ))}
        {errors.mat_engaged && (
          <span className="label-text-alt text-red-500">
            {errors.mat_engaged.message}
          </span>
        )}

        {showMatDetails && (
          <>
            <p className="font-medium">Date Last Used</p>
            <input
              {...register('date_used_mat')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="date"
            />
            {errors.date_used_mat && (
              <span className="label-text-alt text-red-500">
                {errors.date_used_mat.message}
              </span>
            )}

            <p className="font-medium">MAT Clinic</p>
            <input
              {...register('mat_clinic_name')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.mat_clinic_name && (
              <span className="label-text-alt text-red-500">
                {errors.mat_clinic_name.message}
              </span>
            )}

            <p className="font-medium">MAT Clinic Phone Number</p>
            <input
              {...register('mat_clinic_phone')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.mat_clinic_phone && (
              <span className="label-text-alt text-red-500">
                {errors.mat_clinic_phone.message}
              </span>
            )}
          </>
        )}

        <p className="font-medium">Medications</p>
        {fields.map((field, index) => (
          <div key={field.id} className="py-6 space-y-6">
            <div className="flex justify-between items-center py-6">
              <p className="font-medium pb-2 pt-8">Medication {index + 1}</p>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap"
              >
                - Remove Medication
              </button>
            </div>
            <input
              {...register(`medications.${index}.medication`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.medications && errors.medications[index]?.medication && (
              <span className="label-text-alt text-red-500">
                {errors.medications[index]?.medication?.message}
              </span>
            )}

            <p className="font-medium">Dose</p>
            <input
              {...register(`medications.${index}.dose`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.medications && errors.medications[index]?.dose && (
              <span className="label-text-alt text-red-500">
                {errors.medications[index]?.dose?.message}
              </span>
            )}
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addNewMedication}
            className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap"
          >
            + Add Medication
          </button>
        </div>

        <p className="font-medium">Used Addiction Medicine Services?</p>
        {['Never', 'Currently', 'Prior Use'].map((status) => (
          <label key={status} className="flex items-center pt-2">
            <input
              {...register('used_addiction_medicine_services')}
              type="radio"
              value={status}
              className="form-radio"
              onChange={(e) =>
                handleShowAddictionServiceDetails(e.target.value)
              }
            />
            <span className="ml-2">{status}</span>
          </label>
        ))}
        {errors.used_addiction_medicine_services && (
          <span className="label-text-alt text-red-500">
            {errors.used_addiction_medicine_services.message}
          </span>
        )}

        {showAddictionServiceDetails && (
          <>
            <p className="font-medium">Date Last Used</p>
            <input
              {...register('date_used_medicine_service')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="date"
            />
            {errors.date_used_medicine_service && (
              <span className="label-text-alt text-red-500">
                {errors.date_used_medicine_service.message}
              </span>
            )}

            <p className="font-medium">Addiction Medicine Clinic Name</p>
            <input
              {...register('addiction_medicine_clinic')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.addiction_medicine_clinic && (
              <span className="label-text-alt text-red-500">
                {errors.addiction_medicine_clinic.message}
              </span>
            )}

            <p className="font-medium">
              Addiction Medicine Clinic Phone Number
            </p>
            <input
              {...register('addiction_medicine_clinic_phone')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.addiction_medicine_clinic_phone && (
              <span className="label-text-alt text-red-500">
                {errors.addiction_medicine_clinic_phone.message}
              </span>
            )}
          </>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md"
          >
            { isMutationLoading && <span className="loading loading-spinner loading-sm"></span> }
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
