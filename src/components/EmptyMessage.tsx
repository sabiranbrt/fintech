const EmptyMessage = () => {
  return (
    <div className="flex flex-col justify-start mt-5 items-center gap-5 w-full">
      <img src="/expressSearch.svg" className="h-96" />
      <p className="text-grey-500 font-semibold">
        Please enter number to proceed . . .
      </p>
    </div>
  );
};

export default EmptyMessage;
