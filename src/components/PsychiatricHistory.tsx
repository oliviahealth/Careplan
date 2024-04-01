import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { PsychiatricHistorySchema, PsychiatricHistorySchemaType } from '../utils/interfaces.tsx';
import { useMutation } from 'react-query'
import axios from 'axios'

const addPsychiatricHistory = async (data: PsychiatricHistorySchemaType) => {

    const newData = { ...data, user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12" }
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/add_psychiatric_history', newData);
        console.log("Data successfully updated:", data);
        return response.data;
    } catch (error) {
        throw new Error('Network response was not ok');
    }
};

export default function PsychiatricHistory() {
    const { register, control, handleSubmit } = useForm<PsychiatricHistorySchemaType>({
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
            taking_medication: false,
        })
    };

    const { mutate } = useMutation(addPsychiatricHistory);
    const onSubmit: SubmitHandler<PsychiatricHistorySchemaType> = async (data) => {

        data.diagnoses.forEach(diagnosis => {
            diagnosis.taking_medication = Boolean(diagnosis.taking_medication);
        });

        let missingInputsString = ''

        Object.entries(data).forEach((elm) => {
            const [key, value] = elm;

            if (!value) {
                missingInputsString += `${key} \n\n`
            }
        })

        if (missingInputsString) {
            const userConfirmed = window.confirm(`The following data fields are missing or invalid.\n\n${missingInputsString}`);
            if (!userConfirmed) return;
        } else {
            try {
                mutate(PsychiatricHistorySchema.parse(data));
                console.log("Data submitted successfully!");
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
    }

    return (
        <div className="flex  justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <p className="font-medium pt-6">Diagnosis</p>
                        <input {...register(`diagnoses.${index}.diagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Provider</p>
                        <input {...register(`diagnoses.${index}.provider`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Phone Number</p>
                        <input {...register(`diagnoses.${index}.phone_number`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Date of Diagnosis</p>
                        <input {...register(`diagnoses.${index}.date_of_diagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />


                        <p className="font-medium pt-6">Are You Currently Taking Medicine for this Diagnosis?</p>
                        <div className="flex flex-col space-y-2">
                            <label className="inline-flex items-center">
                                <input {...register(`diagnoses.${index}.taking_medication`, { required: true })} type="radio" value="true" className="form-radio" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input {...register(`diagnoses.${index}.taking_medication`)} type="radio" value='' className="form-radio" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewDiagnoses} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Diagnosis</button>
                    <button type="button" onClick={removeLastDiagnoses} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Diagnosis</button>
                </div>

                <p className="font-medium">Notes</p>
                <input {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium whitespace-nowrap">OB/GYN, Primary Care Provider, or Mental Health Provider Name</p>
                <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center pt-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>

            </form>
        </div>
    )
}