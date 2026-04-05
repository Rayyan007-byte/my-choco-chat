import React, { useEffect, useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ChatHeader = () => {
  const currentId = useSelector((state) => state.userid.senderId);
  const [userDetails, setUserDetails] = useState(null);
  const { id } = useParams(); // chat id
  const navigate = useNavigate();

useEffect(() => {
  const fetchUserDetails = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/chat/get-my-chat`,
        { withCredentials: true }
      );
      // Check if response has chats array
      const chats = Array.isArray(res.data) ? res.data : res.data.chats;
      if (!chats) {
        console.error("No chats found in response:", res.data);
        return;
      }

      const chat = chats.find((c) => c._id === id);
      if (!chat) {
        console.error("Chat not found for id:", id);
        return;
      }

      const otherMembers = chat.members.filter((m) => m._id != currentId);
      setUserDetails(otherMembers[0]);
    } catch (error) {
      console.error("Error fetching chat user details:", error);
    }
  };

  fetchUserDetails();
}, [id, currentId]);
  if (!userDetails) {
    return (
      <div className="px-4 py-2 bg-[#1e1e1e] border-b border-gray-700 text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={22} />
        </button>
        <img
          src={
            userDetails.avatar?.url
              ? userDetails.avatar.url.startsWith("http")
                ? userDetails.avatar.url
                : `http://localhost:3000${userDetails.avatar.url}`
              : "/avataar.png"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-600"
        />

        <div>
          <h2 className="text-white text-base font-semibold">
            {userDetails.name}
          </h2>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
      </div>

      {/* Right section */}
      <button className="text-gray-300 hover:text-white transition">
        <MoreVertical size={22} />
      </button>
    </div>
  );
};

export default ChatHeader;