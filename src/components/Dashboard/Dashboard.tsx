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
          <FormSelector name="Substance Use History" path="/substance-use-history" apiUrl="http://127.0.0.1:5000/api/get_substance_use_history" userID="d2bd4688-5527-4bbb-b1a8-af1399d00b12" fieldType="substanceUseHistory"></FormSelector>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
