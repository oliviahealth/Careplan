import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"

type Inputs = {
    drug_test: DrugTest[];
    uds_name: string;
}

type DrugTest = {
    test_ordered: string;
    test_date: string;
    provider_name: string;
    provider_location: string;
    results: string;
    specify_results: string;
    provider_reviewed_with_patient: string;
    date_reviewed: string;
}

export default function DrugScreeningResults() {
    const { register, control, handleSubmit } =useForm<Inputs>({
        defaultValues: {
            drug_test: [{
                test_ordered: '', 
                test_date: '', 
                provider_name: '', 
                provider_location: '', 
                results: '', 
                specify_results: '', 
                provider_reviewed_with_patient: '', 
                date_reviewed: '',
            }]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'drug_test'
    });

    const addNewDrugTest = () => {
        append({
            test_ordered: '',
            test_date: '',
            provider_name: '',
            provider_location: '',
            results: '',
            specify_results: '',
            provider_reviewed_with_patient: '',
            date_reviewed: ''
        })
    };

    const removeLastDrugTest = () => {
        remove(fields.length - 1);
      };

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6 space-y-6">
                        <p className="font-medium">Test Ordered</p>
                        <input {...register(`drug_test.${index}.test_ordered`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Date Collected</p>
                        <input {...register(`drug_test.${index}.test_date`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                        <p className="font-medium">Ordered By (Provider Name)</p>
                        <input {...register(`drug_test.${index}.provider_name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Provider Location</p>
                        <input {...register(`drug_test.${index}.provider_location`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Results</p>
                        {["Positive", "Negative"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`drug_test.${index}.results`)} className="form-radio" type="radio" value={status} />
                                <span className="ml-2">{status}</span>
                            </label>))}

                        <p className="font-medium">Specify Results</p>
                        <textarea {...register(`drug_test.${index}.specify_results`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Provider Reviewed with Patient</p>
                        {["Yes", "No"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`drug_test.${index}.provider_reviewed_with_patient`)} className="form-radio" type="radio" value={status} />
                                <span className="ml-2">{status}</span>
                            </label>))}
                        
                        <p className="font-medium">Date Reviewed</p>
                        <input {...register(`drug_test.${index}.date_reviewed`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewDrugTest} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Test</button>
                    <button type="button" onClick={removeLastDrugTest} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Last Test</button>
                </div>

                <p className="font-medium">Provider ordering UDS or Recover Coach Name</p>
                <input {...register("uds_name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>

        </div>
    )
}