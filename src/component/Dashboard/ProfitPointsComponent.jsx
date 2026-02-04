import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";

const ProfitPointsComponent = ({ profitPoints }) => {
  return (
    <div className="shadow-xl mx-12 rounded-xl bg-white flex-1 sm:m-4">
      <div className="p-8 flex-col flex gap-3">
        <p className="text-2xl font-bold sm:text-xl">Profit Points</p>
        <div className="flex flex-row items-center gap-8">
          <p className=" text-5xl font-bold sm:text-3xl">{profitPoints}</p>
          {/* <div className="bg-red-500 gap-2 text-white w-28 rounded-xl flex flex-row items-center justify-center p-2 ">
            <BsGraphDownArrow />
            <p>10%</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfitPointsComponent;
