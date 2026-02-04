import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChangePasswordComponent = () => {
  const [users, setUsers] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [valueUser, setValueUser] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleGetUsers = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/admin/getAllUsers`,
        data: { accessToken: accessToken },
      });
      console.log(response);
      if (response.data.allowUser !== undefined) {
        navigate("/login");
      }
      let users;
      if (user.admin.userType == "admin") {
        users = response.data.data.filter(
          (distributor) => distributor.userType == "Distributor"
        );
      }
      if (user.admin.userType == "Distributor") {
        users = response.data.data.filter(
          (distributor) => distributor.createdBy == user.admin._id
        );
      }

      setUsers(users);
    } catch (error) {
      console.log(error.data);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, [valueUser]);

  const setClear = () => {
    setValueUser("demo");
    setOldPassword("");
    setNewPassword("");
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const handleSelectUser = () => {
    let newuser = users.filter((us) => us.username == valueUser)[0];
    setSelectedUser(newuser);
  };

  useEffect(() => {
    handleSelectUser();
  }, [valueUser]);

  useEffect(() => {
    // handleTransactionValidation();
  }, [valueUser]);

  const handleSave = async () => {
    try {
      let response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/users/update-password`,
        data: {
          username: valueUser,
          oldpassword: oldPassword,
          newpassword: newPassword,
        },
      });
      setMessage(response.data.message);
      setClear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col shadow-lg my-8 rounded-xl bg-white w-full py-8 p-4 gap-12 ">
      <div className="flex flex-row gap-8 sm:gap-2">
        <div className="flex flex-row w-full justify-around gap-4 sm:flex-col ">
          <div className="flex flex-col w-1/3 gap-2 sm:w-full">
            <label className="font-bold">User</label>
            <select
              value={valueUser}
              className="p-2 bg-white border border-gray-500 rounded-md text-xl focus:outline-none"
              onChange={(e) => setValueUser(e.target.value)}
            >
              <option value="demo" className="text-xl bg-violet-300 focus:b">
                Select User
              </option>
              {users?.map((user) => {
                return (
                  <option
                    key={user.username}
                    value={user.username}
                    className="text-xl bg-violet-300 focus:bg-violet-500"
                  >
                    {user.username.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col w-1/3 gap-2 sm:w-full">
            <label className="font-bold">Old Password</label>
            <input
              className="border border-gray-500 rounded-md p-2 text-xl focus:outline-none"
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-1/3 gap-2 sm:w-full">
            <label className="font-bold">New Password</label>
            <input
              placeholder="New Password"
              className="border border-gray-500 rounded-md p-2 text-xl focus:outline-none"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      <p>{message}</p>
      <div className="flex flex-row gap-3 justify-end sm:justify-center">
        <button
          className="p-3 font-semibold  bg-violet-500 text-white  px-8 rounded-3xl"
          onClick={handleSave}
        >
          Update Password
        </button>
        <button
          className="p-3 font-semibold  bg-red-500 text-white px-8 rounded-3xl sm:flex-1"
          onClick={setClear}
        >
          Cancle
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordComponent;
