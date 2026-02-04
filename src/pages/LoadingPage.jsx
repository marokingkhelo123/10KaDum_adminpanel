import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex flow-row justify-center  h-screen items-center m-12">
      <CircularProgress />
    </div>
  );
};

export default LoadingPage;
