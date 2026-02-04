import { BsSearch } from "react-icons/bs";

const SearchComponent = () => {
  return (
    <div className="flex flex-row h-8 items-center text-xl border-violet-500 border-2 rounded-3xl p-4 gap-4 ">
      <BsSearch />
      <input
        className="w-full focus:outline-none"
        color="white"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchComponent;
