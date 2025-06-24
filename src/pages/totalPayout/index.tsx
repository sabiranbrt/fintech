import { useCount } from "@/hooks/service";
import TransactionCard from "./components/TranscationCard";
import Loader from "@/components/LoaderComponent";

const TotalPayoutList = () => {
  const { data: count, isLoading } = useCount();
  const countList = count?.apiResponseData?.data;

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow-md rounded-md overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-10 ">
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
