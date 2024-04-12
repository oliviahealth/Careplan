import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

type Inputs = {
    child_name: string;
    date_of_birth: string;
    sex: string;
    birth_weight: string;
    gestational_age_at_birth: number;
    NICU_stay: string;
    NICU_length_of_stay: string;
    pediatrician_name: string;
    pediatrician_contact_information: string;
    infant_urine_drug_screening_at_birth: string;
    infant_urine_drug_screening_at_birth_specify: string;
    meconium_results: string;
    meconium_specify: string;
    meconium_opiod_withdraw: string;
    neonatal_opiod_withdraw: string;
    neonatal_opiod_withdraw_treatment_method: string;
    DX_problems_addional_information: string;
    infant_care_needs_items: infantCareNeeds[];
    where_will_baby_sleep: string;
    where_will_baby_sleep_specify: string;
    infant_care_needs_additional_notes: string;
    infant_medication: infantMeds[];
    infant_medication_notes: string;
    father_name: string;
    father_date_of_birth: string;
    father_street_address: string;
    father_city: string;
    father_state: string;
    father_zip_code: number;
    father_primary_phone_number: string;
    father_involved_in_babys_life: string;
    father_involved_in_babys_life_comments: string;
    father_notes: string;
    
};

type infantCareNeeds = {
    breast_pump: string;
    breast_pump_notes: string;
    breastfeeding_support: string;
    breastfeeding_support_notes: string;
    car_seat: string;
    car_seat_notes: string;
    childcare: string;
    childcare_notes: string;
    clothing: string;
    clothing_notes: string;
    crib: string;
    crib_notes: string;
    diapers: string;
    diapers_notes: string;
    infant_formula: string;
    infant_formula_notes: string;
    infant_stroller: string;
    infant_stroller_notes: string;
    other: string;
    other_notes: string;
};

type infantMeds = {
    medication: string;
    dose: string;
    prescriber: string;
    notes: string;
};

