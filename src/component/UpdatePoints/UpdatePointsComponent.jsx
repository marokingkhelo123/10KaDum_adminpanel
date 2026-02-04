import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const UpdatePointsComponent = () => {
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState(0);
  const [valueUser, setValueUser] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
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
      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
      let users;
      if (user.admin.userType == "admin") {
        // Admin can see and manage points for ALL users (Distributor and Prime User)
        users = response.data.data;
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

  const handleTransactionValidation = () => {
    if (value < 0) {
      // Withdraw validation
      if (selectedUser?.balance == 0) {
        setMessage(`Balance is 0. User cannot withdraw amount.`);
      } else if (Math.abs(value) > selectedUser?.balance) {
        setMessage(`Please select value less than ${selectedUser?.balance}`);
      } else {
        setMessage("");
      }
    } else if (value > 0) {
      // Deposit validation
      if (user.admin.userType === "admin") {
        // Admin can give points without balance check
        setMessage("");
      } else if (value > user.admin.balance) {
        // Distributor needs to have sufficient balance
        setMessage(
          `Insufficent Balance !! Your Balance is ${user.admin.balance}`
        );
      } else {
        setMessage("");
      }
    } else {
      setMessage("");
    }
  };

  const setClear = () => {
    setValue(0);
    setValueUser("demo");
    setMessage("");
  };

  const handleSave = async () => {
    try {
      if (value > 0) {
        let response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_BASE_URL}/users/depositUserBalance`,
          data: {
            receiverId: selectedUser._id,
            senderId: user.admin._id,
            balance: value * 1,
          },
        });
        setResponseMessage(response.data.message);
        setClear();
      } else {
        let response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_BASE_URL}/users/withDrawUserBalance`,
          data: {
            userId: selectedUser._id,
            balance: Math.abs(value),
          },
        });
        setClear();
        setResponseMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectUser = () => {
    let newuser = users.filter((us) => us._id == valueUser)[0];
    setSelectedUser(newuser);
  };

  useEffect(() => {
    handleSelectUser();
  }, [valueUser, value]);

  useEffect(() => {
    handleTransactionValidation();
  }, [value, valueUser]);

  return (
    <div className="flex flex-col shadow-lg my-8 rounded-xl bg-white w-full py-8 p-4">
      <div className="flex flex-row gap-8 sm:flex-col ">
        <div className="flex flex-col w-full gap-4">
          <p className="font-bold">Users</p>
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
                  value={user._id}
                  className="text-xl bg-violet-300 focus:bg-violet-500"
                >
                  {user.username.toUpperCase()}
                </option>
              );
            })}
          </select>
          <p>{message}</p>
          <p>{responseMessage}</p>
        </div>
        <div className="w-full flex flex-col gap-4">
          <p className="font-bold">Points</p>
          <input
            className="border border-gray-500 rounded-md p-2 text-xl focus:outline-none"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row gap-3 justify-end sm:mt-12">
        <button
          disabled={message.length > 0}
          className="p-3 font-semibold  bg-violet-500 text-white  px-8 rounded-3xl"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          disabled={message.length > 0}
          className="p-3 font-semibold  bg-red-500 text-white px-8 rounded-3xl"
          onClick={setClear}
        >
          Cancle
        </button>
      </div>
    </div>
  );
};

export default UpdatePointsComponent;
