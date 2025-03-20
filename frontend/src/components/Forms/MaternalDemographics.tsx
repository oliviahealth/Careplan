import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { states } from '../../utils';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useEffect, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';
import ChatLoadingSkeleton from '../LoadingSkeleton';

const livingArrangementsEnum = z.enum([
  'Rent/Own a Home',
  'Living with Relatives or Friends',
  'Residential Treatment Center',
  'Correctional Facility',
  'Emergency Shelter',
  'Homeless',
  'Other',
]);
const livingArrangements = Object.values(livingArrangementsEnum.Values);

const phoneTypeEnum = z.enum(['Mobile', 'Home', 'Other']);
const phoneTypes = Object.values(phoneTypeEnum.Values);

const maritalStatusEnum = z.enum([
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
]);
const maritalStatuses = Object.values(maritalStatusEnum.Values);

const MaternalDemographicsInputsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  current_living_arrangement: livingArrangementsEnum,
  street_address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'Zip code is required'),
  county: z.string().min(1, 'County is required'),
  primary_phone_number: z.string().min(1, 'Primary phone number is required'),
  phone_type: phoneTypeEnum,
  emergency_contact: z.string().min(1, 'Emergency contact is required'),
  emergency_contact_phone: z
    .string()
    .min(1, 'Emergency contact phone number is required'),
  relationship: z.string().min(1, 'Emergency contact relationship is required'),
  marital_status: maritalStatusEnum,
  insurance_plan: z.string().min(1, 'Insurance plan is required'),
  effective_date: z.string().min(1, 'Insurace plan effective date is required'),
  subscriber_id: z.string().min(1, 'Insurance plan subscriber ID is required'),
  group_id: z.string().min(1, 'Insurance plan group ID is required'),
});
export type IMaternalDemographicsInputs = z.infer<
  typeof MaternalDemographicsInputsSchema
>;

const MaternalDemographicsResponseSchema =
  MaternalDemographicsInputsSchema.extend({
    id: z.string(),
    user_id: z.string(),
  });
export type IMaternalDemographicsResponse = z.infer<typeof MaternalDemographicsResponseSchema>;

