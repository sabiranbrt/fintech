interface IProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickLinksTitle = ({ title, icon, onClick }: IProps) => {
  return (
    <div className=" group flex items-center gap-5 border-b border-gray-300 pb-3 cursor-pointer my-3">
      <span>{icon}</span>
      <p
        className=" font-medium group-hover:text-primary-dark"
        onClick={onClick}
      >
        {title}
      </p>
    </div>
  );
};

export default QuickLinksTitle;