export default function InfantInformation() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            infant_medication: [{
                medication: '',
                dose: '',
                prescriber: '',
                notes: ''
            }],

            infant_care_needs_items: [{
                breast_pump: '',
                breast_pump_notes: '',
                breastfeeding_support: '',
                breastfeeding_support_notes: '',
                car_seat: '',
                car_seat_notes: '',
                childcare: '',
                childcare_notes: '',
                clothing: '',
                clothing_notes: '',
                crib: '',
                crib_notes: '',
                diapers: '',
                diapers_notes: '',
                infant_formula: '',
                infant_formula_notes: '',
                infant_stroller: '',
                infant_stroller_notes: '',
                other: '',
                other_notes: ''

            }]
        },
    });

    const { fields: infantMedsFields, append: appendInfantMed, remove: removeInfantMed } = useFieldArray({
        control,
        name: "infant_medication"
    });

    const { fields: infantCareNeedsItemsFields } = useFieldArray({
        control,
        name: "infant_care_needs_items"
    })

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };
    
    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4">
                <p className="font-medium">Child's Name</p>
                <input {...register("child_name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Date of Birth</p>
                <input {...register("date_of_birth")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Sex</p>
                {["Male", "Female"].map((status) => (
                    <label key={status} className="flex items-center">
                        <input {...register("sex")} className="mr-2" type="radio" value={status} />
                        {status}
                    </label>))}
                
                <p className="font-medium">Birth Weight</p>
                <select {...register("birth_weight")} className="form-select border border-gray-300 rounded-md px-2 py-2">
                    {Array.from({ length: (15.0 - 0.0) * 10 + 1}, (_, index) => (index / 10).toFixed(1)).map((weight) => (
                        <option value={weight} key={weight}>
                            {weight} lbs
                        </option>))}
                </select>

                <p className="font-medium">Gestational Age at Birth</p>
                <select {...register("gestational_age_at_birth")} className="form-select border border-gray-300 rounded-md px-2 py-2">
                    {Array.from({ length: 51 }, (_, index) => index).map((week) => (
                        <option key={week} value={week}>
                            {week} {week === 1 ? 'week' : 'weeks'}
                         </option>))}
                    </select>
                
                <p className="font_medium">NICU</p>
                {["Yes", "No"].map((status) => (
                    <label key={status} className="flex items-center">
                        <input {...register("NICU_stay")} className="mr-2" type="radio" value={status} />
                        {status}
                    </label>))}

                <p className="font-medium">Length of Stay (Days)</p>
                <input {...register("NICU_length_of_stay")} className="border border-gray-300 px-4 py-2" />

                <p className="font-medium">Pediatricain Name</p>
                <input {...register("pediatrician_name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Pediatrican Phone Number</p>
                <input {...register("pediatrician_contact_information")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Infant Urine Drug Screening at Birth</p>
                {["Negative", "Not Completed", "Positive"].map((status) => (
                    <label key={status} className="flex items-center">
                        <input {...register("infant_urine_drug_screening_at_birth")} className="mr-2" type="radio" value={status} />
                        {status}
                    </label>))}
                
                <p className="font-medium">Specify</p>
                <input {...register("infant_urine_drug_screening_at_birth_specify")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Meconium Results</p>
                {["Negative", "Not Completed", "Positive"].map((status) => (
                    <label key={status} className="flex items-center">
                        <input {...register("meconium_results")} className="mr-2" type="radio" value={status} />
                        {status}
                    </label>))}

                <p className="font-medium">Specify</p>
                <input {...register("meconium_specify")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">Neonatal Opiod Withdraw/Neonatal Abstinence Syndrom</p>
                {["Yes", "No"].map((status) => (
                    <label key={status} className="flex items-center">
                        <input {...register("neonatal_opiod_withdraw")} className="mr-2" type="radio" value={status} />
                        {status}
                    </label>))}
                
                <p className="font-medium">Treatement Method</p>
                <input {...register("neonatal_opiod_withdraw_treatment_method")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium">DX/Problems and Additional Information</p>
                <input {...register("DX_problems_addional_information")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl">Infant Care Needs</p>

                {infantCareNeedsItemsFields.map((item, index) => (
                    <div key={item.id} className="space-y-4">
                        <p className="font-medium">Breast Pump</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.breast_pump`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.breast_pump_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Breastfeeding Support</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.breastfeeding_support`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.breastfeeding_support_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Car Seat</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.car_seat`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.car_seat_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


                        <p className="font-medium">Childcare</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.childcare`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.childcare_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Clothing</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.clothing`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.clothing_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Crib</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.crib`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.crib_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Diapers</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.diapers`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.diapers_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


                        <p className="font-medium">Infant Formula</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.infant_formula`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.infant_formula_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


                        <p className="font-medium">Infant Stroller</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.infant_stroller`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.infant_stroller_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


                        <p className="font-medium">Other</p>
                        {["No", "Yes", "Pending"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register(`infant_care_needs_items.${index}.other`)} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                        <p className="font-medium">Notes</p>
                        <input {...register(`infant_care_needs_items.${index}.other_notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                    </div>))}

                    <p className="font-medium">Where Will Baby Sleep</p>
                    {["Crib/Bassinet", "Sharing a Bed With Others", "Other"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register("where_will_baby_sleep")} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}
                    <input {...register("where_will_baby_sleep_specify")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Additional Notes</p>
                    <input {...register("infant_care_needs_additional_notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium text-xl">Infant's Medications</p>
                    {infantMedsFields.map((item, index) => (
                        <div key={item.id} className="space-y-6 pt-6">
                            <p className="font-medium">Medication</p>
                            <input {...register(`infant_medication.${index}.medication`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                            <p className="font-medium">Dose</p>
                            <input {...register(`infant_medication.${index}.dose`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                            <p className="font-medium">Prescriber</p>
                            <input {...register(`infant_medication.${index}.prescriber`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                            <p className="font-medium">Notes</p>
                            <input {...register(`infant_medication.${index}.notes`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                        </div>))}

                        <div className="flex justify-between pt-6">
                            <button type="button" onClick={() => appendInfantMed({medication: '', dose: '', prescriber: '', notes: ''})} className="text-black px-4 py-2 rounded-md">+ Add Medication</button>
                            <button type="button" onClick={() => infantMedsFields.length > 0 && removeInfantMed(infantMedsFields.length - 1)} className="text-red-600 px-4 py-2 rounded-md">- Remove Medication</button>
                        </div>

                    <p className="font-medium text-xl">Infant's Father Demographics</p>
                    
                    <p className="font-medium">Name</p>
                    <input {...register("father_name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Date of Birth</p>
                    <input {...register("father_date_of_birth")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                    <p className="font-medium">Street Address</p>
                    <input {...register("father_street_address")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">City</p>
                    <input {...register('father_city')} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">State</p>
                    <input {...register("father_state")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Zip Code</p>
                    <input {...register("father_zip_code")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Phone Number</p>
                    <input {...register("father_primary_phone_number")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <p className="font-medium">Will be/is involved in Baby's Life</p>
                    {["Yes", "No", "Unsure"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input {...register("father_involved_in_babys_life")} className="mr-2" type="radio" value={status} />
                                {status}
                            </label>))}

                    <p className="font-medium">Comments</p>
                    <input {...register("father_involved_in_babys_life_comments")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


                    <p className="font-medium">Additional Notes</p>
                    <input {...register("father_notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                    <div className="flex justify-center py-6">
                        <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                    </div>
            </form>
        </div>
    )
}