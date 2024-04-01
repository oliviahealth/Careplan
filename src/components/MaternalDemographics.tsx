import { useForm, SubmitHandler } from "react-hook-form";
import { states } from "../utils";
import { useMutation } from 'react-query'
import { MaternalDemographicsInputsSchema, MaternalDemographicsInputsType } from "../utils/interfaces";
import axios from 'axios'

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

const updateMaternalDemographicsData = async (data: MaternalDemographicsInputsType) => {

  const newData = { ...data, user_id: "d2bd4688-5527-4bbb-b1a8-af1399d00b12" }
  try {
    const response = await axios.post('http://127.0.0.1:5000/api/add_maternal_demographics', newData);
    console.log("Data successfully updated:", data);
    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

export default function MaternalDemographics() {

  const { register, handleSubmit } = useForm<MaternalDemographicsInputsType>();
  const { mutate } = useMutation(updateMaternalDemographicsData);

  const onSubmit: SubmitHandler<MaternalDemographicsInputsType> = async (formData) => {

    formData.zip_code = Number(formData.zip_code);
    formData.group_id = Number(formData.group_id);
    formData.subscriber_id = Number(formData.subscriber_id);

    let missingInputsString = ''

    Object.entries(formData).forEach((elm) => {
      const [key, value] = elm;

      if (!value) {
        missingInputsString += `${key} \n\n`
      }
    })

    if (missingInputsString) {
      const userConfirmed = window.confirm(`The following data fields are missing or invalid.\n\n${missingInputsString}`);
      if (!userConfirmed) return;
    } else {
      try {
        mutate(MaternalDemographicsInputsSchema.parse(formData));
        console.log("Data submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  return (
    <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">
        <p className="font-medium text-xl">Personal Information</p>
        <p className="font-medium">Name</p>
        <input {...register("name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">Date of Birth</p>
        <input {...register("date_of_birth")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

        <p className="font-medium text-xl">Address and Contact Information</p>

        <p className="font-medium my-6">Current Living Arrangements</p>
        <div className="flex flex-col space-y-2">
          {livingArrangements.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input {...register("current_living_arrangement")} type="radio" value={status} className="form-radio" />
              <span className="ml-2">{status}</span>
            </label>))}
        </div>


        <p className="font-medium">Street Address</p>
        <input {...register("street_address")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">City</p>
        <input {...register("city")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">State</p>
        <select  {...register("state")} className="dropdown border border-gray-300 px-2 py-2 rounded-md w-full font-medium">
          <option disabled value="">State</option>
          {states.map((state) => (<option key={state}>{state}</option>))}
        </select>

        <p className="font-medium">Zip Code</p>
        <input  {...register("zip_code", { valueAsNumber: true })} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">County</p>
        <input {...register("county")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />


        <p className="font-medium">Primary Phone Number</p>
        <input {...register("primary_phone_number")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium mb-2">Phone Type:</p>
        <div className="flex flex-col gap-2">
          {phoneType.map((type) => (
            <label key={type} className="inline-flex items-center">
              <input {...register("phone_type")} type="radio" value={type} className="form-radio" />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>


        <p className="font-medium text-xl">Emergency Contact</p>

        <p className="font-medium">Name</p>
        <input {...register("emergency_contact")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">Emergency Contact Phone Number</p>
        <input {...register("emergency_contact_phone")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">Emergency Contact Relationship</p>
        <input {...register("relationship")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        {/* radio buttons for marital status */}

        <p className="font-medium text-xl">Insurance Status</p>

        <p className="font-medium mb-2">Marital Status:</p>
        <div className="flex flex-col gap-2">
          {maritalStatus.map((status) => (
            <label key={status} className="inline-flex items-center">
              <input {...register("marital_status")} type="radio" value={status} className="form-radio" />
              <span className="ml-2">{status}</span>
            </label>
          ))}
        </div>

        <p className="font-medium">Insurance Plan</p>
        <input {...register("insurance_plan")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">Insurance Effective Date</p>
        <input {...register("effective_date")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="date" />

        <p className="font-medium">Insurance Subscriber ID</p>
        <input {...register("subscriber_id")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <p className="font-medium">Insurance Group ID</p>
        <input {...register("group_id")} className="border border-gray-300 px-4 py-2 rounded-md w-full" />

        <div className="flex justify-center">
          <button type="submit" className="bg-[#AFAFAFAF] w-full text-black px-20 py-2 mt-6 rounded-md">Save</button>
        </div>
      </form>
    </div>
  );
}
