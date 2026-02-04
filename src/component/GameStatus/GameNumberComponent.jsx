import { BsStar } from "react-icons/bs";

const GameNumberComponent = ({ number, value }) => {
  return (
    <div
      className={`w-56 rounded-lg h-36 flex flex-col justify-center items-center gap-4 ${
        value > 0 ? "bg-green-300" : "bg-slate-200"
      } sm:w-32 sm:h-24 sm:gap-2`}
    >
      <p className="text-4xl font-bold sm:text-2xl">{number}</p>
      <div
        className={`flex flex-row text-white gap-2 bg-white p-2 px-6 rounded-xl items-center ${
          value ? "bg-orange-500" : "bg-slate-100"
        }`}
      >
        <BsStar color="black" />
        <p className="text-black">{value}</p>
      </div>
    </div>
  );
};

export default GameNumberComponent;
