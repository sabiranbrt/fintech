import Footer from "@/components/footer";
import Header from "@/components/Header";
import { useAuthToken } from "@/hooks/service";
import QuickLinksComponent from "@/pages/quicklinks/QuickLinksComponent";
import { TopNavbar } from "../components/TopNavbar";
import QuickLinksFormComponent from "./quicklinks/components/QuickLinksFormComponent";

const Dashboard = () => {
  const { data: token } = useAuthToken();
   localStorage.setItem("digiToken", token?.apiResponseData?.responseData?.accessToken);

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
      <Footer />
    </div>
  );
};

export default Dashboard;
