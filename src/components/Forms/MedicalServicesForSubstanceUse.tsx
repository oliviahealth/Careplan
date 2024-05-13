import { useForm, useFieldArray } from "react-hook-form";
import { ChangeEvent, useState } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query'
import axios from 'axios'
import { useEffect } from "react";
import useAppStore from "../../store/useAppStore";

const Medications = z.object({
    medication: z.string().min(1, 'Medication required'),
    dose: z.string().min(1, 'Dose required')
});

const MedicalServicesSubstanceUseInputs = z.object({
    mat_engaged: z.string().min(1, 'MAT engaged required'),
    date_used_mat: z.string().nullable(),
    medications: z.array(Medications),
    mat_clinic_name: z.string().min(1, 'MAT clinic name required'),
    mat_clinic_phone: z.string().min(1, 'MAT clinic phone number required'),
    used_addiction_medicine_services: z.string().min(1, 'This field is required'),
    date_used_medicine_service: z.string().nullable(),
    addiction_medicine_clinic: z.string().min(1, 'Addiction medicine clinic name required'),
    addiction_medicine_clinic_phone: z.string().min(1, 'Addiction medicine clinic phone number required')
});
type MedicalServicesSubstanceUseInputs = z.infer<typeof MedicalServicesSubstanceUseInputs>

const MedicalServicesSubstanceUseResponse = MedicalServicesSubstanceUseInputs.extend({
    id: z.string(),
    user_id: z.string()
});

