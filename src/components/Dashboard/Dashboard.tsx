import FormSelector from "./FormSelector";
// import LeftSidebar from "./LeftSidebar";

import useAppStore from '../../store/useAppStore.ts';

function Dashboard() {


  const user = useAppStore((state) => state.user);

  return (
    <div className="flex flex-col md:flex-row md:px-0 px-10">
      {/* <LeftSidebar /> */}
      <div className="md:pl-10 md:pr-32 py-5 md:py-10 w-full">
        <div className="flex flex-row justify-between items-center md:items-baseline">
          <div className="flex text-2xl md:text-3xl font-semibold">{user?.name}</div>
          <div className="flex pr-3 md:pr-6">
            <img className="w-6 hidden md:block" src="./images/meatballs.svg"></img>
            <img className="h-6 md:hidden block" src="./images/kebab.svg"></img>
          </div>
        </div>

        <div className="mt-5 md:mt-10 flex flex-col gap-2">
          <FormSelector name="Maternal Demographics" path="/maternal-demographics" apiUrl="maternal_demographics"></FormSelector>
          <FormSelector name="Maternal Medical History" path="/maternal-medical-history" apiUrl="maternal_medical_history"></FormSelector>
          <FormSelector name="Psychiatric History" path="/psychiatric-history" apiUrl="psychiatric_history"></FormSelector>
          <FormSelector name="Substance Use History" path="/substance-use-history" apiUrl="substance_use_history"></FormSelector>
          <FormSelector name="Medical Services For Substance Use" path="/medical-services-for-substance-use" apiUrl="medical_services_for_substance_use"></FormSelector>
          <FormSelector name="Drug Screening Results" path="/drug-screening-results" apiUrl="drug_screening_results"></FormSelector>
          <FormSelector name="Family & Supports" path="/family-and-supports" apiUrl="family_and_supports"></FormSelector>
          <FormSelector name="Infant Information" path="/infant-information" apiUrl="infant_information"></FormSelector>
          <FormSelector name="Referrals and Services" path="/referrals-and-services" apiUrl="referrals_and_services"></FormSelector>
          <FormSelector name="Relapse Prevention Plan" path="/relapse-prevention-plan" apiUrl="relapse_prevention_plan"></FormSelector>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
