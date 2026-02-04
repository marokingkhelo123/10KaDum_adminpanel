import UpdatePointsComponent from "../component/UpdatePoints/UpdatePointsComponent";

const UpdatePointsPage = () => {
  return (
    <div className=" m-12 flex flex-col gap-4 sm:m-4">
      <div className="flex flex-row gap-3">
        <p>Home</p>
        <p>/</p>
        <p className="text-violet-500">Add/Remove Points</p>
      </div>
      <UpdatePointsComponent />
    </div>
  );
};

export default UpdatePointsPage;
