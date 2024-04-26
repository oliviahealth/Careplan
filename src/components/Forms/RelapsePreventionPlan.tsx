import { useForm, useFieldArray } from "react-hook-form"
import { useMutation } from 'react-query'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import useAppStore from "../../store/useAppStore";


const Caregiver = z.object({
    name: z.string().min(1, "Name required"),
    contact_number: z.string().min(1, "Contact number required"),
    relationship: z.string().min(1, "Relationship required")
});

const RelapsePreventionPlanInputs = z.object({
    three_things_that_trigger_desire_to_use: z.string().min(1, "3 things that trigger desire required"),
    three_skills_you_enjoy: z.string().min(1, "3 enjoyable activities required"),
    three_people_to_talk_to: z.string().min(1, "3 people to talk to required"),
    safe_caregivers: z.array(Caregiver),
    have_naloxone: z.string().min(1, "Field required"),
    comments: z.string().nullable(),
});
type RelapsePreventionPlanInputs = z.infer<typeof RelapsePreventionPlanInputs>

const RelapsePreventionPlanResponse = RelapsePreventionPlanInputs.extend({
    id: z.string(),
    user_id: z.string()
});

export default function RelapsePreventionPlan() {

    const { submissionId } = useParams();

    const { user } = useAppStore();
    const user_id = user ? user.id : "";

    const navigate = useNavigate();

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<RelapsePreventionPlanInputs>({
        resolver: zodResolver(RelapsePreventionPlanInputs),
        defaultValues: {
            safe_caregivers: [{
                name: '',
                contact_number: '',
                relationship: '',
            }],
            have_naloxone: ''
        },
    });

    console.log(errors);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'safe_caregivers'
    })

    const addAnotherCaregiver = () => {
        append({
            name: '',
            contact_number: '',
            relationship: '',
        })
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (submissionId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/get_relapse_prevention_plan/${user_id}/${submissionId}`)
                    const userData = response.data;
                    Object.keys(userData).forEach(key => {
                        if (key !== 'id' && key !== 'user_id') {
                            const formKey = key as keyof RelapsePreventionPlanInputs;
                            setValue(formKey, userData[key]);
                        }
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, [submissionId]);

    const { mutate } = useMutation(async (data: RelapsePreventionPlanInputs) => {
        let responseData;
        let method;
        if (submissionId) {
            responseData = await axios.put(`http://127.0.0.1:5000/api/update_relapse_prevention_plan/${submissionId}`, { ...data, user_id: user_id });
            method = "updated";
        } else {
            responseData = await axios.post('http://127.0.0.1:5000/api/add_relapse_prevention_plan', { ...data, user_id: user_id });
            method = "added";
        }

        const userData = responseData.data;
        RelapsePreventionPlanResponse.parse(userData);
        console.log(userData);
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
                    <div key={field.id} className="space-y-6">
                        <p className="font-medium pb-4 pt-6">Safe Caregiver {index + 1}</p>

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

                        <div className="flex justify-end">
                            <button type="button" onClick={() => remove(index)} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 1}>- Remove Caregiver</button>
                        </div>
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