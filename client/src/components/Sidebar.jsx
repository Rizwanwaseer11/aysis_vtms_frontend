import { NavLink } from "react-router-dom";

import {
  FaTruck,
  FaUsers,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaCalendarAlt,
  FaShieldAlt,
  FaTrash,
} from "react-icons/fa"; // Importing some icons for the sidebar items

const adminMenu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: "D",
    exact: true,
  },
  {
    name: "Vehicles",
    path: "manage-vehicles",
    icon: FaTruck,
  },
  {
    name: "Users",
    path: "manage-users",
    icon: FaUsers,
  },
  {
    name: "Locations",
    path: "manage-locations",
    icon: FaMapMarkerAlt,
  },
  {
    name: "Operations",
    path: "manage-operations",
    icon: FaHeartbeat,
  },
  {
    name: "Attendance",
    path: "manage-attendance",
    icon: FaCalendarAlt,
  },
  {
    name: "Management",
    path: "manage-management",
    icon: FaShieldAlt,
  },
  {
    name: "Bins",
    path: "manage-bins",
    icon: FaTrash,
  },
];

const Sidebar = () => {
  return (
    <div className="w-72 min-h-screen bg-white shadow-lg">
      {/* Logo */}
      <div className=" flex items-center  justify-items-start p-1">
        <img src="/logo.png" alt="Logo" className="h-32.5  w-35  opacity-100" />
      </div>

      {/* Menu List */}
      <div className=" space-y-6 px-6">
        {adminMenu.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center text-sm font-medium  hover:py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#0060B9] px-4 py-2 text-white"
                    : "text-[#9197B3] hover:bg-[#0060B9]/10  hover:text-[#0060B9]"
                }`
              }
            >
              <div className="w-6 h-6 mr-3 rounded-md flex items-center justify-center bg-[#0060B9]  text-white text-xs">
                {typeof Icon === "string" ? Icon : Icon && <Icon />}
              </div>

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
