import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/Logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-black rounded-lg p-4 inline-block mb-6">
            <img src={logo} alt="MJ POWER" className="w-32 h-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-green-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="  Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="  Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div style={{marginTop: '32px'}}>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-medium py-3 rounded-lg hover:bg-gray-700 mt-4"
          >
            Sign In
          </button>
          </div>
        </form>
   </div>
    </div>
  );
};

export default Login;