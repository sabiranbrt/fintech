import { MiniLoader } from "./loader/MiniLoader";

const Loader = ({
  message = "Loading...",
  img = "https://finkeda.com/wp-content/uploads/2023/01/Finkeda-Final-Logo.png",
}) => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-primary-light bg-opacity-85 flex justify-center items-center z-[1000]">
      <div className="flex flex-col justify-center items-center gap-7">
        {/* Fading logo */}
        <img
          src={img}
          alt="Finkeda Logo"
          className="h-32 animate-fade-in-out"
        />
        <MiniLoader />
        {/* Optional loading message */}
        {message && (
          <p className="mt-5 text-lg font-medium text-white bg-clip-text bg-gradient-to-r from-secondary-light to-secondary-light">
            {message}
          </p>
        )}

        {/* Mini loader component */}
      </div>
    </div>
  );
};

export default Loader;
