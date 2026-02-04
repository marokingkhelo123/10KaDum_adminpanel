import { Checkbox, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import PageBox from "../component/PageBox";
import { BsPlus, BsTrash } from "react-icons/bs";

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [value, setValue] = useState();
  const [valueActive, setValueActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const getAllLocations = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/location/getAllLocations`
      );
      setLocations(response.data.data);
    } catch (error) {
      console.log(error.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  const handleCheck = async (loc) => {
    setLoading(true);
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/location/updateLocation`,
        data: {
          name: loc.name,
          active: !loc.active,
        },
      });
      setLoading(false);
      getAllLocations();
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  const addLocation = async () => {
    setLoading(true);
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_BASE_URL}/location/addLocation`,
        data: {
          name: value,
          active: valueActive,
        },
      });
      setLoading(false);
      setValue("");
      setValueActive(false);
      setShowAdd(false);
      getAllLocations();
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  const handleDelete = async (loc) => {
    let result = window.confirm("Do you want to delete location ?");
    if (result) {
      setLoading(true);
      try {
        await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_BASE_URL}/location/deleteLocation`,
          data: {
            name: loc.name,
          },
        });
        setLoading(false);
        getAllLocations();
      } catch (error) {
        console.log(error.response);
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-12 my-4 pb-24 flex flex-col gap-4 sm:mx-2">
      <div className="flex flex-row gap-3">
        <p>Home</p>
        <p>/</p>
        <p className="text-violet-500">Location</p>
      </div>
      <div className="flex items-end justify-end w-full place-items-end place-content-end gap-4">
        <div
          className="bg-purple-600 p-3 px-8 rounded-3xl text-lg font-medium sm:text-xs   cursor-pointer "
          onClick={() => setShowAdd(true)}
        >
          <button className="flex flex-row text-white items-center gap-2 mx-auto">
            <BsPlus />
            Add Location
          </button>
        </div>
      </div>

      {showAdd ? (
        <div className="flex flex-col shadow-lg my-8 rounded-xl bg-white w-full p-4 ">
          <div className="flex flex-row gap-8 sm:flex-col">
            <div className="flex flex-col w-full gap-4">
              <p className="font-bold">Location Name</p>
              <TextField
                id="outlined-basic"
                label="Location"
                variant="outlined"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
            <div className="w-full flex flex-col items-start gap-4  ">
              <p className="font-bold ">Active</p>
              <Checkbox
                defaultChecked={valueActive}
                onClick={() => setValueActive(true)}
              />
            </div>
            <div className="flex flex-row gap-3 justify-end items-center">
              <button
                className="flex flex-row 
                p-3 font-semibold  bg-purple-500 h-fit  items-center gap-2 text-white px-8 rounded-3xl"
                onClick={addLocation}
              >
                Save
              </button>
              <button
                className="flex flex-row 
                p-3 font-semibold  bg-red-500 h-fit  items-center gap-2 text-white px-8 rounded-3xl"
                onClick={() => {
                  console.log("CLIEKD");
                  setValue("");
                  setValueActive(false);
                  setShowAdd(false);
                }}
              >
                Cancle
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="flex items-end justify-end w-full place-items-end place-content-end h-fit"></div>
      {!loading && locations.length > 0 && (
        <PageBox>
          <div className=" flex-row flex gap-4 border-b border-black pb-8">
            <p className="w-1/3 font-bold text-xl  sm:text-xs">Name</p>
            <p className="w-1/3 font-bold text-xl text-center sm:text-xs">
              Active
            </p>
            <p className="w-1/3 font-bold text-xl text-center sm:text-xs">
              Delete
            </p>
          </div>
          <div className=" flex-col flex gap-4 overflow-y-scroll h-96 no-scrollbar">
            {locations?.map((loc) => {
              return (
                <div
                  className="flex flex-row  bg-white  border-black border-b"
                  key={loc.name + loc.active}
                >
                  <div className="w-1/3 flex flex-row items-center">
                    <div className="text-lg capitalize font-medium sm:text-xs ">
                      {loc.name}
                    </div>
                  </div>

                  <div className="w-1/3 flex  items-center flex-row justify-center  ">
                    <Checkbox
                      size="medium"
                      className=""
                      defaultChecked={loc.active}
                      onClick={() => handleCheck(loc)}
                    />
                  </div>
                  <div className="w-1/3 flex-row flex  justify-center     mb-4 ">
                    <div
                      onClick={() => handleDelete(loc)}
                      className="font-bold bg-red-500 w-fit   p-2 text-white capitalize text-xl cursor-pointer rounded-2xl px-4 sm:text-xs"
                    >
                      <BsTrash />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PageBox>
      )}
      {loading ? <CircularProgress className="mx-auto" /> : <></>}
    </div>
  );
};

export default LocationPage;
