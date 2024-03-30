import { z } from 'zod';

const livingArrangementsEnum = z.enum([
    "Rent/Own a Home",
    "Living with Relatives or Friends",
    "Residential Treatment Center",
    "Correctional Facility",
    "Emergency Shelter",
    "Homeless",
    "Other",
]);
const phoneTypeEnum = z.enum(["Mobile", "Home", "Other"]);
const maritalStatusEnum = z.enum([
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
]);
export const MaternalDemographicsInputsSchema = z.object({
    name: z.string(),
    // lastName: z.string(),
    date_of_birth: z.string(),
    current_living_arrangement: livingArrangementsEnum,
    street_address: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.number(),
    county: z.string(),
    primary_phone_number: z.string(),
    phone_type: phoneTypeEnum,
    emergency_contact: z.string(),
    emergency_contact_phone: z.string(),
    relationship: z.string(),
    marital_status: maritalStatusEnum,
    insurance_plan: z.string(),
    effective_date: z.string(),
    subscriber_id: z.number(),
    group_id: z.number(),
    // obgyn: z.string(),
});
export type MaternalDemographicsInputsType = z.infer<typeof MaternalDemographicsInputsSchema>