import FormSelector from "./FormSelector";
import LeftSidebar from "./LeftSidebar";

import useAppStore from '../../store/useAppStore.ts';

function Dashboard() {

  const { user } = useAppStore();
  const user_id = user ? user.id : "";
  console.log(user_id)

  return (
    <div className="flex flex-row">
      <LeftSidebar />
      <div className="pl-10 pr-32 py-10 w-full">
        <div className="flex flex-row justify-between items-center md:items-baseline">
          <div className="flex text-3xl font-semibold">First Name Last Name</div>
          <div className="flex pr-10">
            <img className="w-6 hidden md:block" src="./images/meatballs.svg"></img>
            <img className="h-8 md:hidden block" src="./images/kebab.svg"></img>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <FormSelector name="Maternal Demographics" path="/maternal-demographics" apiUrl="maternal_demographics" userID={user_id}></FormSelector>
          <FormSelector name="Maternal Medical History" path="/maternal-medical-history" apiUrl="maternal_medical_history" userID={user_id}></FormSelector>
          <FormSelector name="Psychiatric History" path="/psychiatric-history" apiUrl="psychiatric_history" userID={user_id}></FormSelector>
          <FormSelector name="Medical Services For Substance Use" path="/medical-services-for-substance-use" apiUrl="medical_services_for_substance_use" userID={user_id}></FormSelector>
          <FormSelector name="Substance Use History" path="/substance-use-history" apiUrl="substance_use_history" userID={user_id}></FormSelector>
          <FormSelector name="Drug Screening Results" path="/drug-screening-results" apiUrl="drug_screening_results" userID={user_id}></FormSelector>
          <FormSelector name="Family & Supports" path="/family-and-supports" apiUrl="family_and_supports" userID={user_id}></FormSelector>
          <FormSelector name="Infant Information" path="/infant-information" apiUrl="infant_information" userID={user_id}></FormSelector>
          <FormSelector name="Referrals and Services" path="/referrals-and-services" apiUrl="referrals_and_services" userID={user_id}></FormSelector>
          <FormSelector name="Relapse Prevention Plan" path="/relapse-prevention-plan" apiUrl="relapse_prevention_plan" userID={user_id}></FormSelector>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
