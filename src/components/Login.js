import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://test-web-site-464607@appspot.gserviceaccount.com/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      if (response.status === 200) {
        message.success('Login successful!');

        navigate('/product-list');
      } else {
        message.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen" style={{ fontFamily: "Manrope, 'Noto Sans', sans-serif" }}>
      <div className="w-full max-w-md px-8 py-6 bg-[#1a1a1a] rounded-lg shadow-lg">
        <header className="flex items-center justify-center gap-2 mb-8 text-[#FFFFFF]">
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_319)">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath>
            </defs>
          </svg>
          <h2 className="text-2xl font-bold">Car Connect</h2>
        </header>

        <h3 className="text-2xl font-bold text-center text-[#FFFFFF] mb-6">Welcome Back to Car Connect</h3>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-[#FFFFFF] text-base font-medium">email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              className="w-full h-12 px-4 text-[#FFFFFF] bg-[#292929] rounded-xl border-none placeholder-[#ABABAB] focus:outline-none focus:ring-0"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#FFFFFF] text-base font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full h-12 px-4 text-[#FFFFFF] bg-[#292929] rounded-xl border-none placeholder-[#ABABAB] focus:outline-none focus:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full h-12 mt-4 text-center text-white bg-[#EA2831] rounded-xl font-bold"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-[#ABABAB]">
          Don't have an account?
          <a href="/signup" className="text-[#EA2831] font-medium">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
