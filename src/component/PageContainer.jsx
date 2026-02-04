// eslint-disable-next-line react/prop-types
const PageContainer = ({ children }) => {
  return (
    <div className="my-4 mx-16 flex flex-col gap-8 sm:m-4">{children}</div>
  );
};

export default PageContainer;
