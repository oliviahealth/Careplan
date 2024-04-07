import { useForm, useFieldArray } from "react-hook-form";
// import { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query'
import axios from 'axios'

const DrugInfo = z.object({
    ever_used: z.string().min(1, 'Field required'),
    used_during_pregnancy: z.string().min(1, 'Field required'),
    date_last_used: z.string().min(1, 'Date required'),
    notes: z.string().min(1, 'Notes required')
})

type DrugNames = 'alcohol' | 'benzodiazepines' | 'cocaine' | 'heroin' | 'kush' | 'marijuana' | 'methamphetamine' | 'prescription_drugs' | 'tobacco';

type DrugFields = {
    [K in DrugNames]: typeof DrugInfo;
}

const DrugFields: DrugFields = {
    alcohol: DrugInfo,
    benzodiazepines: DrugInfo,
    cocaine: DrugInfo,
    heroin: DrugInfo,
    kush: DrugInfo,
    marijuana: DrugInfo,
    methamphetamine: DrugInfo,
    prescription_drugs: DrugInfo,
    tobacco: DrugInfo
};

const AdditionalDrugs = z.object({
    drug: z.string().min(1, 'Substance name required'),
    pregnancy: z.string().min(1, 'Field required'),
    date: z.string().min(1, 'Date required'),
    notes: z.string().min(1, 'Notes required')
});
type AdditionalDrugs = z.infer<typeof AdditionalDrugs>

const SubstanceUseHistoryInputs = z.object({
    substances: z.object(DrugFields),
    additionalDrugs: z.array(AdditionalDrugs),
    notes: z.string().min(1, 'Additional Notes Required'),
    treatment_case_manager: z.string().min(1, 'Treatment case manager required')
})
export type SubstanceUseHistoryInputsType = z.infer<typeof SubstanceUseHistoryInputs>

// const SubstanceUseHistoryReponse = SubstanceUseHistoryInputs.extend({
//     id: z.string(),
//     user_id: z.string()
// });

