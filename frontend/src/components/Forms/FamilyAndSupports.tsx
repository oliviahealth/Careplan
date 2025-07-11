import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import useAppStore from '../../store/useAppStore.ts';
import ChatLoadingSkeleton from '../LoadingSkeleton.tsx';

const HouseholdMemberSchema = z.object({
  person: z.string().min(1, 'Household member required'),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  relation: z.string().min(1, 'Relation required'),
});
export type IHouseholdMembers = z.infer<typeof HouseholdMemberSchema>;

const ChildSchema = z.object({
  name: z.string().min(1, 'Child name required'),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  caregiver: z.string().min(1, 'Caregiver name required'),
  caregiver_number: z.string().min(1, 'Caregiver number required'),
});
export type IChild = z.infer<typeof ChildSchema>;

const FamilyAndSupportsInputsSchema = z.object({
  people_living_in_home: z.array(HouseholdMemberSchema),
  clients_children_not_living_in_home: z.array(ChildSchema),
  notes: z.string().nullable(),
  current_support_system: z.string().min(1, 'Current support system required'),
  strength_of_client_and_support_system: z
    .string()
    .min(1, 'Strengths required'),
  goals: z.string().min(1, 'Goal(s) required'),
});
type IFamilyAndSupportsInputs = z.infer<typeof FamilyAndSupportsInputsSchema>;

const FamilyAndSupportsResponseSchema = FamilyAndSupportsInputsSchema.extend({
  id: z.string(),
  user_id: z.string(),
});
type IFamilyAndSupportsResponse = z.infer<typeof FamilyAndSupportsResponseSchema>

