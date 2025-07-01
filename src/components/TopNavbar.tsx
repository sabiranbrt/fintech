/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { IoMdQrScanner } from "react-icons/io";
import { MdFullscreenExit } from "react-icons/md";
import logo from "@assets/images/logo.png";
import { useBalance } from "@/hooks/service";

export const TopNavbar = () => {
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
    const d: any = document;
    return (
      d.fullscreenElement ||
      d.webkitFullscreenElement ||
      d.mozFullScreenElement ||
      d.msFullscreenElement
    );
  };
  const handleFullscreen = () => {
    const d: any = document;
    const el: any = d.documentElement;

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
    <nav className=" bg-gradient-to-r from-[#dcdfec] to-[#a0ddde] flex items-center justify-between px-4 py-1 shadow-md">
      <img
        src={logo}
        alt="Logo"
        className="h-16 cursor-pointer"
        onClick={redirectHome}
      />
      <div className="flex justify-center items-center gap-7">
        <div className="flex items-center gap-5">
          <div className="text-sm">
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
          className="flex items-center p-2 bg-transparent border border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-all duration-300"
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
                <IoMdQrScanner className="text-xl mr-2" title="Full Screen" />
                <p>Full Screen</p>
              </span>
            )}
          </span>
        </div>

        <div
          className="flex items-center p-2 bg-transparent mr-2 border border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:text-primary transition-all duration-300"
          onClick={redirectHome}
          style={{
            border: "3px solid transparent",
            borderRadius: "8px",
            borderImage: "linear-gradient(45deg, #4b5a9f, #4fb5b7) 3",
            backgroundClip: "border-box",
            WebkitMaskImage: "linear-gradient(white, white)",
          }}
        >
          <FaHome className="text-xl mr-2" title="Home" />
          <span className="text-sm">Home</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
