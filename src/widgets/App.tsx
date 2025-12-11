import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/images/Logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { login, addItem, data } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCustomerMode) {
      // Customer login - check against customers data
      const customer = data.customers.find(c => c.email === username && c.password === password);
      if (customer) {
        // Set customer as current user with customer role
        const customerUser = { ...customer, role: 'customer' };
        login(customer.email, customer.password, customerUser);
        setError('');
      } else {
        setError('Invalid customer credentials');
      }
    } else {
      if (login(username, password)) {
        setError('');
      } else {
        setError('Invalid credentials');
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Check if customer already exists
    const existingCustomer = data.customers.find(c => c.email === username);
    if (existingCustomer) {
      setError('Customer with this email already exists');
      return;
    }
    
    // Add new customer
    const newCustomer = {
      name,
      email: username,
      phone,
      address,
      password,
      assignedTo: '',
      assignedType: 'partner'
    };
    addItem('customers', newCustomer);
    setError('');
    setIsRegistering(false);
    setName('');
    setPhone('');
    setAddress('');
    setUsername('');
    setPassword('');
    alert('Registration successful! You can now login.');
  };

  if (isCustomerMode) {
    return (
      <div className="min-h-screen bg-blue-600 flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="bg-white rounded-2xl p-6 inline-block mb-6 shadow-2xl">
              <img src={logo} alt="MJ POWER Solar" className="w-32 h-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">MJ POWER Solar</h1>
            <p className="text-xl text-blue-100 mb-8">Your trusted partner in clean energy solutions</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl mb-2">🌞</div>
                <div>Premium Solar Panels</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <div>Expert Installation</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl mb-2">🔧</div>
                <div>24/7 Support</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl mb-2">💰</div>
                <div>Best Prices</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="lg:hidden bg-blue-600 rounded-xl p-3 inline-block mb-4">
                <img src={logo} alt="MJ POWER Solar" className="w-16 h-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isRegistering ? 'Create Account' : 'Customer Login'}
              </h2>
              <p className="text-gray-600">
                {isRegistering ? 'Join thousands of happy customers' : 'Access your solar dashboard'}
              </p>
            </div>

            <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              )}
              
              {isRegistering && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              {isRegistering && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Installation Address
                  </label>
                  <textarea
                    placeholder="Enter your address for solar installation"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    rows="3"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isRegistering ? 'Create Account' : 'Login'}
              </button>
              
              {isRegistering && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setName('');
                    setPhone('');
                    setAddress('');
                    setUsername('');
                    setPassword('');
                    setError('');
                  }}
                  className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </form>

            <div className="mt-6 text-center space-y-3">
              {!isRegistering && (
                <button
                  onClick={() => {
                    setIsCustomerMode(!isCustomerMode);
                    setError('');
                    setUsername('');
                    setPassword('');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                >
                  Staff Login
                </button>
              )}
              
              {!isRegistering && (
                <div>
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setError('');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                  >
                    New customer? Create account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Staff Login UI (existing design)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Solar panel pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-yellow-400 rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-yellow-400 -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-green-400 rotate-45"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-3 sm:p-4 inline-block mb-4 sm:mb-6 shadow-2xl">
            <img src={logo} alt="MJ POWER Solar" className="w-24 sm:w-32 h-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 drop-shadow-lg">
            Solar Staff Portal
          </h1>
          <p className="text-sm sm:text-base text-gray-700">
            Power the future with solar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-blue-900 font-semibold mb-2 text-sm sm:text-base flex items-center">
              <span className="mr-2">👤</span> Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm sm:text-base transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-blue-900 font-semibold mb-2 text-sm sm:text-base flex items-center">
              <span className="mr-2">🔒</span> Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm sm:text-base transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 sm:py-4 rounded-lg hover:from-orange-700 hover:to-orange-600 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">⚡</span>
              Staff Login
            </button>
          </div>
        </form>

        {/* Toggle buttons */}
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => {
              setIsCustomerMode(!isCustomerMode);
              setError('');
              setUsername('');
              setPassword('');
            }}
            className="text-black hover:text-blue-600 text-sm font-semibold bg-gray-100 px-6 py-2 rounded-full hover:bg-gray-200 transition-all duration-200"
          >
            🏠 Customer Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;