
interface IProps{
    title: string
    modalOnClick:()=> void
}

const ModalBtn = ({modalOnClick,title}:IProps) => {
  return (
    <button
      type="button"
      onClick={modalOnClick}
      className="bg-gradient-to-r from-[#4b5a9f] to-[#4fb5b7] px-3 py-1 rounded-lg text-white hover:bg-gradient-to-r hover:from-[#6a77b0] hover:to-[#70c6c7] transition-all duration-300"
    >
      {title}
    </button>
  );
};

export default ModalBtn;
