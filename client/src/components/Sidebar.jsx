// import React from 'react';

// const Sidebar = () => {
//   return (
//     <div className="absolute w-[306px] h-[1280px] left-[2px] top-0 bg-white shadow-[0px_10px_60px_rgba(226,236,249,0.5)]">
//       {/* Rectangle 32 */}
//       <div className="absolute w-[250px] h-[46px] left-[28px] top-[181px] bg-[#0060B9] rounded-lg"></div>

//       {/* Dashboard Title */}
//       <div className="absolute w-[78px] h-[21px] left-[77px] top-[65px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//         Dashboard
//       </div>

//       {/* Vehicles Section */}
//       <div className="absolute w-[59px] h-[21px] left-[77px] top-[130px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//         Vehicles
//       </div>
//       <div className="absolute w-[16px] h-[16px] left-[254px] top-[132px] border-[2px] border-[#9197B3]"></div>

//       {/* Sidebar Menu List */}
//       <div className="absolute w-[231px] h-[24px] left-[39px] top-[192px]">
//         {/* User Item */}
//         <div className="absolute w-[24px] h-[24px] left-[39px] top-[192px] bg-white border-[1.5px] border-[#FFFFFF]"></div>
//         <div className="absolute w-[39px] h-[21px] left-[79px] top-[194px] text-white font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//           Users
//         </div>
//         <div className="absolute w-[16px] h-[16px] left-[254px] top-[196px] border-[2px] border-white"></div>

//         {/* Locations Section */}
//         <div className="absolute w-[67px] h-[21px] left-[77px] top-[258px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//           Locations
//         </div>
//         <div className="absolute w-[16px] h-[16px] left-[254px] top-[260px] border-[2px] border-[#9197B3]"></div>

//         {/* Operations Section */}
//         <div className="absolute w-[78px] h-[21px] left-[77px] top-[322px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//           Operations
//         </div>
//         <div className="absolute w-[16px] h-[16px] left-[254px] top-[324px] border-[2px] border-[#9197B3]"></div>

//         {/* Attendance Section */}
//         <div className="absolute w-[82px] h-[21px] left-[77px] top-[386px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//           Attendance
//         </div>
//         <div className="absolute w-[16px] h-[16px] left-[254px] top-[388px] border-[2px] border-[#9197B3]"></div>

//         {/* Management Section */}
//         <div className="absolute w-[95px] h-[21px] left-[77px] top-[450px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//           Management
//         </div>
//         <div className="absolute w-[16px] h-[16px] left-[254px] top-[452px] border-[2px] border-[#9197B3]"></div>

//         {/* Bins Section */}
//         <div className="absolute w-[29px] h-[21px] left-[80px] top-[654px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//           Bins
//         </div>
//         <div className="absolute w-[16px] h-[16px] left-[257px] top-[656px] border-[2px] border-[#9197B3]"></div>
//       </div>

//       {/* Icons and Images */}
//       <div className="absolute w-[95px] h-[34px] left-[30px] top-[46px] bg-[url('images.png')]"></div>
//       <div className="absolute w-[30px] h-[24px] left-[39px] top-[128px] bg-[url('truck-1058.png')] shadow-[inset_0px_0px_100px_#9197B3]"></div>
//       <div className="absolute w-[24px] h-[24px] left-[40px] top-[320px] border-[1px] border-[#9197B3]"></div>
//       <div className="absolute w-[24px] h-[24px] left-[40px] top-[256px] bg-[url('6960647_preview.png')] shadow-[inset_0px_0px_100px_#9197B3]"></div>
//       <div className="absolute w-[25px] h-[25px] left-[39px] top-[382px] bg-[url('calendar.png')] shadow-[inset_0px_4px_100px_#9197B3]"></div>
//       <div className="absolute w-[26px] h-[30px] left-[40px] top-[445px] bg-[url('—Pngtree—vector_shield_icon_4184620.png')] shadow-[inset_0px_4px_100px_#9197B3]"></div>
//       <div className="absolute w-[29px] h-[21px] left-[80px] top-[654px] text-[#9197B3] font-poppins font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
//         Bins
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import {
  FaTruck,
  FaUsers,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaCalendarAlt,
  FaShieldAlt,
  FaTrash,
} from "react-icons/fa"; // Importing some icons for the sidebar items

const Sidebar = () => {
  return (
    <div className="w-72 min-h-screen bg-white shadow-lg">
      {/* Logo */}
      <div className="flex justify-center items-center mt-8">
        {/* <img src="/path-to-your-logo.png" alt="Logo" className="w-28 h-14" /> */}
        <FaTruck className="w-28 h-14 " color="#0060B9" />
      </div>

      {/* Menu List */}
      <div className="mt-12 space-y-6 px-6">
        {/* Dashboard */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <span className="text-xs">D</span>{" "}
            {/* You can use an icon here */}
          </div>
          <span>Dashboard</span>
        </div>

        {/* Vehicles */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <FaTruck />
          </div>
          <span>Vehicles</span>
        </div>

        {/* Users */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <FaUsers />
          </div>
          <span>Users</span>
        </div>

        {/* Locations - Active Button */}
        <div className="flex items-center text-white bg-[#0060B9] text-sm font-medium px-4 py-2 rounded-lg">
          <div className="w-6 h-6 mr-3 text-white">
            <FaMapMarkerAlt />
          </div>
          <span>Locations</span>
        </div>

        {/* Operations */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <FaHeartbeat />
          </div>
          <span>Operations</span>
        </div>

        {/* Attendance */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <FaCalendarAlt />
          </div>
          <span>Attendance</span>
        </div>

        {/* Management */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <FaShieldAlt />
          </div>
          <span>Management</span>
        </div>

        {/* Bins */}
        <div className="flex items-center text-[#9197B3] text-sm font-medium">
          <div className="w-6 h-6 mr-3 bg-[#0060B9] rounded-md text-white flex items-center justify-center">
            <FaTrash />
          </div>
          <span>Bins</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
