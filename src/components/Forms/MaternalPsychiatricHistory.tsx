import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { months } from "../../utils";

type DiagnosesInputs = {
    diagnosis: string,
    provider: string,
    phoneNumber: string,
    dayOfDiagnosis: string,
    monthOfDiagnosis: string,
    yearOfDiagnosis: string,
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
            phoneNumber: '',
            dayOfDiagnosis: '',
            monthOfDiagnosis: '',
            yearOfDiagnosis: '',
            takingMeds: '',
        })
    };

    const onSubmit: SubmitHandler<Inputs> = data => {
        const formattedData = {
            ...data,
            diagnoses: data.diagnoses.map(diagnosis => ({
                ...diagnosis,
                dateOfDiagnosis: `${diagnosis.monthOfDiagnosis} ${diagnosis.dayOfDiagnosis}, ${diagnosis.yearOfDiagnosis}`,
            })).map(({ dayOfDiagnosis, monthOfDiagnosis, yearOfDiagnosis, ...rest }) => rest),
        };

        console.log(formattedData);
    }
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(i + 1900)).reverse();


    return(
        <div className="flex  justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <p className="font-medium pt-6">Diagnosis</p>
                        <input {...register(`diagnoses.${index}.diagnosis`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Provider</p>
                        <input {...register(`diagnoses.${index}.provider`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Phone Number</p>
                        <input {...register(`diagnoses.${index}.phoneNumber`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Date of Diagnosis</p>
                        <div className="flex space-x-4 pt-6">
                            <select {...register(`diagnoses.${index}.monthOfDiagnosis`)} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                                <option disabled selected>Month</option>
                                {months.map((month, index) => (<option key={index}>{month}</option>))}
                            </select>

                            <select {...register(`diagnoses.${index}.dayOfDiagnosis`)} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                                <option disabled selected>Day</option>
                                {Array.from({ length: 31 }, (_, i) => (<option key={i+1}>{i+1}</option>))}
                            </select>

                            <select {...register(`diagnoses.${index}.yearOfDiagnosis`)} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                                <option disabled selected>Year</option>
                                {years.map((year) => (<option key={year}>{year}</option>))}
                            </select>
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