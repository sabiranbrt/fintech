interface IProps {
  onClick?: () => void;
  title: string;
}

const BtnPrimary = ({ onClick, title }: IProps) => {
  return (
    <button
      type="submit"
      onClick={() => {
        if (title === "Back") {
          window.location.reload();
        } else {
          onClick?.();
        }
      }}
      className={`m-4 px-8 py-1 h-10 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-200 text-sm ml-0`}
      style={{
        border: "3px solid transparent",
        borderRadius: "8px",
        borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
        backgroundClip: "border-box", 
        WebkitMaskImage: "linear-gradient(white, white)",
        boxShadow:
          "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
      }}
    >
      {title}
    </button>
  );
};

export default BtnPrimary;
