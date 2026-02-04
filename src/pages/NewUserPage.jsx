import PageContainer from "../component/PageContainer";
import PageBox from "../component/PageBox";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const NewUsersPage = () => {
  const user = useSelector((state) => state.user);
  const locationData = useLocation().state;
  console.log("DAT", locationData);
  const [firstName, setFirstName] = useState(locationData?.firstName || "");
  const [lastName, setLastName] = useState(locationData?.lastName || "");
  const [location, setLocation] = useState(locationData?.location || "");
  const [username, setUsername] = useState(locationData?.username || "");
  const [password, setPassword] = useState(locationData?.password || "");
  // Set userType based on creator role or existing user data when editing
  // Admin can choose, Distributor can only create Prime User
  const [userType, setUserType] = useState(() => {
    // If editing an existing user, use their actual userType
    if (locationData?.userType) {
      return locationData.userType;
    }
    // Otherwise, set default based on creator role
    if (user.admin?.userType === "admin") {
      return "Distributor"; // Default for Admin
    } else {
      return "Prime User"; // Distributor can only create Prime User
    }
  });
  const [errors, setErrors] = useState({});
  const [isUserActive, setIsUserActive] = useState(
    locationData?.isUserActive ?? true
  );
  const [allowSelectWinner, setAllowSelectWinner] = useState(
    locationData?.allowSelectWinner ?? true
  );
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [mobileNo, setMobileNo] = useState(locationData?.mobileNo || "");

  const navigate = useNavigate();

  const validateFields = () => {
    let errors = {};
    if (firstName.trim() === "") {
      errors.firstName = "First name is required";
    }
    if (lastName.trim() === "") {
      errors.lastName = "Last name is required";
    }
    if (username.trim() === "") {
      errors.username = "Username is required";
    }
    if (password.trim() === "" && locationData == null) {
      errors.password = "Password is required";
    }

    if (mobileNo.length != 10) {
      errors.mobileNo = "Enter Valid Mobile Number";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getAllLocations = async () => {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/location/getAllLocations`
      );
      setLocations(response.data.data);
    } catch (error) {
      console.log(error.data);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      // Get accessToken from cookies
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // Determine userType based on creator role
      let finalUserType = userType;
      if (user.admin?.userType === "Distributor") {
        // Distributor can only create Prime User - force it
        finalUserType = "Prime User";
      }

      let userData = {
        firstName,
        lastName,
        location,
        username,
        password,
        userType: finalUserType,
        isUserActive,
        mobileNo,
        allowSelectWinner,
        accessToken, // Send accessToken for authentication
      };

      const isValid = validateFields();
      if (isValid) {
        await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_BASE_URL}/users/register`,
          data: userData,
        });
        setLoading(false);
        navigate("/users");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create user";
      alert(errorMessage);
      console.log(error);
    }
    setLoading(false);
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Get accessToken from cookies
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // Determine userType based on creator role
      let finalUserType = userType;
      if (user.admin?.userType === "Distributor") {
        // Distributor can only create Prime User - force it
        finalUserType = "Prime User";
      }

      let userData = {
        firstName,
        lastName,
        location,
        username,
        password,
        userType: finalUserType,
        isUserActive,
        mobileNo,
        allowSelectWinner,
      };

      const isValid = validateFields();
      if (isValid) {
        let data = {
          userId: locationData._id,
          data: userData
        }
        await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_BASE_URL}/admin/updateUser`,
          data
        });
        setLoading(false);
        navigate("/users");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update user";
      alert(errorMessage);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-row justify-between gap-3">
        <div className="flex flex-row gap-3">
          <p>Home</p>
          <p>/</p>
          <p className="">Users</p>
          <p>/</p>
          <p className="text-violet-500">Add New User</p>
        </div>
      </div>
      <PageBox>
        <div className="flex flex-row justify-start gap-16  flex-wrap sm:gap-4 sm:grid sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-bold">First Name</label>
            <TextField
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            {errors.firstName && <div>{errors.firstName}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Last Name</label>
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            {errors.lastName && <div>{errors.lastName}</div>}
          </div>
          <div className="w-48">
            <label id="demo-simple-select-label" className="font-bold">
              Location
            </label>
            <Select
              className="w-48"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            >
              {locations?.map((loc) => {
                if (loc.active) {
                  return (
                    <MenuItem value={loc.name} key={loc.name}>
                      {loc.name.toUpperCase()}
                    </MenuItem>
                  );
                }
              })}
            </Select>
            {errors.location && <div>{errors.location}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Mobile Number</label>
            <TextField
              type="number"
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
              value={mobileNo}
              onChange={(e) => {
                setMobileNo(e.target.value);
              }}
            />
            {errors.mobileNo && <div>{errors.mobileNo}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Username</label>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            {errors.username && <div>{errors.username}</div>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold">Password</label>
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {errors.password && <div>{errors.password}</div>}
          </div>
          {/* Show userType selection only for Admin */}
          {user.admin?.userType === "admin" && (
            <div className="flex flex-col gap-2">
              <label id="demo-radio-buttons-group-label" className="font-bold">
                User Type
              </label>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
              >
                <FormControlLabel
                  value="Distributor"
                  control={<Radio />}
                  label="Distributor"
                />
                <FormControlLabel
                  value="Prime User"
                  control={<Radio />}
                  label="Prime User"
                />
              </RadioGroup>
            </div>
          )}
          {/* Show info for Distributor that they can only create Prime User */}
          {user.admin?.userType === "Distributor" && (
            <div className="flex flex-col gap-2">
              <label className="font-bold">User Type</label>
              <p className="text-gray-600 italic">Prime User (Distributors can only create Prime Users)</p>
            </div>
          )}
          {user.admin?.userType !== "admin" && (
            <div className="flex flex-col gap-2">
              <label className="font-bold">Active</label>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUserActive}
                    onChange={(e) => {
                      setIsUserActive(e.target.checked);
                    }}
                  />
                }
                label="User is Active"
              />
            </div>
          )}
          {user.admin?.userType === "admin" && (
            <div className="flex flex-row justify-center items-center gap-2">
              <label className="font-bold">Allow Draw Winner</label>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowSelectWinner}
                    onChange={(e) => {
                      setAllowSelectWinner(e.target.checked);
                    }}
                  />
                }
                label="Allow Draw Winner"
              />
              <label className="font-bold">Active</label>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUserActive}
                    onChange={(e) => {
                      setIsUserActive(e.target.checked);
                    }}
                  />
                }
                label="User is Active"
              />
            </div>
          )}
          <div className="flex flex-row w-full justify-end sm:justify-start gap-4 sm:gap-2">
            {locationData == null ? (
              <button
                onClick={handleCreateUser}
                className="flex-row 
              p-3 font-semibold  bg-purple-500 h-fit flex items-center gap-2 text-white px-8 rounded-3xl "
              >
                {loading ? <CircularProgress /> : <p>SAVE</p>}
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="flex-row 
              p-3 font-semibold  bg-purple-500 h-fit flex items-center gap-2 text-white px-8 rounded-3xl "
              >
                {loading ? <CircularProgress /> : <p>UPDATE</p>}
              </button>
            )}

            <NavLink
              to={"/users"}
              className="flex flex-row 
              p-3 font-semibold  bg-red-500 h-fit  items-center gap-2 text-white px-8 rounded-3xl  "
            >
              <p>CANCLE</p>
            </NavLink>
          </div>
        </div>
      </PageBox>
    </PageContainer>
  );
};

export default NewUsersPage;
