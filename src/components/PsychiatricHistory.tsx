import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from 'react-query'
import axios from 'axios'

const diagnosesSchema = z.object({
    diagnosis: z.string().min(1, "Diagnosis is required"),
    provider: z.string().min(1, "Provider is required"),
    phone_number: z.string().min(1, "Phone number is required"),
    date_of_diagnosis: z.string().min(1, "Date of diagnosis is required"),
    taking_medication: z.string().min(1, "This field is required"),
});

export const PsychiatricHistoryInputsSchema = z.object({
    diagnoses: z.array(diagnosesSchema),
    notes: z.string().min(1, "Notes is required"),
    obgyn: z.string().min(1, "OB/GYN or Primary Care Provider is required"),
});
export type PsychiatricHistoryInputsType = z.infer<typeof PsychiatricHistoryInputsSchema>

const PsychiatricHistoryResponseSchema = PsychiatricHistoryInputsSchema.extend({
    id: z.string(),
    user_id: z.string()
});

export default function PsychiatricHistory() {
    const { register, handleSubmit, control, formState: { errors } } = useForm<PsychiatricHistoryInputsType>({
        resolver: zodResolver(PsychiatricHistoryInputsSchema),
        defaultValues: {
            diagnoses: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'diagnoses'
    })

    const removeLastDiagnoses = () => {
        if (fields.length > 0) {
            remove(fields.length - 1);
        }
    }

    const addNewDiagnoses = () => {
        append({
            diagnosis: '',
            provider: '',
            phone_number: '',
            date_of_diagnosis: '',
            taking_medication: '',
        })
    };

    const { mutate } = useMutation(async (data: PsychiatricHistoryInputsType) => {
        const { data: responseData } = (await axios.post('http://127.0.0.1:5000/api/add_psychiatric_history', { ...data, user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12" }));

        PsychiatricHistoryResponseSchema.parse(responseData);

        return responseData;
    }, {
        onSuccess: (responseData) => {
            console.log("PsychiatricHistory data added successfully", responseData);
        },
        onError: () => {
            alert("Error while adding PsychiatricHistory data.");
        }
    });

    return (
        <div className="flex  justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <p className="font-medium pt-6">Diagnosis</p>
                        <input {...register(`diagnoses.${index}.diagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.diagnoses && errors.diagnoses[index]?.diagnosis && (
                            <span className="label-text-alt text-red-500">{errors.diagnoses[index]?.diagnosis?.message}</span>
                        )}

                        <p className="font-medium pt-6">Provider</p>
                        <input {...register(`diagnoses.${index}.provider`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.diagnoses && errors.diagnoses[index]?.provider && (
                            <span className="label-text-alt text-red-500">{errors.diagnoses[index]?.provider?.message}</span>
                        )}

                        <p className="font-medium pt-6">Phone Number</p>
                        <input {...register(`diagnoses.${index}.phone_number`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.diagnoses && errors.diagnoses[index]?.phone_number && (
                            <span className="label-text-alt text-red-500">{errors.diagnoses[index]?.phone_number?.message}</span>
                        )}

                        <p className="font-medium">Date of Diagnosis</p>
                        <input {...register(`diagnoses.${index}.date_of_diagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.diagnoses && errors.diagnoses[index]?.date_of_diagnosis && (
                            <span className="label-text-alt text-red-500">{errors.diagnoses[index]?.date_of_diagnosis?.message}</span>
                        )}

                        <p className="font-medium pt-6">Are You Currently Taking Medicine for this Diagnosis?</p>
                        <div className="flex flex-col space-y-2">
                            {["Yes", "No"].map((status, idx) => (
                                <label key={idx} className="inline-flex items-center">
                                    <input {...register(`diagnoses.${index}.taking_medication`)} type="radio" value={status} className="form-radio" />
                                    <span className="ml-2">{status}</span>
                                </label>))}
                        </div>
                        {errors.diagnoses && errors.diagnoses[index]?.taking_medication && (
                            <span className="label-text-alt text-red-500">{errors.diagnoses[index]?.taking_medication?.message}</span>
                        )}

                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewDiagnoses} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Diagnosis</button>
                    <button type="button" onClick={removeLastDiagnoses} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Diagnosis</button>
                </div>

                <p className="font-medium">Notes</p>
                <input {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.notes && <span className="label-text-alt text-red-500">{errors.notes.message}</span>}

                <p className="font-medium whitespace-nowrap">OB/GYN, Primary Care Provider, or Mental Health Provider Name</p>
                <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.obgyn && <span className="label-text-alt text-red-500">{errors.obgyn.message}</span>}


                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>

            </form>
        </div>
    )
}