import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ profile }) => {
  const [IsOpen, setIsOpen] = useState(false)
  if (!profile) return null;
  const { name, username, bio, _id, avatar } = profile;

  return (
    <>
    <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg relative gap-4">
      
      {/* Back link */}
      <Link
        to="/main"
        className="absolute top-3 left-3 text-blue-400 hover:text-blue-600 font-semibold"
      >
        ← Back
      </Link>

      {/* Avatar */}
      <img
        src={avatar?.url || "/default-avatar.png"}
        alt={name}
        className="w-32 h-32 rounded-full object-cover shadow-md cursor-pointer"
        onClick={() => setIsOpen(true)}
      />

      {/* User Details */}
      <div className="flex flex-col items-center gap-1 mt-2">
        <div className="text-white font-semibold text-lg">
          Name: <span className="font-normal">{name}</span>
        </div>
        <div className="text-gray-300 text-sm">
          Username: <span className="font-normal">@{username}</span>
        </div>
        {bio && (
          <div className="text-gray-400 text-center mt-1">
            Bio: <span className="font-normal">{bio}</span>
          </div>
        )}
        <div className="text-gray-500 text-xs mt-1">
          User ID: <span className="font-normal">{_id}</span>
        </div>
      </div>
    </div>
    {
      IsOpen && (
        <div className="fixed inset-0 items-center justify-center rounded-lg"
        onClick={() => setIsOpen(false)}
        >
          <img 
          src={avatar?.url} alt=""
          onClick={(e) => e.stopPropagation()}
           />
        </div>
      )
    }
    </>
  );
};

export default ProfileCard;