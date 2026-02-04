import {
  BsGift,
  BsHeartFill,
  BsKanban,
  BsKey,
  BsMap,
  BsPeople,
  BsPercent,
  BsReceipt,
  BsSpeedometer,
} from "react-icons/bs";
import SIDEBAR_LOGO from "./../assets/sidebarlogo.png";
import ListComponent from "./SideBar/ListComponent";
import { useSelector } from "react-redux";

const SideBarComponent = () => {
  const user = useSelector((state) => state.user);

  let ListItem = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BsSpeedometer />,
      show: true,
    },
    {
      name: "Game Current Status",
      path: "/game-current-status",
      icon: <BsKanban />,
      show:
        user.admin.userType == "Distributor"
          ? user.admin.allowSelectWinner
          : true,
    },
    {
      name: "Add/Remove Points",
      path: "/update-points",
      icon: <BsGift />,
      show:
        user.admin.userType == "Distributor"
          ? user.admin.isUserActive
            ? true
            : false
          : true,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <BsReceipt />,
      show: true,
    },
    {
      name: "Users",
      path: "/users",
      icon: <BsPeople />,
      show: true,
    },
    {
      name: "Location",
      path: "/location",
      icon: <BsMap />,
      show: user.admin.userType == "Distributor" ? false : true,
    },
    {
      name: "Change Password",
      path: "/change-password",
      icon: <BsKey />,
      show: true,
    },
    {
      name: "Winning Logic",
      path: "/winning-logic",
      icon: <BsPercent />,
      show: user.admin.userType == "Distributor" ? false : true,
    },
  ];

  return (
    <div>
      <div className="p-4 bg-violet-500 ">
        <img src={SIDEBAR_LOGO} className="" />
      </div>
      <div>
        <ul className="flex flex-col my-4 gap-2 text-lg font-medium">
          {ListItem.map((item) => {
            if (!item.show) return;
            return <ListComponent item={item} key={item.name} />;
          })}
        </ul>
      </div>
      <div className="px-4 mt-20 flex flex-col gap-3 text-xs text-center">
        <span className="font-semibold text-gray-400 tracking-wider">
          NiSu Entertainment Corp
        </span>
        <p className="flex flex-row items-center gap-1 text-gray-400 w-full  justify-center">
          Made with <BsHeartFill color="red" /> by{" "}
          <span className="text-violet-500">Bee Games Ltd</span>
        </p>
      </div>
    </div>
  );
};

export default SideBarComponent;
