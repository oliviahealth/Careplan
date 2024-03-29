import LeftSidebar from "./LeftSidebar";

function Dashboard() {
  return(
    <div className="flex flex-row">
        <LeftSidebar></LeftSidebar>
        <div>content</div>
    </div>
  );
}

export default Dashboard;
