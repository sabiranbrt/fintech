import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const FullPageLoader = () => {
  const isLoading = useSelector((state: RootState) => state.app.isLoading);

  if (!isLoading) return null;

  return (
    <>
      <div className=" absolute top-0 left-0 z-20 bg-black opacity-60 h-full w-full flex items-center justify-center">
        <span className="loader"></span>
      </div>
    </>
  );
};

export default FullPageLoader;