export default function MedicalServicesForSubstanceUse() {
    const navigate = useNavigate();
    const { submissionId } = useParams();

    const user = useAppStore(state => state.user);

    const [showMatDate, setShowMatDate] = useState(false)
    const handleShowMatDate = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;

        if(value === 'Prior MAT use') {
            setShowMatDate(true);

            return;
        }

        setShowMatDate(false);
        setValue('date_used_mat', null);
    };

    const [showAddictionServiceDate, setShowAddictionServiceDate] = useState(false)
    const handleShowAddictionServiceDate = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;

        if(value === 'Prior Use') {
            setShowAddictionServiceDate(true);

            return;
        }

        setShowAddictionServiceDate(false);
        setValue('date_used_medicine_service', null);
    };

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<MedicalServicesSubstanceUseInputs>({
        resolver: zodResolver(MedicalServicesSubstanceUseInputs), 
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medications'
    });

    const addNewMedication = () => append({ medication: '', dose: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (submissionId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/get_medical_services_for_substance_use/${user?.id}/${submissionId}`)
                    const userData = response.data;

                    Object.keys(userData).forEach(key => {
                        if(key === 'id' || key === 'user_id') return;

                        const formKey = key as keyof MedicalServicesSubstanceUseInputs;

                        if (key === 'date_used_mat' || key === 'date_used_medicine_service') {
                            setValue(formKey, new Date(userData[key]).toISOString().split('T')[0]);
                        } else {
                            setValue(formKey, userData[key]);
                        }
                    });

                    setShowMatDate(userData.mat_engaged === 'Prior MAT use');
                    setShowAddictionServiceDate(userData.used_addiction_medicine_services === 'Prior Use')
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [submissionId]);

    const { mutate } = useMutation(async (data: MedicalServicesSubstanceUseInputs) => {
        let responseData;
        let method;

        if (submissionId) {
            responseData = await axios.put(`http://127.0.0.1:5000/api/update_medical_services_for_substance_use/${submissionId}`, { ...data, user_id: user?.id })
            method = "updated";
        } else {
            responseData = await axios.post('http://127.0.0.1:5000/api/add_medical_services_for_substance_use', { ...data, user_id: user?.id });
            method = "added";
        }

        const userData = responseData.data;
        MedicalServicesSubstanceUseResponse.parse(userData);

        console.log(userData);
        return { userData, method };
    }, {
        onSuccess: (data) => {
            const { userData, method } = data;

            alert(`Maternal Services For Substance Use ${method} successfully!`);
            console.log(`MaternalServicesForSubstanceUse data ${method} successfully.`, userData);

            navigate('/dashboard')
        },
        onError: () => {
            alert("Error while adding Maternal Services For Substance Use data.");
        }
    });

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">

                <p className="font-semibold text-red-700">Complete with MAT Provider</p>
                <div className="w-full h-px bg-gray-300"></div>

                <p className="font-medium">Medication Assisted Treatment (MAT) engaged?</p>
                {["Never", "Currently", "Prior MAT use"].map((status) => (
                    <label key={status} className="flex pt-2">
                        <input {...register("mat_engaged")} type="radio" value={status} className="form-radio" onChange={handleShowMatDate} />
                        <span className="ml-2">{status}</span>
                    </label>))}
                {errors.mat_engaged && <span className="label-text-alt text-red-500">{errors.mat_engaged.message}</span>}

                {showMatDate &&
                    <>
                        <p className="font-medium">Date Last Used</p>
                        <input {...register("date_used_mat")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.date_used_mat && <span className="label-text-alt text-red-500">{errors.date_used_mat.message}</span>}
                    </>
                }

                {fields.map((_fields, index) => (
                    <div key={index} className="py-6 space-y-6">

                        <div className="flex justify-between items-center py-6">
                            <p className="font-medium pb-2 pt-8">Medication {index + 1}</p>
                            <button type="button" onClick={() => remove(index)} className="text-red-600 px-4 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Medication</button>
                        </div>
                        <input {...register(`medications.${index}.medication`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.medications && errors.medications[index]?.medication && (
                            <span className="label-text-alt text-red-500">{errors.medications[index]?.medication?.message}</span>
                        )}

                        <p className="font-medium">Dose</p>
                        <input {...register(`medications.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.medications && errors.medications[index]?.dose && (
                            <span className="label-text-alt text-red-500">{errors.medications[index]?.dose?.message}</span>
                        )}                        
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewMedication} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Medication</button>
                </div>

                <p className="font-medium">MAT Clinic</p>
                <input {...register("mat_clinic_name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.mat_clinic_name && <span className="label-text-alt text-red-500">{errors.mat_clinic_name.message}</span>}

                <p className="font-medium">MAT Clinic Phone Number</p>
                <input {...register("mat_clinic_phone")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.mat_clinic_phone && <span className="label-text-alt text-red-500">{errors.mat_clinic_phone.message}</span>}

                <p className="font-medium">Used Addiction Medicine Services?</p>
                {["Never", "Currently", "Prior Use"].map((status) => (
                    <label key={status} className="flex items-center pt-2">
                        <input {...register("used_addiction_medicine_services")} type="radio" value={status} className="form-radio" onChange={handleShowAddictionServiceDate} />
                        <span className="ml-2">{status}</span>
                    </label>))}
                {errors.used_addiction_medicine_services && <span className="label-text-alt text-red-500">{errors.used_addiction_medicine_services.message}</span>}

                {showAddictionServiceDate &&
                    <>
                        <p className="font-medium">Date Last Used</p>
                        <input {...register("date_used_medicine_service")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                        {errors.date_used_medicine_service && <span className="label-text-alt text-red-500">{errors.date_used_medicine_service.message}</span>}
                    </>
                }

                <p className="font-medium">Addiction Medicine Clinic Name</p>
                <input {...register("addiction_medicine_clinic")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.addiction_medicine_clinic && <span className="label-text-alt text-red-500">{errors.addiction_medicine_clinic.message}</span>}

                <p className="font-medium">Addiction Medicine Clinic Phone Number</p>
                <input {...register("addiction_medicine_clinic_phone")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.addiction_medicine_clinic_phone && <span className="label-text-alt text-red-500">{errors.addiction_medicine_clinic_phone.message}</span>}

                <div className="flex justify-center">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )


}