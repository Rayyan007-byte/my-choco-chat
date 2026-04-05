import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import axios from "axios";
import { setSenderId } from "../redux/slice";
import ProfileCard from "../components/cards/ProfileCard";

const MyProfile = () => {
  const dispatch = useDispatch();
  const [Profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/user/get-me", {
        withCredentials: true,
      });
      dispatch(setSenderId(res.data.profile._id));
      setProfile(res.data.profile);
    };
    fetchMe();
  }, []);

  if (!Profile) return <p className="text-white">Loading...</p>; // safe fallback

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-950 p-4">
      <ProfileCard
        profile={{
          ...Profile,
         /*  avatar: {
            url: Profile.avatar?.url
              ? `http://localhost:3000${Profile.avatar.url}`
              : "/default-avatar.png",
          }, */
          avatar: {
            url: Profile.avatar?.url
            ? Profile.avatar?.url.startsWith("http")
              ? Profile.avatar?.url 
              : `http://localhost:3000${Profile.avatar.url}`
            : "Default"
          }
        }}
      />
    </div>
  );
};

export default MainLayout()(MyProfile);