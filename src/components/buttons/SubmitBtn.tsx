
interface IProps{
    onClick:()=>void
    isLoading: boolean
    isPennyDropVerified: boolean
}

const SubmitBtn = ({onClick,isLoading,isPennyDropVerified}:IProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || !isPennyDropVerified}
      className={`px-5 text-white rounded-lg py-2  ${
        !isPennyDropVerified
          ? "bg-gray-400"
          : "bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7] hover:from-[#6a77b0] hover:to-[#70c6c7] transition-all duration-300"
      }`}
    >
      {isLoading ? "Submitting..." : "Submit"}
    </button>
  );
};

export default SubmitBtn;
