/* 
This component is meant to display the Maternal Demographic Form that is found on the top half of Page 7 of the Plan of Self Care Document
*/

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { months, states, countries, livingArrangements, phoneType, maritalStatus } from "../utils";

/**
 * TypeScript Interface that defines what data types are meant for each field in the form
 */
type Inputs = {
  firstName: string;
  lastName: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  homeStatus: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: number;
  country: string;
  primary_phone_number: string;
  phone_type: string;
  emergency_contact: string;
  emergency_phone_number: string;
  emergency_relationship: string;
  maritalStatus: string;
  insurance_plan: string;
  effective_date: string;
  subscriber_id: number;
  group_id: number;
  obgyn: string;
};

/**
 *
 * @returns a form for the Maternal Demographics found on the top half of Page 7 of the Plan of Self Care Document
 */
export default function MaternalDemographics() {
  const { register, handleSubmit, control, formState: { errors, isSubmitted }} = useForm<Inputs>({
    defaultValues: {
      homeStatus: "", // Set the default value to an empty string
      maritalStatus: "",
      phone_type: ""
    }
  });
  
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const currentYear = new Date().getFullYear(); // function to get the current year to display in the form
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(i + 1900)).reverse(); // creates an array with every year from 1900 - pres

  return (
    <div className="w-[30rem] mx-auto mt-[10rem] p-2 rounded-xl font-OpenSans">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="font-medium">First Name *</p>
        <input {...register("firstName", { required: true })} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        {errors.firstName && isSubmitted && (<span className="text-red-500">First Name is required</span>)}

        <p className="font-medium">Last Name *</p>
        <input {...register("lastName", { required: true })} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        {errors.lastName && isSubmitted && (<span className="text-red-500">Last Name is required</span>)}

        <p className="font-medium">Date of Birth</p>
        <div className="flex space-x-2 mb-4">
          {/* Material UI component for the selector for DOB */}
          <FormControl fullWidth>
            <InputLabel id="dob-month-label">Month</InputLabel>
            <Controller name="dobMonth" control={control} defaultValue="" render={({ field }) => (
                <Select labelId="dob-month-label" {...field} label="Month">
                  <MenuItem value="" disabled>Month</MenuItem>
                  {months.map((month, index) => (<MenuItem key={month} value={index + 1}>{month}</MenuItem>))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="dob-day-label">Day</InputLabel>
            <Controller name="dobDay" control={control} defaultValue="" render={({ field }) => (
                <Select labelId="dob-day-label" {...field} label="Day">
                  <MenuItem value="" disabled>Day</MenuItem>
                  {Array.from({ length: 31 }, (_, i) => (<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="dob-year-label">Year</InputLabel>
            <Controller name="dobYear" control={control} defaultValue=""
              render={({ field }) => (
                <Select labelId="dob-year-label" {...field} label="Year">
                  <MenuItem value="" disabled>Year</MenuItem>
                  {years.map((year) => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
                </Select>
              )}
            />
          </FormControl>
        </div>

        <fieldset className="flex flex-col gap-2">
          <p className="font-medium mt-6">Current Living Arrangements</p>
          {livingArrangements.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input {...register("homeStatus")} type="radio" value={status} className="form-radio"/>
              <span className="ml-2">{status}</span>
            </label>
          ))}
        </fieldset>

        <p className="font-medium">Street Address</p>
        <input {...register("street_address", { pattern: { value: /^\d+\s[A-Za-z\s]+$/, message: "Must be a valid address" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.street_address?.message && isSubmitted && (<span className="text-red-500">{errors.street_address.message}</span>)}

        <p className="font-medium">City</p>
        <input {...register("city")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">State</p>
        {/* Material UI component for displaying states */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="state-select-label">State</InputLabel>
          <Controller name="state" control={control} defaultValue="" render={({ field }) => (
              <Select labelId="state-select-label" {...field} label="State">
                {states.map((state) => (<MenuItem key={state} value={state}>{state}</MenuItem>))}
              </Select>
            )}
          />
        </FormControl>

        <p className="font-medium">Zip Code</p>
        {/* used a regex that will only accept 5 digit numbers and nothing else */}
        <input {...register("zip_code", { pattern: { value: /^\d{5}$/, message: "must be a 5 digit number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.zip_code?.message && isSubmitted && (<span className="text-red-500">Must be a 5 digit number</span>)}

        <p className="font-medium">Country</p>
        {/* Material UI component for displaying country */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="country-select-label">Country</InputLabel>
          <Controller name="country" control={control} defaultValue="" render={({ field }) => (
              <Select labelId="country-select-label" {...field} label="Country">
                {countries.map((country) => (<MenuItem key={country} value={country}>{country}</MenuItem>))}
              </Select>
            )}
          />
        </FormControl>

        <p className="font-medium">Primary Phone Number</p>
        {/* used a regex that takes phones numbers with () optional around the area code and optional dashes inbetween the digits */}
        <input {...register("primary_phone_number", { pattern: { value: /^(\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$/, message: "Must be a valid phone number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full" />
        {errors.primary_phone_number && errors.primary_phone_number.message && isSubmitted &&  (<span className="text-red-500">Must be a valid Phone number</span>)}

        <fieldset className="flex flex-col gap-2">
          <legend className="font-medium mb-2">Phone Type:</legend>
          {phoneType.map((type) => (
            <label key={type} className="inline-flex items-center">
              <input {...register("phone_type")} type="radio" value={type} className="form-radio"/>
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </fieldset>

        <p className="font-medium">Emergency Contact</p>
        <input {...register("emergency_contact")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Phone Number</p>
        {/* used a regex that takes phones numbers with () optional around the area code and optional dashes inbetween the digits */}
        <input {...register("emergency_phone_number", { pattern: { value: /^(\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$/, message: "Must be a valid phone number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.emergency_phone_number?.message && isSubmitted && (<span className="text-red-500">Must be a valid Phone Number</span>)}

        <p className="font-medium">Relationship</p>
        <input {...register("emergency_relationship")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <fieldset className="flex flex-col gap-2">
          {/* radio buttons for marital status */}
          <legend className="font-medium mb-2">Marital Status:</legend>
          {maritalStatus.map((status) => (
              <label key={status} className="inline-flex items-center">
                <input {...register("maritalStatus")} type="radio" value={status} className="form-radio"/>
                <span className="ml-2">{status}</span>
              </label>
            )
          )}
        </fieldset>

        <p className="font-medium">Insurance Plan</p>
        <input {...register("insurance_plan")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Effective Date</p>
        <input {...register("effective_date")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date"/>
        
        <p className="font-medium">Subscriber ID</p>
        {/* regex that only accepts numbers of any length of digits */}
        <input {...register("subscriber_id", { pattern: { value: /^\d+$/, message: "Subscriber ID must be a number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.subscriber_id && isSubmitted &&(<span className="text-red-500">{errors.subscriber_id.message}</span>)}

       <p className="font-medium">Group ID</p>
       {/* regex that only accepts numbers of any length of digits */}
        <input {...register("group_id", { pattern: { value: /^\d+$/, message: "Group ID must be a number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.group_id && isSubmitted &&(<span className="text-red-500">{errors.group_id.message}</span>)}

        <p className="font-medium">OB/GYN or Primary Provider Name</p>
        <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <div className="flex justify-center">
          {/* div to center button */}
          <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
        </div>
        
      </form>
    </div>
  );
}