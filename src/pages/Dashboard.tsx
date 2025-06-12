import Header from "@/components/Header";
import QuickLinksComponent from "@/pages/quicklinks/QuickLinksComponent";
import { TopNavbar } from "../components/TopNavbar";
import QuickLinksFormComponent from "./quicklinks/components/QuickLinksFormComponent";

const Dashboard = () => {
  return (
    <div className=" bg-secondary-background overflow-hidden h-screen">
      <TopNavbar />
      <div className=" flex gap-4 p-3 h-[85vh]">
        <div className="flex-1">
          <Header />
          <div className="">
            <QuickLinksFormComponent />
          </div>
        </div>
        <div className=" overflow-y-auto bg-white px-8 py-5 shadow-md rounded-md h-full min-h-0">
          <QuickLinksComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
