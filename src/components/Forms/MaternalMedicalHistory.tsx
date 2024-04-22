import { useForm, useFieldArray } from "react-hook-form"
import { useMutation } from 'react-query'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"

const CurrentMedicationList = z.object({
    name: z.string().min(1, 'Name is required'),
    dose: z.string().min(1, 'Dose is required'),
    prescriber: z.string().min(1, 'Prescriber is required'),
    notes: z.string().min(1, 'Notes is required')
});

const deliveryModesEnum = z.enum([
    "Vaginal",
    "Cesarean"
]);
const deliveryModes = Object.values(deliveryModesEnum.Values);

const attendedPostpartumEnum = z.enum([
    "Yes",
    "No"
]);
const attendedPostpartum = Object.values(attendedPostpartumEnum.Values);

const MaternalMedicalHistoryInputs = z.object({
    gestational_age: z.string().min(1, 'Gestational age is required'),
    anticipated_delivery_date: z.string().min(1, 'Anticipated delivery date is required'),
    planned_mode_delivery: z.string().min(1, 'Planned mode of delivery is required'),
    actual_mode_delivery: z.string().min(1, 'Actual mode of delivery is required'),
    attended_postpartum_visit: z.string(),
    postpartum_visit_location: z.string().min(1, 'Postpartum visit location is required'),
    postpartum_visit_date: z.string().min(1, 'Postpartum visit date is required'),
    total_num_pregnancies: z.string().min(1, 'Total number of pregnancies is required'),
    total_num_live_births: z.string().min(1, 'Total number of live births is required'),
    total_num_children_with_mother: z.string().min(1, 'Total number of children with mother is required'),
    prior_complications: z.string().default(""),
    current_medication_list: z.array(CurrentMedicationList),
    med_problems_diagnoses: z.string().min(1, 'required'),
    notes: z.string().min(1, 'Notes is required'),
});
type MaternalMedicalHistoryInputs = z.infer<typeof MaternalMedicalHistoryInputs>;

const MaternalMedicalHistoryResponse = MaternalMedicalHistoryInputs.extend({
    id: z.string(),
    user_id: z.string()
});

