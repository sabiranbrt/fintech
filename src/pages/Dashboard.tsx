import Header from "@/components/Header";
import QuickLinksComponent from "@/pages/quicklinks/QuickLinksComponent";
import { TopNavbar } from "../components/TopNavbar";
import QuickLinksFormComponent from "./quicklinks/components/QuickLinksFormComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import BackButton from "@/components/BackButton";

const Dashboard = () => {
  const { selectedService, isText } = useSelector(
    (state: RootState) => state.service
  );

  return (
    <div className=" bg-secondary-background h-dvh overflow-hidden">
      <TopNavbar />
      <div className=" flex gap-4 p-3 h-[85%]">
        <div className=" w-full">
          <Header />
          {selectedService || isText ? <BackButton /> : null}
          <div className=" overflow-hidden">
            <QuickLinksFormComponent />
          </div>
        </div>
        <div className=" flex justify-end w-72">
          <QuickLinksComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
