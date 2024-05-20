import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query'
import axios from 'axios'
import { useEffect, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';

const displayNames: Record<string, string> = {
    parenting_classes: "Parenting Classes",
    transportation_services: "Transportation Services",
    ssi_disability: "SSI/Disability",
    temporary_assistance_for_needy_families: "Temporary Assistance for Needy Families (TANF)",
    personal_safety: "Personal Safety",
    home_visitation_program: "Home Visitation Program",
    housing_assistance: "Housing Assistance",
    healthy_start_program: "Healthy Start Program",
    breastfeeding_support: "Breastfeeding Support",
    local_food_pantries: "Local Food Pantries",
    snap: "SNAP",
    women_infants_children: "Women, Infants, & Children (WIC)",
    health_insurance_enrollment: "Health Insurance Enrollment",
    prenatal_healthcare: "Prenatal Healthcare",
    family_planning: "Family Planning",
    primary_care: "Primary Care",
    mental_health_counseling: "Mental Health/Counseling",
    smoking_cessation: "Smoking Cessation",
    residential: "Residential",
    outpatient: "Outpatient",
    caring_for_two_program: "Caring for Two Program",
    the_cradles_program: "The Cradles Program",
    recovery_support_services: "Recovery Support Services",
    medication_assisted_treatment: "Medication-Assisted Treatment (MAT)",
    early_childhood_intervention: "Early Childhood Intervention",
    early_head_start: "Early Head Start",
    NCI_childcare_subsidy: "NCI Childcare Subsidy",
    pediatrician_primary_care: "Pediatrician/Primary Care",
    safe_sleep_education: "Safe Sleep Education",
    child_protective_service: "Child Protective Service",
    legal_aid: "Legal Aid",
    specialty_court: "Specialty Court",
    additional_notes: "Additional Notes",
};

const ServiceSchema = z.object({
    service_status: z.string().min(1, "Service status required"),
    organization: z.string().min(1, "Organization required"),
    organization_contact_information: z.string().min(1, "Organization contact info required")
})
export type IService = z.infer<typeof ServiceSchema>

const AdditionalServiceSchema = z.object({
    name: z.string().min(1, "Service name required"),
    service_status: z.string().min(1, "Service status required"),
    organization: z.string().min(1, "Organization required"),
    organization_contact_information: z.string().min(1, "Organization contact info required")
});
export type IAdditionalService = z.infer<typeof AdditionalServiceSchema>

const ReferralsAndServicesInputsSchema = z.object({
    parenting_classes: ServiceSchema,
    transportation_services: ServiceSchema,
    ssi_disability: ServiceSchema,
    temporary_assistance_for_needy_families: ServiceSchema,
    personal_safety: ServiceSchema,
    home_visitation_program: ServiceSchema,
    housing_assistance: ServiceSchema,
    healthy_start_program: ServiceSchema,
    support_services_other: z.array(AdditionalServiceSchema),
    breastfeeding_support: ServiceSchema,
    local_food_pantries: ServiceSchema,
    snap: ServiceSchema,
    women_infants_children: ServiceSchema,
    food_nutrition_other: z.array(AdditionalServiceSchema),
    health_insurance_enrollment: ServiceSchema,
    prenatal_healthcare: ServiceSchema,
    family_planning: ServiceSchema,
    primary_care: ServiceSchema,
    mental_health_counseling: ServiceSchema,
    smoking_cessation: ServiceSchema,
    healthcare_other: z.array(AdditionalServiceSchema),
    residential: ServiceSchema,
    outpatient: ServiceSchema,
    caring_for_two_program: ServiceSchema,
    the_cradles_program: ServiceSchema,
    recovery_support_services: ServiceSchema,
    medication_assisted_treatment: ServiceSchema,
    substance_use_treatment_other: z.array(AdditionalServiceSchema),
    early_childhood_intervention: ServiceSchema,
    early_head_start: ServiceSchema,
    NCI_childcare_subsidy: ServiceSchema,
    pediatrician_primary_care: ServiceSchema,
    safe_sleep_education: ServiceSchema,
    child_related_other: z.array(AdditionalServiceSchema),
    child_protective_service: ServiceSchema,
    legal_aid: ServiceSchema,
    specialty_court: ServiceSchema,
    legal_assistance_other: z.array(AdditionalServiceSchema),
    additional_notes: z.string(),
});
type IReferralsAndServicesInputs = z.infer<typeof ReferralsAndServicesInputsSchema>

const ReferralsAndServicesResponseSchema = ReferralsAndServicesInputsSchema.extend({
    id: z.string(),
    user_id: z.string()
});

export default function ReferralsAndServices() {
    const navigate = useNavigate();
    const { submissionId } = useParams();

    const user = useAppStore((state) => state.user);
    const access_token = useAppStore((state) => state.access_token);

    const headers = useMemo(() => ({
        "Authorization": "Bearer " + access_token,
        "userId": user?.id,
    }), [access_token, user?.id]);

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<IReferralsAndServicesInputs>({
        resolver: zodResolver(ReferralsAndServicesInputsSchema)
    });

    const { fields: supportServicesOtherFields, append: appendSupportServicesOther, remove: removeSupportServicesOther } = useFieldArray({
        control,
        name: 'support_services_other',
    });

    const { fields: foodNutritionOtherFields, append: appendFoodNutritionOther, remove: removeFoodNutritionOther } = useFieldArray({
        control,
        name: 'food_nutrition_other',
    });

    const { fields: healthcareOtherFields, append: appendHealthcareOther, remove: removeHealthcareOther } = useFieldArray({
        control,
        name: 'healthcare_other',
    });

    const { fields: substanceUseTreatmentOtherFields, append: appendSubstanceUseTreatmentOther, remove: removeSubstanceUseTreatmentOther } = useFieldArray({
        control,
        name: 'substance_use_treatment_other',
    });

    const { fields: childRelatedOtherFields, append: appendChildRelatedOther, remove: removeChildRelatedOther } = useFieldArray({
        control,
        name: 'child_related_other',
    });

    const { fields: legalAssistanceOtherFields, append: appendLegalAssistanceOther, remove: removeLegalAssistanceOther } = useFieldArray({
        control,
        name: 'legal_assistance_other',
    });

    const addNewSupportService = () => appendSupportServicesOther({ service_status: '', organization: '', organization_contact_information: '', name: '' });

    const addNewFoodService = () => appendFoodNutritionOther({ service_status: '', organization: '', organization_contact_information: '', name: ''})

    const addNewHealthcareService = () => appendHealthcareOther({ service_status: '', organization: '', organization_contact_information: '', name: ''});

    const addNewSubstanceUseTreatmentService = () => appendSubstanceUseTreatmentOther({ service_status: '', organization: '', organization_contact_information: '', name: ''});

    const addNewChildRelatedService = () => appendChildRelatedOther({ service_status: '', organization: '', organization_contact_information: '', name: '' });

    const addNewLegalAssistanceService = () => appendLegalAssistanceOther({ service_status: '', organization: '', organization_contact_information: '', name: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (submissionId) {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:5000/api/get_referrals_and_services/${submissionId}`,
                        { headers: { ...headers } }
                    )
                    const pastResponseData = response.data;

                    ReferralsAndServicesResponseSchema.parse(pastResponseData);

                    Object.keys(pastResponseData).forEach(key => {
                        if(key === 'id' || key === 'user_id') return;
                        
                        const formKey = key as keyof IReferralsAndServicesInputs;
                        setValue(formKey, pastResponseData[key]);
                    });
                } catch (error) {
                    alert("Something went wrong!");
                    
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, [submissionId, headers, setValue]);

    const { mutate } = useMutation(async (data: IReferralsAndServicesInputs) => {
        let responseData;
        let method;
        if (submissionId) {
            responseData = await axios.put(
                `http://127.0.0.1:5000/api/update_referrals_and_services/${submissionId}`,
                { ...data },
                { headers: { ...headers } }
            );
            method = "updated";
        } else {
            responseData = await axios.post(
                'http://127.0.0.1:5000/api/add_referrals_and_services',
                { ...data },
                { headers: { ...headers } }
            );
            method = "added";
        }

        const userData = responseData.data;
        ReferralsAndServicesResponseSchema.parse(userData);

        return { userData, method };
    }, {
        onSuccess: (data) => {
            const { userData, method } = data;
            
            alert(`Referrals and Services ${method} successfully!`);
            console.log(`ReferralsAndServices data ${method} successfully.`, userData);
            
            navigate('/dashboard');
        },
        onError: () => {
            alert("Error while adding/updating ReferralsAndServices data.");
        }
    })

    const generateFormFields = (keys: string[], errors: FieldErrors<IReferralsAndServicesInputs>) => {
        return keys.map((key, index) => (
            <div key={index}>
                <p className="font-medium text-xl pt-6">{displayNames[key]}</p>
                <p className="font-medium pt-2">Status</p>
                <div className="flex flex-col space y-2">
                    {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                        <label key={status} className="inline-flex items-center pt-2">
                            <input
                                {...register(`${key}.service_status` as keyof IReferralsAndServicesInputs)}
                                type="radio"
                                value={status}
                                className="form-radio"
                            />
                            <span className="ml-2">{status}</span>
                        </label>
                    ))}
                </div>
                { /* @ts-expect-error: Overriding ts checks */ }
                {errors[key]?.service_status && <span className="label-text-alt text-red-500">{errors[key]?.service_status.message}</span>}

                <p className="font-medium pt-6">Organization</p>
                <input
                    {...register(`${key}.organization` as keyof IReferralsAndServicesInputs)}
                    className="border border-gray-300 px-4 py-2 rounded-md w-full"
                />
                { /* @ts-expect-error: Overriding ts checks */ }
                {errors[key]?.organization && <span className="label-text-alt text-red-500">{errors[key]?.organization.message}</span>}
                <p className="font-medium pt-6">Organization Contact Information</p>
                <input
                    {...register(`${key}.organization_contact_information` as keyof IReferralsAndServicesInputs)}
                    className="border border-gray-300 px-4 py-2 rounded-md w-full"
                />
                { /* @ts-expect-error: Overriding ts checks */ }
                {errors[key]?.organization_contact_information && <span className="label-text-alt text-red-500">{errors[key]?.organization_contact_information.message}</span>}
            </div>
        ));
    };

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">

                <p className="font-semibold text-red-700">Complete with: Recovery Coach or Social Worker</p>
                <div className="w-full h-px bg-gray-300"></div>

                <p className="font-medium text-xl pt-6">SUPPORT SERVICES</p>
                {generateFormFields(Object.keys(displayNames).slice(0, 8), errors)}

                <p className="font-medium text-xl pt-6">Additional Support Services</p>
                {supportServicesOtherFields.map((field, index) => (
                    <div key={field.id}>
                        <div className="flex justify-between items-center pb-4">
                            <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
                            <button type="button" onClick={() => removeSupportServicesOther(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Service</button>
                        </div>
                        <input {...register(`support_services_other.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.support_services_other && errors.support_services_other[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.support_services_other[index]?.name?.message}</span>)}

                        <p className="font-medium pt-6">Status {index + 1}</p>
                        <div className="flex flex-col space y-2">
                            {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input
                                        {...register(`support_services_other.${index}.service_status`)}
                                        type="radio"
                                        value={status}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">{status}</span>
                                </label>
                            ))}
                        </div>
                        {errors.support_services_other && errors.support_services_other[index]?.service_status && (
                            <span className="label-text-alt text-red-500">{errors.support_services_other[index]?.service_status?.message}</span>)}

                        <p className="font-medium py-6">Organization {index + 1}</p>
                        <input {...register(`support_services_other.${index}.organization`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.support_services_other && errors.support_services_other[index]?.organization && (
                            <span className="label-text-alt text-red-500">{errors.support_services_other[index]?.organization?.message}</span>)}

                        <p className="font-medium p-6">Organization Contact Information {index + 1}</p>
                        <input {...register(`support_services_other.${index}.organization_contact_information`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.support_services_other && errors.support_services_other[index]?.organization_contact_information && (
                            <span className="label-text-alt text-red-500">{errors.support_services_other[index]?.organization_contact_information?.message}</span>)}
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewSupportService} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Service</button>
                </div>

                <p className="font-medium text-xl pt-6">Food/Nutrition SERVICES</p>
                {generateFormFields(Object.keys(displayNames).slice(8, 13), errors)}

                <p className="font-medium text-xl pt-6">Additional Food/Nutrition Services</p>
                {foodNutritionOtherFields.map((field, index) => (
                    <div key={field.id}>
                        <div className="flex justify-between items-center">
                            <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
                            <button type="button" onClick={() => removeFoodNutritionOther(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Service</button>
                        </div>
                        <input {...register(`food_nutrition_other.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.food_nutrition_other && errors.food_nutrition_other[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.food_nutrition_other[index]?.name?.message}</span>)}

                        <p className="font-medium pt-6">Status {index + 1}</p>
                        <div className="flex flex-col space y-2">
                            {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input
                                        {...register(`food_nutrition_other.${index}.service_status`)}
                                        type="radio"
                                        value={status}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">{status}</span>
                                </label>
                            ))}
                        </div>
                        {errors.food_nutrition_other && errors.food_nutrition_other[index]?.service_status && (
                            <span className="label-text-alt text-red-500">{errors.food_nutrition_other[index]?.service_status?.message}</span>)}

                        <p className="font-medium pt-6">Organization {index + 1}</p>
                        <input {...register(`food_nutrition_other.${index}.organization`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.food_nutrition_other && errors.food_nutrition_other[index]?.organization && (
                            <span className="label-text-alt text-red-500">{errors.food_nutrition_other[index]?.organization?.message}</span>)}

                        <p className="font-medium pt-6">Organization Contact Information {index + 1}</p>
                        <input {...register(`food_nutrition_other.${index}.organization_contact_information`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.food_nutrition_other && errors.food_nutrition_other[index]?.organization_contact_information && (
                            <span className="label-text-alt text-red-500">{errors.food_nutrition_other[index]?.organization_contact_information?.message}</span>)}
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewFoodService} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Service</button>
                </div>

                <p className="font-medium text-xl pt-6">HEALTHCARE SERVICES</p>
                {generateFormFields(Object.keys(displayNames).slice(13, 18), errors)}

                <p className="font-medium text-xl pt-6">Additional Healthcare Services</p>
                {healthcareOtherFields.map((field, index) => (
                    <div key={field.id}>
                        <div className="flex justify-between items-center py-6">
                            <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
                            <button type="button" onClick={() => removeHealthcareOther(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Service</button>
                        </div>
                        <input {...register(`healthcare_other.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.healthcare_other && errors.healthcare_other[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.healthcare_other[index]?.name?.message}</span>)}

                        <p className="font-medium pt-6">Status {index + 1}</p>
                        <div className="flex flex-col space y-2">
                            {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input
                                        {...register(`healthcare_other.${index}.service_status`)}
                                        type="radio"
                                        value={status}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">{status}</span>
                                </label>
                            ))}
                        </div>
                        {errors.healthcare_other && errors.healthcare_other[index]?.service_status && (
                            <span className="label-text-alt text-red-500">{errors.healthcare_other[index]?.service_status?.message}</span>)}

                        <p className="font-medium pt-6">Organization {index + 1}</p>
                        <input {...register(`healthcare_other.${index}.organization`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.healthcare_other && errors.healthcare_other[index]?.organization && (
                            <span className="label-text-alt text-red-500">{errors.healthcare_other[index]?.organization?.message}</span>)}

                        <p className="font-medium pt-6">Organization Contact Information {index + 1}</p>
                        <input {...register(`healthcare_other.${index}.organization_contact_information`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.healthcare_other && errors.healthcare_other[index]?.organization_contact_information && (
                            <span className="label-text-alt text-red-500">{errors.healthcare_other[index]?.organization_contact_information?.message}</span>)}
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewHealthcareService} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Service</button>
                </div>

                <p className="font-medium text-xl pt-6">SUBSTANCE USE TREATMENT SERVICES</p>
                {generateFormFields(Object.keys(displayNames).slice(18, 24), errors)}

                <p className="font-medium text-xl pt-6">Additional Substance Use Treatment Services</p>
                {substanceUseTreatmentOtherFields.map((field, index) => (
                    <div key={field.id}>
                        <div className="flex justify-between items-center py-6">
                            <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
                            <button type="button" onClick={() => removeSubstanceUseTreatmentOther(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Service</button>
                        </div>
                        <input {...register(`substance_use_treatment_other.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.substance_use_treatment_other && errors.substance_use_treatment_other[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.substance_use_treatment_other[index]?.name?.message}</span>)}

                        <p className="font-medium pt-6">Status {index + 1}</p>
                        <div className="flex flex-col space y-2">
                            {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input {...register(`substance_use_treatment_other.${index}.service_status`)} type="radio" value={status} className="form-radio" />
                                    <span className="ml-2">{status}</span>
                                </label>))}
                        </div>
                        {errors.substance_use_treatment_other && errors.substance_use_treatment_other[index]?.service_status && (
                            <span className="label-text-alt text-red-500">{errors.substance_use_treatment_other[index]?.service_status?.message}</span>)}

                        <p className="font-medium pt-6">Organization {index + 1}</p>
                        <input {...register(`substance_use_treatment_other.${index}.organization`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.substance_use_treatment_other && errors.substance_use_treatment_other[index]?.organization && (
                            <span className="label-text-alt text-red-500">{errors.substance_use_treatment_other[index]?.organization?.message}</span>)}

                        <p className="font-medium pt-6">Organization Contact Information {index + 1}</p>
                        <input {...register(`substance_use_treatment_other.${index}.organization_contact_information`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.substance_use_treatment_other && errors.substance_use_treatment_other[index]?.organization_contact_information && (
                            <span className="label-text-alt text-red-500">{errors.substance_use_treatment_other[index]?.organization_contact_information?.message}</span>)}

                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewSubstanceUseTreatmentService} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Service</button>
                </div>

                <p className="font-medium text-xl pt-6">CHILD RELATED SERVICES</p>
                {generateFormFields(Object.keys(displayNames).slice(24, 29), errors)}

                <p className="font-medium text-xl pt-6">Additional Child Related Services</p>
                {childRelatedOtherFields.map((field, index) => (
                    <div key={field.id}>
                        <div className="flex justify-between items-center py-6">
                            <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
                            <button type="button" onClick={() => removeChildRelatedOther(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Service</button>
                        </div>
                        <input {...register(`child_related_other.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.child_related_other && errors.child_related_other[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.child_related_other[index]?.name?.message}</span>)}

                        <p className="font-medium pt-6">Status {index + 1}</p>
                        <div className="flex flex-col space y-2">
                            {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input
                                        {...register(`child_related_other.${index}.service_status`)}
                                        type="radio"
                                        value={status}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">{status}</span>
                                </label>
                            ))}
                        </div>                        {errors.child_related_other && errors.child_related_other[index]?.service_status && (
                            <span className="label-text-alt text-red-500">{errors.child_related_other[index]?.service_status?.message}</span>)}

                        <p className="font-medium pt-6">Organization {index + 1}</p>
                        <input {...register(`child_related_other.${index}.organization`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.child_related_other && errors.child_related_other[index]?.organization && (
                            <span className="label-text-alt text-red-500">{errors.child_related_other[index]?.organization?.message}</span>)}

                        <p className="font-medium pt-6">Organization Contact Information {index + 1}</p>
                        <input {...register(`child_related_other.${index}.organization_contact_information`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.child_related_other && errors.child_related_other[index]?.organization_contact_information && (
                            <span className="label-text-alt text-red-500">{errors.child_related_other[index]?.organization_contact_information?.message}</span>)}
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewChildRelatedService} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Service</button>
                </div>

                <p className="font-medium text-xl pt-6">LEGAL ASSISTANCE SERVICES</p>
                {generateFormFields(Object.keys(displayNames).slice(29, 32), errors)}

                <p className="font-medium text-xl pt-6">Additional Legal Assistance Services</p>
                {legalAssistanceOtherFields.map((field, index) => (
                    <div key={field.id}>
                        <div className="flex justify-between items-center py-6">
                            <p className="font-medium pb-2 pt-8">Name {index + 1}</p>
                            <button type="button" onClick={() => removeLegalAssistanceOther(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Service</button>
                        </div>
                        <input {...register(`legal_assistance_other.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.legal_assistance_other && errors.legal_assistance_other[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.legal_assistance_other[index]?.name?.message}</span>)}

                        <p className="font-medium pt-6">Status {index + 1}</p>
                        <div className="flex flex-col space y-2">
                            {["Discussed", "Needed", "Referred", "Participating", "Completed"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input
                                        {...register(`legal_assistance_other.${index}.service_status`)}
                                        type="radio"
                                        value={status}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">{status}</span>
                                </label>
                            ))}
                        </div>
                        {errors.legal_assistance_other && errors.legal_assistance_other[index]?.service_status && (
                            <span className="label-text-alt text-red-500">{errors.legal_assistance_other[index]?.service_status?.message}</span>)}

                        <p className="font-medium pt-6">Organization {index + 1}</p>
                        <input {...register(`legal_assistance_other.${index}.organization`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.legal_assistance_other && errors.legal_assistance_other[index]?.organization && (
                            <span className="label-text-alt text-red-500">{errors.legal_assistance_other[index]?.organization?.message}</span>)}

                        <p className="font-medium pt-6">Organization Contact Information {index + 1}</p>
                        <input {...register(`legal_assistance_other.${index}.organization_contact_information`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.legal_assistance_other && errors.legal_assistance_other[index]?.organization_contact_information && (
                            <span className="label-text-alt text-red-500">{errors.legal_assistance_other[index]?.organization_contact_information?.message}</span>)}
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewLegalAssistanceService} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Service</button>
                </div>

                <p className="font-medium text-xl pt-6">Additional Notes</p>
                <textarea {...register("additional_notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>
        </div >
    );
}