import ChangePasswordComponent from "../component/ChangePassword/ChangePasswordComponent";

const ChangePasswordPage = () => {
  return (
    <div className="m-12 flex flex-col gap-4 sm:m-2">
      <div className="flex flex-row gap-3">
        <p>Home</p>
        <p>/</p>
        <p className="text-violet-500">Update Password</p>
      </div>
      <ChangePasswordComponent />
    </div>
  );
};

export default ChangePasswordPage;
