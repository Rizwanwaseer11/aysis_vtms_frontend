import React, { useState } from "react";
import {
  Trash2,
  MapPinned,
  MapPinHouse,
} from "lucide-react";

const Locations = () => {
  return (
    <div className="mt-8 ">
    <DashboardStats />
    </div>
  )
}

export default Locations



const DashboardStats = () => {
  const stats = [
    {
      title: "Total Zones",
      value: 3,
      icon: <ZoneIcon size={22} />,
      bg: "bg-orange-100",
      iconBg: "bg-orange-500",
    },
    {
      title: "Total UCs",
      value: 4,
      icon: <MapPinned  size={22} />,
      bg: "bg-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Total Wards",
      value: 2,
      icon: <MapPinHouse size={22} />,
      bg: "bg-green-100",
      iconBg: "bg-green-500",
    },
    {
      title: "Total Bins ",
      value: 2,
      icon: <Trash2 size={22} />,
      bg: "bg-green-100",
      iconBg: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 p-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-md hover:shadow-lg  "
        >
          <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl  mt-2">{item.value}</h2>
          </div>

          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.iconBg}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};



const ZoneIcon = ({ size = 32, color = "orange", imageSize = 30 }) => {
  const bgColor = `bg-${color}-500`; // Tailwind dynamic class
  return (
    <div
      className={`${bgColor} rounded-2xl flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      <img
        src="/place.png" // make sure image is in public folder
        alt="zone icon"
        style={{ width: 40, height: 30 }}
      />
    </div>
  );
};