export default function FamilyAndSupports() {
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
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFamilyAndSupportsInputs>({
    resolver: zodResolver(FamilyAndSupportsInputsSchema),
    defaultValues: {
      people_living_in_home: [
        {
          person: '',
          date_of_birth: '',
          relation: '',
        },
      ],
      clients_children_not_living_in_home: [
        {
          name: '',
          date_of_birth: '',
          caregiver: '',
          caregiver_number: '',
        },
      ],
      goals: '',
      current_support_system: '',
      notes: '',
    },
  });

  const {
    fields: householdMemberFields,
    append: appendHouseholdMember,
    remove: removeMember,
  } = useFieldArray({
    control,
    name: 'people_living_in_home',
  });

  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: 'clients_children_not_living_in_home',
  });

  const addNewHouseholdMember = () =>
    appendHouseholdMember({ person: '', date_of_birth: '', relation: '' });

  const addNewChild = () =>
    appendChild({
      name: '',
      date_of_birth: '',
      caregiver: '',
      caregiver_number: '',
    });

    const { isFetching, refetch } = useQuery({
      enabled: false,
      queryKey: [submissionId],
      queryFn: async () => {
        if(!submissionId) return;

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_family_and_supports/${submissionId}`, { headers: { ...headers } });

        return response.data;
      },
      onSuccess: (data: IFamilyAndSupportsResponse) => {
        FamilyAndSupportsResponseSchema.parse(data);

        Object.keys(data).forEach((key) => {
          if (key === 'id' || key === 'user_id') {
            return;
          }

          const formKey = key as keyof IFamilyAndSupportsInputs;
          setValue(formKey, data[key as keyof IFamilyAndSupportsInputs]);
        });
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
    async (data: IFamilyAndSupportsInputs) => {
      let responseData;
      let method;
      if (submissionId) {
        responseData = await axios.put(
          `${import.meta.env.VITE_API_URL}/update_family_and_supports/${submissionId}`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'updated';
      } else {
        responseData = await axios.post(
          `${import.meta.env.VITE_API_URL}/add_family_and_supports`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'added';
      }

      const userData = responseData.data;
      FamilyAndSupportsResponseSchema.parse(userData);

      return { userData, method };
    },
    {
      onSuccess: (data) => {
        const { userData, method } = data;

        setSuccessMessage(`Family And Supports ${method} successfully!`)
        console.log(
          `Family And Supports data ${method} successfully.`,
          userData
        );

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
    <div className="flex justify-center w-full p-2 mt-2 text-base">
      <form
        onSubmit={handleSubmit((data) => updateMutation(data))}
        className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4"
      >
        <p className="font-semibold text-red-700">
          Complete with Recovery Coach or Social Worker
        </p>
        <div className="w-full h-px bg-gray-300"></div>

        <p className="font-medium text-xl">Current Living Arrangement</p>
        {householdMemberFields.map((field, index) => (
          <div key={field.id} className="space-y-6 py-6">
            <div className="flex justify-between items-center py-6">
              <p className="font-medium pb-2 pt-8">
                Household Member Name {index + 1}
              </p>
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap"
              >
                - Remove Member
              </button>
            </div>
            <input
              {...register(`people_living_in_home.${index}.person`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.people_living_in_home &&
              errors.people_living_in_home[index]?.person && (
                <span className="label-text-alt text-red-500">
                  {errors.people_living_in_home[index]?.person?.message}
                </span>
              )}

            <p className="font-medium">Date of Birth</p>
            <input
              {...register(`people_living_in_home.${index}.date_of_birth`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="date"
            />
            {errors.people_living_in_home &&
              errors.people_living_in_home[index]?.date_of_birth && (
                <span className="label-text-alt text-red-500">
                  {errors.people_living_in_home[index]?.date_of_birth?.message}
                </span>
              )}

            <p className="font-medium">Relation</p>
            <input
              {...register(`people_living_in_home.${index}.relation`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.people_living_in_home &&
              errors.people_living_in_home[index]?.relation && (
                <span className="label-text-alt text-red-500">
                  {errors.people_living_in_home[index]?.relation?.message}
                </span>
              )}
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addNewHouseholdMember}
            className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap"
          >
            + Add Member
          </button>
        </div>

        <p className="font-medium text-xl">
          Client's Children NOT Living in the home
        </p>
        {childrenFields.map((field, index) => (
          <div key={field.id} className="space-y-6 py-6">
            <div className="flex justify-between items-center py-6">
              <p className="font-medium pb-2 pt-8">Child {index + 1}</p>
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap"
              >
                - Remove Child
              </button>
            </div>
            <input
              {...register(`clients_children_not_living_in_home.${index}.name`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.clients_children_not_living_in_home &&
              errors.clients_children_not_living_in_home[index]?.name && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.clients_children_not_living_in_home[index]?.name
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Date of Birth</p>
            <input
              {...register(
                `clients_children_not_living_in_home.${index}.date_of_birth`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="date"
            />
            {errors.clients_children_not_living_in_home &&
              errors.clients_children_not_living_in_home[index]
                ?.date_of_birth && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.clients_children_not_living_in_home[index]
                      ?.date_of_birth?.message
                  }
                </span>
              )}

            <p className="font-medium">Caregiver Name</p>
            <input
              {...register(
                `clients_children_not_living_in_home.${index}.caregiver`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.clients_children_not_living_in_home &&
              errors.clients_children_not_living_in_home[index]?.caregiver && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.clients_children_not_living_in_home[index]?.caregiver
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Caregiver Phone Number</p>
            <input
              {...register(
                `clients_children_not_living_in_home.${index}.caregiver_number`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.clients_children_not_living_in_home &&
              errors.clients_children_not_living_in_home[index]
                ?.caregiver_number && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.clients_children_not_living_in_home[index]
                      ?.caregiver_number?.message
                  }
                </span>
              )}
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addNewChild}
            className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap"
          >
            + Add Another Child
          </button>
        </div>

        <p className="font-medium text-xl">Notes</p>
        <textarea
          {...register('notes')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.notes && (
          <span className="label-text-alt text-red-500">
            {errors.notes.message}
          </span>
        )}

        <p className="font-medium text-xl">Current Support System</p>
        <textarea
          {...register('current_support_system')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.current_support_system && (
          <span className="label-text-alt text-red-500">
            {errors.current_support_system.message}
          </span>
        )}

        <p className="font-medium text-xl">
          Strengths of Client and Support System
        </p>
        <textarea
          {...register('strength_of_client_and_support_system')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.strength_of_client_and_support_system && (
          <span className="label-text-alt text-red-500">
            {errors.strength_of_client_and_support_system.message}
          </span>
        )}

        <p className="font-medium text-xl">
          Goals (Parenting, Breastfeeding, Recovery, Etc.)
        </p>
        <textarea
          {...register('goals')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.goals && (
          <span className="label-text-alt text-red-500">
            {errors.goals.message}
          </span>
        )}

        <div className="flex justify-center py-6">
          <button
            type="submit"
            className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md"
          >
            { isMutationLoading && <span className="loading loading-spinner loading-sm"></span> }
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
