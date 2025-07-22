import clsx from "clsx";

interface IProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  children?: React.ReactNode;
}

const QuickLinksTitle = ({ title, icon, onClick, children }: IProps) => {
  // const { isToggled } = useSelector((state: RootState) => state.toggle);

  return (
    <div
      className=" group flex items-center gap-5 border-b border-gray-300 pb-3 my-3"
      onClick={onClick}
    >
      <span>{icon}</span>
      <p
        className={clsx(
          "font-medium group-hover:text-primary-dark block lg:block md:hidden"
        )}
      >
        {title}
      </p>
      {children}
    </div>
  );
};

export default QuickLinksTitle;
