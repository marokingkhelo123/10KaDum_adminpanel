import PageContainer from "../component/PageContainer";
import PageBox from "../component/PageBox";
import { useSelector } from "react-redux";
import {
  BsArrowClockwise,
  BsBookmarkCheckFill,
  BsPencil,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox, CircularProgress } from "@mui/material";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  let admin = user.admin;
  const handleGetUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/getAllUsers`
      );

      let users;
      if (user.admin.userType == "admin") {
        users = response.data.data;
      }
      if (user.admin.userType == "Distributor") {
        users = response.data.data.filter(
          (distributor) => distributor.createdBy == user.admin._id
        );
      }

      setUsers(users);
      setLoading(false);
    } catch (error) {
      console.log(error.data);
    }
  };

  const handleUpdateUserDrawWinner = async (user) => {
    setLoading(true);
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/users/updateDistributorActive`,
        data: {
          _id: user._id,
          allowSelectWinner: user.allowSelectWinner,
        },
      });
      await handleGetUsers();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleUpdateUserAction = async (user) => {
    setLoading(true);
    console.log(user);
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/users/updateUserActive`,
        data: {
          _id: user._id,
          isUserActive: user.isUserActive,
        },
      });
      await handleGetUsers();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    let result = window.confirm("Do you want to delete user ?");
    if (result) {
      setLoading(true);
      try {
        await axios({
          method: "delete",
          url: `${import.meta.env.VITE_API_BASE_URL}/users/deleteUser`,
          data: {
            _id: user._id,
          },
        });
        handleGetUsers();
      } catch (error) {
        console.log(error.response);
        setLoading(false);
      }
    }
  };

  const navigate = useNavigate()
  const handleEditUser = async (user) => {
    navigate('/newuser',{state:user})
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-row justify-between gap-3  ">
        <div className="flex flex-row gap-3">
          <p>Home</p>
          <p>/</p>
          <p className="text-violet-500">Users</p>
        </div>
        <div className="flex flex-row justify-center items-center  gap-4  ">
          <NavLink
            to={"/newuser"}
            className="p-3 font-semibold  bg-orange-500 flex-row  flex items-center gap-2 text-white px-8 rounded-3xl sm:text-xs"
          >
            <BsPlus color="white" />
            {admin.userType == "admin" ? (
              <p>Add Distributor</p>
            ) : (
              <p>Add User</p>
            )}
          </NavLink>
        </div>
      </div>
      <PageBox>
        <div className="flex flex-row  justify-between">
          <div>
            <p className="text-4xl font-bold sm:text-lg">{users?.length}</p>
            <p className="">Total Users</p>
          </div>
        </div>
      </PageBox>

      {loading ? (
        <CircularProgress className="mx-auto" />
      ) : (
        <PageBox>
          <div className=" flex-row flex gap-4 border-b border-black pb-8 justify-between sm:text-xs">
            <p className="w-1/5 font-bold text-xl sm:text-xs">Users</p>
            <p className="w-1/5 font-bold text-xl sm:text-xs">Name</p>
            <p className="w-1/5 font-bold text-xl sm:text-xs">MobileNo</p>
            {/* <p className="w-1/5 font-bold text-xl sm:text-xs">CreatedBy</p> */}
            <p className="w-1/5 font-bold text-xl sm:text-xs">
              Balance Details
            </p>
            <p className="w-1/5 font-bold text-xl text-center sm:text-xs">
              Location
            </p>

            {user.admin.userType == "admin" ? (
              <>
                <p className="w-1/5 font-bold text-xl text-center sm:text-xs">
                  Draw Winner
                </p>
                <p className="w-1/5 font-bold text-xl text-center sm:text-xs">
                  Active
                </p>
              </>
            ) : (
              <p className="w-1/5 font-bold text-xl text-center sm:text-xs">
                Active
              </p>
            )}
            <p className="w-1/5"></p>
          </div>
          <div className=" flex-col flex gap-4  h-96 overflow-y-scroll no-scrollbar">
            {users?.map((user) => {
              return (
                <div
                  className="flex flex-row justify-around gap-4 bg-white  border-black border-b py-2"
                  key={user.username}
                >
                  <div className="w-1/5 flex flex-row align-top items-start gap-2">
                    <BsBookmarkCheckFill className=" text-green-500" />
                    <div className="flex flex-col -mt-1">
                      <div className="text-xl font-medium capitalize sm:text-xs">
                        {user?.userType}
                      </div>
                      <div className="sm:text-xs">{user.username}</div>
                    </div>
                  </div>
                  <div className="w-1/5 flex flex-row align-top items-start gap-2">
                    <div className="flex flex-col -mt-1">
                      <div className="sm:text-xs">{user.firstName} {user.lastName}</div>
                    </div>
                  </div>
                  <div className="w-1/5 flex flex-row align-top items-start gap-2">
                    <div className="flex flex-col -mt-1">
                      <div className="sm:text-xs">{user.mobileNo}</div>
                    </div>
                  </div>

                  <div className="w-1/5 flex flex-row align-top items-start gap-2">
                    <BsBookmarkCheckFill className=" text-purple-500" />
                    <div className="flex flex-col -mt-1">
                      <div className="text-xl font-medium sm:text-xs">
                        Balance
                      </div>
                      <div>{user.balance}</div>
                    </div>
                  </div>
                  <div className="w-1/5 text-center">
                    {/* <div className="font-medium text-xl capitalize">Location</div> */}
                    <div className="capitalize font-medium sm:text-xs">
                      {user.location}
                    </div>
                  </div>
                  <div
                    className={`${
                      admin.userType == "admin" ? "w-2/5" : "w-1/5"
                    }  flex flex-col `}
                  >
                    {admin?.userType == "admin" ? (
                      <div className="flex flex-row w-full justify-evenly">
                        <Checkbox
                          onChange={() => {
                            handleUpdateUserDrawWinner(user);
                          }}
                          style={{ zIndex: 0 }}
                          disabled={
                            user.userType != "Distributor" ? true : false
                          }
                          checked={user.allowSelectWinner}
                        />
                        <Checkbox
                          onChange={() => {
                            handleUpdateUserAction(user);
                          }}
                          style={{ zIndex: 0 }}
                          checked={user.isUserActive}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-row  justify-evenly">
                        <Checkbox
                          onChange={() => {
                            handleUpdateUserAction(user);
                          }}
                          style={{ zIndex: 0 }}
                          checked={user.isUserActive}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-1/5 flex-row flex  justify-center items-center align-middle mb-4 gap-2">
                    <div
                      onClick={() => handleDeleteUser(user)}
                      className="font-bold bg-red-500 w-fit  p-2 text-white capitalize text-xl cursor-pointer rounded-2xl px-4 sm:text-xs"
                    >
                      <BsTrash />
                    </div>
                    <div
                      onClick={() => handleEditUser(user)}
                      className="font-bold bg-red-500 w-fit  p-2 text-white capitalize text-xl cursor-pointer rounded-2xl px-4 sm:text-xs"
                    >
                      <BsPencil />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PageBox>
      )}
    </PageContainer>
  );
};

export default UsersPage;
