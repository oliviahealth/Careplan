import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";


type DiagnosesInputs = {
    diagnosis: string,
    provider: string,
    phoneNumber: string,
    dateDiagnosis: string,
    takingMeds: string,
};

type Inputs = {
    diagnoses: DiagnosesInputs[],
    notes: string,
    obgyn: string,
};

export default function MaternalPsychiatricHistory() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            diagnoses: [{
                diagnosis: '',
                provider: '',
                phoneNumber: '',
                dateDiagnosis: '',
                takingMeds: '',
            }]
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
            phoneNumber: '',
            dateDiagnosis: '',
            takingMeds: '',
        })
    };

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);


    return(
        <div className="flex  justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                <div className="flex justify-center">
                    <button type="button" onClick={addNewDiagnoses} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Diagnosis</button>
                    <button type="button" onClick={removeLastDiagnoses} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Diagnosis</button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <div className="flex flex-nowrap space-x-4">
                            <div className="flex flex-col flex-grow">
                                <p className="font-medium pt-6">Diagnosis</p>
                                <input {...register(`diagnoses.${index}.diagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <p className="font-medium pt-6">Provider</p>
                                <input {...register(`diagnoses.${index}.provider`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            </div>
                        </div>
                        <div className="flex flex-nowrap space-x-4">
                            <div className="flex flex-col flex-grow">
                                <p className="font-medium pt-6">Phone Number</p>
                                <input {...register(`diagnoses.${index}.phoneNumber`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <p className="font-medium pt-6">Date of Diagnosis</p>
                                <input {...register(`diagnoses.${index}.dateDiagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                            </div>
                        </div>
                        
                        <p className="font-medium pt-6">Are They Taking Medicine for this Diagnosis?</p>
                        <div className="flex flex-col space-y-2">
                            {["Yes", "No"].map((status) => (
                                <label key={status} className="inline-flex items-center pt-2">
                                    <input {...register(`diagnoses.${index}.takingMeds`)} type="radio" value={status} className="form-radio"/>
                                    <span className="ml-2">{status}</span>
                                </label>))}
                        </div>   
                    </div>))}

                    <p className="font-medium">Notes</p>
                    <textarea {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium whitespace-nowrap">OB/GYN, Primary Care Provider, or Mental Health Provider Name</p>
                    <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <div className="flex justify-center pt-6">
                        <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                    </div>

            </form>
        </div>
    )
}