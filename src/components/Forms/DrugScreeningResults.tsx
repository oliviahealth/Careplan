import { useForm, useFieldArray } from "react-hook-form"
import { useMutation } from 'react-query'
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react"
import useAppStore from '../../store/useAppStore.ts';

const DrugTest = z.object({
    test_ordered: z.string().min(1, 'Test name required'),
    date_collected: z.string().min(1, 'Test date requried'),
    provider: z.string().min(1, 'Test provider required'),
    provider_location: z.string().min(1, 'Test location requried'),
    results: z.string().min(1, 'Test results requried'),
    specify_results: z.string().nullable(),
    provider_reviewed: z.string().min(1, 'Reviewed with provider requried'),
    date_reviewed: z.string().nullable()
})

const DrugScreeningResultsInputs = z.object({
    tests: z.array(DrugTest),
})
type DrugScreeningResultsInputs = z.infer<typeof DrugScreeningResultsInputs>;

const DrugScreeningResultsResponse = DrugScreeningResultsInputs.extend({
    id: z.string(),
    user_id: z.string()
});

export default function DrugScreeningResults() {

    const { submissionId } = useParams();

    const navigate = useNavigate();

    const { user } = useAppStore();
    const user_id = user ? user.id : "";

    const [showDateReviewed, setShowDateReviewed] = useState(false);
    const handleShowDateReviewed = (index: number, value: string) => {
        setShowDateReviewed(value === 'Yes');
        if (value === 'No') {
            setValue(`tests.${index}.date_reviewed`, null);
        }
    }

    const formatDate = (date: any) => {
        return date.toISOString().split('T')[0];
    };

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<DrugScreeningResultsInputs>({
        resolver: zodResolver(DrugScreeningResultsInputs),
        defaultValues: {
            tests: [{
                test_ordered: '',
                date_collected: '',
                provider: '',
                provider_location: '',
                results: '',
                specify_results: '',
                provider_reviewed: '',
                date_reviewed: '',
            }]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tests'
    });

    const addNewDrugTest = () => {
        append({
            test_ordered: '',
            date_collected: '',
            provider: '',
            provider_location: '',
            results: '',
            specify_results: '',
            provider_reviewed: '',
            date_reviewed: ''
        })
    };

    const removeLastDrugTest = () => {
        remove(fields.length - 1);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (submissionId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/get_drug_screening_results/${user_id}/${submissionId}`)
                    const userData = response.data;
                    Object.keys(userData).forEach(key => {
                        if (key !== 'id' && key !== 'user_id') {
                            const formKey = key as keyof DrugScreeningResultsInputs;
                            if (key === 'date_reviewed') {
                                setValue(formKey, formatDate(new Date(userData[key])));
                            } else {
                                setValue(formKey, userData[key]);
                            }
                            setShowDateReviewed(userData.tests[0]?.provider_reviewed === 'Yes');
                        }
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, [submissionId]);

    const { mutate } = useMutation(async (data: DrugScreeningResultsInputs) => {
        let responseData;
        let method;
        if (submissionId) {
            responseData = await axios.put(`http://127.0.0.1:5000/api/update_drug_screening_results/${submissionId}`, { ...data, user_id: user_id })
            method = "updated";
        } else {
            responseData = await axios.post('http://127.0.0.1:5000/api/add_drug_screening_results', { ...data, user_id: user_id });
            method = "added";
        }

        const userData = responseData.data;
        DrugScreeningResultsResponse.parse(userData);
        console.log(userData);
        return { userData, method };
    }, {
        onSuccess: (data) => {
            const { userData, method } = data;
            alert(`Drug screening results ${method} successfully!`);
            console.log(`DrugScreeningResults data ${method} successfully.`, userData);
            navigate('/dashboard');
        },
        onError: () => {
            alert("Error while adding/updating DrugScreeningResults data.");
        }
    });

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">

            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                {fields.map((field, index) => (

                    <div key={field.id} className="py-6 space-y-6">

                        <p className="font-semibold text-red-700">Complete with Provider Ordering UDS or Recovery Coach</p>
                        <div className="w-full h-px bg-gray-300"></div>

                        <p className="font-medium">Test Ordered</p>
                        <input {...register(`tests.${index}.test_ordered`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.tests && errors.tests[index]?.test_ordered && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.test_ordered?.message}</span>
                        )}

                        <p className="font-medium">Date Collected</p>
                        <input {...register(`tests.${index}.date_collected`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.tests && errors.tests[index]?.date_collected && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.date_collected?.message}</span>
                        )}

                        <p className="font-medium">Ordered By (Provider Name)</p>
                        <input {...register(`tests.${index}.provider`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.tests && errors.tests[index]?.provider && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.provider?.message}</span>
                        )}

                        <p className="font-medium">Provider Location</p>
                        <input {...register(`tests.${index}.provider_location`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.tests && errors.tests[index]?.provider_location && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.provider_location?.message}</span>
                        )}

                        <p className="font-medium">Results</p>
                        {["Positive", "Negative"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`tests.${index}.results`)} className="form-radio" type="radio" value={status} />
                                <span className="ml-2">{status}</span>
                            </label>))}
                        {errors.tests && errors.tests[index]?.results && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.results?.message}</span>
                        )}

                        <p className="font-medium">Specify Results</p>
                        <textarea {...register(`tests.${index}.specify_results`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.tests && errors.tests[index]?.specify_results && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.specify_results?.message}</span>
                        )}

                        <p className="font-medium">Provider Reviewed with Patient</p>
                        {["Yes", "No"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`tests.${index}.provider_reviewed`)} className="form-radio" type="radio" value={status} onChange={(e) => handleShowDateReviewed(index, e.target.value)} />
                                <span className="ml-2">{status}</span>
                            </label>))}
                        {errors.tests && errors.tests[index]?.provider_reviewed && (
                            <span className="label-text-alt text-red-500">{errors.tests[index]?.provider_reviewed?.message}</span>
                        )}

                        {showDateReviewed && (
                            <>
                                <p className="font-medium">Date Reviewed</p>
                                <input {...register(`tests.${index}.date_reviewed`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                                {errors.tests && errors.tests[index]?.date_reviewed && (
                                    <span className="label-text-alt text-red-500">{errors.tests[index]?.date_reviewed?.message}</span>
                                )}
                            </>
                        )}

                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewDrugTest} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Test</button>
                    <button type="button" onClick={removeLastDrugTest} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Last Test</button>
                </div>

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>

        </div>
    )
}