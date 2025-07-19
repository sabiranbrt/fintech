interface IProps {
  title: string;
  subtitle: string;
  confirmBtn: string;
  cancelBtn: string;
  confirm: () => void;
  cancel: () => void;
}

const ActionModal = ({
  title,
  subtitle,
  confirm,
  cancel,
  confirmBtn,
  cancelBtn,
}: IProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p>{subtitle}?</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-all duration-300"
            onClick={confirm}
          >
            {confirmBtn}
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancel}>
            {cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
