import ChildSearch from "./ChildSearch";
import ChildSelector from "./ChildSelector";

function LeftSidebar() {
  return (
    <div className="w-full md:w-1/4 mt-5 md:mt-0 bg-white">
      <div className="flex flex-row md:flex-col gap-2 md:border-b-2 md:border-r-2 border-neutral-200 min-h-fit md:p-5">
        <div className="text-lg hidden md:flex flex-row gap-1">
          <div>Children</div>
          <div className="text-neutral-400">(2)</div>{/* TODO: needs to update dynamically */}
        </div>
        <img className="flex md:hidden w-6 mx-1" src="./images/menuselector.svg"></img>
        <ChildSearch />
      </div>
      <div className="hidden md:flex flex-col gap-4 overflow-x-auto min-h-[calc(100%-10vh)] border-r-2 border-neutral-200 p-5">
        <ChildSelector isSelected={true} actionsRequired={true}></ChildSelector>
        <ChildSelector isSelected={false} actionsRequired={false}></ChildSelector>
      </div>
    </div>
  );
}

export default LeftSidebar;
