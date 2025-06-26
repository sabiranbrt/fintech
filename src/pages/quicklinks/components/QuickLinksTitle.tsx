interface IProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  children?: React.ReactNode;
}

const QuickLinksTitle = ({ title, icon, onClick, children }: IProps) => {
  return (
    <div
      className=" group flex items-center gap-5 border-b border-gray-300 pb-3 my-3"
      onClick={onClick}
    >
      <span>{icon}</span>
      <p className=" font-medium group-hover:text-primary-dark">{title}</p>
      {children}
    </div>
  );
};

export default QuickLinksTitle;
