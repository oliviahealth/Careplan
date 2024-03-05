/* 
This component is meant to display the Maternal Demographic Form that is found on the top half of Page 7 of the Plan of Self Care Document
*/

import { useForm, SubmitHandler } from "react-hook-form";
import { months, states, countries } from "../utils";

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
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  primaryPhoneNumber: string;
  phone_type: string;
  emergencyContact: string;
  emergencyPhoneNumber: string;
  emergencyRelationship: string;
  maritalStatus: string;
  insurancePlan: string;
  effectiveDate: string;
  subscriberID: number;
  groupID: number;
  obgyn: string;
};

/**
 *
 * @returns a form for the Maternal Demographics found on the top half of Page 7 of the Plan of Self Care Document
 * @param takes no props
 */
export default function MaternalDemographics() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<Inputs>({
    defaultValues: {
      homeStatus: "",
      maritalStatus: "",
      phone_type: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const currentYear = new Date().getFullYear(); // function to get the current year to display in the form
  const years = Array.from({ length: currentYear - 1899 }, (_, i) =>
    String(i + 1900)
  ).reverse(); // creates an array with every year from 1900 - pres
  const livingArrangements = [
    "Rent/Own a Home",
    "Living with Relatives or Friends",
    "Residential Treatment Center",
    "Correctional Facility",
    "Emergency Shelter",
    "Homeless",
    "Other",
  ];
  const phoneType = ["Mobile", "Home", "Other"];
  const maritalStatus = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
  ];

  return (
    <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
        <p className="font-medium">First Name <span className="text-red-500">*</span></p>
        <input {...register("firstName", { required: true })} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        {errors.firstName && isSubmitted && (<span className="text-red-500">First Name is required</span>)}

        <p className="font-medium">Last Name <span className="text-red-500">*</span></p>
        <input {...register("lastName", { required: true })} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        {errors.lastName && isSubmitted && (<span className="text-red-500">Last Name is required</span>)}

        <p className="font-medium">Date of Birth</p>
        <div className="flex space-x-4">
          <select className="dropdown border rounded-md border-gray-300 p-3 font-medium">
            <option disabled selected>Month</option>
            {months.map((month, index) => (<option key={index}>{month}</option>))}
          </select>

          <select className="dropdown border rounded-md border-gray-300 p-3 font-medium">
            <option disabled selected>Day</option>
            {Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
          </select>

          <select className="dropdown border rounded-md border-gray-300 p-3 font-medium">
            <option disabled selected>Year</option>
            {years.map((year) => (<option key={year}>{year}</option>))}
          </select>
        </div>

          <p className="font-medium mt-6">Current Living Arrangements</p>
          <div className="flex flex-col space-y-2">
          {livingArrangements.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input {...register("homeStatus")} type="radio" value={status} className="form-radio"/>
              <span className="ml-2">{status}</span>
            </label>))}
          </div>
  

          <p className="font-medium">Street Address</p>
          <input {...register("streetAddress")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

          <p className="font-medium">City</p>
          <input {...register("city")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

          <p className="font-medium">State</p>
          <select className="dropdown border border-gray-300 px-2 py-2 rounded-md w-full font-medium">
            <option disabled selected>State</option>
            {states.map((state) => (<option key={state}>{state}</option>))}
          </select>

          <p className="font-medium">Zip Code</p>
          {/* used a regex that will only accept 5 digit numbers and nothing else */}
          <input {...register("zipCode", { pattern: { value: /^\d{5}$/, message: "must be a 5 digit number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
          {errors.zipCode?.message && isSubmitted && (<span className="text-red-500">Must be a 5 digit number</span>)}

          <p className="font-medium">Country</p>
          {/* Material UI component for displaying country */}
          <select className="dropdown border border-gray-300 px-2 py-2 rounded-md w-full font-medium">
            <option disabled selected>Country</option>
            {countries.map((country) => (<option key={country}>{country}</option>))}
          </select>
        
          <p className="font-medium">Primary Phone Number</p>
          {/* used a regex that takes phones numbers with () optional around the area code and optional dashes inbetween the digits */}
          <input {...register("primaryPhoneNumber", {pattern: {value: /^(\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$/,message: "Must be a valid phone number",},})}className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
          {errors.primaryPhoneNumber && errors.primaryPhoneNumber.message && isSubmitted && (<span className="text-red-500">Must be a valid Phone number</span>)}

            <p className="font-medium mb-2">Phone Type:</p>
            <div className="flex flex-col gap-2">
            {phoneType.map((type) => (
              <label key={type} className="inline-flex items-center">
                <input {...register("phone_type")} type="radio" value={type} className="form-radio"/>
                <span className="ml-2">{type}</span>
              </label>
            ))}
            </div>
    

        <p className="font-medium">Emergency Contact</p>
        <input {...register("emergencyContact")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Phone Number</p>
        {/* used a regex that takes phones numbers with () optional around the area code and optional dashes inbetween the digits */}
        <input {...register("emergencyPhoneNumber", {pattern: {value: /^(\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$/,message: "Must be a valid phone number",},})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.emergencyPhoneNumber?.message && isSubmitted && (<span className="text-red-500">Must be a valid Phone Number</span>)}

        <p className="font-medium">Relationship</p>
        <input {...register("emergencyRelationship")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        {/* radio buttons for marital status */}
        <p className="font-medium mb-2">Marital Status:</p>
        <div className="flex flex-col gap-2">
          {maritalStatus.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input {...register("maritalStatus")} type="radio" value={status} className="form-radio"/>
              <span className="ml-2">{status}</span>
            </label>
          ))}
        </div>

        <p className="font-medium">Insurance Plan</p>
        <input {...register("insurancePlan")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Effective Date</p>
        <input {...register("effectiveDate")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date"/>

        <p className="font-medium">Subscriber ID</p>
        {/* regex that only accepts numbers of any length of digits */}
        <input {...register("subscriberID", {pattern: {value: /^\d+$/, message: "Subscriber ID must be a number"}})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.subscriberID && isSubmitted && (<span className="text-red-500">{errors.subscriberID.message}</span>)}

        <p className="font-medium">Group ID</p>
        {/* regex that only accepts numbers of any length of digits */}
        <input {...register("groupID", {pattern: { value: /^\d+$/, message: "Group ID must be a number" }})} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>
        {errors.groupID && isSubmitted && (<span className="text-red-500">{errors.groupID.message}</span>)}

        <p className="font-medium">OB/GYN or Primary Provider Name</p>
        <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <div className="flex justify-center">
          <button type="submit" className="bg-[#AFAFAFAF] text-black px-20 py-2 mt-6 rounded-md">Save</button>
        </div>
      </form>
    </div>
  );
}
