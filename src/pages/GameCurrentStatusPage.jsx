import React, { useEffect, useState } from "react";
import GameNumberComponent from "../component/GameStatus/GameNumberComponent";
import axios from "axios";
import { Checkbox, CircularProgress, Modal } from "@mui/material";
import { BsStarFill } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const GameCurrentStatusPage = () => {
  const [countDown, setCountDown] = useState("00:00");
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState({ starPoints: {} });
  const [winningNumber, setWinningNumber] = useState(0);
  const [winningx, setWinningx] = useState(0);
  const [timeDifference, setTimeDifference] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formatedSecond, setFormatedSeconds] = useState("");
  const [formatedMinutes, setFormatedMinutes] = useState("");
  const user = useSelector((state) => state.user);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCancle = () => {
    setWinningNumber(0);
    setWinningx(0);
    handleClose();
  };

  const getCurrentGame = async () => {
    setLoading(true);
    try {
      const accessToken = Cookies.get("accessToken");
      if (user.admin.userType == "admin") {
        let response = await axios({
          method: "get",
          url: `${import.meta.env.VITE_API_BASE_URL}/users/getLiveGame`,
        });
        setCurrentGame(response.data.data);
      } else {
        let response = await axios({
          method: "post",
          data: {
            userId: user.admin._id,
            accessToken,
          },
          url: `${import.meta.env.VITE_API_BASE_URL}/admin/getLiveGameDistributor`,
        });
        if (response.data.allowUser !== undefined) {
          navigate("/login");
        }

        setCurrentGame(response.data.data.game);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSelectWinner = (number) => {
    setWinningNumber(number);
    handleOpen();
  };

  const handleDrawWinners = async () => {
    if (winningx == 0) {
      alert("Please select winning x");
    } else {
      try {
        setLoading(true);
        await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_BASE_URL}/users/updateWinner`,
          data: {
            _id: currentGame._id,
            winning_number: winningNumber,
            winning_x: winningx,
            userType: user.admin.userType,
            updaterId: user.admin._id,
          },
        });
        setLoading(false);
        handleCancle();
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  let wordToNumber = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
  };
  let arraya = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let countdownInterval;
  const updateCountdown = () => {
    const targetTime = new Date(currentGame?.startTime);
    const currentTime = new Date();
    // Calculate minutes to next 5-minute interval
    let minutes = 5 - (currentTime.getMinutes() - targetTime.getMinutes());
    targetTime.setMinutes(targetTime.getMinutes() + 5);

    const timeDifference = targetTime.getTime() - currentTime.getTime();
    setTimeDifference(timeDifference);
    if (timeDifference <= 0 && minutes == 0) {
      clearInterval(countdownInterval);
      getCurrentGame();
    } else {
      const remainingMinutes = Math.floor(timeDifference / (1000 * 60));
      const remainingSeconds = Math.floor(
        (timeDifference % (1000 * 60)) / 1000
      );
      const formattedMinutes =
        remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
      const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
      setFormatedMinutes(formattedMinutes);
      setFormatedSeconds(formattedSeconds);
      setCountDown(`${formattedMinutes}:${formattedSeconds}`);
    }
  };

  useEffect(() => {
    getCurrentGame();
  }, []);
  useEffect(() => {
    getCurrentGame();
    setTimeout(() => {
      console.log("HERE");
      getCurrentGame();
    }, 30000);
  }, []);

  useEffect(() => {
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(countdownInterval);
  }, [currentGame]);

  const handleWinningXCheckBox = (number) => {
    setWinningx(number);
  };

  return (
    <div className="w-screen h-screen">
      {loading ? (
        <div className="flex flex-row items-center justify-center w-screen h-screen">
          <CircularProgress />
        </div>
      ) : (
        <div className="my-8 mx-8 flex flex-col gap-8 sm:mx-2 ">
          <div className="flex flex-row justify-between gap-3 sm:flex-col">
            <div className="flex flex-row gap-3">
              <NavLink to={"/dashboard"} className="text-violet-500">
                Home
              </NavLink>
              <p>/</p>
              <p className="text-violet-500">Game Current Status</p>
            </div>

            <div className="flex flex-row items-center gap-8  sm:gap-3 sm:grid-cols-2 sm:place-items-center sm:mt-4 sm:grid">
              <div className="bg-purple-600 p-3 px-8 rounded-3xl text-lg font-medium sm:text-sm">
                <button className="flex flex-row text-white items-center gap-2 text-center ">
                  <p>{countDown}</p>
                </button>
              </div>
              <div className="bg-purple-600 p-3 px-8 rounded-3xl text-lg font-medium w-36 sm:text-sm">
                <button
                  className="flex flex-row text-white items-center gap-2 mx-auto"
                  onClick={getCurrentGame}
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        size={30}
                        color={"inherit"}
                        className="text-white"
                      />
                    </>
                  ) : (
                    <>
                      <BsStarFill color="white" />
                      <p>Refresh</p>
                    </>
                  )}
                </button>
              </div>
              <div className="">
                <p className="text-2xl font-bold sm:text-sm sm:mt-4 ">
                  Total Order Points : {currentGame?.orderPoints || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-8 mt-16 justify-center w-full sm:gap-2 sm:mt-4">
            {currentGame !== null ? (
              Object.keys(currentGame?.starPoints).map((number, i) => (
                <div
                  key={number}
                  className="cursor-pointer"
                  onClick={() => handleSelectWinner(wordToNumber[number])}
                >
                  <GameNumberComponent
                    number={wordToNumber[number]}
                    value={currentGame.starPoints[number]}
                  />
                </div>
              ))
            ) : (
              <></>
            )}
          </div>

          {formatedMinutes == 0 && formatedSecond < 10 ? (
            <></>
          ) : (
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div className=" h-screen w-screen flex flex-row justify-center items-center ">
                {loading ? (
                  <div className="bg-white h-fit max-w-xl rounded-xl p-8 ">
                    <CircularProgress size={30} />
                  </div>
                ) : (
                  <div className="bg-white h-fit max-w-xl rounded-xl p-8 ">
                    <p className="text-xl font-bold px-1">
                      Are you sure you want to release this number ?
                    </p>
                    <div className="grid-rows-3 grid gap-4 justify-center grid-cols-3 mt-12 min-h-fit w-full">
                      {arraya.map((number) => {
                        return (
                          <div
                            key={number}
                            className="flex flex-row items-center justify-center bg-gray-100 font-bold p-4  rounded-xl"
                          >
                            <Checkbox
                              defaultChecked={winningx == number}
                              onClick={() => handleWinningXCheckBox(number)}
                            />
                            <p className="text-2xl">{number}x</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-row justify-center gap-4 mt-12">
                      <div
                        onClick={handleDrawWinners}
                        className="font-bold bg-violet-500 w-1/3 text-center  p-2 text-white capitalize text-xl cursor-pointer rounded-3xl px-4"
                      >
                        OK
                      </div>
                      <div
                        onClick={handleCancle}
                        className="font-bold bg-red-500 w-1/3  text-center p-2 text-white capitalize text-xl cursor-pointer rounded-3xl px-4"
                      >
                        CANCLE
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default GameCurrentStatusPage;
