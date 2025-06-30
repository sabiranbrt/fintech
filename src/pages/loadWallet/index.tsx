import { useAgent, useSlabViaPG } from "@/hooks/service";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "@/components/LoaderComponent";

const LoadWallet = () => {
  const value = useSelector((state: RootState) => state.stringValue.value);

  const { data: agent, isLoading: agentLoad } = useAgent();
  const { data: slab, isLoading: SlabLoad, refetch } = useSlabViaPG(value);

  const slablist = slab?.apiResponseData?.data;
  const agentList = agent?.apiResponseData?.data?.userPersonalDetails;

  return (
    <div className="flex items-center justify-center z-[2]">
      <div className="bg-white rounded-xl w-full animate-fadeIn max-h-full overflow-y-auto shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section - Merchant Details and Slab Section */}
          <LeftSection merchantData={agentList} slabList={slablist} />
          <RightSection slablist={slablist} refetchSlab={refetch} />
          {(agentLoad || SlabLoad) && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default LoadWallet;