export default function MaternalDemographics() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IMaternalDemographicsInputs>({
    resolver: zodResolver(MaternalDemographicsInputsSchema),
  });

  const { isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: [submissionId],
    queryFn: async () => {
      if(!submissionId) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_maternal_demographics/${submissionId}`, { headers: { ...headers } });

      return response.data;
    },
    onSuccess: (data: IMaternalDemographicsResponse) => {
      MaternalDemographicsResponseSchema.parse(data);

      Object.keys(data).forEach((key) => {
        if (key === 'id' || key === 'user_id') {
          return;
        }

        const formKey = key as keyof IMaternalDemographicsInputs;
        if (key === 'date_of_birth' || key === 'effective_date') {
          const newDate = new Date(data[key])
            .toISOString()
            .split('T')[0];

          setValue(formKey, newDate);
        } else {
          setValue(formKey, data[key as keyof IMaternalDemographicsInputs]);
        }
      });
    },
    onError: () => setError("Something went wrong! Please try again later")
  })

  useEffect(() => {
    if(!submissionId) return;

    refetch();
  }, [submissionId, headers, refetch])

  const { mutate: updateMutation, isLoading: isMutationLoading } = useMutation(
    async (data: IMaternalDemographicsInputs) => {
      let responseData;
      let method;
      if (submissionId) {
        responseData = await axios.put(
          `${import.meta.env.VITE_API_URL}/update_maternal_demographics/${submissionId}`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'updated';
      } else {
        responseData = await axios.post(
          `${import.meta.env.VITE_API_URL}/add_maternal_demographics`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'added';
      }

      const userData = responseData.data;
      MaternalDemographicsResponseSchema.parse(userData);

      return { userData, method };
    },
    {
      onSuccess: (data) => {
        const { userData, method } = data;

        setSuccessMessage(`Maternal Demographics data ${method} successfully.`);
        console.log(
          `Maternal Demographics data ${method} successfully.`,
          userData
        );

        navigate('/dashboard');
      },
      onError: () => {
        setError('Something went wrong! Please try again later');
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
        <p className="font-medium text-xl">Personal Information</p>
        <p className="font-medium">Name</p>
        <input
          {...register('name')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.name && (
          <span className="label-text-alt text-red-500">
            {errors.name.message}
          </span>
        )}

        <p className="font-medium">Date of Birth</p>
        <input
          {...register('date_of_birth')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
          type="date"
        />
        {errors.date_of_birth && (
          <span className="label-text-alt text-red-500">
            {errors.date_of_birth.message}
          </span>
        )}

        <p className="font-medium text-xl">Address and Contact Information</p>
        <p className="font-medium my-6">Current Living Arrangements</p>
        <div className="flex flex-col space-y-2">
          {livingArrangements.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input
                {...register('current_living_arrangement')}
                type="radio"
                value={status}
                className="form-radio"
              />
              <span className="ml-2">{status}</span>
            </label>
          ))}

          {errors.current_living_arrangement && (
            <span className="label-text-alt text-red-500">
              {errors.current_living_arrangement.message}
            </span>
          )}
        </div>

        <div className="flex flex-nowrap space-x-4 py-6">
          <div className="flex flex-col flex-grow lg:w-full md:w-full sm:w-auto">
            <p className="font-medium whitespace-nowrap">Street Address</p>
            <input
              {...register('street_address')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.street_address && (
              <span className="label-text-alt text-red-500">
                {errors.street_address.message}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow lg:w-3/4 md:w-3/4 sm:w-3/4">
            <p className="font-medium">City</p>
            <input
              {...register('city')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.city && (
              <span className="label-text-alt text-red-500">
                {errors.city.message}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow lg:w-1/3 md:w-full sm:w-3/4">
            <p className="font-medium">State</p>
            <select
              {...register('state')}
              className="dropdown border border-gray-300 px-4 py-2 rounded-md w-full"
            >
              <option selected disabled>
                --
              </option>
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <span className="label-text-alt text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-nowrap space-x-4">
          <div className="flex flex-col flex-grow">
            <p className="font-medium">Zip Code</p>
            <input
              {...register('zip_code')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.zip_code && (
              <span className="label-text-alt text-red-500">
                {errors.zip_code.message}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <p className="font-medium">County</p>
            <input
              {...register('county')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.county && (
              <span className="label-text-alt text-red-500">
                {errors.county.message}
              </span>
            )}
          </div>
        </div>

        <p className="font-medium">Primary Phone Number</p>
        <input
          {...register('primary_phone_number')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.primary_phone_number && (
          <span className="label-text-alt text-red-500">
            {errors.primary_phone_number.message}
          </span>
        )}

        <p className="font-medium mb-2">Phone Type:</p>
        <div className="flex flex-col gap-2">
          {phoneTypes.map((type) => (
            <label key={type} className="inline-flex items-center">
              <input
                {...register('phone_type')}
                type="radio"
                value={type}
                className="form-radio"
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
        {errors.phone_type && (
          <span className="label-text-alt text-red-500">
            {errors.phone_type.message}
          </span>
        )}

        <p className="font-medium text-xl">Emergency Contact</p>
        <div className="flex flex-nowrap space-x-4">
          <div className="flex flex-col flex-grow">
            <p className="font-medium">Name</p>
            <input
              {...register('emergency_contact')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.emergency_contact && (
              <span className="label-text-alt text-red-500">
                {errors.emergency_contact.message}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <p className="font-medium">Phone Number</p>
            <input
              {...register('emergency_contact_phone')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.emergency_contact_phone && (
              <span className="label-text-alt text-red-500">
                {errors.emergency_contact_phone.message}
              </span>
            )}
          </div>
        </div>

        <p className="font-medium">Emergency Contact Relationship</p>
        <input
          {...register('relationship')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.relationship && (
          <span className="label-text-alt text-red-500">
            {errors.relationship.message}
          </span>
        )}

        <p className="font-medium text-xl">Insurance Status</p>

        <p className="font-medium mb-2">Marital Status:</p>
        <div className="flex flex-col gap-2">
          {maritalStatuses.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input
                {...register('marital_status')}
                type="radio"
                value={status}
                className="form-radio"
              />
              <span className="ml-2">{status}</span>
            </label>
          ))}
        </div>
        {errors.marital_status && (
          <span className="label-text-alt text-red-500">
            {errors.marital_status.message}
          </span>
        )}

        <p className="font-medium">Insurance Plan</p>
        <input
          {...register('insurance_plan')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.insurance_plan && (
          <span className="label-text-alt text-red-500">
            {errors.insurance_plan.message}
          </span>
        )}

        <div className="flex flex-nowrap space-x-4 pt-6">
          <div className="flex flex-col flex-grow">
            <p className="font-medium">Effective Date</p>
            <input
              {...register('effective_date')}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="date"
            />
            {errors.effective_date && (
              <span className="label-text-alt text-red-500">
                {errors.effective_date.message}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <p className="font-medium">Subscriber ID</p>
            <input
              {...register('subscriber_id')}
              className="border border-gray-300 px-4 py-2.5 rounded-md w-full"
            />
            {errors.subscriber_id && (
              <span className="label-text-alt text-red-500">
                {errors.subscriber_id.message}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <p className="font-medium">Group ID</p>
            <input
              {...register('group_id')}
              className="border border-gray-300 px-4 py-2.5 rounded-md w-full"
            />
            {errors.group_id && (
              <span className="label-text-alt text-red-500">
                {errors.group_id.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#AFAFAFAF] w-full text-black px-20 py-2 mt-6 rounded-md"
          >
            { isMutationLoading && <span className="loading loading-spinner loading-sm"></span> }
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
