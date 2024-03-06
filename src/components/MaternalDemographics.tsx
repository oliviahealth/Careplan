import { useForm, SubmitHandler } from "react-hook-form";
import { months, states, countries } from "../utils";

type MaternalDemographicsInputs = {
  firstName: string;
  lastName: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  currentLivingArrangements: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  primaryPhoneNumber: string;
  phoneType: string;
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


export default function MaternalDemographics() {
  const { register, handleSubmit, formState: { }} = useForm<MaternalDemographicsInputs>({
    defaultValues: { currentLivingArrangements: "", maritalStatus: "", phoneType: "" },
  });

  // Need to alert the user if they're submitting the form with null values
  const onSubmit: SubmitHandler<MaternalDemographicsInputs> = (data) => {
    let missingInputsString = ''

    Object.entries(data).forEach((elm) => {
      const [key, value] = elm;

      if(!value) {
        missingInputsString += `${key} \n\n`
      }
    })

    if(missingInputsString) {
      const userConfirmed = window.confirm(`The following data is missing, are you sure you want to proceed?\n\n${missingInputsString}`);

      if(!userConfirmed) return;
    }

    console.log(data);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(i + 1900)).reverse(); // Creates an array with every year from 1900 - pres to use in date of birth selector

  return (
    <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">

        <p className="font-medium">First Name</p>
        <input {...register("firstName")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">Last Name</p>
        <input {...register("lastName")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Date of Birth <span className="text-red-500">*</span></p>
        <div className="flex space-x-4">
          <select {...register('dobMonth')} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
            <option  disabled selected>Month</option>
            {months.map((month, index) => (<option key={index}>{month}</option>))}
          </select>

          <select {...register('dobDay')} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
            <option disabled selected>Day</option>
            {Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
          </select>

          <select {...register('dobYear')} className="dropdown border rounded-md border-gray-300 p-3 font-medium">
            <option disabled selected>Year</option>
            {years.map((year) => (<option key={year}>{year}</option>))}
          </select>
        </div>

          <p className="font-medium mt-6">Current Living Arrangements</p>
          <div className="flex flex-col space-y-2">
          {livingArrangements.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input {...register("currentLivingArrangements")} type="radio" value={status} className="form-radio"/>
              <span className="ml-2">{status}</span>
            </label>))}
          </div>
  

          <p className="font-medium">Street Address</p>
          <input {...register("streetAddress")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

          <p className="font-medium">City</p>
          <input {...register("city")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

          <p className="font-medium">State</p>
          <select {...register('state')} className="dropdown border border-gray-300 px-2 py-2 rounded-md w-full font-medium">
            <option disabled selected>State</option>
            {states.map((state) => (<option key={state}>{state}</option>))}
          </select>

          <p className="font-medium">Zip Code</p>
          <input {...register("zipCode")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

          <p className="font-medium">Country</p>
          {/* Material UI component for displaying country */}
          <select {...register('country')} className="dropdown border border-gray-300 px-2 py-2 rounded-md w-full font-medium">
            <option disabled selected>Country</option>
            {countries.map((country) => (<option key={country}>{country}</option>))}
          </select>
        
          <p className="font-medium">Primary Phone Number</p>
          {/* used a regex that takes phones numbers with () optional around the area code and optional dashes inbetween the digits */}
          <input {...register("primaryPhoneNumber")}className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

            <p className="font-medium mb-2">Phone Type:</p>
            <div className="flex flex-col gap-2">
            {phoneType.map((type) => (
              <label key={type} className="inline-flex items-center">
                <input {...register("phoneType")} type="radio" value={type} className="form-radio"/>
                <span className="ml-2">{type}</span>
              </label>
            ))}
            </div>
    

        <p className="font-medium">Emergency Contact</p>
        <input {...register("emergencyContact")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Emergency Contact Phone Number</p>
        <input {...register("emergencyPhoneNumber")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Emergency Contact Relationship</p>
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

        <p className="font-medium">Insurance Effective Date</p>
        <input {...register("effectiveDate")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date"/>

        <p className="font-medium">Insurance Subscriber ID</p>
        <input {...register("subscriberID")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">Insurance Group ID</p>
        <input {...register("groupID")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <p className="font-medium">OB/GYN or Primary Provider Name</p>
        <input {...register("obgyn")} className="border border-gray-300 px-4 py-2 rounded-md w-full"/>

        <div className="flex justify-center">
          <button type="submit" className="bg-[#AFAFAFAF] w-full text-black px-20 py-2 mt-6 rounded-md">Save</button>
        </div>
      </form>
    </div>
  );
}
