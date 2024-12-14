import { useState, useEffect } from 'react';

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Layout = ({ children }: { children: JSX.Element|JSX.Element[]}) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner if not already seen 
    let bannerSeen = localStorage.getItem("banner-seen");
    if (!bannerSeen) {
      setShowBanner(true);
    }
    //localStorage.removeItem("banner-seen");
  }, []);

  return (
    <>
      {showBanner &&
        <div className="fixed w-full h-fit px-6 py-2 bg-navy/80 text-white z-50 flex gap-12 justify-end items-center">
          <div className="text-center font-medium flex-grow">
            Note: Server will spin down with inactivity, which can delay requests by 50 seconds or more on initial use.
          </div>
          <button className="" onClick={() => {
            setShowBanner(false);
            localStorage.setItem("banner-seen", "true");
          }}>
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>
      }
      <div className="w-full min-h-screen flex flex-col justify-between">
        {children}
      </div>
    </>
  );
};

export default Layout;