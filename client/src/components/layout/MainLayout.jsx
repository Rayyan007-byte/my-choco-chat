import axios from "axios";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import ChatList from "../../pages/ChatList";
import DraggableBox from "./DraggableBox";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { CgMenuMotion } from "react-icons/cg";
import { MdMenu } from "react-icons/md";

const MainLayout = () => (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const socket = useSocket();

    const [showChatlist, setShowChatlist] = useState(false);

    useEffect(() => {
      if (!socket) return;
      socket.on("connect", () => {
        // console.log("new user connected", socket.id);
      });
      return () => socket.off("connect");
    }, [socket]);

    const logoutHandler = async () => {
      await axios.get("http://localhost:3000/api/v1/user/log-out", {
        withCredentials: true,
      });
      navigate("/");
    };

    return (
      <>
        <div className="h-screen bg-orange-950 flex items-center justify-center p-4 relative overflow-hidden">

          {/* ===== Mobile Menu Button ===== */}
          <button
            className="text-white absolute top-4 left-4 md:hidden z-50"
            onClick={() => setShowChatlist((prev) => !prev)}
          >
           {
            showChatlist ? <CgMenuMotion size={26} /> : <MdMenu size={26} />
           } 
          </button>

          {/* ===== Main Card ===== */}
          <div className="relative backdrop-blur-md bg-white/10 border border-white/5 rounded-lg shadow-xl max-w-4xl w-full text-white flex h-[90%] overflow-hidden">

            {/* ================= SIDEBAR / DRAWER ================= */}
            <div
              className={`
                bg-white/10 backdrop-blur-md
                border-r border-white/5
                w-[85%] sm:w-[70%] md:w-[40%]
                fixed md:static
                top-0 left-0 h-full md:h-auto
                z-40
                transform transition-transform duration-300 ease-in-out
                ${showChatlist ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
                md:translate-x-0 md:shadow-none
              `}
            >
              <div className="h-full relative flex flex-col">

                <div className="bottom-20 right-0">
                  <DraggableBox />
                </div>

                {/* ChatList / New Contact (NO CHANGE) */}
                <div className="flex-1 w-full overflow-y-auto">
                  <ChatList />
                </div>

                {/* Bottom Actions */}
                <div className="h-12 w-full flex gap-0.5">
                  <Link
                    to="/me"
                    className="w-[70%] bg-white/30 hover:bg-white/10 flex items-center justify-center text-2xl font-semibold text-orange-950"
                    onClick={() => setShowChatlist(false)}
                  >
                    <IoSettingsOutline />
                  </Link>

                  <div
                    onClick={logoutHandler}
                    className="w-[30%] bg-white/30 hover:bg-white/10 flex items-center justify-center text-2xl font-semibold text-orange-950 cursor-pointer"
                  >
                    <MdLogout />
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Overlay (Mobile only) ===== */}
            {showChatlist && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setShowChatlist(false)}
              />
            )}

            {/* ================= RIGHT CONTENT ================= */}
            <div className="h-full w-full flex-1 items-center justify-center relative z-10">
              <WrappedComponent {...props} />
            </div>

          </div>
        </div>
      </>
    );
  };
};

export default MainLayout;