export default function SubstanceUseHistory() {

    const navigate = useNavigate();

    const { register, control, handleSubmit, formState: { errors } } = useForm<SubstanceUseHistoryInputsType>({

        resolver: zodResolver(SubstanceUseHistoryInputs),
        defaultValues: {
            substances: Object.fromEntries(
                Object.keys(DrugFields).map(drug => [drug, { date_last_used: "", ever_used: "", notes: "", used_during_pregnancy: "" }])
            ),
            additionalDrugs: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'additionalDrugs'
    });

    const { mutate } = useMutation(async (data: SubstanceUseHistoryInputsType) => {

        const transformedData = {
            ...data.substances,
            ...data.additionalDrugs.reduce<{ [key: string]: AdditionalDrugs }>((acc, curr, index) => {
                acc[`other${index + 1}`] = curr;
                return acc;
            }, {}),
            notes: data.notes,
            treatment_case_manager: data.treatment_case_manager,
            user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12"
        };

        console.log(transformedData)


        const { data: responseData } = (await axios.post('http://127.0.0.1:5000/api/add_substance_use_history', transformedData));
        // SubstanceUseHistoryReponse.parse(responseData);
        return responseData;
    }, {
        onSuccess: (responseData) => {
            alert("Substance Use History added successfully!");
            console.log("SubstanceUseHistory data added successfully", responseData);

            navigate("/dashboard");
        },
        onError: () => {
            alert("Error while adding SubstanceUseHistory data.");
        }
    });

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4">
                {(['alcohol', 'benzodiazepines', 'cocaine', 'heroin', 'kush', 'marijuana', 'methamphetamine', 'prescription_drugs', 'tobacco'] as const).map(drug => (
                    <div key={drug} className="pt-10">
                        <div className="flex flex-nowrap space-x-4">
                            <div className="flex flex-col space-y-2 flex-grow">
                                <p className="font-medium">Have they used {drug.charAt(0).toUpperCase() + drug.slice(1)}?</p>
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`substances.${drug}.ever_used`)} className="mr-2" type="radio" value={status} />
                                        {status}
                                    </label>))}
                                {errors.substances && errors.substances[drug]?.ever_used && (
                                    <span className="label-text-alt text-red-500">{errors.substances[drug]?.ever_used?.message}</span>
                                )}
                            </div>
                            <div className="flex flex-col space-y-2 flex-grow">
                                <p className="font-medium">Used during Pregnancy?</p>
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`substances.${drug}.used_during_pregnancy`)} className="mr-2" type="radio" value={status} />
                                        {status}
                                    </label>
                                ))}
                                {errors.substances && errors.substances[drug]?.used_during_pregnancy && (
                                    <span className="label-text-alt text-red-500">{errors.substances[drug]?.used_during_pregnancy?.message}</span>
                                )}
                            </div>
                        </div>
                        <p className="font-medium pt-6">Date Last Used</p>
                        <input {...register(`substances.${drug}.date_last_used`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.substances && errors.substances[drug]?.date_last_used && (
                            <span className="label-text-alt text-red-500">{errors.substances[drug]?.date_last_used?.message}</span>
                        )}

                        <p className="font-medium pt-6">Notes</p>
                        <textarea {...register(`substances.${drug}.notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.substances && errors.substances[drug]?.notes && (
                            <span className="label-text-alt text-red-500">{errors.substances[drug]?.notes?.message}</span>
                        )}
                    </div>
                ))}


                <div className="pt-10">
                    <div className="flex justify-between">
                        <button type="button" onClick={() => fields.length < 2 && append({ drug: '', pregnancy: '', date: '', notes: '' })} className="text-black px-4 py-2 rounded-md">+ Add Substance</button>
                        <button type="button" onClick={() => fields.length > 0 && remove(fields.length - 1)} className="text-red-600 px-4 py-2 rounded-md">- Remove Substance</button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <p className="font-medium">Substance</p>
                            <input {...register(`additionalDrugs.${index}.drug`)} placeholder="Substance Name" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            {errors.additionalDrugs && errors.additionalDrugs[index]?.drug && (
                                <span className="label-text-alt text-red-500">{errors.additionalDrugs[index]?.drug?.message}</span>
                            )}

                            <p className="font-medium">Used during pregnancy?</p>
                            <div className="flex space-x-2">
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`additionalDrugs.${index}.pregnancy`)} type="radio" value={status} className="mr-2" />
                                        {status}
                                    </label>
                                ))}
                            </div>
                            {errors.additionalDrugs && errors.additionalDrugs[index]?.pregnancy && (
                                <span className="label-text-alt text-red-500">{errors.additionalDrugs[index]?.pregnancy?.message}</span>
                            )}

                            <p className="font-medium">Date last used</p>
                            <input {...register(`additionalDrugs.${index}.date`)} type="date" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            {errors.additionalDrugs && errors.additionalDrugs[index]?.date && (
                                <span className="label-text-alt text-red-500">{errors.additionalDrugs[index]?.date?.message}</span>
                            )}

                            <p className="font-medium">Notes</p>
                            <textarea {...register(`additionalDrugs.${index}.notes`)} placeholder="Notes" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            {errors.additionalDrugs && errors.additionalDrugs[index]?.notes && (
                                <span className="label-text-alt text-red-500">{errors.additionalDrugs[index]?.notes?.message}</span>
                            )}
                        </div>
                    ))}
                </div>

                <p className="font-medium">Other Notes</p>
                <textarea {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.notes && <span className="label-text-alt text-red-500">{errors.notes.message}</span>}

                <p className="font-medium">Treatment Case Manager or Recovery Coach Name</p>
                <input {...register("treatment_case_manager")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.treatment_case_manager && <span className="label-text-alt text-red-500">{errors.treatment_case_manager.message}</span>}

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>
        </div>
    );
}
