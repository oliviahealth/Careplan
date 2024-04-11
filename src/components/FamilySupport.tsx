import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

type HouseholdMember = {
    person: string;
    date_of_birth: string;
    relation: string;
};

type Child = {
    name: string;
    dob: string;
    caregiver_name: string;
    caregiver_phone: string;
};

type Goals = {
    goal: string;
};

type SupportSystem = {
    name: string;
    relation: string;
};

type Inputs = {
    household_members: HouseholdMember[];
    children: Child[];
    goals: Goals[];
    support_systems: SupportSystem[];
    notes: string
    social_worker: string;
    strength_of_support: string;
};

export default function FamilySupport() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            household_members: [{
                person: '',
                date_of_birth: '',
                relation: '',
            }],
            children: [{
                name: '',
                dob: '',
                caregiver_name: '',
                caregiver_phone: '',
            }],
            goals: [{
                goal: '',
            }],
            support_systems: [{
                name: '',
                relation: '',
            }],
        },
    });

    const { fields: householdMemberFields, append: appendHouseholdMember, remove: removeHouseholdMember } = useFieldArray({
        control,
        name: 'household_members'
    });

    const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
        control,
        name: 'children'
    });

    const { fields: goalsFields, append: appendGoal, remove: removeGoal } = useFieldArray({
        control,
        name: 'goals'
    });

    const { fields: supportFields, append: appendSupport, remove: removeSupport } = useFieldArray({
        control,
        name: 'support_systems'
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };

    return (
        <div className="flex justify-center w-full p-2 mt-2 text-base">
            <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input,&>textarea]:px-4">
                <p className="font-medium text-xl">Current Living Arrangement</p>
                {householdMemberFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-6">
                        <p className="font-medium">Household Member Name</p>
                        <input key={field.id} {...register(`household_members.${index}.person`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Date of Birth</p>
                        <input key={field.id} {...register(`household_members.${index}.date_of_birth`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                        <p className="font-medium">Relation</p>
                        <input key={field.id} {...register(`household_members.${index}.relation`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
                    </div>))}

                    <div className="flex justify-center">
                            <button type="button" onClick={() => appendHouseholdMember({ person: '', date_of_birth: '', relation: '' })} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Member</button>
                            <button type="button" onClick={() => removeHouseholdMember()} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Member</button>
                        </div>
                
                {childrenFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-6">
                        <p className="font-medium">Client's Children NOT Living in the home</p>
                        <input key={field.id} {...register(`children.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Date of Birth</p>
                        <input key={field.id} {...register(`children.${index}.dob`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

                        <p className="font-medium">Caregiver Name</p>
                        <input key={field.id} {...register(`children.${index}.caregiver_name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Caregiver Phone Number</p>
                        <input key={field.id} {...register(`children.${index}.caregiver_phone`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <div className="flex justify-center">
                            <button type="button" onClick={() => appendChild({ name: '', dob: '', caregiver_name: '', caregiver_phone: '' })} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Another Child</button>
                            <button type="button" onClick={() => removeChild(index)} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Child</button>
                        </div>
                    </div>))}

                <p className="font-medium">Notes</p>
                <input {...register("notes")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl">Current Support System</p>

                {supportFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-6">
                        <p className="font-medium">Name</p>
                        <input key={field.id} {...register(`support_systems.${index}.name`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <p className="font-medium">Relation</p>
                        <input key={field.id} {...register(`support_systems.${index}.relation`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <div className="flex justify-center">
                            <button type="button" onClick={() => appendSupport({ name: '', relation: '' })} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Support</button>
                            <button type="button" onClick={() => removeSupport(index)} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Support</button>
                        </div>
                    </div>))}

                <p className="font-medium">Strengths of Client and Support System</p>
                <input {...register("strength_of_support")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                <p className="font-medium text-xl">Goals (Parenting, Breastfeeding, Recovery, Etc.)</p>

                {goalsFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 py-6">
                        <p className="font-medium">Goal</p>
                        <input key={field.id} {...register(`goals.${index}.goal`)} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

                        <div className="flex justify-center pb-6">
                            <button type="button" onClick={() => appendGoal({ goal: '' })} className="text-black px-20 py-2 mt-6 rounded-md whitespace-nowrap">+ Add Goal</button>
                            <button type="button" onClick={() => removeGoal(index)} className="text-red-600 px-20 py-2 mt-6 rounded-md whitespace-nowrap">- Remove Goal</button>
                        </div>
                    </div>))}

                <div className="flex justify-center py-6">
                    <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}