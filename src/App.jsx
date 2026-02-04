import SideBarComponent from "./component/SideBarComponent";
import NavBarComponent from "./component/NavBarComponent";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useLayoutEffect, useState } from "react";
import { updateUser } from "./store/Slices/userSlice";
import axios from "axios";
import Cookies from "js-cookie";

const App = () => {
  const user = useSelector((state) => state.user);
  const [myCookie, setMyCookie] = useState("ff");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginWithToken = async (accessToken) => {
    // navigate("/loading");
    if (accessToken == undefined) {
      dispatch(updateUser({ isLoggedIn: false }));
    }
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/admin/loginwithtoken`,
        data: {
          accessToken,
        },
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      console.log(response.data);
      dispatch(
        updateUser({
          admin: {
            ...response.data.data.user,
          },
          isLoggedIn: response.data.data.allowUser,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      navigate("/login");
      Cookies.remove("refreshToken");
      Cookies.set("accessToken");
    }
  };

  useEffect(() => {
    // navigate("/loading");
    const accessToken = Cookies.get("accessToken");
    if (accessToken == undefined) {
      navigate("/login");
    }

    loginWithToken(accessToken);
  }, [user.accessToken]);

  return (
    <div className="flex flex-row h-screen w-screen  overflow-hidden">
      <div className="flex flex-row ">
        {location.pathname == "/game-current-status" ? (
          <></>
        ) : (
          <div className={`w-1/4 sm:hidden`}>
            <SideBarComponent />
          </div>
        )}

        <div
          className={`h-full  bg-gray-50 ${
            location.pathname !== "/game-current-status" ? "w-full" : "w-full"
          }`}
        >
          <div>
            {location.pathname == "/game-current-status" ? (
              <></>
            ) : (
              <NavBarComponent />
            )}
            <div className="h-screen pb-12 no-scrollbar overflow-hidden overflow-y-scroll overflow-x-hidden">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
