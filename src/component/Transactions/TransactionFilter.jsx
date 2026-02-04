import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const TransactionFilter = () => {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState(null);
  const [value, setValue] = useState(0);
  const [valueUser, setValueUser] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/getAllUsers`
      );
      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
      let users;
      if (user.admin.userType == "admin") {
        users = response.data.data.filter(
          (distributor) => distributor.userType == "Distributor"
        );
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

  function convertISTtoUTC(fromIST, toIST) {
    const from = new Date(fromIST);
    const to = new Date(toIST);
    const fromUTC = from.toISOString();
    const toUTC = to.toISOString();

    return { from: fromUTC, to: toUTC };
  }

  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const fetchTransactionsByPage = async (page) => {
    const fromDateObj = `${fromDate}T00:00:00.000+05:30`;
    const toDateObj = `${toDate}T23:59:59.999+05:30`;
    const dates = convertISTtoUTC(fromDateObj, toDateObj);
    try {
      setIsLoading(true);
      const response = await axios({
        url: `${import.meta.env.VITE_API_BASE_URL}/admin/transactions`,
        method: "post",
        data: {
          userId: valueUser,
          fromDate: dates.from,
          toDate: dates.to,
          page,
        },
      });
      const { transactions: data, totalPages: pages, currentPage: pageNum } = response.data.data;
      setTransactions(data);
      setTotalPages(pages || 0);
      setCurrentPage(pageNum || page);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactions = () => fetchTransactionsByPage(1);

  const handlePrevPage = () => {
    if (currentPage > 1) fetchTransactionsByPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchTransactionsByPage(currentPage + 1);
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    setTransactions(null);
    setCurrentPage(1);
    setTotalPages(0);
  }, [valueUser]);
  return (
    <div>
      <div className="flex flex-col shadow-lg my-8 rounded-xl bg-white w-full py-8 p-4  sm:mx-auto  ">
        <div className="flex flex-row gap-8 sm:flex-col sm:gap-4">
          <div className="flex flex-col w-full gap-4">
            <p className="font-bold">Users</p>
            <select
              value={valueUser}
              className="p-2 bg-white border border-gray-500 rounded-md text-xl focus:outline-none"
              onChange={(e) => {
                setTransactions(null);

                setValueUser(e.target.value);
              }}
            >
              <option value="demo" className="text-xl bg-violet-300 focus:b">
                Select User
              </option>
              <option value="all" className="text-xl bg-violet-300 focus:b">
                All
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
          <div className="flex flex-row gap-4 ">
            <div className="w-full flex flex-col gap-4">
              <p className="font-bold">Date From</p>
              <input
                className="border border-gray-500 rounded-md p-2 text-xl focus:outline-none"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-4">
              <p className="font-bold">Date To</p>
              <input
                className="border border-gray-500 rounded-md p-2 text-xl focus:outline-none"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 justify-end sm:justify-center sm:mt-12">
          <button
            className={`p-3 font-semibold bg-violet-500 text-white px-8 rounded-3xl flex items-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleTransactions}
            disabled={isLoading}
          >
            {isLoading && (
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
            )}
            {isLoading ? "Loading..." : "Get Transactions"}
          </button>
          <button
            className="p-3 font-semibold  bg-red-500 text-white px-8 rounded-3xl"
            // onClick={setClear}
          >
            Reset
          </button>
        </div>
      </div>
      {valueUser != "all" && (
        <div className=" p-8 gap-8 flex flex-col rounded-2xl  overflow-hidden sm:w-full  sm:overflow-x-scroll sm:p-2">
          <div className="flex flex-row w-full font-bold text-xs sm:text-xs  ">
            <p className="w-1/12 text-center">Txn No.</p>
            <p className="w-2/12 text-center">Barcode</p>
            {valueUser == "all" ? (
              <p className="w-2/6 text-center">Date</p>
            ) : (
              <p className="w-2/6 text-center">Timeslot</p>
            )}
            {valueUser == "all" && (
              <p className="w-2/6 text-center">Username</p>
            )}
            <p className="w-2/6 text-center">Opening Balance</p>
            <p className="w-1/6 text-center">Order Points</p>
            <p className="w-1/6 text-center">Winning Points</p>
            <p className="w-1/6 text-center">Profit Points</p>
            <p className="w-1/6 text-center">Top Up / Transfer</p>
            <p className="w-2/6 text-center">Closing Balance</p>
          </div>
          {transactions !== null && (
            <>
              <div className="flex flex-col gap-2 h-96 overflow-y-scroll no-scrollbar">
                {transactions.map((transaction) => {
                  const Timeslot = new Date(
                    transaction.createdAt
                  ).toLocaleString();
                  let OrderPoints = 0;
                  let WinningPoints = 0;
                  let ProfitPoints = 0;
                  let TopUp = 0;
                  const amount = toNumber(transaction.amount);
                  const totalWinning = toNumber(transaction.total_winning);
                  const totalBetPoints = toNumber(transaction.totalBetPoints);

                  if (
                    transaction.type == "Gaming" &&
                    transaction.isProfit == false
                  ) {
                    WinningPoints = totalWinning;
                    // OrderPoints = WinningPoints + transaction.amount * 1;
                    OrderPoints = totalBetPoints;
                    // ProfitPoints = OrderPoints - WinningPoints;
                    ProfitPoints = amount;
                  } else if (transaction.type == "Remove Balance") {
                    TopUp = amount * -1;
                  } else if (transaction.type == "Add Balance") {
                    TopUp = amount;
                  } else if (
                    transaction.type == "Gaming" &&
                    transaction.isProfit == true
                  ) {
                    WinningPoints = totalWinning;
                  }
                  // Format transaction number (use last 8 characters of _id for readability)
                  const transactionNumber = transaction._id ? transaction._id.toString().slice(-8).toUpperCase() : 'N/A';
                  const barcodeNumber = transaction?.uniqueString || "—";
                  
                  return (
                    <div
                      key={transaction._id}
                      className="flex flex-row w-full bg-white py-4 rounded-md shadow-md font-bold text-sm sm:text-xs"
                    >
                      <p className="w-1/12 text-center text-gray-600 font-mono text-xs">
                        {transactionNumber}
                      </p>
                      <p className="w-2/12 text-center text-gray-600 font-mono text-xs break-all">
                        {barcodeNumber}
                      </p>
                      <p className="w-2/6 text-center">{Timeslot}</p>
                      <p className="w-2/6 text-center">
                        {transaction.openingBalance}
                      </p>
                      <p className="w-1/6 text-center">{OrderPoints}</p>
                      <p
                        className={`w-1/6 text-center ${
                          WinningPoints > 0 ? "text-green-500" : ""
                        }`}
                      >
                        {WinningPoints}
                      </p>
                      <p
                        className={`w-1/6 text-center ${
                          ProfitPoints > 0 ? "text-green-500" : "text-red-500"
                        }  ${ProfitPoints == 0 ? "text-black" : ""}`}
                      >
                        {ProfitPoints}
                      </p>
                      <p
                        className={`w-1/6 text-center ${
                          TopUp < 0 ? "text-red-500" : "text-sky-500"
                        }`}
                      >
                        {TopUp}
                      </p>
                      <p className="w-2/6 text-center">
                        {transaction.closingBalance}
                      </p>
                    </div>
                  );
                })}
              </div>
              {totalPages > 0 && (
                <div className="flex flex-row items-center justify-center gap-4 mt-4 py-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1 || isLoading}
                    className="px-4 py-2 rounded-lg bg-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages || isLoading}
                    className="px-4 py-2 rounded-lg bg-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {valueUser == "all" && (
        <div className=" p-8 gap-8 flex flex-col rounded-2xl  overflow-hidden sm:w-full  sm:overflow-x-scroll sm:p-2">
          <div className="flex flex-row w-full font-bold text-xs sm:text-xs  ">
            <p className="w-1/12 text-center">Txn No.</p>
            <p className="w-2/12 text-center">Barcode</p>
            {valueUser === "all" ? (
              <p className="w-2/6 text-center">Date</p>
            ) : (
              <p className="w-2/6 text-center">Timeslot</p>
            )}
            {valueUser === "all" && (
              <p className="w-2/6 text-center">Username</p>
            )}
            <p className="w-2/6 text-center">Opening Balance</p>
            <p className="w-1/6 text-center">Order Points</p>
            <p className="w-1/6 text-center">Winning Points</p>
            <p className="w-1/6 text-center">Profit Points</p>
            <p className="w-1/6 text-center">Top Up / Transfer</p>
            <p className="w-2/6 text-center">Closing Balance</p>
          </div>
          {transactions !== null && (
            <>
              <div className="flex flex-col gap-2 h-96 overflow-y-scroll no-scrollbar">
                {Object.entries(transactions).map(([date, userData]) =>
                Object.entries(userData).map(([userId, transactions]) => {
                  const Timeslot = date;
                  let OrderPoints = 0;
                  let WinningPoints = 0;
                  let ProfitPoints = 0;
                  let TopUp = 0;
                  transactions.forEach((transaction) => {
                    const amount = toNumber(transaction.amount);
                    const totalWinning = toNumber(transaction.total_winning);
                    const totalBetPoints = toNumber(transaction.totalBetPoints);
                    if (
                      transaction.type == "Gaming" &&
                      transaction.isProfit == false
                    ) {
                      const orderIncrement =
                        totalBetPoints !== 0 ? totalBetPoints : amount;
                      OrderPoints = OrderPoints + orderIncrement;
                    } else if (transaction.type == "Remove Balance") {
                      TopUp = TopUp + amount * -1;
                    } else if (transaction.type == "Add Balance") {
                      TopUp = TopUp + amount;
                    } else if (
                      transaction.type == "Gaming" &&
                      transaction.isProfit == true
                    ) {
                      WinningPoints = WinningPoints + totalWinning;
                    }
                  });
                  ProfitPoints = OrderPoints - WinningPoints;

                  // Get transaction number from first transaction in the group
                  const firstTransaction = transactions[0];
                  const transactionNumber = firstTransaction?._id 
                    ? firstTransaction._id.toString().slice(-8).toUpperCase() 
                    : 'N/A';
                  const barcodeNumber = firstTransaction?.uniqueString || "—";
                  // If multiple transactions, show indicator
                  const txnDisplay = transactions.length > 1 
                    ? `${transactionNumber} (+${transactions.length - 1})` 
                    : transactionNumber;
                  
                  // return transactions.map((transaction, index) => (
                  return (
                    <div
                      key={`${userId}-${date}`}
                      className={`flex flex-row w-full bg-white py-4 rounded-md shadow-md font-bold sm:text-xs `}
                    >
                      <p className="w-1/12 text-center text-gray-600 font-mono text-xs">
                        {txnDisplay}
                      </p>
                    <p className="w-2/12 text-center text-gray-600 font-mono text-xs break-all">
                      {barcodeNumber}
                    </p>
                      <p className="w-2/6 text-center">{Timeslot}</p>
                      <p className="w-2/6 text-center">{userId}</p>
                      <p className="w-2/6 text-center">
                        {transactions[transactions.length -1].openingBalance}
                      </p>
                      <p className="w-1/6 text-center">{OrderPoints}</p>
                      <p
                        className={`w-1/6 text-center ${
                          WinningPoints > 0 ? "text-green-500" : ""
                        }`}
                      >
                        {WinningPoints}
                      </p>
                      <p
                        className={`w-1/6 text-center ${
                          ProfitPoints > 0 ? "text-green-500" : "text-red-500"
                        }  ${ProfitPoints == 0 ? "text-black" : ""}`}
                      >
                        {ProfitPoints}
                      </p>
                      <p
                        className={`w-1/6 text-center ${
                          TopUp < 0 ? "text-red-500" : "text-sky-500"
                        }`}
                      >
                        {TopUp}
                      </p>
                      <p className="w-2/6 text-center">
                        {transactions[0].closingBalance}
                      </p>
                    </div>
                  );
                  // ));
                })
              )}
            </div>
            {totalPages > 0 && (
              <div className="flex flex-row items-center justify-center gap-4 mt-4 py-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1 || isLoading}
                  className="px-4 py-2 rounded-lg bg-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages || isLoading}
                  className="px-4 py-2 rounded-lg bg-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600"
                >
                  Next
                </button>
              </div>
            )}
          </>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilter;
