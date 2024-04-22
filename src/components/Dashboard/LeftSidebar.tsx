import ChildSelector from "./ChildSelector";

function LeftSidebar() {
  return(
    <div className="w-1/4 bg-white">
        <div className="flex flex-col gap-2 border-b-2 border-r-2 border-gray-200  min-h-fit p-5">
        <div className="text-lg flex flex-row gap-2">
            <div>Children</div>
            <div className="text-gray-400">(2)</div> {/* TODO: needs to update dynamically */}
        </div>
            <div className="rounded-xl bg-gray-200 text-gray-400 flex flex-row items-center">
            <img className="w-3 mx-2" src="./images/search.svg"/>
                Search for children {/* TODO: needs to be a functional search component */}
            </div>
        </div>
        <div className="flex flex-col gap-4 overflow-x-auto min-h-[calc(100vh-230px)] border-r-2 border-gray-200 p-5"> 
          <ChildSelector isSelected={true} actionsRequired={true}></ChildSelector>
          <ChildSelector isSelected={false} actionsRequired={false}></ChildSelector>
        </div>
    </div>
  );
}

export default LeftSidebar;
