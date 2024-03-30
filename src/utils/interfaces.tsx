import { z } from 'zod'

const CurrentMedicationListSchema = z.object({
    name: z.string(),
    dose: z.string(),
    prescriber: z.string(),
    notes: z.string(),
});
export const MaternalMedicalHistorySchema = z.object({
    gestational_age: z.number(),
    anticipated_delivery_date: z.string(),
    planned_mode_delivery: z.string(),
    actual_mode_delivery: z.string(),
    attended_postpartum_visit: z.boolean(),
    postpartum_visit_location: z.string(),
    postpartum_visit_date: z.string(),
    total_num_pregnancies: z.number(),
    total_num_live_births: z.number(),
    total_num_children_with_mother: z.number(),
    prior_complications: z.string(),
    current_medication_list: z.array(CurrentMedicationListSchema),
    med_problems_diagnoses: z.string(),
    notes: z.string(),
});
export type MaternalMedicalHistorySchemaType = z.infer<typeof MaternalMedicalHistorySchema>;