import SearchComponent from "./SearchComponent";
import ProfileCardComponent from "./ProfileCardComponent";
import { BsList } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateSlideBar } from "../store/Slices/sideBarSlice";
import MobileBarComponent from "./MobileBarComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavBarComponent = () => {
  const slideBar = useSelector((state) => state.slideBar);
  const user = useSelector((state) => state.user);
  const [balance, setBalance] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSlideBar = () => {
    dispatch(updateSlideBar({ visible: true }));
  };

  const handleCloseSlidebar = () => {
    dispatch(updateSlideBar({ visible: false }));
  };

  return (
    <div className="flex flex-row justify-around items-center bg-white h-16 p-4">
      <div className="w-1/6 hidden sm:block">
        <BsList className="text-4xl" onClick={handleSlideBar} />
      </div>
      {slideBar.visible && (
        <div className="absolute  bg-white  left-0 h-screen top-0">
          <MobileBarComponent handleCloseSlidebar={handleCloseSlidebar} />
        </div>
      )}
      <div className="w-3/6 ">
        <SearchComponent />
      </div>
      <div className="bg-gray-400 w-0.5  h-full "></div>
      {user.admin.userType == "Distributor" ? (
        <div className="w-1/6 text-center bg-green-500 px-8 py-2 rounded-2xl text-white font-bold">
          <p>Balance: {user.admin.balance}</p>
        </div>
      ) : (
        <></>
      )}
      <div className="1/6">
        <ProfileCardComponent />
      </div>
    </div>
  );
};

export default NavBarComponent;