export default function MaternalMedicalHistory() {


    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<MaternalMedicalHistoryInputs>({
        resolver: zodResolver(MaternalMedicalHistoryInputs),
        defaultValues: {
            current_medication_list: [],
            planned_mode_delivery: "",
            actual_mode_delivery: "",
            attended_postpartum_visit: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'current_medication_list'
    })

    const addNewMedication = () => {
        append({
            name: '',
            dose: '',
            prescriber: '',
            notes: ''
        })
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/get_maternal_medical_history/d2bd4688-5527-4bbb-b1a8-af1399d00b12')
                const userData = response.data[response.data.length - 1];
                Object.keys(userData).forEach(key => {
                    if (key !== 'id' && key !== 'user_id') {
                        const formKey = key as keyof MaternalMedicalHistoryInputs;
                        setValue(formKey, userData[key]);
                    }
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const { mutate } = useMutation(async (data: MaternalMedicalHistoryInputs) => {
        const { data: responseData } = (await axios.post('http://127.0.0.1:5000/api/add_maternal_medical_history', { ...data, user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12" }));

        MaternalMedicalHistoryResponse.parse(responseData);

        return responseData;
    }, {
        onSuccess: (responseData) => {
            console.log("MaternalMedicalHistory data added successfully.", responseData);
        },
        onError: () => {
            alert("Error while adding MaternalMedicalHistory data.");
        }
    });

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">

                <p className="font-semibold text-red-700">Complete with OB/GYN or Primary Care Provider</p>
                <div className="w-full h-px bg-gray-300"></div>
                
                <p className="font-medium text-xl whitespace-nowrap">Prenatal Care (for current or most recent pregnancy)</p>

                <p className="font-medium">Gestational Age at Entry of Care</p>
                <input {...register("gestational_age")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.gestational_age && <span className="label-text-alt text-red-500">{errors.gestational_age.message}</span>}

                <p className="font-medium">Anticipated Delivery Date</p>
                <input {...register("anticipated_delivery_date")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                {errors.anticipated_delivery_date && <span className="label-text-alt text-red-500">{errors.anticipated_delivery_date.message}</span>}

                <p className="font-medium">Planned Mode of Delivery</p>
                <div className="flex flex-col space-y-2">
                    {deliveryModes.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("planned_mode_delivery")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                    {errors.planned_mode_delivery && <span className="label-text-alt text-red-500">{errors.planned_mode_delivery.message}</span>}
                </div>

                <p className="font-medium">Actual Mode of Delivery</p>
                <div className="flex flex-col space-y-2">
                    {deliveryModes.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("actual_mode_delivery")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                    {errors.actual_mode_delivery && <span className="label-text-alt text-red-500">{errors.actual_mode_delivery.message}</span>}
                </div>

                <p className="font-medium">Attended Postpartum Visit</p>
                <div className="flex flex-col space-y-2">
                    {attendedPostpartum.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("attended_postpartum_visit")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                    {errors.attended_postpartum_visit && <span className="label-text-alt text-red-500">{errors.attended_postpartum_visit.message}</span>}
                </div>

                <p className="font-medium">Postpartum Visit Location</p>
                <input {...register("postpartum_visit_location")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.postpartum_visit_location && <span className="label-text-alt text-red-500">{errors.postpartum_visit_location.message}</span>}

                <p className="font-medium">Date Completed</p>
                <input {...register("postpartum_visit_date")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                {errors.postpartum_visit_date && <span className="label-text-alt text-red-500">{errors.postpartum_visit_date.message}</span>}

                <p className="font-medium text-xl">Obstetric History</p>

                <p className="font-medium">Total Number of Pregnancies</p>
                <select {...register("total_num_pregnancies")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6 }, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>
                {errors.total_num_pregnancies && <span className="label-text-alt text-red-500">{errors.total_num_pregnancies.message}</span>}

                <p className="font-medium">Number of Live Births</p>
                <select {...register("total_num_live_births")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6 }, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>
                {errors.total_num_live_births && <span className="label-text-alt text-red-500">{errors.total_num_live_births.message}</span>}

                <p className="font-medium">Number of Children Living with Mother</p>
                <select {...register("total_num_children_with_mother")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6 }, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>
                {errors.total_num_children_with_mother && <span className="label-text-alt text-red-500">{errors.total_num_children_with_mother.message}</span>}

                <p className="font-medium">Please Explain Complications During Prior Pregnancies</p>
                <textarea {...register("prior_complications")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.prior_complications && <span className="label-text-alt text-red-500">{errors.prior_complications.message}</span>}

                <p className="font-medium text-xl pt-6">Medical Problems Requiring Ongoing Care</p>

                <p className="font-medium">Diagnoses</p>
                <textarea {...register("med_problems_diagnoses")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.med_problems_diagnoses && <span className="label-text-alt text-red-500">{errors.med_problems_diagnoses.message}</span>}

                <p className="font-medium text-xl">Current Medication List</p>
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <p className="font-medium pt-6">Medication {index + 1}</p>
                        <input {...register(`current_medication_list.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.current_medication_list && errors.current_medication_list[index]?.name && (
                            <span className="label-text-alt text-red-500">{errors.current_medication_list[index]?.name?.message}</span>
                        )}

                        <p className="font-medium pt-6">Dose</p>
                        <input {...register(`current_medication_list.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.current_medication_list && errors.current_medication_list[index]?.dose && (
                            <span className="label-text-alt text-red-500">{errors.current_medication_list[index]?.dose?.message}</span>
                        )}
                        <p className="font-medium pt-6">Prescriber</p>
                        <input {...register(`current_medication_list.${index}.prescriber`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.current_medication_list && errors.current_medication_list[index]?.prescriber && (
                            <span className="label-text-alt text-red-500">{errors.current_medication_list[index]?.prescriber?.message}</span>
                        )}

                        <p className="font-medium pt-6">Medication Notes</p>
                        <input {...register(`current_medication_list.${index}.notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        {errors.current_medication_list && errors.current_medication_list[index]?.notes && (
                            <span className="label-text-alt text-red-500">{errors.current_medication_list[index]?.notes?.message}</span>
                        )}
                        
                        <div className="flex justify-end">
                            <button type="button" onClick={() => remove(index)} className="text-red-600 py-2 mt-6  rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Medication</button>
                        </div>
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewMedication} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Medication</button>
                </div>

                <p className="font-medium">Other Notes</p>
                <textarea {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                {errors.notes && <span className="label-text-alt text-red-500">{errors.notes.message}</span>}

                <div className="flex justify-center">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}