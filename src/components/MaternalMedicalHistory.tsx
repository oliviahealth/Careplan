import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { MaternalMedicalHistorySchema, MaternalMedicalHistorySchemaType } from '../utils/interfaces.tsx';
import { useMutation } from 'react-query'
import axios from 'axios'

const updateMaternalDemographicsData = async (data: MaternalMedicalHistorySchemaType) => {

    const newData = { ...data, user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12" }
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/add_maternal_medical_history', newData);
        console.log("Data successfully updated:", data);
        return response.data;
    } catch (error) {
        throw new Error('Network response was not ok');
    }
};


export default function MaternalMedicalHistory() {
    const { register, control, handleSubmit } = useForm<MaternalMedicalHistorySchemaType>({
        defaultValues: {
            current_medication_list: [],
            planned_mode_delivery: "",
            actual_mode_delivery: "",
            attended_postpartum_visit: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'current_medication_list'
    })

    const removeLastMedication = () => {
        if (fields.length > 0) {
            remove(fields.length - 1);
        }
    };

    const addNewMedication = () => {
        append({
            name: '',
            dose: '',
            prescriber: '',
            notes: ''
        })
    };

    const { mutate } = useMutation(updateMaternalDemographicsData);
    const onSubmit: SubmitHandler<MaternalMedicalHistorySchemaType> = async (data) => {
        // const dateSubmitted = `${data.dateCompletedMonth} ${data.dateCompletedDay}, ${data.dateCompletedYear}`;

        // const { dateCompletedDay, dateCompletedMonth, dateCompletedYear, ...restOfData } = data;
        // const fullData = { ...restOfData };
        data.gestational_age = Number(data.gestational_age)
        data.total_num_pregnancies = Number(data.total_num_pregnancies)
        data.total_num_live_births = Number(data.total_num_live_births)
        data.total_num_children_with_mother = Number(data.total_num_children_with_mother)
        data.attended_postpartum_visit = Boolean(data.attended_postpartum_visit)

        let missingInputsString = ''

        Object.entries(data).forEach((elm) => {
            const [key, value] = elm;

            if (key === "attended_postpartum_visit") {
                return;
            }

            if (!value) {
                missingInputsString += `${key} \n\n`
            }
        })

        if (missingInputsString) {
            const userConfirmed = window.confirm(`The following data is missing, please fill them out.\n\n${missingInputsString}`);

            if (!userConfirmed) return;
        }

        try {
            const validatedData = MaternalMedicalHistorySchema.parse(data);
            const updatedData = await mutate(validatedData);

        } catch (error) {
            if (error instanceof Error && error.message) {
                console.error("Error:", error.message);
                const userConfirmed = window.confirm(`Please fix errors from the following fields.\n\n${missingInputsString}`);
                if (!userConfirmed) return;
            } else {
                console.error("An error occurred:", error);
            }
        }
    };

    // console.log(data);
    // const currentYear = new Date().getFullYear(); // function to get the current year to display in the form
    // const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(i + 1900)).reverse(); // creates an array with every year from 1900 - pres

    const deliveryModes = ["Vaginal", "Cesarean"];

    // const numberOptions =  [];
    // for (let i = 0; i <= 10; i++) {
    //     numberOptions.push(<option key={i} value={i}>{i}</option>);
    // }

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                <p className="font-medium text-xl whitespace-nowrap">Prenatal Care (for current or most recent pregnancy)</p>

                <p className="font-medium">Gestation Age at Entry of Care</p>
                <input {...register("gestational_age")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Anticipated Delivery Date</p>
                <input {...register("anticipated_delivery_date")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                <p className="font-medium">Planned Mode of Delivery</p>
                <div className="flex flex-col space-y-2">
                    {deliveryModes.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("planned_mode_delivery")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                </div>

                <p className="font-medium">Actual Mode of Delivery</p>
                <div className="flex flex-col space-y-2">
                    {deliveryModes.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("actual_mode_delivery")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                </div>

                <p className="font-medium">Attended Postpartum Visit</p>
                <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                        <input {...register("attended_postpartum_visit", { required: true })} type="radio" value="true" className="form-radio" />
                        <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input {...register("attended_postpartum_visit")} type="radio" value='' className="form-radio" />
                        <span className="ml-2">No</span>
                    </label>
                </div>

                <p className="font-medium">Postpartum Visit Location</p>
                <input {...register("postpartum_visit_location")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Date Completed</p>
                <input {...register("postpartum_visit_date")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />
                {/* <div className="flex space-x-4">
                    <select {...register("dateCompletedMonth")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                        <option disabled selected>Month</option>
                        {months.map((month, index) => (<option key={index}>{month}</option>))}
                    </select>

                    <select {...register("dateCompletedDay")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                        <option disabled selected>Day</option>
                        {Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                    </select>

                    <select {...register("dateCompletedYear")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                        <option disabled selected>Year</option>
                        {years.map((year) => (<option key={year}>{year}</option>))}
                    </select>
                </div> */}

                <p className="font-medium text-xl">Obstetric History</p>

                <p className="font-medium">Total Number of Pregnancies</p>
                <select {...register("total_num_pregnancies")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6 }, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>

                <p className="font-medium">Number of Live Births</p>
                <select {...register("total_num_live_births")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6 }, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>

                <p className="font-medium">Number of Children Living with Mother</p>
                <select {...register("total_num_children_with_mother")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6 }, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>

                <p className="font-medium">Please Explain Complications During Prior Pregnancies</p>
                <input {...register("prior_complications")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl pt-6">Medical Problems Requiring Ongoing Care</p>

                <p className="font-medium">Diagnoses</p>
                <input {...register("med_problems_diagnoses")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl">Current Medication List</p>
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <p className="font-medium pt-6">Medication {index + 1}</p>
                        <input {...register(`current_medication_list.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Dose</p>
                        <input {...register(`current_medication_list.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Prescriber</p>
                        <input {...register(`current_medication_list.${index}.prescriber`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Medication Notes</p>
                        <input {...register(`current_medication_list.${index}.notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewMedication} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Medication</button>
                    <button type="button" onClick={removeLastMedication} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Medication</button>
                </div>

                <p className="font-medium">Other Notes</p>
                <input {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                {/* <p className="font-medium">OB/GYN or Primary Provider Name</p>
                <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full" /> */}

                <div className="flex justify-center">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}