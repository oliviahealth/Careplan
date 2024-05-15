import { useForm, useFieldArray } from "react-hook-form"
import { useMutation } from 'react-query'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom";
import useAppStore from "../../store/useAppStore";


const CaregiverSchema = z.object({
    name: z.string().min(1, "Name required"),
    contact_number: z.string().min(1, "Contact number required"),
    relationship: z.string().min(1, "Relationship required")
});
export type ICaregiver = z.infer<typeof CaregiverSchema>

const RelapsePreventionPlanInputSchema = z.object({
    three_things_that_trigger_desire_to_use: z.string().min(1, "3 things that trigger desire required"),
    three_skills_you_enjoy: z.string().min(1, "3 enjoyable activities required"),
    three_people_to_talk_to: z.string().min(1, "3 people to talk to required"),
    safe_caregivers: z.array(CaregiverSchema),
    have_naloxone: z.string().min(1, "Field required"),
    comments: z.string().nullable(),
});
type IRelapsePreventionPlanInput = z.infer<typeof RelapsePreventionPlanInputSchema>

const RelapsePreventionPlanResponseSchema = RelapsePreventionPlanInputSchema.extend({
    id: z.string(),
    user_id: z.string()
});

export default function RelapsePreventionPlan() {
    const navigate = useNavigate();
    const { submissionId } = useParams();

    const user = useAppStore((state) => state.user);
    const access_token = useAppStore((state) => state.access_token);

    const headers = useMemo(() => ({
        "Authorization": "Bearer " + access_token,
        "userId": user?.id,
    }), [access_token, user?.id]);

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<IRelapsePreventionPlanInput>({
        resolver: zodResolver(RelapsePreventionPlanInputSchema),
        defaultValues: {
            safe_caregivers: [{
                name: '',
                contact_number: '',
                relationship: '',
            }],
            have_naloxone: ''
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'safe_caregivers'
    })

    const addAnotherCaregiver = () => append({ name: '', contact_number: '', relationship: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (submissionId) {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:5000/api/get_relapse_prevention_plan/${submissionId}`,
                        { headers: { ...headers } }
                    );
                    const pastResponseData = response.data;

                    RelapsePreventionPlanResponseSchema.parse(pastResponseData);

                    Object.keys(pastResponseData).forEach(key => {
                        if(key === 'id' || key === 'user_id') return;
                        
                        const formKey = key as keyof IRelapsePreventionPlanInput;
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

    const { mutate } = useMutation(async (data: IRelapsePreventionPlanInput) => {
        let responseData;
        let method;
        if (submissionId) {
            responseData = await axios.put(
                `http://127.0.0.1:5000/api/update_relapse_prevention_plan/${submissionId}`,
                { ...data },
                { headers: { ...headers } }
            );
            method = "updated";
        } else {
            responseData = await axios.post(
                'http://127.0.0.1:5000/api/add_relapse_prevention_plan',
                { ...data },
                { headers: { ...headers } }
            );
            method = "added";
        }

        const userData = responseData.data;
        RelapsePreventionPlanResponseSchema.parse(userData);
        
        return { userData, method };
    }, {
        onSuccess: (data) => {
            const { userData, method } = data;
            
            alert(`Relapse Prevention Plan ${method} successfully!`);
            console.log(`RelapsePreventionPlan data ${method} successfully.`, userData);
            
            navigate('/dashboard')
        },
        onError: () => {
            alert("Error while adding/updating RelapsePreventionPlan data.");
        }
    });

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                <p className="font-medium text-xl">Relapse Prevention Plan</p>

                <p className="font-semibold text-red-700">Complete with: Recovery Coach or Social Worker</p>
                <div className="w-full h-px bg-gray-300"></div>

                <p className="font-medium">List 3 things you know trigger your desire to use:</p>
                <textarea {...register("three_things_that_trigger_desire_to_use")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.three_things_that_trigger_desire_to_use && <span className="label-text-alt text-red-500">{errors.three_things_that_trigger_desire_to_use.message}</span>}

                <p className="font-medium">List 3 skills or things you enjoy doing that can help get your mind off using:</p>
                <textarea {...register("three_skills_you_enjoy")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.three_skills_you_enjoy && <span className="label-text-alt text-red-500">{errors.three_skills_you_enjoy.message}</span>}

                <p className="font-medium">List 3 people you can talk to if you are thinking about using:</p>
                <textarea {...register("three_people_to_talk_to")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.three_people_to_talk_to && <span className="label-text-alt text-red-500">{errors.three_people_to_talk_to.message}</span>}

                <p className="font-medium">In the case of a relapse, the patient's safe caregivers will be:</p>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="font-medium pb-2 pt-8">Safe Caregiver {index + 1}</p>
                            {index !== 0 && (
                                <button type="button" onClick={() => remove(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Caregiver</button>)}
                        </div>


                        <p className="font-medium">Name</p>
                        <input {...register(`safe_caregivers.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.safe_caregivers && errors.safe_caregivers[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.safe_caregivers[index]?.name?.message}</span>)}

                        <p className="font-medium">Contact Number</p>
                        <input {...register(`safe_caregivers.${index}.contact_number`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.safe_caregivers && errors.safe_caregivers[index]?.contact_number && (
                            <span className="label-text-alt text-red-500">{errors.safe_caregivers[index]?.contact_number?.message}</span>)}

                        <p className="font-medium">Relationship</p>
                        <input {...register(`safe_caregivers.${index}.relationship`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.safe_caregivers && errors.safe_caregivers[index]?.relationship && (
                            <span className="label-text-alt text-red-500">{errors.safe_caregivers[index]?.relationship?.message}</span>)}


                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addAnotherCaregiver} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Another Caregiver</button>
                </div>

                <p className="font-medium">Patient has Naloxone (opiod overdose reversal drug), and knows how to use it.</p>
                <div className="flex flex-col space-y-2">
                    {["Yes", "No"].map((status) => (
                        <label key={status} className="inline-flex items-center pt-2">
                            <input {...register("have_naloxone")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                    {errors.have_naloxone && <span className="label-text-alt text-red-500">{errors.have_naloxone.message}</span>}
                </div>

                <p className="font-medium">Comments</p>
                <textarea {...register("comments")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}