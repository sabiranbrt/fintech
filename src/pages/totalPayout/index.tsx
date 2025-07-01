import TransactionCard from "./components/TranscationCard";
import Loader from "@/components/LoaderComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDynamicQuery } from "@/hooks/dynamicQuery";
import { getDynamicRequest } from "@/utils/dynamicRequest";

const TotalPayoutList = () => {
  const { selectedService } = useSelector((state: RootState) => state.service);
  const { endpoints } = useSelector((state: RootState) => state.endPoints);

  const stepName = selectedService?.sequence?.find(
    (item) => item === "getCount"
  );

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});
  const { data: count, isLoading } = useDynamicQuery<TODO>(
    request ?? { url: "", method: "GET" },
    {
      queryKey: [stepName],
      enabled: !!request,
    }
  );

  const countList = count?.apiResponseData?.data;

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow-md rounded-md overflow-y-auto min-h-0 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {Object.entries(countList ?? "")
          .filter(([key]) => key !== "total_payout")
          .map(([key, value]) => (
            <TransactionCard key={key} title={key} data={value} />
          ))}
      </div>
    </div>
  );
};

export default TotalPayoutList;
