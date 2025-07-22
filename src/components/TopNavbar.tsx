import { useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { IoMdQrScanner } from "react-icons/io";
import { MdFullscreenExit } from "react-icons/md";
import logo from "@assets/images/logo.png";
import { useBalance } from "@/hooks/service";
import hamburgerMenu from "@assets/icons/hamburger-maenu.svg";
import CrossMenu from "@assets/icons/menu-close.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setToggle } from "@/redux/slices/toggleSlice";

export const TopNavbar = () => {
  const { isToggled } = useSelector((state: RootState) => state.toggle);
  const dispatch = useDispatch();
  const { data: balanceData } = useBalance();

  const balance = balanceData?.apiResponseData?.data;
  const totalBalance = balance?.current_balance;

  const [showBalance, setShowBalance] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const redirectHome = () => {
    const v1URL = import.meta.env.VITE_V1_URL;
    window.location.href = v1URL;
  };

  const handleMouseUp = () => {
    setShowBalance(false);
  };

  const handleMouseDown = () => {
    setShowBalance(true);
  };

  const isInFullscreen = () => {
    const d: TODO = document;
    return (
      d.fullscreenElement ||
      d.webkitFullscreenElement ||
      d.mozFullScreenElement ||
      d.msFullscreenElement
    );
  };

  const handleFullscreen = () => {
    const d: TODO = document;
    const el: TODO = d.documentElement;

    if (!isInFullscreen()) {
      /* ENTER fullscreen */
      setIsFullscreen(true);
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      /* EXIT fullscreen */
      setIsFullscreen(false);
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
      else if (d.mozCancelFullScreen) d.mozCancelFullScreen();
      else if (d.msExitFullscreen) d.msExitFullscreen();
    }
  };

  return (
    <nav className=" sticky top-0 z-50 bg-gradient-to-r from-[#dcdfec] to-[#a0ddde] flex items-center justify-between px-4 py-1 shadow-md">
      <img
        src={logo}
        alt="Logo"
        className="h-7 lg:h-16 cursor-pointer mr-2"
        onClick={redirectHome}
      />
      <div className="flex justify-center items-center gap-2 lg:gap-7">
        <div className="items-center justify-between gap-1 lg:gap-5 flex">
          <div className="text-sm hidden lg:block">
            <span className="font-bold text-primary-dark">Email: </span>
            <span>help@finkeda.com</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-primary-dark">Toll Free No: </span>
            <span>08069627000</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-primary-dark">Total Balance: </span>
            <span>{showBalance ? totalBalance : "XXX"}</span>
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className="ml-2"
            >
              {showBalance ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <div
          className="hidden lg:flex items-center whitespace-nowrap p-2 md-2 sm:p-1 bg-transparent border border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-all duration-300"
          onClick={handleFullscreen}
          style={{
            border: "3px solid transparent",
            borderRadius: "8px",
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box",
            WebkitMaskImage: "linear-gradient(white, white)",
          }}
        >
          <span className="text-sm">
            {isFullscreen ? (
              <span className="flex">
                <MdFullscreenExit
                  className="text-xl mr-2"
                  title="Exit Full Screen"
                />
                <p>Exit Full Screen</p>
              </span>
            ) : (
              <span className="flex">
                <IoMdQrScanner
                  className="text-xl mr-2 md:text-xl sm:text-sm"
                  title="Full Screen"
                />
                <p>Full Screen</p>
              </span>
            )}
          </span>
        </div>
        <div
          className="flex items-center p-1 lg:p-2 bg-transparent mr-2 border border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-all duration-300"
          onClick={redirectHome}
          style={{
            border: "3px solid transparent",
            borderRadius: "8px",
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box",
            WebkitMaskImage: "linear-gradient(white, white)",
          }}
        >
          <FaHome className=" mr-0 lg:mr-2 lg:text-xl text-sm" title="Home" />
          <span className="text-sm hidden lg:block">Home</span>
        </div>

        <div className=" block md:hidden">
          {!isToggled ? (
            <div onClick={() => dispatch(setToggle(true))}>
              <img src={hamburgerMenu} alt="hamburger-menu" className=" h-8" />
            </div>
          ) : (
            <div onClick={() => dispatch(setToggle(false))}>
              <img src={CrossMenu} alt="close-menu" className=" h-8" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
