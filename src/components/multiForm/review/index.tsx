// components/review/ReviewSection.tsx
import { FaPencil } from "react-icons/fa6";

interface Props {
  title: string;
  onEdit?: () => void;
  fields: TODO;
  columns?: number;
}

const ReviewSection = ({ title, onEdit, fields, columns = 2 }: Props) => {

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <h3 className="text-lg font-medium text-primary-dark">{title}</h3>
        {onEdit && (
          <FaPencil
            className="text-md text-gray-400 cursor-pointer"
            onClick={onEdit}
          />
        )}
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {fields.map((field: TODO, i: number) => (
          <div key={i}>
            <p className="text-sm text-gray-600">{field.label}</p>
            <p className="font-medium">{field.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
