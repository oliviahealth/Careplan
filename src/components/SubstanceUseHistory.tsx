import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

type DrugInfo = {
    ever_used: string;
    used_during_pregnancy: string;
    date_last_used: string;
    notes: string;
};

type DrugNames = 'alcohol' | 'benzodiazepines' | 'cocaine' | 'heroin' | 'kush' | 'marijuana' | 'methamphetamine' | 'prescription_drugs' | 'tobacco';

type DrugFields = {
    [K in DrugNames]: DrugInfo;
};

type AdditionalDrugs = {
    drug: string;
    pregnancy: string;
    date: string;
    notes: string;
};

type Inputs = DrugFields & {
    substances: AdditionalDrugs[];
    notes: string;
    treatmentCareManager: string;
};

export default function SubstanceUseHistory() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            substances: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'substances'
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4">
                {(['alcohol', 'benzodiazepines', 'cocaine', 'heroin', 'kush', 'marijuana', 'methamphetamine', 'prescription_drugs', 'tobacco'] as const).map(drug => (
                    <div key={drug} className="pt-10">
                        <div className="flex flex-nowrap space-x-4">
                            <div className="flex flex-col space-y-2 flex-grow">
                                <p className="font-medium">Have they used {drug.charAt(0).toUpperCase() + drug.slice(1)}?</p>
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`${drug}.ever_used`)} className="mr-2" type="radio" value={status} />
                                        {status}
                                    </label>
                                ))}
                            </div>
                            <div className="flex flex-col space-y-2 flex-grow">
                                <p className="font-medium">Used during Pregnancy?</p>
                                {['Yes', 'No'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input {...register(`${drug}.used_during_pregnancy`)} className="mr-2" type="radio" value={status} />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <p className="font-medium pt-6">Date Last Used</p>
                        <input {...register(`${drug}.date_last_used`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        
                        <p className="font-medium pt-6">Notes</p>
                        <textarea {...register(`${drug}.notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                    </div>
                ))}


                <div className="pt-10">
                    <div className="flex justify-between">
                        <button type="button" onClick={() => append({drug: '', pregnancy: '', date: '', notes: ''})} className="text-black px-4 py-2 rounded-md">+ Add Substance</button>
                        <button type="button" onClick={() => fields.length > 0 && remove(fields.length - 1)} className="text-red-600 px-4 py-2 rounded-md">- Remove Substance</button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <p className="font-medium">Substance</p>
                            <input {...register(`substances.${index}.drug`)} placeholder="Substance Name" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            <p className="font-medium">Used during pregnancy?</p>
                            <div className="flex space-x-2">
                                {['Yes', 'No'].map((status) => (
                                <label key={status} className="inline-flex items-center">
                                <input {...register(`substances.${index}.pregnancy`)} type="radio" value={status} className="mr-2" />
                                {status}
                                </label>
                            ))}
                        </div>

            <p className="font-medium">Date last used</p>
            <input {...register(`substances.${index}.date`)} type="date" className="border border-gray-300 px-4 py-2 rounded-md w-full" />

            <p className="font-medium">Notes</p>
            <textarea {...register(`substances.${index}.notes`)} placeholder="Notes" className="border border-gray-300 px-4 py-2 rounded-md w-full" />
        </div>
    ))}
                </div>

                <p className="font-medium">Other Notes</p>
                <textarea {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Treatment Case Manager or Recovery Coach Name</p>
                <input {...register("treatmentCareManager")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>  
        </div>
    );
}
