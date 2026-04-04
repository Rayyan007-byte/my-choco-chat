import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  VisuallyHiddenInput,
} from "../components/styles/StyledComponent";
import { useInputValue } from "../hooks/inputValue";
import { setIsLoggedIn, setSenderId } from "../redux/slice";
import { passwordValidator, usernameValidator } from "../utils/validator";

const Login = () => {
  const dispatch = useDispatch();
  const [IsLogin, setIsLogin] = useState(true);
  const [SignUpName, setSignUpName] = useState("");
  const username = useInputValue({ validator: usernameValidator });
  const password = useInputValue({ validator: passwordValidator });
  const [AvatarFile, setAvatarFile] = useState(null);
  const [AvatarPreview, setAvatarPreview] = useState(null);
  const [UserBio, setUserBio] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const toggleLogin = () => setIsLogin((prev) => !prev);

  const navigate = useNavigate();

  const signinHandler = async () => {
    if (!username.validate() || !password.validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/sign-in",
        { username: username.value, password: password.value },
        { withCredentials: true }
      );

      dispatch(setSenderId(res.data.existingUser._id));
      toast.success(res.data.message);

      username.setValue("");
      password.setValue("");
      navigate("/main");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const signupHandle = async () => {
    if (!SignUpName || !username.validate() || !password.validate()) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    if (AvatarFile) toast.loading("Uploading avatar, please wait...");

    try {
      const formData = new FormData();
      formData.append("name", SignUpName);
      formData.append("username", username.value);
      formData.append("password", password.value);
      formData.append("bio", UserBio);
      if (AvatarFile) formData.append("avatar", AvatarFile);

      const res = await axios.post(
        "http://localhost:3000/api/v1/user/sign-up",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.dismiss(); // remove loading toast
      toast.success(res.data.message);

      // reset fields
      setSignUpName("");
      username.setValue("");
      password.setValue("");
      setUserBio("");
      setAvatarFile(null);
      setAvatarPreview(null);
      navigate("/login");
      dispatch(setIsLoggedIn(true));
    } catch (error) {
      toast.dismiss();
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-orange-950 flex items-center justify-center p-4">
      {IsLogin ? (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 max-w-xl w-full text-white text-center flex flex-col gap-4">
          <h1 className="text-4xl font-bold mb-3 text-[#d6b28d] drop-shadow-md flex justify-between">
            🍫 LOG-IN
            <Link to="/">🏠</Link>
          </h1>

          <div className="w-full flex flex-col gap-4">
            <input
              value={username.value}
              onChange={username.onChange}
              placeholder="Enter Username"
              className={`w-full py-2 px-1 rounded-lg border ${
                username.error ? "border-red-500" : "border-white/10"
              }`}
            />
            {username.error && (
              <p className="text-red-400 text-sm">{username.error}</p>
            )}

            <input
              type="password"
              value={password.value}
              onChange={password.onChange}
              placeholder="Enter Password"
              className={`w-full py-2 px-1 rounded-lg border ${
                password.error ? "border-red-500" : "border-white/10"
              }`}
            />
            {password.error && (
              <p className="text-red-400 text-sm">{password.error}</p>
            )}

            <button
              onClick={signinHandler}
              className="bg-orange-950 text-[#d6b28d] font-semibold py-2 px-20 rounded shadow hover:bg-white/20 transition"
            >
              Login
            </button>
          </div>

          <p className="text-[#d6b28d]">OR</p>

          <div className=" text-white/50">
            <button onClick={toggleLogin} className="hover:text-[#d6b28d]">
              Sign Up Instead
            </button>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 max-w-xl w-full text-white text-center flex flex-col gap-4">
          <h1 className="text-4xl font-bold mb-3 text-[#d6b28d] drop-shadow-md flex justify-between">
            🍫 SIGN-UP
            <Link to="/">🏠</Link>
          </h1>

          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="relative w-fit">
                <Avatar size="lg" src={AvatarPreview} />
                <label
                  htmlFor="avatar-upload"
                  className="w-8 h-8 bg-orange-950 rounded-full cursor-pointer flex items-center justify-center gap-2 text-[#d6b28d] hover:opacity-80 absolute bottom-0 -right-2"
                >
                  <FaCamera size={16} />
                </label>
                <VisuallyHiddenInput
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <input
              value={SignUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              type="text"
              placeholder="Enter Name"
              className="w-full py-2 px-1 border border-white/10 rounded-lg"
            />

            <input
              value={username.value}
              onChange={username.onChange}
              placeholder="Enter Username"
              className={`w-full py-2 px-1 rounded-lg border ${
                username.error ? "border-red-500" : "border-white/10"
              }`}
            />
            {username.error && (
              <p className="text-red-400 text-sm">{username.error}</p>
            )}

            <input
              type="password"
              value={password.value}
              onChange={password.onChange}
              placeholder="Enter Password"
              className={`w-full py-2 px-1 rounded-lg border ${
                password.error ? "border-red-500" : "border-white/10"
              }`}
            />
            {password.error && (
              <p className="text-red-400 text-sm">{password.error}</p>
            )}

            <textarea
              value={UserBio}
              onChange={(e) => setUserBio(e.target.value)}
              placeholder="Enter Bio"
              rows={4}
              className="focus-blur w-full border border-zinc-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={signupHandle}
              disabled={loading}
              className="bg-orange-950 text-[#d6b28d] font-semibold py-2 px-20 rounded shadow hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </div>

          <p className="text-[#d6b28d]">OR</p>

          <div className=" text-white/50">
            <button onClick={toggleLogin} className="hover:text-[#d6b28d]">
              Sign In Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;