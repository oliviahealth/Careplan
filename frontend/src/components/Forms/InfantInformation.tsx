import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';
import ChatLoadingSkeleton from '../LoadingSkeleton';

const InfantCareNeedsSchema = z.object({
  breast_pump: z.string().min(1, 'Breast pump information required'),
  breast_pump_notes: z.string().nullable(),
  breastfeeding_support: z
    .string()
    .min(1, 'Breastfeeding support information required'),
  breastfeeding_support_notes: z.string().nullable(),
  car_seat: z.string().min(1, 'Car seat information required'),
  car_seat_notes: z.string().nullable(),
  childcare: z.string().min(1, 'Childcare information required'),
  childcare_notes: z.string().nullable(),
  clothing: z.string().min(1, 'Clothing information required'),
  clothing_notes: z.string().nullable(),
  crib: z.string().min(1, 'Crib information required'),
  crib_notes: z.string().nullable(),
  diapers: z.string().min(1, 'Diapers information required'),
  diapers_notes: z.string().nullable(),
  infant_formula: z.string().min(1, 'Infant formula information required'),
  infant_formula_notes: z.string().nullable(),
  infant_stroller: z.string().min(1, 'Infant stroller information required'),
  infant_stroller_notes: z.string().nullable(),
  other: z.string().nullable(),
  other_name: z.string().nullable(),
  other_notes: z.string().nullable(),
});
export type IInfantCareNeeds = z.infer<typeof InfantCareNeedsSchema>;

const InfantMedsSchema = z.object({
  medication: z.string().min(1, 'Medication required'),
  dose: z.string().min(1, 'Dose required'),
  prescriber: z.string().min(1, 'Prescriber required'),
  notes: z.string().min(1, 'Notes required'),
});
export type IInfantMeds = z.infer<typeof InfantMedsSchema>;

const InfantInformationInputsSchema = z.object({
  child_name: z.string().min(1, 'Child name required'),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  sex: z.string().min(1, 'Sex required'),
  birth_weight: z.string().min(1, 'Birth weight required'),
  gestational_age_at_birth: z
    .string()
    .min(1, 'Gestional age at birth required'),
  NICU_stay: z.string().min(1, 'NICU stay information required'),
  NICU_length_of_stay: z.string().nullable(),
  pediatrician_name: z.string().min(1, 'Pediatrician name required'),
  pediatrician_contact_info: z
    .string()
    .min(1, 'Pediatrician phone number required'),
  infant_urine_drug_screening_at_birth: z
    .string()
    .min(1, 'Infant urine drug screening at birth info required'),
  infant_urine_drug_screening_at_birth_specify: z.string().nullable(),
  meconium_results: z.string().min(1, 'Meconium results required'),
  meconium_results_specify: z.string().nullable(),
  neonatal_opiod_withdraw: z
    .string()
    .min(1, 'Neonatal opiod withdraw info required'),
  neonatal_opiod_withdraw_treatment_method: z.string().nullable(),
  DX_problems_additional_information: z
    .string()
    .min(1, 'DX Problems/Additional Information required'),
  infant_care_needs_items: z.array(InfantCareNeedsSchema),
  where_will_baby_sleep: z
    .string()
    .min(1, 'Baby sleeping information required'),
  where_will_baby_sleep_specify: z.string().nullable(),
  infant_care_needs_additional_notes: z.string().nullable(),
  infant_medications: z.array(InfantMedsSchema),
  infant_medication_notes: z.string().nullable(),
  father_name: z.string().min(1, 'Father name required'),
  father_date_of_birth: z.string().min(1, 'Father date of birth required'),
  father_street_address: z.string().min(1, 'Father street address required'),
  father_city: z.string().min(1, 'Father city required'),
  father_state: z.string().min(1, 'Father state required'),
  father_zip_code: z.string().min(1, 'Father zip code required'),
  father_primary_phone_numbers: z
    .string()
    .min(1, 'Father phone number required'),
  father_involved_in_babys_life: z
    .string()
    .min(1, "Father involvement in baby's life required"),
  father_involved_in_babys_life_comments: z.string().nullable(),
  father_notes: z.string().nullable(),
});
type IInfantInformationInputs = z.infer<typeof InfantInformationInputsSchema>;

const InfantInformationResponseSchema = InfantInformationInputsSchema.extend({
  id: z.string(),
  user_id: z.string(),
});
type IInfantInformationResponse = z.infer<typeof InfantInformationResponseSchema>;

