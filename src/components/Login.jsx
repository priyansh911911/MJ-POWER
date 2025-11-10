import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/Logo.png';

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

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-black rounded-lg p-3 sm:p-4 inline-block mb-4 sm:mb-6">
            <img src={logo} alt="MJ POWER" className="w-24 sm:w-32 h-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {isRegistering ? 'Customer Registration' : (isCustomerMode ? 'Customer Portal' : 'Staff Portal')}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            {isRegistering ? 'Create your customer account' : (isCustomerMode ? 'Access your orders and tickets' : 'Sign in to your account')}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-4 sm:space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-green-700 font-medium mb-2 text-sm sm:text-base">
                Full Name
              </label>
              <input
                type="text"
                placeholder="  Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                required
              />
            </div>
          )}
          
          {isRegistering && (
            <div>
              <label className="block text-green-700 font-medium mb-2 text-sm sm:text-base">
                Phone
              </label>
              <input
                type="tel"
                placeholder="  Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-green-700 font-medium mb-2 text-sm sm:text-base">
              {isCustomerMode ? 'Email' : 'Username'}
            </label>
            <input
              type={isCustomerMode ? 'email' : 'text'}
              placeholder={isCustomerMode ? '  Enter your email' : '  Enter your username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-700 font-medium mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              placeholder="  Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-green-700 font-medium mb-2 text-sm sm:text-base">
                Address
              </label>
              <textarea
                placeholder="  Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                rows="3"
              />
            </div>
          )}

          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white font-medium py-2 sm:py-3 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
            >
              {isRegistering ? 'Register' : (isCustomerMode ? 'Customer Login' : 'Staff Login')}
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
                className="w-full mt-2 bg-gray-600 text-white font-medium py-2 sm:py-3 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
              >
                Cancel Registration
              </button>
            )}
          </div>
        </form>

        {/* Toggle buttons */}
        <div className="mt-6 text-center space-y-2">
          {!isRegistering && (
            <button
              onClick={() => {
                setIsCustomerMode(!isCustomerMode);
                setError('');
                setUsername('');
                setPassword('');
              }}
              className="text-green-600 hover:text-green-700 text-sm underline"
            >
              {isCustomerMode ? 'Staff Login' : 'Customer Login'}
            </button>
          )}
          
          {isCustomerMode && !isRegistering && (
            <div>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm underline ml-4"
              >
                Register as Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;