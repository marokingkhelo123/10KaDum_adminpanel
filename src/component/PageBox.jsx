const PageBox = ({ children }) => {
  return (
    <div className="bg-white p-8 gap-8 flex flex-col rounded-2xl sm:p-2  sm:gap-2">
      {children}
    </div>
  );
};

export default PageBox;
