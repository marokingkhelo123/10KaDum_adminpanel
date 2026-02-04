import { useState } from "react";
import IMAGE from "./../assets/logo.png";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { updateUser } from "../store/Slices/userSlice";
import { useNavigate } from "react-router-dom";

import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logUserIN = async () => {
    setLoading(true);

    if (userType.length == 0) {
      alert("SELECT USERTYPE");
    }
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        data: {
          username,
          password,
          userType,
        },
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data.data);
      dispatch(updateUser({ ...response.data.data, isLoggedIn: true }));
      Cookies.set("refreshToken", response.data.data.refreshToken);
      Cookies.set("accessToken", response.data.data.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.log(error, "LOG USER IN");
      alert("WRONG CREDENTIALS");
    }
    setLoading(false);
  };

  return (
    <div className="bg-yellow-500 h-screen w-screen">
      <div className="flex h-screen  justify-center text-4xl sm:text-2xl">
        <div className="bg-white flex flex-col my-auto bg-opacity-60 p-8 rounded-xl sm:max-w-sm sm:my-24 sm:h-1/2 sm:gap-2">
          <img src={IMAGE} className="mx-auto" />

          <input
            placeholder="User ID"
            className="my-2 px-4 bg-white  p-2 rounded-lg"
            mode="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            label="UserId"
          />
          <input
            placeholder="Password"
            className=" my-2 px-4 bg-white p-2 rounded-lg"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
          <RadioGroup
            className="my-2"
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Prime User"
            name="radio-buttons-group"
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
            }}
          >
            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />

            <FormControlLabel
              value="Distributor"
              control={<Radio />}
              label="Distributor"
            />
          </RadioGroup>
          {loading ? (
            <CircularProgress color="inherit" className="mx-auto mt-4" />
          ) : (
            <button
              onClick={logUserIN}
              className=" rounded-lg my-2 bg-red-600 text-white p-2 text-center"
            >
              <p>LOGIN</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
