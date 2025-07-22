import Footer from "@/components/footer";
import Header from "@/components/Header";
import QuickLinksComponent from "@/pages/quicklinks/QuickLinksComponent";
import { TopNavbar } from "../components/TopNavbar";
import QuickLinksFormComponent from "./quicklinks/components/QuickLinksFormComponent";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Dashboard = () => {
  const { isToggled } = useSelector((state: RootState) => state.toggle);

  return (
    <div className=" bg-secondary-background lg:overflow-hidden overflow-auto h-screen">
      <TopNavbar />
      <div className=" flex gap-4 p-3 lg:h-[80vh] pb-24 md:pb-24 lg:pb-0">
        <div className=" flex-1 lg:h-full overflow-hidden flex flex-col">
          <Header />
          <div className="flex-1 min-h-0">
            <QuickLinksFormComponent />
          </div>
        </div>
        <div
          className={clsx(
            "overflow-y-auto bg-white px-8 py-5 shadow-md rounded-md h-full min-h-0 lg:block",
            isToggled
              ? "absolute top-[60px] left-0 right-0 bottom-0 z-30"
              : "hidden"
          )}
        >
          <QuickLinksComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
