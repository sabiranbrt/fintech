import Header from "@/components/Header";
import QuickLinksComponent from "@/pages/quicklinks/QuickLinksComponent";
import { TopNavbar } from "../components/TopNavbar";
import QuickLinksFormComponent from "./quicklinks/components/QuickLinksFormComponent";
import Footer from "@/components/footer";

const Dashboard = () => {
  return (
    <div className=" bg-secondary-background overflow-hidden h-screen">
      <TopNavbar />
      <div className=" flex gap-4 p-3 h-[80vh]">
        <div className=" flex-1 h-full overflow-hidden flex flex-col">
          <Header />
          <div className="flex-1 min-h-0">
            <QuickLinksFormComponent />
          </div>
        </div>
        <div className="overflow-y-auto bg-white px-8 py-5 shadow-md rounded-md h-full min-h-0">
          <QuickLinksComponent />
        </div>
      </div>
      <Footer messages={""}/>
    </div>
  );
};

export default Dashboard;
