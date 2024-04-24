import { useForm, useFieldArray } from "react-hook-form"
import { useMutation } from 'react-query'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"
import useAppStore from '../../store/useAppStore.ts';

const HouseholdMember = z.object({
    person: z.string().min(1, "Household member required"),
    date_of_birth: z.string().min(1, "Date of birth required"),
    relation: z.string().min(1, "Relation required")
});

const Child = z.object({
    name: z.string().min(1, "Child name required"),
    date_of_birth: z.string().min(1, "Date of birth required"),
    caregiver: z.string().min(1, "Caregiver name required"),
    caregiver_number: z.string().min(1, "Caregiver number required"),
});

const FamilyAndSupportsInputs = z.object({
    people_living_in_home: z.array(HouseholdMember),
    clients_children_not_living_in_home: z.array(Child),
    notes: z.string().nullable(),
    current_support_system: z.string().min(1, "Current support system required"),
    strength_of_client_and_support_system: z.string().min(1, "Strengths required"),
    goals: z.string().min(1, "Goal(s) required")
});
type FamilyAndSupportsInputs = z.infer<typeof FamilyAndSupportsInputs>

const FamilyAndSupportsResponse = FamilyAndSupportsInputs.extend({
    id: z.string(),
    user_id: z.string()
})

export default function FamilyAndSupports() {

    const { user } = useAppStore();
    const user_id = user ? user.id : "";

    const navigate = useNavigate();

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<FamilyAndSupportsInputs>({
        resolver: zodResolver(FamilyAndSupportsInputs),
        defaultValues: {
            people_living_in_home: [{
                person: '',
                date_of_birth: '',
                relation: '',
            }],
            clients_children_not_living_in_home: [{
                name: '',
                date_of_birth: '',
                caregiver: '',
                caregiver_number: '',
            }],
            goals: '',
            current_support_system: '',
            notes: '',
        },
    });

    const { fields: householdMemberFields, append: appendHouseholdMember, remove: removeMember } = useFieldArray({
        control,
        name: 'people_living_in_home'
    });

    const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
        control,
        name: 'clients_children_not_living_in_home'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/get_family_and_supports/${user_id}`)
                const userData = response.data[response.data.length - 1];
                Object.keys(userData).forEach(key => {
                    if (key !== 'id' && key !== 'user_id') {
                        const formKey = key as keyof FamilyAndSupportsInputs;
                        setValue(formKey, userData[key]);
                    }
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const { mutate } = useMutation(async (data: FamilyAndSupportsInputs) => {

        const { data: responseData } = (await axios.post('http://127.0.0.1:5000/api/add_family_and_supports', { ...data, user_id: user_id }));
        FamilyAndSupportsResponse.parse(responseData);
        return responseData;
    }, {
        onSuccess: (responseData) => {
            alert("Family And Supports added successfully!");
            console.log("FamilyAndSupports data added successfully.", responseData);

            navigate('/dashboard');
        },
        onError: () => {
            alert("Error while adding FamilyAndSupports data.");
        }
    })

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4">
                <p className="font-semibold text-red-700">Complete with Recovery Coach or Social Worker</p>
                <div className="w-full h-px bg-gray-300"></div>

                <p className="font-medium text-xl">Current Living Arrangement</p>
                {householdMemberFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-6">
                        <p className="font-medium">Household Member Name</p>
                        <input {...register(`people_living_in_home.${index}.person`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.people_living_in_home && errors.people_living_in_home[index]?.person && (
                            <span className="label-text-alt text-red-500">{errors.people_living_in_home[index]?.person?.message}</span>)}

                        <p className="font-medium">Date of Birth</p>
                        <input {...register(`people_living_in_home.${index}.date_of_birth`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.people_living_in_home && errors.people_living_in_home[index]?.date_of_birth && (
                            <span className="label-text-alt text-red-500">{errors.people_living_in_home[index]?.date_of_birth?.message}</span>)}

                        <p className="font-medium">Relation</p>
                        <input {...register(`people_living_in_home.${index}.relation`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.people_living_in_home && errors.people_living_in_home[index]?.relation && (
                            <span className="label-text-alt text-red-500">{errors.people_living_in_home[index]?.relation?.message}</span>)}

                        <div className="flex justify-end">
                            <button type="button" onClick={() => removeMember(index)} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Member</button>

                        </div>
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={() => appendHouseholdMember({ person: '', date_of_birth: '', relation: '' })} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Member</button>
                </div>

                <p className="font-medium text-xl">Client's Children NOT Living in the home</p>
                {childrenFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-6">
                        <p className="font-medium">Child</p>
                        <input {...register(`clients_children_not_living_in_home.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.clients_children_not_living_in_home && errors.clients_children_not_living_in_home[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.clients_children_not_living_in_home[index]?.name?.message}</span>)}

                        <p className="font-medium">Date of Birth</p>
                        <input {...register(`clients_children_not_living_in_home.${index}.date_of_birth`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.clients_children_not_living_in_home && errors.clients_children_not_living_in_home[index]?.date_of_birth && (
                            <span className="label-text-alt text-red-500">{errors.clients_children_not_living_in_home[index]?.date_of_birth?.message}</span>)}

                        <p className="font-medium">Caregiver Name</p>
                        <input {...register(`clients_children_not_living_in_home.${index}.caregiver`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.clients_children_not_living_in_home && errors.clients_children_not_living_in_home[index]?.caregiver && (
                            <span className="label-text-alt text-red-500">{errors.clients_children_not_living_in_home[index]?.caregiver?.message}</span>)}

                        <p className="font-medium">Caregiver Phone Number</p>
                        <input {...register(`clients_children_not_living_in_home.${index}.caregiver_number`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.clients_children_not_living_in_home && errors.clients_children_not_living_in_home[index]?.caregiver_number && (
                            <span className="label-text-alt text-red-500">{errors.clients_children_not_living_in_home[index]?.caregiver_number?.message}</span>)}

                        <div className="flex justify-end">
                            <button type="button" onClick={() => removeChild(index)} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Child</button>
                        </div>
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={() => appendChild({ name: '', date_of_birth: '', caregiver: '', caregiver_number: '' })} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Another Child</button>
                </div>

                <p className="font-medium text-xl">Notes</p>
                <textarea {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.notes && <span className="label-text-alt text-red-500">{errors.notes.message}</span>}

                <p className="font-medium text-xl">Current Support System</p>
                <textarea {...register("current_support_system")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.current_support_system && <span className="label-text-alt text-red-500">{errors.current_support_system.message}</span>}

                <p className="font-medium text-xl">Strengths of Client and Support System</p>
                <textarea {...register("strength_of_client_and_support_system")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.strength_of_client_and_support_system && <span className="label-text-alt text-red-500">{errors.strength_of_client_and_support_system.message}</span>}

                <p className="font-medium text-xl">Goals (Parenting, Breastfeeding, Recovery, Etc.)</p>
                <textarea {...register("goals")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.goals && <span className="label-text-alt text-red-500">{errors.goals.message}</span>}

                <div className="flex justify-center py-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}