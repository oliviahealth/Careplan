import FormSelector from "./FormSelector";
import LeftSidebar from "./LeftSidebar";

function Dashboard() {
  return(
    <div className="flex flex-row">
        <LeftSidebar />
        <div className="px-24 py-10 w-full">
            <div className="text-3xl font-semibold">First Name Last Name</div>
            <div className="mt-8 flex flex-col gap-4">
                <FormSelector></FormSelector>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;
