import agents from "@/jsonDemo/agent.json";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const LoadWallet = () => {
  const merchantData = agents?.userPersonalDetails;

  return (
    <>
      {/* {loadingSlab && <Loader message="Loading . . ." />} */}
      <div className="flex items-center justify-center z-[2]">
        <div className="bg-white rounded-xl w-full animate-fadeIn max-h-full overflow-y-auto shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Section - Merchant Details and Slab Section */}
            <LeftSection merchantData={merchantData} />
            <RightSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadWallet;
