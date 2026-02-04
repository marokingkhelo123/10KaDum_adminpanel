import NAVAUTHOR from "./../assets/nav_author.jpg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import Cookies from "js-cookie";

const ProfileCardComponent = () => {
  const user = useSelector((state) => state.user);
  console.log(user);
  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate("/login");
    Cookies.remove("refreshToken");
    Cookies.set("accessToken");
  };

  return (
    <div className="flex flex-row items-center gap-4 justify-center cursor-pointer">
      <img src={NAVAUTHOR} className="h-12 rounded-2xl sm:h-8" />
      <div className="flex flex-col gap-1 sm:hidden">
        <p className="font-bold text-xl">
          {user.admin.username?.toUpperCase()}
        </p>
        <p className="text-gray-500 tracking-wider text-sm">
          {user.admin.userType}
        </p>
      </div>
      <div className="flex flex-col gap-1 sm:hidden ml-8">
        <LuLogOut size={20} onClick={handleLogOut} />
        <p>LogOut</p>
      </div>
    </div>
  );
};

export default ProfileCardComponent;
