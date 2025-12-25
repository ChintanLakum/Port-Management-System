import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown"
import Message from "../../components/Message";
import { toast } from "react-toastify";

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("USER");
  const [profilePhoto, setProfilePhoto] = useState('./public/download.png');
  const [portId, setPortId] = useState("");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("mobileno", phone);
      formData.append("role", role);

      if (profilePhoto) {
        formData.append("profile", profilePhoto);
      }
      console.log(formData)
      if (role === 'ADMIN') {
        formData.append("portId", portId);
      }

      const response = await fetch("/api/user/signup/post", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json()
      console.log("Success:", data);
      if (data.success) {
        toast.success(data.message)
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRole("user");
        setProfilePhoto(null);
        setPortId("");
        setStep(1);
        navigate('/login');
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error( error.message);
      toast.error(error.message)
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-cyan-700 mb-2">
          Sign Up
        </h1>
        {(message || error) && <Message message={message} error={error} />}
        <form onSubmit={step === 2 ? handleSignup : (e) => e.preventDefault()} className="space-y-6">
          {step === 1 && (
            <>
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              {/* Role Dropdown */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                  Role
                </label>
                <CustomDropdown
                  options={["USER", "ADMIN", "SYSTEM ADMIN"]}
                  selected={role}
                  onSelect={setRole}
                />
              </div>
              {role === 'ADMIN' && (
                <div>
                  <label htmlFor="portId" className="block text-sm font-medium text-gray-900 mb-2">
                    Port ID
                  </label>
                  <input
                    type="text"
                    id="portId"
                    className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    placeholder="Enter Port ID"
                    value={portId}
                    onChange={(e) => setPortId(e.target.value)}
                    required
                  />
                </div>
              )}


              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-900 mb-2">
                  Profile Photo
                </label>
                <label
                  htmlFor="profilePhoto"
                  className="flex items-center justify-center w-full h-12 p-3 text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors hover:bg-gray-50"
                >
                  {/* Using an emoji for the upload button instead of an SVG */}
                  <span className="mr-2 text-xl">📸</span>
                  {profilePhoto ? profilePhoto.name : "Upload Profile Photo"}
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <div className="flex justify-between space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 text-cyan-600 border border-cyan-600 hover:bg-cyan-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-cyan-400"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};


export default Signup;
