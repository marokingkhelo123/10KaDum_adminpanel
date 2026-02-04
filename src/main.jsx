import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import GameCurrentStatusPage from "./pages/GameCurrentStatusPage.jsx";
import UpdatePointsPage from "./pages/UpdatePointsPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import LocationPage from "./pages/LocationPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import { store } from "./store/store.js";
import NewUsersPage from "./pages/NewUserPage.jsx";
import WinningLogicPage from "./pages/WinningLogicPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/loading",
    element: <LoadingPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },

      {
        path: "/game-current-status",
        element: <GameCurrentStatusPage />,
      },
      {
        path: "/update-points",
        element: <UpdatePointsPage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/newuser",
        element: <NewUsersPage />,
      },
      {
        path: "/location",
        element: <LocationPage />,
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "/winning-logic",
        element: <WinningLogicPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