export default function InfantInformation() {
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

  const [showNICUStay, setShowNICUStay] = useState(false);
  const handleShowNICUStay = (value: string) => {
    setShowNICUStay(value === 'Yes');

    if (value === 'Yes') {
      setShowNICUStay(true);

      return;
    }

    setShowNICUStay(false);
    setValue('NICU_length_of_stay', null);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IInfantInformationInputs>({
    resolver: zodResolver(InfantInformationInputsSchema),
    defaultValues: {
      infant_medications: [
        {
          medication: '',
          dose: '',
          prescriber: '',
          notes: '',
        },
      ],

      infant_care_needs_items: [
        {
          breast_pump: '',
          breast_pump_notes: '',
          breastfeeding_support: '',
          breastfeeding_support_notes: '',
          car_seat: '',
          car_seat_notes: '',
          childcare: '',
          childcare_notes: '',
          clothing: '',
          clothing_notes: '',
          crib: '',
          crib_notes: '',
          diapers: '',
          diapers_notes: '',
          infant_formula: '',
          infant_formula_notes: '',
          infant_stroller: '',
          infant_stroller_notes: '',
          other: '',
          other_notes: '',
        },
      ],
    },
  });

  const {
    fields: infantMedsFields,
    append: appendInfantMed,
    remove: removeInfantMed,
  } = useFieldArray({
    control,
    name: 'infant_medications',
  });

  const { fields: infantCareNeedsItemsFields } = useFieldArray({
    control,
    name: 'infant_care_needs_items',
  });

  const addInfantMed = () =>
    appendInfantMed({ medication: '', dose: '', prescriber: '', notes: '' });

  const { isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: [submissionId],
    queryFn: async () => {
      if(!submissionId) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_infant_information/${submissionId}`, { headers: { ...headers } });

      return response.data;
    },
    onSuccess: (data: IInfantInformationResponse) => {
      InfantInformationResponseSchema.parse(data);

      Object.keys(data).forEach((key) => {
        if (key === 'id' || key === 'user_id') {
          return;
        }
        
        const formKey = key as keyof IInfantInformationInputs;
        if (key === 'date_of_birth' || key === 'father_date_of_birth') {
          const newDate = new Date(data[key])
            .toISOString()
            .split('T')[0];

          setValue(formKey, newDate);
        } else {
          setValue(formKey, data[key as keyof IInfantInformationInputs]);
        }
      });

      if (data.NICU_stay === 'Yes') {
        setShowNICUStay(true);
      } else {
        setShowNICUStay(false);
      }

      if (data.NICU_stay === 'No') {
        setValue('NICU_length_of_stay', null);
      }
    },
    onError: () => {
      setError('Something went wrong! Please try again later');
    }
  })

  useEffect(() => {
    if(!submissionId) return;

    refetch();

  }, [submissionId, headers, refetch]);

  const { mutate: updateMutation, isLoading: isMutationLoading } = useMutation(
    async (data: IInfantInformationInputs) => {
      let responseData;
      let method;
      if (submissionId) {
        responseData = await axios.put(
          `${import.meta.env.VITE_API_URL}/update_infant_information/${submissionId}`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'updated';
      } else {
        responseData = await axios.post(
          `${import.meta.env.VITE_API_URL}/add_infant_information`,
          { ...data },
          { headers: { ...headers } }
        );
        method = 'added';
      }

      const userData = responseData.data;
      InfantInformationResponseSchema.parse(userData);

      return { userData, method };
    },
    {
      onSuccess: (data) => {
        const { userData, method } = data;

        setSuccessMessage(`Family And Supports ${method} successfully!`)
        console.log(`InfantInformation data ${method} successfully.`, userData);

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
        className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4"
      >
        <p className="font-semibold text-red-700">Complete with Pediatrician</p>
        <div className="w-full h-px bg-gray-300"></div>

        <p className="font-medium">Child's Name</p>
        <input
          {...register('child_name')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.child_name && (
          <span className="label-text-alt text-red-500">
            {errors.child_name.message}
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

        <p className="font-medium">Sex</p>
        {['Male', 'Female'].map((status) => (
          <label key={status} className="flex items-center">
            <input
              {...register('sex')}
              className="mr-2"
              type="radio"
              value={status}
            />
            {status}
          </label>
        ))}
        {errors.sex && (
          <span className="label-text-alt text-red-500">
            {errors.sex.message}
          </span>
        )}

        <p className="font-medium">Birth Weight (lbs)</p>
        <input
          {...register('birth_weight')}
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
        <div>
          {errors.birth_weight && (
            <span className="label-text-alt text-red-500">
              {errors.birth_weight.message}
            </span>
          )}
        </div>

        <p className="font-medium">Gestational Age at Birth (Weeks)</p>
        <input
          {...register('gestational_age_at_birth')}
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
        <div>
          {errors.gestational_age_at_birth && (
            <span className="label-text-alt text-red-500">
              {errors.gestational_age_at_birth.message}
            </span>
          )}
        </div>

        <p className="font_medium">NICU</p>
        {['Yes', 'No'].map((status) => (
          <label key={status} className="flex items-center">
            <input
              {...register('NICU_stay')}
              className="mr-2"
              type="radio"
              value={status}
              onChange={(e) => handleShowNICUStay(e.target.value)}
            />
            {status}
          </label>
        ))}
        {errors.NICU_stay && (
          <span className="label-text-alt text-red-500">
            {errors.NICU_stay.message}
          </span>
        )}

        {showNICUStay && (
          <>
            <p className="font-medium">Length of Stay (Days)</p>
            <input
              {...register('NICU_length_of_stay')}
              className="border border-gray-300 px-4 py-2 rounded-md"
            />
            <div>
              {errors.NICU_length_of_stay && (
                <span className="label-text-alt text-red-500">
                  {errors.NICU_length_of_stay.message}
                </span>
              )}
            </div>
          </>
        )}

        <p className="font-medium">Pediatrician Name</p>
        <input
          {...register('pediatrician_name')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.pediatrician_name && (
          <span className="label-text-alt text-red-500">
            {errors.pediatrician_name.message}
          </span>
        )}

        <p className="font-medium">Pediatrician Phone Number</p>
        <input
          {...register('pediatrician_contact_info')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.pediatrician_contact_info && (
          <span className="label-text-alt text-red-500">
            {errors.pediatrician_contact_info.message}
          </span>
        )}

        <p className="font-medium">Infant Urine Drug Screening at Birth</p>
        {['Negative', 'Not Completed', 'Positive'].map((status) => (
          <label key={status} className="flex items-center">
            <input
              {...register('infant_urine_drug_screening_at_birth')}
              className="mr-2"
              type="radio"
              value={status}
            />
            {status}
          </label>
        ))}
        {errors.infant_urine_drug_screening_at_birth && (
          <span className="label-text-alt text-red-500">
            {errors.infant_urine_drug_screening_at_birth.message}
          </span>
        )}

        <p className="font-medium">Specify</p>
        <input
          {...register('infant_urine_drug_screening_at_birth_specify')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.infant_urine_drug_screening_at_birth_specify && (
          <span className="label-text-alt text-red-500">
            {errors.infant_urine_drug_screening_at_birth_specify.message}
          </span>
        )}

        <p className="font-medium">Meconium Results</p>
        {['Negative', 'Not Completed', 'Positive'].map((status) => (
          <label key={status} className="flex items-center">
            <input
              {...register('meconium_results')}
              className="mr-2"
              type="radio"
              value={status}
            />
            {status}
          </label>
        ))}
        {errors.meconium_results && (
          <span className="label-text-alt text-red-500">
            {errors.meconium_results.message}
          </span>
        )}

        <p className="font-medium">Specify</p>
        <input
          {...register('meconium_results_specify')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.meconium_results_specify && (
          <span className="label-text-alt text-red-500">
            {errors.meconium_results_specify.message}
          </span>
        )}

        <p className="font-medium">
          Neonatal Opiod Withdraw/Neonatal Abstinence Syndrome
        </p>
        {['Yes', 'No'].map((status) => (
          <label key={status} className="flex items-center">
            <input
              {...register('neonatal_opiod_withdraw')}
              className="mr-2"
              type="radio"
              value={status}
            />
            {status}
          </label>
        ))}
        {errors.neonatal_opiod_withdraw && (
          <span className="label-text-alt text-red-500">
            {errors.neonatal_opiod_withdraw.message}
          </span>
        )}

        <p className="font-medium">Treatment Method</p>
        <input
          {...register('neonatal_opiod_withdraw_treatment_method')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.neonatal_opiod_withdraw_treatment_method && (
          <span className="label-text-alt text-red-500">
            {errors.neonatal_opiod_withdraw_treatment_method.message}
          </span>
        )}

        <p className="font-medium">DX/Problems and Additional Information</p>
        <input
          {...register('DX_problems_additional_information')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.DX_problems_additional_information && (
          <span className="label-text-alt text-red-500">
            {errors.DX_problems_additional_information.message}
          </span>
        )}

        <p className="font-medium text-xl">Infant Care Needs</p>

        {infantCareNeedsItemsFields.map((item, index) => (
          <div key={item.id} className="space-y-4">
            <p className="font-medium">Breast Pump</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.breast_pump`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.breast_pump && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.breast_pump?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(
                `infant_care_needs_items.${index}.breast_pump_notes`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.breast_pump_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.breast_pump_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Breastfeeding Support</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(
                    `infant_care_needs_items.${index}.breastfeeding_support`
                  )}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.breastfeeding_support && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.breastfeeding_support
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(
                `infant_care_needs_items.${index}.breastfeeding_support_notes`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]
                ?.breastfeeding_support_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]
                      ?.breastfeeding_support_notes?.message
                  }
                </span>
              )}

            <p className="font-medium">Car Seat</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.car_seat`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.car_seat && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.car_seat?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_care_needs_items.${index}.car_seat_notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.car_seat_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.car_seat_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Childcare</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.childcare`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.childcare && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.childcare?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_care_needs_items.${index}.childcare_notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.childcare_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.childcare_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Clothing</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.clothing`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.clothing && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.clothing?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_care_needs_items.${index}.clothing_notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.clothing_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.clothing_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Crib</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.crib`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.crib && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.crib?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_care_needs_items.${index}.crib_notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.crib_notes && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.crib_notes?.message}
                </span>
              )}

            <p className="font-medium">Diapers</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.diapers`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.diapers && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.diapers?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_care_needs_items.${index}.diapers_notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.diapers_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.diapers_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Infant Formula</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(
                    `infant_care_needs_items.${index}.infant_formula`
                  )}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.infant_formula && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.infant_formula
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(
                `infant_care_needs_items.${index}.infant_formula_notes`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.infant_formula_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.infant_formula_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Infant Stroller</p>
            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(
                    `infant_care_needs_items.${index}.infant_stroller`
                  )}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.infant_stroller && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.infant_stroller
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(
                `infant_care_needs_items.${index}.infant_stroller_notes`
              )}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.infant_stroller_notes && (
                <span className="label-text-alt text-red-500">
                  {
                    errors.infant_care_needs_items[index]?.infant_stroller_notes
                      ?.message
                  }
                </span>
              )}

            <p className="font-medium">Other</p>
            <input
              {...register(`infant_care_needs_items.${index}.other_name`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.other_name && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.other_name?.message}
                </span>
              )}

            {['Yes', 'No', 'Pending'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  {...register(`infant_care_needs_items.${index}.other`)}
                  className="mr-2"
                  type="radio"
                  value={status}
                />
                {status}
              </label>
            ))}
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.other && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.other?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_care_needs_items.${index}.other_notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_care_needs_items &&
              errors.infant_care_needs_items[index]?.other_notes && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_care_needs_items[index]?.other_notes?.message}
                </span>
              )}
          </div>
        ))}

        <p className="font-medium">Where Will Baby Sleep</p>
        {['Crib/Bassinet', 'Sharing a Bed With Others', 'Other'].map(
          (status) => (
            <label key={status} className="flex items-center">
              <input
                {...register('where_will_baby_sleep')}
                className="mr-2"
                type="radio"
                value={status}
              />
              {status}
            </label>
          )
        )}
        {errors.where_will_baby_sleep && (
          <span className="label-text-alt text-red-500">
            {errors.where_will_baby_sleep.message}
          </span>
        )}

        <p className="font-medium">Specify Where Baby Will Sleep</p>
        <input
          {...register('where_will_baby_sleep_specify')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.where_will_baby_sleep_specify && (
          <span className="label-text-alt text-red-500">
            {errors.where_will_baby_sleep_specify.message}
          </span>
        )}

        <p className="font-medium">Additional Notes</p>
        <input
          {...register('infant_care_needs_additional_notes')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.infant_care_needs_additional_notes && (
          <span className="label-text-alt text-red-500">
            {errors.infant_care_needs_additional_notes.message}
          </span>
        )}

        <p className="font-medium text-xl">Infant's Medications</p>
        {infantMedsFields.map((item, index) => (
          <div key={item.id} className="space-y-6 pt-6">
            <div className="flex justify-between items-center py-6">
              <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
              <button
                type="button"
                onClick={() => removeInfantMed(infantMedsFields.length - 1)}
                className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap"
              >
                - Remove Medication
              </button>
            </div>
            <input
              {...register(`infant_medications.${index}.medication`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_medications &&
              errors.infant_medications[index]?.medication && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_medications[index]?.medication?.message}
                </span>
              )}

            <p className="font-medium">Dose</p>
            <input
              {...register(`infant_medications.${index}.dose`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_medications &&
              errors.infant_medications[index]?.dose && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_medications[index]?.dose?.message}
                </span>
              )}

            <p className="font-medium">Prescriber</p>
            <input
              {...register(`infant_medications.${index}.prescriber`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_medications &&
              errors.infant_medications[index]?.prescriber && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_medications[index]?.prescriber?.message}
                </span>
              )}

            <p className="font-medium">Notes</p>
            <input
              {...register(`infant_medications.${index}.notes`)}
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            {errors.infant_medications &&
              errors.infant_medications[index]?.notes && (
                <span className="label-text-alt text-red-500">
                  {errors.infant_medications[index]?.notes?.message}
                </span>
              )}
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addInfantMed}
            className="text-black px-4 py-2 rounded-md"
          >
            + Add Medication
          </button>
        </div>

        <p className="font-medium">Infant Medication Notes</p>
        <textarea
          {...register('infant_medication_notes')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.infant_medication_notes && (
          <span className="label-text-alt text-red-500">
            {errors.infant_medication_notes.message}
          </span>
        )}

        <p className="font-medium text-xl">Infant's Father Demographics</p>

        <p className="font-medium">Name</p>
        <input
          {...register('father_name')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_name && (
          <span className="label-text-alt text-red-500">
            {errors.father_name.message}
          </span>
        )}

        <p className="font-medium">Date of Birth</p>
        <input
          {...register('father_date_of_birth')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
          type="date"
        />
        {errors.father_date_of_birth && (
          <span className="label-text-alt text-red-500">
            {errors.father_date_of_birth.message}
          </span>
        )}

        <p className="font-medium">Street Address</p>
        <input
          {...register('father_street_address')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_street_address && (
          <span className="label-text-alt text-red-500">
            {errors.father_street_address.message}
          </span>
        )}

        <p className="font-medium">City</p>
        <input
          {...register('father_city')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_city && (
          <span className="label-text-alt text-red-500">
            {errors.father_city.message}
          </span>
        )}

        <p className="font-medium">State</p>
        <input
          {...register('father_state')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_state && (
          <span className="label-text-alt text-red-500">
            {errors.father_state.message}
          </span>
        )}

        <p className="font-medium">Zip Code</p>
        <input
          {...register('father_zip_code')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_zip_code && (
          <span className="label-text-alt text-red-500">
            {errors.father_zip_code.message}
          </span>
        )}

        <p className="font-medium">Phone Number</p>
        <input
          {...register('father_primary_phone_numbers')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_primary_phone_numbers && (
          <span className="label-text-alt text-red-500">
            {errors.father_primary_phone_numbers.message}
          </span>
        )}

        <p className="font-medium">Will be/is involved in Baby's Life</p>
        {['Yes', 'No', 'Unsure'].map((status) => (
          <label key={status} className="flex items-center">
            <input
              {...register('father_involved_in_babys_life')}
              className="mr-2"
              type="radio"
              value={status}
            />
            {status}
          </label>
        ))}
        {errors.father_involved_in_babys_life && (
          <span className="label-text-alt text-red-500">
            {errors.father_involved_in_babys_life.message}
          </span>
        )}

        <p className="font-medium">Comments</p>
        <input
          {...register('father_involved_in_babys_life_comments')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_involved_in_babys_life_comments && (
          <span className="label-text-alt text-red-500">
            {errors.father_involved_in_babys_life_comments.message}
          </span>
        )}

        <p className="font-medium">Additional Notes</p>
        <textarea
          {...register('father_notes')}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        {errors.father_notes && (
          <span className="label-text-alt text-red-500">
            {errors.father_notes.message}
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
