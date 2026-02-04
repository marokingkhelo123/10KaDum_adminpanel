import React from "react";
import TransactionFilter from "../component/Transactions/TransactionFilter";
import PageBox from "../component/PageBox";

const TransactionsPage = () => {
  return (
    <div className=" m-12 flex flex-col gap-4 sm:m-4 ">
      <div className="flex flex-row gap-3">
        <p>Home</p>
        <p>/</p>
        <p className="text-violet-500">Transactions</p>
      </div>
      <TransactionFilter />
    </div>
  );
};

export default TransactionsPage;
