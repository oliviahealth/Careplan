import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

type Inputs = {
    medication: Medication[];
    mat_clinic_name: string;
    mat_clinic_phone: string;
    used_addiction_medicine_services: string;
    date_used_medicine_service: string;
    addiction_medicine_clinic: string;
    addiction_medicine_clinic_phone: string;
    mat_provider: string;
}

type Medication = {
    mat_engaged: string;
    date_used_mat: string;
    medication: string;
    dose: string;
}

export default function ServicesSubstanceUse() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            medication: [{ mat_engaged: '', date_used_mat: '', medication: '', dose: '' }]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medication'
    });

    const addNewMedication = () => {
        append({
            mat_engaged: '',
            date_used_mat: '',
            medication: '',
            dose: '',
        })
    };

    const removeLastMedication = () => {
        if (fields.length > 0) {
            remove(fields.length - 1);
        } 
    };

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };
    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                {fields.map((fields, index) => (
                    <div key={fields.mat_engaged} className="py-6 space-y-6">
                        <p className="font-medium">Medication Assisted Treatment (MAT) enganged?</p>
                        {["Never", "Currently", "Prior MAT use"].map((status) => (
                            <label key={status} className="flex pt-2">
                                <input {...register(`medication.${index}.mat_engaged`)} type="radio" value={status} className="form-radio" />
                                <span className="ml-2">{status}</span>
                            </label>))}
                        <p className="font-medium">Date Last Used</p>
                        <input {...register(`medication.${index}.date_used_mat`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                        <p className="font-medium">Medication</p>
                        <input {...register(`medication.${index}.medication`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Dose</p>
                        <input {...register(`medication.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                    </div>))}

                    <div className="flex justify-center">
                        <button type="button" onClick={addNewMedication} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Medication</button>
                        <button type="button" onClick={removeLastMedication} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Medication</button>
                    </div>

                    <p className="font-medium">MAT Clinic</p>
                    <input {...register("mat_clinic_name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">MAT Clinic Phone Number</p>
                    <input {...register("mat_clinic_phone")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Used Addiction Medicine Services?</p>
                    {["Never", "Currently", "Prior Use"].map((status) => (
                        <label key={status} className="flex items-center pt-2">
                            <input {...register("date_used_medicine_service")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}

                    <p className="font-medium">Date Last Used</p>
                    <input {...register("date_used_medicine_service")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                    <p className="font-medium">Addiction Medicine Clinic Name</p>
                    <input {...register("addiction_medicine_clinic")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Addiction Medicine Clinic Phone Number</p>
                    <input {...register("addiction_medicine_clinic_phone")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

                    <div className="flex justify-center pt-6">
                        <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                    </div>
            </form>
        </div>
    )
}