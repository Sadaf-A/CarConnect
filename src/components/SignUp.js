import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { message } from 'antd';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post('https://hallowed-fin-447404-e6.el.r.appspot.com/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        message.success("User signed up successfully!");
        setTimeout(() => {
          handleRedirectToLogin();
        }, 1000); 
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRedirectToLogin = () => {
    navigate("/");
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-black dark overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-solid border-b-[#292929] px-10 py-3">
          <h2 className="text-[#FFFFFF] text-lg font-bold">Car Connect</h2>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <h3 className="text-[#FFFFFF] text-2xl font-bold text-center pb-2 pt-5">Welcome to Car Connect</h3>
            <div className="flex max-w-[480px] flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <p className="text-[#FFFFFF] text-base font-medium pb-2">Username</p>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="form-input w-full rounded-xl text-[#FFFFFF] focus:outline-0 bg-[#292929] h-14 placeholder:text-[#ABABAB] p-4"
                />
              </label>
            </div>

            <div className="flex max-w-[480px] flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <p className="text-[#FFFFFF] text-base font-medium pb-2">Email</p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input w-full rounded-xl text-[#FFFFFF] focus:outline-0 bg-[#292929] h-14 placeholder:text-[#ABABAB] p-4"
                />
              </label>
            </div>

            <div className="flex max-w-[480px] flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <p className="text-[#FFFFFF] text-base font-medium pb-2">Password</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input w-full rounded-xl text-[#FFFFFF] focus:outline-0 bg-[#292929] h-14 placeholder:text-[#ABABAB] p-4"
                />
              </label>
            </div>

            <div className="flex px-4 py-3">
              <button
                onClick={handleSignUp}
                className="min-w-[84px] w-full cursor-pointer rounded-xl h-10 bg-[#EA2831] text-[#FFFFFF] text-sm font-bold"
              >
                Sign Up
              </button>
            </div>

            <p className="text-[#ABABAB] text-sm text-center pb-3 pt-1 px-4">Already have an account?</p>

            <div className="flex px-4 py-3">
              <button
                onClick={handleRedirectToLogin}
                className="min-w-[84px] w-full cursor-pointer rounded-xl h-10 bg-[#292929] text-[#FFFFFF] text-sm font-bold"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
