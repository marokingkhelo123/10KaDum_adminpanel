import ProfitPointsComponent from "../component/Dashboard/ProfitPointsComponent";
import TotalOrderPointsComponent from "../component/Dashboard/TotalOrderPointsComponent";
import WinningPointsComponent from "../component/Dashboard/WinningPointsComponent";
import { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/Slices/userSlice";
import apiClient from "../utils/apiClient";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const isUserReady = Boolean(user?.admin?._id && user?.admin?.userType);

  const getDashboardDetails = useCallback(
    async ({ isManual } = {}) => {
      if (!isUserReady) return;
      if (isManual) {
        setIsRefreshing(true);
      }
      try {
        const response = await apiClient.post("/admin/dashboard-details", {
          userId: user.admin._id,
          userType: user.admin.userType?.toLowerCase(),
        });
        setData(response.data.data);
      } catch (error) {
        dispatch(
          updateUser({
            admin: {},
            refreshToken: "",
            accessToken: "",
            isLoggedIn: false,
          })
        );
      } finally {
        if (isManual) {
          setIsRefreshing(false);
        }
      }
    },
    [dispatch, isUserReady, user?.admin?._id, user?.admin?.userType]
  );

  useEffect(() => {
    if (!isUserReady) return;
    getDashboardDetails();
    const countdownInterval = setInterval(() => {
      getDashboardDetails();
    }, 60000);
    return () => clearInterval(countdownInterval);
  }, [getDashboardDetails, isUserReady]);

  return (
    <div className="w-3/4 flex flex-col justify-center  mx-auto sm:w-screen sm:mt-12">
      {data == null ? (
        <div className="flex items-center justify-center flex-row h-96 ">
          <CircularProgress />
        </div>
      ) : (
        <div className="sm:mx-2">
          <div className="flex justify-end mb-4 pr-2">
            <button
              onClick={() => getDashboardDetails({ isManual: true })}
              disabled={isRefreshing || !isUserReady}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? (
                <CircularProgress size={16} thickness={6} color="inherit" />
              ) : (
                "Refresh"
              )}
            </button>
          </div>
          <TotalOrderPointsComponent orderPoints={data.orderPoints} />
          <div className="flex flex-row  sm:flex-col">
            <WinningPointsComponent winningPoints={data.winning_points} />
            <ProfitPointsComponent profitPoints={data.profit_points} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
