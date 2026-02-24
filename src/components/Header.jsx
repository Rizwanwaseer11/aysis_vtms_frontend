import React, { useEffect, useRef, useState } from "react";
import { Menu, Bell, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const DashboardHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employee = useSelector((state) => state.auth.employee);
  const name = employee?.name || "User";
  const role = employee?.designationName || employee?.designationCode || "Employee";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleGoDashboard = () => {
    setIsDropdownOpen(false);
    navigate("/admin");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-blue-600 bg-[url('https://preline.co/assets/svg/examples/abstract-1.svg')] bg-no-repeat bg-cover bg-center rounded-3xl px-8 py-4 flex items-center justify-between shadow-sm">
        {/* Left - Menu */}
        <button className="p-2 rounded-lg hover:bg-gray-200 transition">
          <Menu className="w-6 h-6 text-gray-200 hover:text-gray-600" />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notification */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-100" />

            {/* Badge */}
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
              12
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* User Info */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>

              {/* Name + Role */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-100">{name}</p>
                <p className="text-xs text-gray-200">{role}</p>
              </div>

              {/* Dropdown Icon */}
              <ChevronDown className="w-4 h-4 text-gray-100" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20">
                <button
                  type="button"
                  onClick={handleGoDashboard}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default DashboardHeader;
