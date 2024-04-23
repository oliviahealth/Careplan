import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query'
import axios from 'axios'
import useAppStore from "../../store/useAppStore";

const DrugInfo = z.object({
    ever_used: z.string().min(1, 'Field required'),
    used_during_pregnancy: z.string().min(1, 'Field required'),
    date_last_used: z.string(),
    notes: z.string().min(1, 'Notes required')
})

const AdditionalDrugs = z.object({
    drug_used: z.string().min(1, 'Substance name required'),
    used_during_pregnancy: z.string().min(1, 'Field required'),
    date_last_used: z.string().min(1, 'Date required'),
    notes: z.string().min(1, 'Notes required')
});
type AdditionalDrugs = z.infer<typeof AdditionalDrugs>

const SubstanceUseHistoryInputs = z.object({
    alcohol: DrugInfo,
    benzodiazepines: DrugInfo,
    cocaine: DrugInfo,
    heroin: DrugInfo,
    kush: DrugInfo,
    marijuana: DrugInfo,
    methamphetamine: DrugInfo,
    prescription_drugs: DrugInfo,
    tobacco: DrugInfo,
    other_drugs: z.array(AdditionalDrugs),
    notes: z.string().min(1, 'Additional Notes Required')
})
export type SubstanceUseHistoryInputs = z.infer<typeof SubstanceUseHistoryInputs>

const SubstanceUseHistoryReponse = SubstanceUseHistoryInputs.extend({
    id: z.string(),
    user_id: z.string()
});

export default function SubstanceUseHistory() {

    const { user } = useAppStore();
    const user_id = user ? user.id : "";

    const navigate = useNavigate();

    type DrugVisibilityState = {
        [key: string]: boolean;
    };

    const [showDrugDate, setShowDrugDate] = useState<DrugVisibilityState>({
        alcohol: false,
        benzodiazepines: false,
        cocaine: false,
        heroin: false,
        kush: false,
        marijuana: false,
        methamphetamine: false,
        prescription_drugs: false,
        tobacco: false,
    });
    const handleDrugDate = (drug: string, value: string) => {
        setShowDrugDate(prevState => ({
            ...prevState,
            [drug]: value === 'Yes',
        }));
    };


    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<SubstanceUseHistoryInputs>({

        resolver: zodResolver(SubstanceUseHistoryInputs),
        defaultValues: {
            other_drugs: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'other_drugs'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/get_substance_use_history/${user_id}`)
                const userData = response.data[response.data.length - 1];;

                Object.keys(userData).forEach(key => {
                    if (key !== 'id' && key !== 'user_id') {
                        const formKey = key as keyof SubstanceUseHistoryInputs;
                        setValue(formKey, userData[key]);

                        setShowDrugDate(prevState => ({
                            ...prevState,
                            [key]: userData[key]?.ever_used === 'Yes',
                        }));
                    }
                });
                console.log('working', userData)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);


    const { mutate } = useMutation(async (data: SubstanceUseHistoryInputs) => {

        const { data: responseData } = (await axios.post('http://127.0.0.1:5000/api/add_substance_use_history', { ...data, user_id: user_id }));
        SubstanceUseHistoryReponse.parse(responseData);
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

                <p className="font-semibold text-red-700">Complete with Treatment Case Manager or Recovery Coach</p>
                <div className="w-full h-px bg-gray-300"></div>

                {(['alcohol', 'benzodiazepines', 'cocaine', 'heroin', 'kush', 'marijuana', 'methamphetamine', 'prescription_drugs', 'tobacco'] as const).map(drug => (
                    <div key={drug} className="pt-10">
                        <div className="flex flex-nowrap space-x-4">
                            <div className="flex flex-col space-y-2 flex-grow">
                                <p className="font-medium">Have they used {drug.charAt(0).toUpperCase() + drug.slice(1)}?</p>
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`${drug}.ever_used`)} className="mr-2" type="radio" value={status} onChange={(e) => handleDrugDate(drug, e.target.value)} />
                                        {status}
                                    </label>
                                ))}
                                {errors[drug]?.ever_used && (
                                    <span className="label-text-alt text-red-500">{errors[drug]?.ever_used?.message}</span>
                                )}
                            </div>
                            <div className="flex flex-col space-y-2 flex-grow">
                                <p className="font-medium">Used during Pregnancy?</p>
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`${drug}.used_during_pregnancy`)} className="mr-2" type="radio" value={status} />
                                        {status}
                                    </label>
                                ))}
                                {errors[drug]?.used_during_pregnancy && (
                                    <span className="label-text-alt text-red-500">{errors[drug]?.used_during_pregnancy?.message}</span>
                                )}
                            </div>
                        </div>
                        {showDrugDate[drug] && (
                            <>
                                <p className="font-medium pt-6">Date Last Used</p>
                                <input {...register(`${drug}.date_last_used`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                                {errors[drug]?.date_last_used && (
                                    <span className="label-text-alt text-red-500">{errors[drug]?.date_last_used?.message}</span>
                                )}
                            </>
                        )}

                        <p className="font-medium pt-6">Notes</p>
                        <textarea {...register(`${drug}.notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors[drug]?.notes && (
                            <span className="label-text-alt text-red-500">{errors[drug]?.notes?.message}</span>
                        )}
                    </div>
                ))}

                <div className="pt-10">

                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <p className="font-medium">Substance</p>
                            <input {...register(`other_drugs.${index}.drug_used`)} placeholder="Substance Name" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            {errors.other_drugs && errors.other_drugs[index]?.drug_used && (
                                <span className="label-text-alt text-red-500">{errors.other_drugs[index]?.drug_used?.message}</span>
                            )}

                            <p className="font-medium">Used during pregnancy?</p>
                            <div className="flex space-x-2">
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`other_drugs.${index}.used_during_pregnancy`)} type="radio" value={status} className="mr-2" />
                                        {status}
                                    </label>
                                ))}
                            </div>
                            {errors.other_drugs && errors.other_drugs[index]?.used_during_pregnancy && (
                                <span className="label-text-alt text-red-500">{errors.other_drugs[index]?.used_during_pregnancy?.message}</span>
                            )}

                            <p className="font-medium">Date last used</p>
                            <input {...register(`other_drugs.${index}.date_last_used`)} type="date" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            {errors.other_drugs && errors.other_drugs[index]?.date_last_used && (
                                <span className="label-text-alt text-red-500">{errors.other_drugs[index]?.date_last_used?.message}</span>
                            )}

                            <p className="font-medium">Notes</p>
                            <textarea {...register(`other_drugs.${index}.notes`)} placeholder="Notes" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            {errors.other_drugs && errors.other_drugs[index]?.notes && (
                                <span className="label-text-alt text-red-500">{errors.other_drugs[index]?.notes?.message}</span>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => fields.length < 2 && append({ drug_used: '', used_during_pregnancy: '', date_last_used: '', notes: '' })} className="text-black px-4 py-2 rounded-md">+ Add Substance</button>
                        <button type="button" onClick={() => fields.length > 0 && remove(fields.length - 1)} className="text-red-600 px-4 py-2 rounded-md">- Remove Substance</button>
                    </div>
                </div>

                <p className="font-medium">Other Notes</p>
                <textarea {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.notes && <span className="label-text-alt text-red-500">{errors.notes.message}</span>}

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>
        </div>
    );
}
