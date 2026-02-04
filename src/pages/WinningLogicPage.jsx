import React, { useState } from "react";
import PageBox from "../component/PageBox";

import axios from "axios";
import { useEffect } from "react";

const WinningLogicPage = () => {
  const [percent, setPercent] = useState();

  const handleChangeGameProfit = async () => {
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/admin/update-gamepercent`,
        data: { percent },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPercent = async () => {
    try {
      let response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_BASE_URL}/admin/get-gamepercent`,
      });
      setPercent(response.data.data.percent);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPercent();
  }, []);

  useEffect(() => {
    handleChangeGameProfit();
  }, [percent]);

  return (
    <div className="m-12 flex flex-col gap-4 sm:m-2">
      <div className="flex flex-row gap-3">
        <p>Home</p>
        <p>/</p>
        <p className="text-violet-500">Winning Logic</p>
      </div>
      {/* <ChangePasswordComponent /> */}
      <PageBox>
        <labe className="text-xl font-bold">Select Game Profit Percentage</labe>
        <select
          value={percent}
          className="p-2 bg-white border border-gray-500 rounded-md text-xl focus:outline-none w-1/3"
          onChange={(e) => setPercent(e.target.value)}
        >
          <option value={0.9}>90-10</option>
          <option value={0.8}>80-20</option>
          <option value={0.7}>70-30</option>
          <option value={0.6}>60-40</option>
          <option value={0.5}>50-50</option>
        </select>
      </PageBox>
    </div>
  );
};

export default WinningLogicPage;
