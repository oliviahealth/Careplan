import FormSelector from "./FormSelector";
import LeftSidebar from "./LeftSidebar";

function Dashboard() {
  return (
    <div className="flex flex-row">
      <LeftSidebar />
      <div className="pl-10 pr-32 py-10 w-full">
        <div className="text-3xl font-semibold">First Name Last Name</div>

        <div className="mt-8 flex flex-col gap-2">
          <FormSelector name="Maternal Demographics" path="/maternal-demographics" completed={false}></FormSelector>
          <FormSelector name="Medical History" path="/maternal-medical-history"></FormSelector>
          <FormSelector name="Psychiatric History" path="/maternal-psychiatric-history"></FormSelector>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
