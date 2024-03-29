import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { months } from "../utils"

type Inputs = {
    alcohol: string,
    alcholPregnancy: string,
    alcoholMonth: string,
    alcoholDay: string,
    alcoholYear: string,
    alcoholNotes: string,

    xanex: string,
    xanexPregnancy: string,
    xanexMonth: string,
    xanexDay: string,
    xanexYear: string,
    xanexNotes: string,

    cocaine: string,
    cocainePregnancy: string,
    cocaineMonth: string,
    cocaineDay: string,
    cocaineYear: string,
    cocaineNotes: string,

    heroine: string,
    heroinePregnancy: string,
    heroineMonth: string,
    heroineDay: string,
    heroineYear: string,
    heroineNotes: string,

    kush: string,
    kushPregnancy: string,
    kushMonth: string,
    kushDay: string,
    kushYear: string,
    kushNotes: string,

    weed: string,
    weedPregnancy: string,
    weedMonth: string,
    weedDay: string,
    weedYear: string,
    weedNotes: string,

    meth: string,
    methPregnancy: string,
    methMonth: string,
    methDay: string,
    methYear: string
    methNotes: string,

    rx: string,
    rxPregnancy: string,
    rxMonth: string,
    rxDay: string,
    rxYear: string,
    rxNotes: string,

    tobacco: string,
    tobaccoPregnancy: string,
    tobaccoMonth: string,
    tobaccoDay: string,
    tobaccoYear: string,
    tobaccoNotes: string,

    substances: additionalDrugs[],
    notes: string,
    treamentCareManager: string,

};

type additionalDrugs = {
    drug: string,
    drugPregnancy: string,
    drugMonth: string,
    drugDay: string,
    drugYear: string,
    drugNotes: string,
};


export default function SubstanceAbuse() {
    const { register, control, handleSubmit } = useForm<Inputs>({
        defaultValues: {
            substances: [],
            alcohol: '',
            alcholPregnancy: '',
            xanex: '',
            xanexPregnancy: '',
            cocaine: '',
            cocainePregnancy: '',
            heroine: '',
            heroinePregnancy: '',
            kush: '',
            kushPregnancy: '',
            weed: '',
            weedPregnancy: '',
            meth: '',
            methPregnancy: '',
            rx: '',
            rxPregnancy: '',
            tobacco: '',
            tobaccoPregnancy: '',
        },
    });
}

const { fields, append, remove } = useFieldArray({
    control,
    name: 'substances'
})

const removeSubstance = () => {
    if (fields.length > 0) {
        remove(fields.length - 1);
    }
};

const addSubstance = () => {
    append({
        drug: '',
        drugPregnancy: '',
        drugMonth: '',
        drugDay: '',
        drugYear: '',
        drugNotes: '',
    })
};

const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
}

const currentYear = new Date().getFullYear;
const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(i + 1900)).reverse();

return (
    <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
        <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
            <p className="font-medium">Have they used alcohol?</p>
            <div className="flex flex-col space-y-2">
                {['Yes', 'No'].map((status) => (
                    <label key={status} className="inline-flex items-center">
                        <input {...register} />
                    </label>
                ))}
            </div>    
        </form>  
    </div>
)