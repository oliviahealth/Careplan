import FormSelector from "./FormSelector";
import LeftSidebar from "./LeftSidebar";

function Dashboard() {
  return (
    <div className="flex flex-row">
      <LeftSidebar />
      <div className="pl-10 pr-32 py-10 w-full">
        <div className="text-3xl font-semibold">First Name Last Name</div>

        <div className="mt-8 flex flex-col gap-2">
          <FormSelector name="Maternal Demographics" path="/maternal-demographics" apiUrl="http://127.0.0.1:5000/api/get_maternal_demographics" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="maternalDemographics"></FormSelector>
          <FormSelector name="Maternal Medical History" path="/maternal-medical-history" apiUrl="http://127.0.0.1:5000/api/get_maternal_medical_history" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="maternalMedicalHistory"></FormSelector>
          <FormSelector name="Psychiatric History" path="/maternal-psychiatric-history" apiUrl="http://127.0.0.1:5000/api/get_psychiatric_history" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="psychiatricHistory"></FormSelector>
          <FormSelector name="Medical Services For Substance Use" path="/services-substance-use" apiUrl="http://127.0.0.1:5000/api/get_medical_services_for_substance_use" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="medicalServicesForSubstanceUse"></FormSelector>
          <FormSelector name="Substance Use History" path="/substance-use-history" apiUrl="http://127.0.0.1:5000/api/get_substance_use_history" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="substanceUseHistory"></FormSelector>
          <FormSelector name="Drug Screening Results" path="/drug-screening-results" apiUrl="http://127.0.0.1:5000/api/get_drug_screening_results" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="drugScreeningResults"></FormSelector>
          <FormSelector name="Family & Supports" path="/family-and-supports" apiUrl="http://127.0.0.1:5000/api/get_family_and_supports" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="familyAndSupports"></FormSelector>
          <FormSelector name="Infant Information" path="/infant-information" apiUrl="http://127.0.0.1:5000/api/get_infant_information" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="infantInformation"></FormSelector>
          <FormSelector name="Referrals and Services" path="/referrals-and-services" apiUrl="http://127.0.0.1:5000/api/get_referrals_and_services" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="referralsAndServices"></FormSelector>
          <FormSelector name="Relapse Prevention Plan" path="/relapse-prevention-plan" apiUrl="http://127.0.0.1:5000/api/get_relapse_prevention_plan" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="relapsePreventionPlan"></FormSelector>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
