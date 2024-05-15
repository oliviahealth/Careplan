import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState, useMemo } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query'
import axios from 'axios'
import useAppStore from "../../store/useAppStore";

const DrugInfoSchema = z.object({
    ever_used: z.string().min(1, 'Field required'),
    used_during_pregnancy: z.string().min(1, 'Field required'),
    date_last_used: z.string().nullable(),
    notes: z.string().nullable()
})
export type IDrug = z.infer<typeof DrugInfoSchema>

const AdditionalDrugSchema = z.object({
    drug_used: z.string().min(1, 'Substance name required'),
    used_during_pregnancy: z.string().min(1, 'Field required'),
    date_last_used: z.string().min(1, 'Date required'),
    notes: z.string().nullable()
});
export type IAdditionalDrug = z.infer<typeof AdditionalDrugSchema>

const SubstanceUseHistoryInputSchema = z.object({
    alcohol: DrugInfoSchema,
    benzodiazepines: DrugInfoSchema,
    cocaine: DrugInfoSchema,
    heroin: DrugInfoSchema,
    kush: DrugInfoSchema,
    marijuana: DrugInfoSchema,
    methamphetamine: DrugInfoSchema,
    prescription_drugs: DrugInfoSchema,
    tobacco: DrugInfoSchema,
    other_drugs: z.array(AdditionalDrugSchema),
    notes: z.string().nullable()
})
export type ISubstanceUseHistoryInput = z.infer<typeof SubstanceUseHistoryInputSchema>

const SubstanceUseHistoryReponseSchema = SubstanceUseHistoryInputSchema.extend({
    id: z.string(),
    user_id: z.string()
});

export default function SubstanceUseHistory() {
    const navigate = useNavigate();
    const { submissionId } = useParams();

    const user = useAppStore((state) => state.user);
    const access_token = useAppStore((state) => state.access_token);

    const headers = useMemo(() => ({
        "Authorization": "Bearer " + access_token,
        "userId": user?.id,
    }), [access_token, user?.id]);

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
    const handleDrugDate = (drug: keyof DrugVisibilityState, value: string) => {
        setShowDrugDate(prevState => ({
            ...prevState,
            [drug]: value === 'Yes',
        }));
        if (value === 'No') {
            setValue(`${drug}.date_last_used` as keyof ISubstanceUseHistoryInput, null);
        }
    };


    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<ISubstanceUseHistoryInput>({
        resolver: zodResolver(SubstanceUseHistoryInputSchema),
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
            if (submissionId) {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:5000/api/get_substance_use_history/${submissionId}`,
                        { headers: { ...headers } }
                    )
                    const pastResponseData = response.data;

                    SubstanceUseHistoryReponseSchema.parse(pastResponseData);

                    Object.keys(pastResponseData).forEach(key => {
                        if (key === 'id' || key === 'user_id') return;

                        const formKey = key as keyof ISubstanceUseHistoryInput;
                        if (key === 'date_last_used') {
                            const newDate = new Date(pastResponseData[key]).toISOString().split('T')[0];

                            setValue(formKey, newDate);
                        } else {
                            setValue(formKey, pastResponseData[key]);
                        }

                        setShowDrugDate(prevState => ({
                            ...prevState,
                            [key]: pastResponseData[key]?.ever_used === 'Yes',
                        }));
                    });
                } catch (error) {
                    alert("Something went wrong!");

                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, [submissionId, headers, setValue]);


    const { mutate } = useMutation(async (data: ISubstanceUseHistoryInput) => {
        let responseData;
        let method;
        if (submissionId) {
            responseData = await axios.put(
                `http://127.0.0.1:5000/api/update_substance_use_history/${submissionId}`,
                { ...data },
                { headers: { ...headers } }
            )
            method = "updated";
        } else {
            responseData = await axios.post(
                'http://127.0.0.1:5000/api/add_substance_use_history',
                { ...data },
                { headers: { ...headers } }
            );
            method = "added";
        }

        const userData = responseData.data
        SubstanceUseHistoryReponseSchema.parse(userData);
        
        return { userData, method };
    }, {
        onSuccess: (data) => {
            const { userData, method } = data;

            alert(`Substance Use History ${method} successfully!`);
            console.log(`SubstanceUseHistory data ${method} successfully.`, userData);
            
            navigate('/dashboard')
        },
        onError: () => {
            alert("Error while adding/updating SubstanceUseHistory data.");
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
                                <p className="font-medium">Have they used {drug === 'prescription_drugs' ? 'Prescription Drugs' : drug.charAt(0).toUpperCase() + drug.slice(1)}?</p>
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
                            <div className="flex justify-between items-center">
                                <p className="font-medium py-6">Substance {index + 1}</p>
                                <button type="button" onClick={() => fields.length > 0 && remove(fields.length - 1)} className="text-red-600 px-4 py-2 rounded-md">- Remove Substance</button>
                            </div>
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
                                <span className="label-text-alt text-red-500">{errors.other_drugs[index]?.notes?.message}</span>)}
                        </div>))}

                    <div className="flex justify-center">
                        <button type="button" onClick={() => fields.length < 2 && append({ drug_used: '', used_during_pregnancy: '', date_last_used: '', notes: '' })} className="text-black px-4 py-2 rounded-md">+ Add Substance</button>
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
