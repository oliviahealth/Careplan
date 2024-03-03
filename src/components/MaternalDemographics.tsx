/* 
This component is meant to display the Maternal Demographic Form that is found on the top half of Page 7 of the Plan of Self Care Document
*/

import { useForm, SubmitHandler } from "react-hook-form";

// tsx interface for all of the input fields
type Inputs = {
  firstName: string;
  lastName: string;
  //dob: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  homeStatus: "Rent/Own a Home" | "Living with Relatives or Friends" | "Residential Treatment Center" | "Correctional Facility" | "Emergency Shelter" | "Homeless" | "Other";
  street_address: string;
  city: string;
  state: string;
  zip_code: number;
  country: string;
  primary_phone_number: string; 
  phone_type: "Mobile" | "Home" | "Other";
  emergency_contact: string;
  emergency_phone_number: string;
  emergency_relationship: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "Separated";
  insurance_plan: string;
  effective_date: string;
  subscriber_id: number;
  group_id: number;
  obgyn: string;
};

export default function MaternalDemographics() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 1899}, (_, i) => String(i + 1900)).reverse();
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "Washington D.C."
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
  
  return (
    <div className="w-[30rem] mx-auto mt-[10rem] p-2 rounded-xl font-OpenSans">
      <legend className="text-white text-xl mb-2">
        Maternal Demographics Form
      </legend>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="input_label">First Name *</p>
        <input
          {...register("firstName", { required: true })}
          className="input_field"
        />
        {errors.firstName && (
          <span className="required_field">First Name is required</span>
        )}

        <p className="input_label">Last Name *</p>
        <input
          {...register("lastName", { required: true })}
          className="input_field"
        />
        {errors.lastName && (
          <span className="required_field">Last Name is required</span>
        )}

        <p className="input_label">Date of Birth</p>
        <div className="flex space-x-2 mb-4">
          <select
            {...register("dobMonth")}
            className="input_field"
          >
            <option value="" disabled selected>
              Month
            </option>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            {...register("dobDay")}
            className="input_field"
          >
            <option value="" disabled selected>
              00
            </option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            {...register("dobYear")}
            className="input_field"
          >
            <option value="" disabled selected>
              0000
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-col gap-2">
          <p className="input_label">Current Housing Status</p>
          <legend className="text-white mb-2">Housing Status:</legend>
          {[
            "Rent/Own a Home",
            "Living with Relatives or Friends",
            "Residential Treatment Center",
            "Correctional Facility",
            "Emergency Shelter",
            "Homeless",
            "Other",
          ].map((status) => (
            <label key={status} className="inline-flex items-center">
              <input
                {...register("homeStatus")}
                type="radio"
                value={status}
                className="form-radio"
              />
              <span className="ml-2">{status}</span>
            </label>
          ))}
        </fieldset>

        <p className="input_label">Street Address</p>
        <input
          {...register("street_address", {
            pattern: {
              value: /^\d+\s[A-Za-z\s]+$/,
              message: "ex: 123 Main Street",
            },
          })}
          className="input_field"
        />
        {errors.street_address?.message && (
          <span className="required_field">
            Must be in this form: 123 Main Street
          </span>
        )}

        <p className="input_label">City</p>
        <input
          {...register("city")}
          className="input_field"
        />

        <p className="input_label">State</p>
        <select
          {...register("state")}
          className="input_field"
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <p className="input_label">Zip Code</p>
        <input
          {...register("zip_code", {
            pattern: { value: /^\d{5}$/, message: "must be a 5 digit number" },
          })}
          className="input_field"
        />
        {errors.zip_code?.message && (
          <span className="required_field">Must be a 5 digit number</span>
        )}

        <p className="input_label">Country</p>
        <input
          {...register("country")}
          className="input_field"
        />

        <p className="input_label">Primary Phone Number</p>
        <input
          {...register("primary_phone_number", {
            pattern: {
              value: /^(\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$/,
              message: "Must be a valid phone number",
            },
          })}
          className="input_field"
        />
        {errors.primary_phone_number && errors.primary_phone_number.message && (
          <span className="required_field">Must be a valid Phone number</span>
        )}

        <fieldset className="flex flex-col gap-2">
          <legend className="input_label mb-2">Phone Type:</legend>
          {["Mobile", "Home", "Other"].map((type) => (
            <label key={type} className="inline-flex items-center">
              <input
                {...register("phone_type")}
                type="radio"
                value={type}
                className="form-radio"
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </fieldset>

        <p className="input_label">Emergency Contact</p>
        <input
          {...register("emergency_contact")}
          className="input_field"
        />

        <p className="input_label">Phone Number</p>
        <input
          {...register("emergency_phone_number", {
            pattern: {
              value: /^(\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4}$/,
              message: "Must be a valid phone number",
            },
          })}
          className="input_field"
        />
        {errors.emergency_phone_number?.message && (
          <span className="required_field">Must be a valid Phone Number</span>
        )}

        <p className="input_label">Relationship</p>
        <input
          {...register("emergency_relationship")}
          className="input_field"
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="input_label mb-2">Marital Status:</legend>
          {["Single", "Married", "Divorced", "Widowed", "Separated"].map(
            (status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  {...register("maritalStatus")}
                  type="radio"
                  value={status}
                  className="form-radio"
                />
                <span className="ml-2">{status}</span>
              </label>
            )
          )}
        </fieldset>

        <p className="input_label">Insurance Plan</p>
        <input
          {...register("insurance_plan")}
          className="input_field"
        />

        <p className="input_label">Effective Date</p>
        <input
          {...register("effective_date")}
          className="input_field"
          type="date"
        />

        <p className="input_label">Subscriber ID</p>
        <input
          {...register("subscriber_id")}
          className="input_field"
        />

        <p className="input_label">Group ID</p>
        <input
          {...register("group_id")}
          className="input_field"
        />

        <p className="input_label">OB/GYN or Primary Provider Name</p>
        <input
          {...register("obgyn")}
          className="input_field"
        />

        <button
          type="submit"
          className="bg-[#AFAFAFAF] text-black px-20 py-2 rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  );
}
