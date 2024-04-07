import { useForm, useFieldArray } from "react-hook-form";
import { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query'
import axios from 'axios'

const Medications = z.object({
    medication: z.string().min(1, 'Medication required'),
    dose: z.string().min(1, 'Dose required')
});

const ServicesSubstanceUseInputs = z.object({
    mat_engaged: z.string().min(1, 'required'),
    date_used_mat: z.string(),
    medications: z.array(Medications),
    mat_clinic_name: z.string().min(1, 'required'),
    mat_clinic_phone: z.string().min(1, 'required'),
    used_addiction_medicine_services: z.string().min(1, 'required'),
    date_used_medicine_service: z.string(),
    addiction_medicine_clinic: z.string().min(1, 'required'),
    addiction_medicine_clinic_phone: z.string().min(1, 'required'),
    mat_provider: z.string().min(1, 'required'),
});
type ServicesSubstanceUseInputsType = z.infer<typeof ServicesSubstanceUseInputs>

const ServicesSubstanceUseResponse = ServicesSubstanceUseInputs.extend({
    id: z.string(),
    user_id: z.string()
});

export default function ServicesSubstanceUse() {

    const navigate = useNavigate();

    const [showMatDate, setShowMatDate] = useState(false)
    const handleShowMatDate = (value: string) => {
        setShowMatDate(value === 'Prior MAT use');
    };

    const [showAddictionServiceDate, setShowAddictionServiceDate] = useState(false)
    const handleShowAddictionServiceDate = (value: string) => {
        setShowAddictionServiceDate(value === 'Prior Use');
    };

    const { register, control, handleSubmit, formState: { errors } } = useForm<ServicesSubstanceUseInputsType>({
        resolver: zodResolver(ServicesSubstanceUseInputs),
        defaultValues: {
            medications: [{ medication: '', dose: '' }],
            date_used_mat: '',
            date_used_medicine_service: ''
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medications'
    });

    const addNewMedication = () => {
        append({
            medication: '',
            dose: '',
        })
    };

    const removeLastMedication = () => {
        if (fields.length > 0) {
            remove(fields.length - 1);
        }
    };

    const { mutate } = useMutation(async (data: ServicesSubstanceUseInputsType) => {

        const { data: responseData } = (await axios.post('http://127.0.0.1:5000/api/add_medical_services_for_substance_use', { ...data, user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12" }));

        ServicesSubstanceUseResponse.parse(responseData);

        return responseData;
    }, {
        onSuccess: (responseData) => {
            alert("Maternal Services For Substance Use added successfully!");
            console.log("MaternalServicesForSubstanceUse data added successfully.", responseData);

            navigate('/dashboard');
        },
        onError: () => {
            alert("Error while adding Maternal Services For Substance Use data.");
        }
    });

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">

                <p className="font-medium">Medication Assisted Treatment (MAT) enganged?</p>
                {["Never", "Currently", "Prior MAT use"].map((status) => (
                    <label key={status} className="flex pt-2">
                        <input {...register("mat_engaged")} type="radio" value={status} className="form-radio" onChange={(e) => handleShowMatDate(e.target.value)} />
                        <span className="ml-2">{status}</span>
                    </label>))}


                {showMatDate &&
                    <>
                        <p className="font-medium">Date Last Used</p>
                        <input {...register("date_used_mat")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                    </>
                }

                {fields.map((fields, index) => (
                    <div key={index} className="py-6 space-y-6">

                        <p className="font-medium">Medication</p>
                        <input {...register(`medications.${index}.medication`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Dose</p>
                        <input {...register(`medications.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
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
                        <input {...register("used_addiction_medicine_services")} type="radio" value={status} className="form-radio" onChange={(e) => handleShowAddictionServiceDate(e.target.value)} />
                        <span className="ml-2">{status}</span>
                    </label>))}

                {showAddictionServiceDate &&
                    <>
                        <p className="font-medium">Date Last Used</p>
                        <input {...register("date_used_medicine_service")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                    </>
                }

                <p className="font-medium">Addiction Medicine Clinic Name</p>
                <input {...register("addiction_medicine_clinic")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Addiction Medicine Clinic Phone Number</p>
                <input {...register("addiction_medicine_clinic_phone")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


                <p className="font-medium">MAT Provider</p>
                <input {...register("mat_provider")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )


}