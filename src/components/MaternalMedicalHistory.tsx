import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { months } from "../utils"

type MedicineInputs = {
    medication: string,
    dose: string,
    prescriber: string,
    medicationNotes: string,
};

type Inputs = {
    gestationAge: string,
    anticipatedDeliveryData: string,
    plannedModeDelivery: string,
    actualModeDelivery: string,
    attendedPostpartum: string,
    dateCompletedDay: string,
    dateCompletedMonth: string,
    dateCompletedYear: string,
    numPregnancies: string,
    numLiveBirths: string,
    numChildrenLivingWithMother: string,
    preganacyComplications: string,
    medications: MedicineInputs[],
    diagnoses: string,
    otherNotes: string,
    obgyn: string
}


export default function MaternalMedicalHistory() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            medications: [],
            plannedModeDelivery: "",
            actualModeDelivery: "",
            attendedPostpartum: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medications'
    })

    const removeLastMedication = () => {
        if (fields.length > 0) {
            remove(fields.length - 1);
        }
    };

    const addNewMedication = () => {
        append({
            medication: '',
            dose: '',
            prescriber: '',
            medicationNotes: ''
        })
    };

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const dateSubmitted = `${data.dateCompletedMonth} ${data.dateCompletedDay}, ${data.dateCompletedYear}`;

        const { dateCompletedDay, dateCompletedMonth, dateCompletedYear, ...restOfData } = data;
        const fullData = { ...restOfData, dateSubmitted };

        console.log(fullData);
    }
    const currentYear = new Date().getFullYear(); // function to get the current year to display in the form
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(i + 1900)).reverse(); // creates an array with every year from 1900 - pres

    const deliveryModes = ["Vaginal", "Cesarean"];

    const numberOptions =  [];
    for (let i = 0; i <= 10; i++) {
        numberOptions.push(<option key={i} value={i}>{i}</option>);
    }
    

    return(
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
                <p className="font-medium text-xl whitespace-nowrap">Prenatal Care (for current or most recent pregnancy)</p>
                
                <p className="font-medium">Gestation Age at Entry of Care</p>
                <input {...register("gestationAge")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Anticipated Delivery Date</p>
                <input {...register("anticipatedDeliveryData")} className="border border-gray-300 px-4 py-2 rounded-md w-full"   />

                <p className="font-medium">Planned Mode of Delivery</p>
                <div className="flex flex-col space-y-2">
                    {deliveryModes.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("plannedModeDelivery")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                </div>

                <p className="font-medium">Actual Mode of Delivery</p>
                <div className="flex flex-col space-y-2">
                    {deliveryModes.map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("actualModeDelivery")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                </div>

                <p className="font-medium">Attended Postpartum Visit</p>
                <div className="flex flex-col space-y-2">
                    {["Yes", "No"].map((status) => (
                        <label key={status} className="inline-flex items-center">
                            <input {...register("attendedPostpartum")} type="radio" value={status} className="form-radio" />
                            <span className="ml-2">{status}</span>
                        </label>))}
                </div>

                <p className="font-medium">Date Completed</p>
                <div className="flex space-x-4">
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
                </div>

                <p className="font-medium text-xl">Obstretric History</p>

                <p className="font-medium">Total Number of Pregnancies</p>
                <select {...register("numPregnancies")}className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6}, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>

                <p className="font-medium">Number of Live Births</p>
                <select {...register("numLiveBirths")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6}, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>

                <p className="font-medium">Number of Children Living with Mother</p>
                <select {...register("numChildrenLivingWithMother")} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
                    {Array.from({ length: 6}, (_, i) => (<option key={i} value={i}>{i}</option>))}
                </select>

                <p className="font-medium">Please Explain Complications During Prior Pregnancies</p>
                <input {...register("preganacyComplications")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl pt-6">Medical Problems Requiring Ongoing Care</p>

                <p className="font-medium">Diagnoses</p>
                <input {...register("diagnoses")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl">Current Medication List</p>
                {fields.map((field, index) => (
                    <div key={field.id} className="py-6">
                        <p className="font-medium pt-6">Medication {index + 1}</p>
                        <input {...register(`medications.${index}.medication`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Dose</p>
                        <input {...register(`medications.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Prescriber</p>
                        <input {...register(`medications.${index}.prescriber`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium pt-6">Medication Notes</p>
                        <input {...register(`medications.${index}.medicationNotes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                    </div>))}

                <div className="flex justify-center">
                    <button type="button" onClick={addNewMedication} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Medication</button>
                    <button type="button" onClick={removeLastMedication} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap" disabled={fields.length === 0}>- Remove Medication</button>
                </div>

                <p className="font-medium">Other Notes</p>
                <input {...register("otherNotes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">OB/GYN or Primary Provider Name</p>
                <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <div className="flex justify-center">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}