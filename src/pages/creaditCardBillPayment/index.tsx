/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDynamicQuery } from "@/hooks/dynamicQuery";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { useSelector } from "react-redux";

const CreditCardBill = () => {
  const { endpoints } = useSelector((state: RootState) => state.endPoints);
  const { selectedService } = useSelector((state: RootState) => state.service);

  const stepName = selectedService?.sequence?.[2];
  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});

  const { data } = useDynamicQuery<any>(request!, {
    enabled: !!request,
    queryKey: [stepName],
  });

  console.log("selectedService", selectedService);
  console.log("stepName", stepName);
  console.log("data", data);
  return <div>{data?.charge}</div>;
};

export default CreditCardBill;
