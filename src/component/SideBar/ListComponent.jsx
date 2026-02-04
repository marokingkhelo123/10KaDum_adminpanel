/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const ListComponent = ({ item }) => {
  let { name, path, icon } = item;
  return (
    <NavLink to={path}>
      <div className="flex flex-row gap-2 items-center hover:bg-violet-200 hover:text-violet-800 px-8 py-1 ">
        {icon}
        <p>{name}</p>
      </div>
    </NavLink>
  );
};

export default ListComponent;
