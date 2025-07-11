import React, { useState, useContext, useEffect } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiUser, FiMail, FiPhone, FiCreditCard, 
  FiGlobe, FiMapPin, FiSave, FiEdit2, 
  FiHome, FiNavigation, FiCalendar 
} from "react-icons/fi";

const ProfileForm = () => {
  const { userData, backendUrl, setuserData } = useContext(AppContent);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cni: "",
    passportNumber: "",
    state: "",
    postCode: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        cni: userData.cni || "",
        passportNumber: userData.passportNumber || "",
        state: userData.state || "",
        postCode: userData.postCode || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.put(`${backendUrl}/api/user/profil`, formData);
      setuserData(res.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      toast.error("Failed to update profile. Please try again.", {
        position: "top-center"
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {userData?.name?.charAt(0) || "U"}
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
            >
              <FiEdit2 className="text-blue-600" />
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon profile</h1>
          <p className="text-gray-500 max-w-md text-center">
            Manage your personal information and keep it up to date
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Personal Information Section */}
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-1 h-8 bg-blue-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiUser className="mr-3 text-blue-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiMail className="mr-3 text-blue-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-1 h-8 bg-indigo-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Contact Information
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiPhone className="mr-3 text-indigo-500" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiCreditCard className="mr-3 text-indigo-500" />
                      National ID (CNI)
                    </label>
                    <input
                      type="text"
                      name="cni"
                      value={formData.cni}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-1 h-8 bg-purple-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Address Information
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiGlobe className="mr-3 text-purple-500" />
                      Passport Number
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="A12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiHome className="mr-3 text-purple-500" />
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="California"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-600">
                      <FiNavigation className="mr-3 text-purple-500" />
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-5 py-3 border ${isEditing ? 'border-gray-300 hover:border-blue-400' : 'border-transparent bg-gray-50'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="90210"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="mr-4 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;