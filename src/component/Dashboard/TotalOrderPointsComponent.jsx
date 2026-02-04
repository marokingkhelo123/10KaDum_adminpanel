import React from "react";
import { BsArrowUp, BsArrowUpCircleFill } from "react-icons/bs";

const TotalOrderPointsComponent = ({ orderPoints }) => {
  return (
    <div className="shadow-xl m-12 rounded-xl bg-white sm:m-4">
      <div className="p-8 flex-col flex gap-3">
        <p className="text-2xl font-bold sm:text-xl">Total Order Points</p>
        <p className=" text-5xl font-bold sm:text-3xl">{orderPoints}</p>
      </div>

      {/* <p className="bg-sky-300 rounded-b-xl px-8 py-5 flex flex-row items-center text-white gap-2">
        <BsArrowUpCircleFill />
        <span>Average over the previous day</span>
      </p> */}
    </div>
  );
};

export default TotalOrderPointsComponent;
