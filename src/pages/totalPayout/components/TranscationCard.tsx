import { PiCurrencyInr } from "react-icons/pi";
import { BsCashStack } from "react-icons/bs";

interface IProps {
  title: string;
  data: TODO;
}

const TransactionCard = ({ title, data }: IProps) => {
  const Icon = data.icon;

  return (
    <div className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900 capitalize">
            {title.replace(/_/g, " ")}
          </h3>
          <div className="p-2 rounded-full bg-slate-100">
            {Icon ? (
              <Icon className="w-6 h-6 text-slate-600" />
            ) : (
              <BsCashStack />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Success */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Success</span>
          <span className="text-sm font-medium text-emerald-600">
            {data.success + data.initiated}
          </span>
        </div>

        {/* Failure */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Failure</span>
          <span className="text-sm font-medium text-red-500">
            {data.failure}
          </span>
        </div>

        {/* Total Amount */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Amount</span>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <PiCurrencyInr className="w-3 h-3 mr-1" />
              <span>
                {(data.totalAmount + data.initiatedAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransactionCard;
